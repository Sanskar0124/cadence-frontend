import { useState, useEffect, useRef, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./Reassignment.module.scss";
import {
	Checkbox,
	Label,
	HighlightBox,
	SearchBar,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { HighlightBoxThemes, ThemedButtonThemes } from "@cadence-frontend/themes";

import Toggle from "./components/Toggle/Toggle";
import UsersOverlay from "./components/UsersOverlay/UsersOverlay";
import UserCardsList from "./components/UserCardsList/UserCardsList";

import { COMPANY_CONTACT_REASSIGNMENT_OPTIONS } from "../../../constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useOutsideClickHandler } from "@cadence-frontend/utils";

const Reassignment = ({
	active,
	leadsCount,
	dataAccess,
	contactIds,
	ownerIds,
	setViewPeopleList,
	handleClose,
	setCb,
}) => {
	const { reassignLeads, reassignLeadsLoading } = dataAccess;
	const { addError, addWarning } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const usersDropdownRef = useRef(null);
	const [users, setUsers] = useState([]);
	const [toggle, setToggle] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [showUsersDropdown, setShowUsersDropdown] = useState(false);
	// const [reassignedLeads, setReassignedLeads] = useState({});
	const [reassignedContacts, setReassignedContacts] = useState({});
	// const [leadsLeft, setLeadsLeft] = useState(0);
	const [contactsLeft, setContactsLeft] = useState(0);
	// const [reassignLeadsTasks, setReassignLeadsTasks] = useState(true);
	// const [reassignContactsTasks, setReassignContactsTasks] = useState(true);
	const [reassignSetting, setReassignSetting] = useState(null);

	useOutsideClickHandler(usersDropdownRef, () => setSearchFocus(false));

	useEffect(() => {
		setCb(() => {
			setSearchFocus(false);
			window.onmousedown = null;
		});
		// setLeadsLeft(leadIds.length);
		setContactsLeft(contactIds.length);
	}, []);

	useEffect(() => {
		if (toggle && users.length > 0) {
			// let leadsNo = leadIds.length;
			let contactsNo = contactIds.length;
			let usersNo = users.length;
			// let autoDistributedLeads = {};
			let autoDistributedContacts = {};

			users.forEach(user => {
				// const leads = Math.ceil(leadsNo / usersNo);
				const contacts = Math.ceil(contactsNo / usersNo);

				// autoDistributedLeads = {
				// 	...autoDistributedLeads,
				// 	[user.user_id]: leads,
				// };
				autoDistributedContacts = {
					...autoDistributedContacts,
					[user.user_id]: contacts,
				};

				// leadsNo -= leads;
				contactsNo -= contacts;
				usersNo -= 1;
			});

			// setReassignedLeads(autoDistributedLeads);
			setReassignedContacts(autoDistributedContacts);
			// setLeadsLeft(0);
			setContactsLeft(0);
		}
	}, [toggle, users, contactIds]);

	useEffect(() => {
		if (!toggle) {
			if (users.length > 0) {
				console.log(contactIds, "ContactIds103");
				let resetValues = {};

				users.forEach(user => {
					resetValues = {
						...resetValues,
						[user.user_id]: 0,
					};
				});
				// setReassignedLeads(resetValues);
				setReassignedContacts(resetValues);
			}

			// setLeadsLeft(leadIds.length);
			setContactsLeft(contactIds.length);
		}
	}, [contactIds]);

	const handleSubmit = e => {
		e.preventDefault();
		if (users.length === 0) {
			addError({ text: "No user selected!" });
			return;
		}
		// if (leadsLeft > 0) {
		// 	addError(
		// 		leadsLeft === 1
		// 			? `${leadsLeft} lead is unassigned!`
		// 			: `${leadsLeft} leads are unassigned!`
		// 	);
		// 	return;
		// }
		if (contactsLeft) {
			addError({
				text:
					contactsLeft === 1
						? `${contactsLeft} contact is unassigned!`
						: `${contactsLeft} contacts are unassigned!`,
			});
			return;
		}
		if (contactIds.length > 0 && reassignSetting === null) {
			addError({ text: "Reassignment setting is required!" });
			return;
		}

		const body = {
			contact_reassignment_rule: reassignSetting,
			// reassignTasksForLeads: reassignLeadsTasks,
			// reassignTasksForContacts: reassignContactsTasks,
			// reassignToForLeads: users.map(user => ({
			// 	user_id: user.user_id,
			// 	count: reassignedLeads[user.user_id],
			// })),
			reassignToForContacts: users.map(user => ({
				user_id: user.user_id,
				count: reassignedContacts[user.user_id],
			})),
			// leadIds: leadIds,
			contactIds: contactIds,
		};

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
				handleClose();
			},
		});
	};
	console.log("hey");
	return (
		active && (
			<>
				<div className={styles.heading}>
					<h3>
						{CADENCE_TRANSLATION.REASSIGNMENT?.[user?.language?.toUpperCase()]} -{" "}
						{leadsCount} {COMMON_TRANSLATION?.PEOPLE?.[user?.language?.toUpperCase()]}
					</h3>
					<ThemedButton
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setViewPeopleList(prevState => !prevState)}
						width="fit-content"
					>
						{CADENCE_TRANSLATION?.VIEW_PEOPLE_LIST[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
				<div className={styles.body}>
					<label>{CADENCE_TRANSLATION.ADD_OWNER[user?.language?.toUpperCase()]}(s)</label>
					<div ref={usersDropdownRef}>
						<SearchBar
							width="100%"
							height="50px"
							value={searchValue}
							setValue={setSearchValue}
							placeholder={
								CADENCE_TRANSLATION?.SEARCH_FOR_A_USER?.[user?.language?.toUpperCase()]
							}
							className={styles.searchBar}
							onFocus={() => setSearchFocus(true)}
						/>
						<UsersOverlay
							users={users}
							setUsers={setUsers}
							searchFocus={searchFocus}
							searchValue={searchValue}
							setSearchFocus={setSearchFocus}
							// setReassignedLeads={setReassignedLeads}
							setReassignedContacts={setReassignedContacts}
							ownerIds={ownerIds}
							showUsersDropdown={showUsersDropdown}
							setShowUsersDropdown={setShowUsersDropdown}
						/>
					</div>

					<div className={styles.header}>
						<p>
							{
								CADENCE_TRANSLATION?.AUTOMATIC_DISTRIBUTION?.[
									user?.language?.toUpperCase()
								]
							}{" "}
							{/* <span>{`(${leadIds.length} ${
								leadIds.length === 1
									? `${COMMON_TRANSLATION.LEAD?.[user?.language?.toUpperCase()]}`
									: `${COMMON_TRANSLATION.LEADS?.[user?.language?.toUpperCase()]}`
							})`}</span>{" "}
							<span>{`(${contactIds.length} ${
								contactIds.length === 1 ? "contact" : "contacts"
							})`}</span> */}
						</p>
						<div className={styles.distnStatus}>
							{/* {leadsLeft > 0 && (
								<HighlightBox
									height={26}
									fontWeight={700}
									borderRadius={5}
									theme={HighlightBoxThemes.RED}
								>
									{`${leadsLeft} ${
										leadsLeft === 1
											? `${COMMON_TRANSLATION.LEAD?.[user?.language?.toUpperCase()]}`
											: `${COMMON_TRANSLATION.LEADS?.[user?.language?.toUpperCase()]}`
									} ${COMMON_TRANSLATION.LEFT?.[user?.language?.toUpperCase()]}`}
								</HighlightBox>
							)} */}
							{contactsLeft > 0 && (
								<HighlightBox
									height={26}
									fontWeight={700}
									borderRadius={5}
									theme={HighlightBoxThemes.RED}
								>
									{`${contactsLeft} ${contactsLeft === 1 ? "contact" : "contacts"} ${
										COMMON_TRANSLATION.LEFT?.[user?.language?.toUpperCase()]
									}`}
								</HighlightBox>
							)}
							<Toggle
								checked={toggle}
								onChange={() => setToggle(prevState => !prevState)}
							/>
						</div>
					</div>
					<UserCardsList
						className={styles.usersList}
						users={users}
						toggle={toggle}
						setUsers={setUsers}
						// leadProps={{
						// 	reassignedLeads,
						// 	setReassignedLeads,
						// 	leadsLeft,
						// 	setLeadsLeft,
						// }}
						contactProps={{
							reassignedContacts,
							setReassignedContacts,
							contactsLeft,
							setContactsLeft,
						}}
					/>
					<div className={styles.settingsLabel}>
						<label>
							{
								CADENCE_TRANSLATION?.REASSIGNMENT_SETTINGS?.[
									user?.language?.toUpperCase()
								]
							}
						</label>
						<span>*applicable for contacts only</span>
					</div>
					<Select
						options={{
							[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_ONLY]:
								"Change only contact owner",
							[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_AND_ACCOUNT]:
								"Change contact owner and account owner",
							[COMPANY_CONTACT_REASSIGNMENT_OPTIONS.CONTACT_ACCOUNT_AND_OTHER_CONTACTS]:
								"Change contact owner, account owner and other contacts of the same account",
						}}
						value={reassignSetting}
						setValue={setReassignSetting}
						placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
						borderColor={"#DADCE0"}
						borderRadius={15}
						className={styles.action}
						menuOnTop
					/>
					{/* <div className={styles.checks}>
						<div className={styles.check}>
							<Checkbox checked={reassignLeadsTasks} onChange={setReassignLeadsTasks} />
							<p>
								{
									CADENCE_TRANSLATION.RE_ASSIGN_TASKS_FOR_LEADS[
										user?.language?.toUpperCase()
									]
								}
							</p>
						</div>

						<div className={styles.check}>
							<Checkbox
								checked={reassignContactsTasks}
								onChange={setReassignContactsTasks}
							/>
							<p>{CADENCE_TRANSLATION.RE_ASSIGN_TASKS[user?.language?.toUpperCase()]}</p>
						</div>
					</div> */}
				</div>

				<div className={styles.footer}>
					<ThemedButton
						className={styles.reassignBtn}
						theme={ThemedButtonThemes.PRIMARY}
						onClick={handleSubmit}
						loading={reassignLeadsLoading}
						disabled={contactIds.length === 0}
					>
						{CADENCE_TRANSLATION?.COMPLETE_REASSIGNMENT[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</>
		)
	);
};

export default Reassignment;
