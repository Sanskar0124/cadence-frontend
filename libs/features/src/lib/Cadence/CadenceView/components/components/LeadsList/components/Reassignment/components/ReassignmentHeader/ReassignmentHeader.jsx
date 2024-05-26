import { useState, useEffect, useContext, useRef } from "react";
import { useRecoilValue } from "recoil";

import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { BackButton, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";

import ReassignmentSettingModal from "./components/ReassignmentSettingModal/ReassignmentSettingModal";

import styles from "./ReassignmentHeader.module.scss";
import { VIEWS } from "../../constants";

const ReassignmentHeader = ({
	reassignmentOption,
	setReassignmentOption,
	setShowReassignment,
	reassignedTo,
	groupedLeads,
	previousOwners,
	cadenceLeadsDataAccess,
	setCheckedLeads,
	setSelectAllLeads,
}) => {
	//Data from recoil
	const user = useRecoilValue(userInfo);

	//Context
	const { addError, addWarning } = useContext(MessageContext);

	//API
	const { reassignLeads, reassignLeadsLoading } = cadenceLeadsDataAccess;

	//States
	const [reassignmentButtons, setReassignmentButtons] = useState([]);
	const [numberOfLeads, setNumberOfLeads] = useState();
	const [numberOfContacts, setNumberOfContacts] = useState();
	const [reassignmentSettingModal, setReassignmentSettingModal] = useState(false);
	const [reassignmentSetting, setReassignmentSetting] = useState(null);

	//Refs
	const showRSModalRef = useRef(null);

	/*As soon as grouped leads are set, it counts the number of leads and number of contacts
	and store them separately in different state and accordingly tabNav options are displayed */
	useEffect(() => {
		let leadNumber = 0;
		Object.keys(groupedLeads?.[VIEWS.LEAD])?.forEach(
			prevOwner => (leadNumber += groupedLeads?.[VIEWS.LEAD]?.[prevOwner]?.length)
		);
		let contactNumber = 0;
		Object.keys(groupedLeads?.[VIEWS.CONTACT])?.forEach(
			prevOwner => (contactNumber += groupedLeads?.[VIEWS.CONTACT]?.[prevOwner]?.length)
		);
		setNumberOfContacts(contactNumber);
		setNumberOfLeads(leadNumber);
		setReassignmentButtons([
			{ label: `Leads (${leadNumber})`, value: VIEWS.LEAD },
			{ label: `Contacts (${contactNumber})`, value: VIEWS.CONTACT },
		]);
	}, [groupedLeads]);

	/*Validations before sending reassignment request(checked both for leads and contacts)
 1.If no new owner is selected for prevOwner leads, then consider that user does not want to resign
 leads for that owner, so no error should be displayed. But for some previous owner if it has selected atleast one new owner
 but for the same prev owner if some new owner box is empty then show error msg.
 2.Number of leads/contacts selected for reassignment should be equal to the sum of number 
 of leads/contacts reassigned to new owners.*/
	const isValid = () => {
		let isError = false;
		Object.values(VIEWS).forEach(view => {
			if (isError) {
				return;
			}
			Object.keys(reassignedTo?.[view]).forEach(prevOwner => {
				if (isError) return;
				let leadsCountForOwner = 0;
				let emptyOwnerError = false;
				let emptyOwnerCount = 0; //To calculate how many new Owners box are empty and have 0 leads reassigned for a particular previous owner
				const owner = previousOwners[view][prevOwner];
				reassignedTo[view][prevOwner].reassignedOwners.forEach(newOwner => {
					if (!newOwner.user_id && !newOwner.count) {
						emptyOwnerCount++;
					}
					if (!newOwner.user_id) {
						emptyOwnerError = `${owner.first_name} ${owner.last_name}`;
					}
					leadsCountForOwner += newOwner.count;
				});
				if (emptyOwnerCount !== reassignedTo[view][prevOwner].reassignedOwners.length) {
					if (emptyOwnerError) {
						isError = true;
						addError({
							text: `Please select a new owner for ${view}s assigned to ${owner.first_name} ${owner.last_name}`,
						});
					} else if (leadsCountForOwner !== groupedLeads[view][prevOwner].length) {
						isError = true;
						addError({
							text: `Selected ${reassignmentOption}s for an owner must be equal to the number of reassigned ${reassignmentOption}s`,
						});
					} else {
						if (view === VIEWS.CONTACT) {
							//If a flow reaches here, it means we have atleast one contact for which new owner is reassigned so in that case
							// we want to show reassignment setting(RS)  modal
							showRSModalRef.current = true;
						}
					}
				}
			});
		});

		return !isError;
	};

	/* Reassignment function */
	const handleReassignment = () => {
		if (showRSModalRef.current && !reassignmentSetting) {
			return addError({ text: "Reassignment setting is required!" });
		}

		let reassignedContactsList = {};
		let reassignedLeadsList = {};

		/*Here, In this logic, we will iterate over each new reaasigned owner for each 
		previous owner, see the count of reassigned leads and will slice out those 
		number of leads from grouped leads and store it separately for each new reassigned
	  owner 
		For ex-------- 
		We have 5 leads of previous owner A and 7 leads of previous owner B.
		For A- 3 leads are reassigned to P and 2 are reassigned to Q.
		For B- 4 leads are reassigned to Q and 2 to P and 1 to R.
		Now first of all, we will iterate over A's leads new owners, we see that 3 are 
		reassigned to P, So from our groupedLeads state, we will first reach to an 
		array where all leads of prev owner A are there and then slice an array of first 3 leads
	  and put in for P and then slice out remaining 2 leads	and put it for Q. Similarly we will
		 do it for Previous owner B.
		At the end, our reassigned list will look like this-
			{
				P:[leadids of 3 leads of A and 2 leads of B ],
				Q:[leadids of 2 leads of A and 4 leads of B],
				R:[leadid of 1 lead of B]
			}
			We will then store it in reassignedLeadsList object. Similarly we do it for contacts
			 and store in reassignedContacts list object.
		*/
		Object.values(VIEWS).forEach(view => {
			let reassignedList = {};
			Object.keys(reassignedTo?.[view]).forEach(prevOwner => {
				let count = 0;
				reassignedTo[view][prevOwner].reassignedOwners.forEach(newOwner => {
					if (newOwner.user_id) {
						let leadsReassigned = groupedLeads[view][prevOwner]
							.slice(count, count + newOwner.count)
							.map(lead => lead.lead_id);

						if (reassignedList[newOwner.user_id]) {
							reassignedList[newOwner.user_id] = [
								...reassignedList[newOwner.user_id],
								...leadsReassigned,
							];
						} else {
							reassignedList[newOwner.user_id] = [...leadsReassigned];
						}
						count = count + newOwner.count;
					}
				});
			});

			if (view === VIEWS.LEAD) {
				reassignedLeadsList = { ...reassignedList };
			} else {
				reassignedContactsList = { ...reassignedList };
			}
		});

		/*Now for each new owner in reassignedLeadsList(from above example, P,Q and R), we store leadids in same order of new owners in
	leadids array as we store the count of reassigned leads for each new owner in reassignToForLeads array
	For ex-
	leadIds=[leadids of 5 leads of P, leadids of 6 leads of Q, leadids of 1 lead of R]
	reassignToForLeads=[{user_id: user_id of P, count:count of owners reassigned to P i.e. 5},
	                    {user_id: user_id of Q, count:count of owners reassigned to Q i.e. 6},
										  {user_id: user_id of R, count:count of owners reassigned to R i.e. 1},
										]
	 */
		let leadIds = [];
		let reassignToForLeads = [];

		Object.keys(reassignedLeadsList).forEach(lead => {
			reassignToForLeads.push({
				user_id: lead,
				count: reassignedLeadsList[lead].length,
			});
			leadIds = [...leadIds, ...reassignedLeadsList[lead]];
		});

		/* What we have done above for leads, we do same for contacts*/
		let contactIds = [];
		let reassignToForContacts = [];

		Object.keys(reassignedContactsList).forEach(contact => {
			reassignToForContacts.push({
				user_id: contact,
				count: reassignedContactsList[contact].length,
			});
			contactIds = [...contactIds, ...reassignedContactsList[contact]];
		});

		if (!reassignToForLeads.length && !reassignToForContacts.length) {
			return addError({ text: "No leads or contacts are reassigned." });
		}

		const body = {
			contact_reassignment_rule: reassignmentSetting,
			reassignTasksForLeads: true,
			reassignTasksForContacts: true,
			reassignToForLeads,
			reassignToForContacts,
			leadIds,
			contactIds,
		};

		/*Request for reassignment of owners for leads and contacts is sent*/
		reassignLeads(body, {
			onError: err => {
				addError({
					text: err.response?.data?.msg ?? "Some error occured while reassigning leads!",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: res => {
				addWarning("Reassignment is in progress ! Please check after sometime.");
				setReassignmentSettingModal(false);
				setTimeout(() => {
					setShowReassignment(false);
				}, 200);
				setCheckedLeads([]);
				setSelectAllLeads(false);
			},
		});
	};

	return (
		<>
			<div className={styles.header}>
				<div className={styles.exit}>
					<BackButton
						text={"Exit reassignment"}
						onClick={() => {
							setShowReassignment(false);
						}}
					/>
				</div>
				<div className={styles.buttons}>
					{numberOfContacts !== 0 && numberOfLeads !== 0 ? (
						<div className={styles.tabNavBox}>
							<TabNavSlider
								theme={TabNavThemes.GREY}
								buttons={reassignmentButtons}
								width="300px"
								className={styles.tabNav}
								value={reassignmentOption}
								setValue={setReassignmentOption}
								btnClassName={styles.tabBtn}
								activePillClassName={styles.activePill}
								activeBtnClassName={styles.activeBtn}
							/>
						</div>
					) : (
						<div className={styles.count}>
							{numberOfLeads !== 0
								? `Total leads selected : ${numberOfLeads}`
								: `Total contacts selected : ${numberOfContacts}`}
						</div>
					)}
					<div className={styles.btn}>
						<ThemedButton
							height="40px"
							width="124px"
							theme={ThemedButtonThemes.PRIMARY}
							onClick={() =>
								isValid() &&
								(showRSModalRef.current
									? setReassignmentSettingModal(true)
									: handleReassignment())
							}
							loading={!showRSModalRef.current && reassignLeadsLoading}
						>
							{CADENCE_TRANSLATION.REASSIGN[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
			</div>
			<ReassignmentSettingModal
				modal={reassignmentSettingModal}
				setModal={setReassignmentSettingModal}
				reassignmentSetting={reassignmentSetting}
				setReassignmentSetting={setReassignmentSetting}
				reassignLeadsLoading={reassignLeadsLoading}
				handleReassignment={handleReassignment}
			/>
		</>
	);
};
export default ReassignmentHeader;
