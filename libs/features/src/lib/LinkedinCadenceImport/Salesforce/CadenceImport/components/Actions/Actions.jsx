import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useContext, useState, useEffect } from "react";
import {
	DATA_CATEGORY,
	DATA_CATEGORY_ID,
	LEAD_STATUS,
	noPhone,
	IMPORT_OPTIONS,
} from "../../constants";
import styles from "./Actions.module.scss";
// import Reassign from "./components/Reassign/Reassign";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import Reassign from "./components/Reassign/Reassign";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Title } from "@cadence-frontend/components";
import { Exclude } from "@cadence-frontend/icons";
import WarningModal from "./components/WarningModal/WarningModal";
import { constants } from "buffer";

const Actions = ({
	cadenceImportDataAccess,
	checkedLeads,
	setCheckedLeads,
	list,
	setList,
	cadenceSelected,
	setCadenceSelected,
	resetDropdowns,
	loader,
	socket1,
	socket2,
	setProgress,
	setCheckedIssueLead,
	checkedIssueLead,
	onRemoveSelected,
	isModal,
	setIsModal,
	search_url,
	type,
	setSocketLoading,
	loader2,
	crm,
	setSocketLoaderMessage,
	exportedOnce,
}) => {
	const query = useQuery();
	const { addError } = useContext(MessageContext);
	const { addList } = cadenceImportDataAccess;
	const { useProfilesExport } = cadenceImportDataAccess;
	const { postProfilesExport, postProfilesExportLoading } = useProfilesExport();

	const user = useRecoilValue(userInfo);

	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const [iessuesInLead, setIessuesInLead] = useState({
		first_name: { name: "first name", leads: [] },
		last_name: { name: "last name", leads: [] },
		email: { name: "email", leads: [] },
		phone_number: { name: "phone number", leads: [] },
		linkedin_url: { name: "linkedin url", leads: [] },
		company_name: { name: "company name", leads: [] },
	});

	const onAdd = stopPreviousCadences => {
		setSocketLoaderMessage("Exporting Leads");
		let exportType = "";
		setProgress(0);
		setSocketLoading(true);
		//Adding Topics
		list.map((item, index) => {
			list[index]["topics"] = [];
		});
		//Filtering List according to checkboxes
		let profilesArrayToSend = [];
		checkedLeads.map((item, index) => {
			profilesArrayToSend.push(list[item]);
		});
		if (crm) {
			exportType = IMPORT_OPTIONS.CRM_AND_CADENCE;
		} else {
			exportType = IMPORT_OPTIONS.CRM_ONLY;
		}
		//const exportType = {crm ? IMPORT_OPTIONS.CRM_AND_CADENCE : IMPORT_OPTIONS.CRM_AND_CADENCE}

		const body = {
			profiles: profilesArrayToSend,
			type: type,
			cadence_id: cadenceSelected.id.toString(),
			search_url: search_url,
			loader_id: loader2.current,
			option: exportType,
		};

		postProfilesExport(body, {
			onSuccess: msg => {
				setSocketLoading(false);
			},
		});
	};

	const onModalHandler = () => {
		setIsModal(true);
	};

	const onCloseWarningModal = () => {
		setIsModal(false);
	};

	useEffect(() => {
		const missingFirstName = list
			?.filter(lead => !lead.first_name)
			?.map(each => ({
				...each,
				issue: "first_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));
		const missingLastName = list
			?.filter(lead => !lead.last_name)
			?.map(each => ({
				...each,
				issue: "last_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));
		// const missingLinkedin = list
		// 	?.filter(lead => !lead.linkedin_url)
		// 	?.map(each => ({
		// 		...each,
		// 		issue: "linkedin_url",
		// 		allIssue: [
		// 			"first_name",
		// 			"last_name",
		// 			"linkedin_url",
		// 			"company_name",
		// 			"email",
		// 			"phone_number",
		// 		],
		// 	}));
		const missingCompanyName = list
			?.filter(lead => !lead?.account?.name)
			?.map(each => ({
				...each,
				issue: "company_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));

		// const missingEmail = list
		// 	?.filter((lead, i) => {
		// 		const isMissingeEmail = lead?.emails?.some(em => {
		// 			if (em.type === "Email") {
		// 				return em.email_id === null;
		// 			}
		// 		});
		// 		return isMissingeEmail || lead.emails?.length === 0;
		// 	})
		// 	?.map(each => ({
		// 		...each,
		// 		issue: "email",
		// 		allIssue: [
		// 			"first_name",
		// 			"last_name",
		// 			"linkedin_url",
		// 			"company_name",
		// 			"email",
		// 			"phone_number",
		// 		],
		// 	}));

		// const missingPhoneNumber = list
		// 	?.filter((lead, i) => {
		// 		const isMissingePhoneNumber = lead?.phone_numbers?.some(
		// 			ph =>
		// 				ph.type !== "Company_phone__c" && ph.phone_number !== null && ph.phone_number
		// 		);

		// 		return !isMissingePhoneNumber || lead.phone_numbers?.length === 0;
		// 	})
		// 	?.map(each => ({
		// 		...each,
		// 		issue: "phone_number",
		// 		allIssue: [
		// 			"first_name",
		// 			"last_name",
		// 			"linkedin_url",
		// 			"company_name",
		// 			"email",
		// 			"phone_number",
		// 		],
		// 	}));

		setIessuesInLead(prev => ({
			...prev,
			first_name: { name: "first name", leads: missingFirstName },
			last_name: { name: "last name", leads: missingLastName },
			// email: {
			// 	name: "email",
			// 	leads: missingEmail,
			// },
			// phone_number: { name: "phone number", leads: missingPhoneNumber },
			// linkedin_url: { name: "linkedin url", leads: missingLinkedin },
			company_name: { name: "company name", leads: missingCompanyName },
		}));
	}, [isModal, list]);

	let totalIssue = 0;

	Object.keys(iessuesInLead).forEach(issue => {
		totalIssue = totalIssue + iessuesInLead[issue]?.leads?.length;
	});

	const getDisableCondition = () => {
		if (exportedOnce) return true;
		if (checkedLeads?.length === 0) return true;
		if (crm) {
			if (checkedLeads?.length === 0 || !cadenceSelected?.id) return true;
		} else {
			if (checkedLeads?.length === 0) return true;
		}
		return false;
	};
	return (
		<>
			<div className={styles.actions}>
				<div className={styles.left}>
					<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
					<Title size={16}>
						{CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} -{" "}
						{checkedLeads?.length} out of {list?.length ?? 0}
					</Title>
				</div>
				<div className={styles.right}>
					{crm && (
						<SelectCadence
							cadenceSelected={cadenceSelected}
							setCadenceSelected={setCadenceSelected}
						/>
					)}

					{/* <Reassign
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						list={list}
						checkedLeads={checkedLeads}
					/> */}

					<ThemedButton
						onClick={() =>
							list.filter(
								lead =>
									checkedLeads.includes(lead.Id) &&
									lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
							).length
								? setLinkLeadsModal(true)
								: onAdd(false)
						}
						theme={ThemedButtonThemes.PRIMARY}
						disabled={getDisableCondition()}
						className={styles.btnAdd}
					>
						<span>{COMMON_TRANSLATION.ADD[user?.language?.toUpperCase()]}</span>{" "}
						<span>{checkedLeads?.length > 0 && `(${checkedLeads?.length})`}</span>
					</ThemedButton>

					{totalIssue ? (
						<ThemedButton
							onClick={() => onModalHandler()}
							theme={ThemedButtonThemes.WHITE}
							className={styles.btnExclude}
						>
							<Exclude /> <span>{totalIssue}</span>
						</ThemedButton>
					) : null}
				</div>
				<LinkLeadsModal
					modal={linkLeadsModal}
					setModal={setLinkLeadsModal}
					onAdd={onAdd}
				/>
			</div>

			<WarningModal
				onClose={onCloseWarningModal}
				isModal={isModal}
				iessuesInLead={iessuesInLead}
				totalIssue={totalIssue}
				list={list}
				setCheckedIssueLead={setCheckedIssueLead}
				checkedIssueLead={checkedIssueLead}
				onRemoveSelected={onRemoveSelected}
			/>
		</>
	);
};

export default Actions;
