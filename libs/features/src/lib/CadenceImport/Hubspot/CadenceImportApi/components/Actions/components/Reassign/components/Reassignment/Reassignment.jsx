import { useState, useContext, useEffect, useRef } from "react";
import {
	useSubDepartment,
	useLeadNContactCount,
	useSubDepartmentUser,
} from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
//dm
import styles from "./Reassignment.module.scss";
import { Div, Modal } from "@cadence-frontend/components";
import {
	Checkbox,
	Label,
	HighlightBox,
	SearchBar,
	Select,
	ThemedButton,
	list,
} from "@cadence-frontend/widgets";
import { HighlightBoxThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useTasks, useReassign } from "@cadence-frontend/data-access";
import Toggle from "./components/Toggle/Toggle";
import UsersOverlay from "./components/UsersOverlay/UsersOverlay";
import UserCardsList from "./components/UserCardsList/UserCardsList";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import PeopleList from "./components/PeopleList/PeopleList";
import {
	USER_DELETE_OPTIONS,
	STATUS,
	LEAD_REASSIGNMENT,
	TYPES,
	COMPANY_CONTACT_REASSIGNMENT_OPTIONS,
} from "./constants";
import { useQuery } from "@cadence-frontend/utils";

const Reassignment = ({ modal, setModal, list }) => {
	// const { memberId, memberName } = memberProps;
	const user = useRecoilValue(userInfo);
	const query = useQuery();
	const { addError, addSuccess } = useContext(MessageContext);
	// const { leadCounts, contactCounts, countsLoading } = useLeadNContactCount(memberId);
	// const { companySettings, settingsLoading } = useSubDepartment(teamId, false);
	// const { removeUser: removeMember, removeUserLoading: removeMemberLoading } =
	// 	useSubDepartmentUser(teamId);
	const type = query.get("type");
	const [leadSetting, setLeadSetting] = useState(LEAD_REASSIGNMENT.ALL_LEADS);
	const elementRef = useRef(null);
	const [users, setUsers] = useState([]);
	const [action, setAction] = useState(null);
	const [toggle, setToggle] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [reassignedLeads, setReassignedLeads] = useState({});
	const [reassignedContacts, setReassignedContacts] = useState({});
	const [leadsLeft, setLeadsLeft] = useState(0);
	const [contactsLeft, setContactsLeft] = useState(0);
	const [reassignSetting, setReassignSetting] = useState(
		COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_ACCOUNT_AND_OTHER_CONTACTS
	);
	const { employees, employeesLoading } = useTasks({ employees: true }, user?.role);
	const [filteredList, setFilteredList] = useState(list);
	const { reassign, isReassigning } = useReassign();
	const [openedPeopleView, setOpenPeopleView] = useState(false);
	const removedLeads = useRef(new Set());
	const [dis, dispatch] = useState(true);

	useEffect(() => {
		if (modal) {
			setUsers([]);
			setAction(null);
			setToggle(false);
			setSearchValue("");
			setReassignedLeads({});
			setReassignedContacts({});
		}
	}, [modal]);

	useEffect(() => {
		if (leadSetting === LEAD_REASSIGNMENT.ALL_LEADS) {
			setFilteredList(list);
			dispatch(prev => !prev);
			return;
		}
		const lst = list.filter(
			lead =>
				(leadSetting === LEAD_REASSIGNMENT.NOT_IN_CADENCE) &
					(lead.status !== STATUS.LEAD_PRESENT) ||
				(leadSetting === LEAD_REASSIGNMENT.ONLY_LEADS_IN_CADENCE) &
					(lead.status === STATUS.LEAD_PRESENT)
		);
		removedLeads.current.clear();
		setFilteredList(lst);
		dispatch(prev => !prev);
	}, [leadSetting]);
	useEffect(() => {
		if (toggle && users.length > 0) {
			let leadsNo = filteredList.length - removedLeads.current.size;
			let contactsNo = filteredList.length - removedLeads.current.size;
			let usersNo = users.length;
			let autoDistributedLeads = {};
			let autoDistributedContacts = {};
			const leads = Math.floor(leadsNo / usersNo);
			const contacts = Math.floor(contactsNo / usersNo);
			// console.log({leadsNo , contactsNo , usersNo})

			users.forEach(user => {
				if (type === TYPES.LEAD) {
					const assign = Math.min(leads, leadsNo);
					autoDistributedLeads[user.user_id] = assign;
					leadsNo -= assign;
				} else {
					const assign = Math.min(contacts, contactsNo);
					autoDistributedContacts[user.user_id] = assign;
					contactsNo -= assign;
				}
			});

			if (type == TYPES.LEAD) autoDistributedLeads[users[0].user_id] += leadsNo;
			else autoDistributedContacts[users[0].user_id] += contactsNo;

			setReassignedLeads(autoDistributedLeads);
			setLeadsLeft(0);

			setReassignedContacts(autoDistributedContacts);
			setContactsLeft(0);
		}
	}, [toggle, users, dis]);
	const handleClose = () => {
		setSearchFocus(false);
		window.onmousedown = null;
		setModal(false);
	};

	const handleSubmit = e => {
		e.preventDefault();

		// if (users.length === 0) {
		// 	addError("No user selected!");
		// 	return;
		// }

		if (type == TYPES.LEAD && leadsLeft > 0) {
			addError({
				text:
					leadsLeft === 1
						? `${leadsLeft} lead is unassigned!`
						: `${leadsLeft} leads are unassigned!`,
			});
			return;
		}
		if (type == TYPES.CONTACT && contactsLeft > 0) {
			addError({
				text:
					contactsLeft === 1
						? `${contactsLeft} contact is unassigned!`
						: `${contactsLeft} contacts are unassigned!`,
			});
			return;
		}

		let body = {
			contact_reassignment_rule: reassignSetting,
			reassignTo: users.map(user => ({
				user_id: user.user_id,
				count:
					type == TYPES.LEAD
						? reassignedLeads[user.user_id]
						: reassignedContacts[user.user_id],
			})),
			type,
			leads: filteredList.filter(lead => !removedLeads.current.has(lead?.lead_id)),
		};
		reassign(body, {
			onError: err => {
				addError({
					text: err.response?.data?.msg ?? "Some error occured while reassigning leads!",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: data => {
				if (data.msg.includes("Error") || data.msg.includes("error"))
					return addError({ text: "Unable to reassign" });

				addSuccess(data.msg);
				handleClose();
				window.location.reload();
			},
		});
	};

	return (
		<Div className={styles.reassignment}>
			<div className={styles.heading}>
				<h3>
					Reassignment {`- ${filteredList.length - removedLeads.current.size} people`}
				</h3>
				<h3
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						setOpenPeopleView(prev => !prev);
					}}
				>
					{openedPeopleView ? "Back" : "View people list"}
				</h3>
			</div>
			<div className={styles.body}>
				{openedPeopleView ? (
					<PeopleList
						filteredList={filteredList}
						setFilteredList={setFilteredList}
						type={type}
						removedLeads={removedLeads.current}
						dispatch={dispatch}
					/>
				) : (
					<div className={styles.reassign}>
						<div className={styles.inputGroup}>
							<Label>{"New owner(s)"}</Label>
							<SearchBar
								width="100%"
								height="50px"
								value={searchValue}
								setValue={setSearchValue}
								placeholder="Search for a user"
								className={styles.searchBar}
								onFocus={event => {
									setSearchFocus(true);
									window.onmousedown = e => {
										if (
											event.target === e.target ||
											elementRef.current === e.target ||
											elementRef.current.contains(e.target)
										)
											return;
										setSearchFocus(false);
										window.onmousedown = null;
									};
								}}
							/>
							<UsersOverlay
								users={users}
								setUsers={setUsers}
								searchFocus={searchFocus}
								searchValue={searchValue}
								setSearchFocus={setSearchFocus}
								setReassignedLeads={setReassignedLeads}
								setReassignedContacts={setReassignedContacts}
								elementRef={elementRef}
								employees={employees}
								employeesLoading={employeesLoading}
							/>
						</div>

						<div className={styles.reassign}>
							<div className={styles.header}>
								<p>Automatic distribution</p>
								<div className={styles.distnStatus}>
									{type == TYPES.LEAD && leadsLeft > 0 && (
										<HighlightBox
											height={26}
											fontWeight={700}
											borderRadius={5}
											theme={HighlightBoxThemes.RED}
										>
											{`${leadsLeft} leads left`}
										</HighlightBox>
									)}
									{type == TYPES.CONTACT && contactsLeft > 0 && (
										<HighlightBox
											height={26}
											fontWeight={700}
											borderRadius={5}
											theme={HighlightBoxThemes.RED}
										>
											{`${contactsLeft} contacts left`}
										</HighlightBox>
									)}
									<Toggle
										checked={toggle}
										onChange={() => setToggle(prevState => !prevState)}
									/>
								</div>
							</div>
							<UserCardsList
								className={styles.users}
								users={users}
								toggle={toggle}
								setUsers={setUsers}
								type={type}
								leadProps={{
									reassignedLeads,
									setReassignedLeads,
									leadsLeft,
									setLeadsLeft,
								}}
								contactProps={{
									reassignedContacts,
									setReassignedContacts,
									contactsLeft,
									setContactsLeft,
								}}
							/>
						</div>

						<div className={styles.inputGroup}>
							<Label required>Reassignment setting</Label>
							{type == TYPES.CONTACT && (
								<Select
									options={Object.freeze({
										[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_ACCOUNT_AND_OTHER_CONTACTS]:
											"Change contact owner, account owner and other contacts of the same account",
										[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_ONLY]:
											"Change only contact owner",
										[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_AND_ACCOUNT]:
											"Change contact owner and account owner",
									})}
									value={reassignSetting}
									setValue={setReassignSetting}
									placeholder={
										COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
									}
									menuOnTop
									className={styles.contact_select_options}
								/>
							)}

							<Select
								options={Object.freeze({
									[LEAD_REASSIGNMENT.ALL_LEADS]: "Reassign all leads",
									[LEAD_REASSIGNMENT.ONLY_LEADS_IN_CADENCE]:
										"Reassign leads only present in cadence",
									[LEAD_REASSIGNMENT.NOT_IN_CADENCE]:
										"Reassign leads not present in cadence",
								})}
								value={leadSetting}
								setValue={setLeadSetting}
								placeholder="Select reassignment type"
								menuOnTop
							/>
						</div>
					</div>
				)}
			</div>

			<div className={styles.footer}>
				<ThemedButton
					className={styles.removeBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={isReassigning}
					loadingText={"Reassigning"}
				>
					{"Reassign"}
				</ThemedButton>
			</div>
		</Div>
	);
};
//dm
export default Reassignment;
