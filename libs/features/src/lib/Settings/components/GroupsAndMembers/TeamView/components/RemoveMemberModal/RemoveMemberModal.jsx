import { useState, useContext, useEffect, useRef } from "react";
import {
	useSubDepartment,
	useLeadNContactCount,
	useSubDepartmentUser,
} from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./RemoveMemberModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import {
	Checkbox,
	Label,
	HighlightBox,
	SearchBar,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { HighlightBoxThemes, ThemedButtonThemes } from "@cadence-frontend/themes";

import Toggle from "../Toggle/Toggle";
import UsersOverlay from "./components/UsersOverlay/UsersOverlay";
import UserCardsList from "./components/UserCardsList/UserCardsList";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import {
	USER_DELETE_OPTIONS,
	COMPANY_CONTACT_REASSIGNMENT_OPTIONS,
	isReassignmentAvailable,
	AVAILABLE_TYPES,
	PEOPLE_TYPES,
} from "./constants";

const RemoveMemberModal = ({ modal, setModal, teamId, memberProps }) => {
	const { memberId, memberName } = memberProps;

	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { leadCounts, contactCounts, countsLoading } = useLeadNContactCount(memberId);
	const { companySettings, settingsLoading } = useSubDepartment(teamId, false);
	const { removeUser: removeMember, removeUserLoading: removeMemberLoading } =
		useSubDepartmentUser({}, teamId);

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
	const [reassignLeadsTasks, setReassignLeadsTasks] = useState(false);
	const [reassignContactsTasks, setReassignContactsTasks] = useState(false);
	const [reassignSetting, setReassignSetting] = useState(null);

	useEffect(() => {
		if (modal) {
			setUsers([]);
			setAction(null);
			setToggle(false);
			setSearchValue("");
			setReassignedLeads({});
			setReassignedContacts({});
			setReassignLeadsTasks(false);
			setReassignContactsTasks(false);
			setReassignSetting(companySettings?.contact_reassignment_rule ?? null);
		}
	}, [modal, companySettings]);

	useEffect(() => {
		if (modal) {
			if (leadCounts === 0 && contactCounts === 0) {
				setAction(USER_DELETE_OPTIONS.DELETE_ALL);
			} else {
				setLeadsLeft(leadCounts ?? 0);
				setContactsLeft(contactCounts ?? 0);
			}
		}
	}, [leadCounts, contactCounts, modal]);

	useEffect(() => {
		if (toggle && users.length > 0) {
			let leadsNo = leadCounts ?? 0;
			let contactsNo = contactCounts ?? 0;
			let usersNo = users.length;
			let autoDistributedLeads = {};
			let autoDistributedContacts = {};

			users.forEach(user => {
				const leads = Math.ceil(leadsNo / usersNo);
				const contacts = Math.ceil(contactsNo / usersNo);

				autoDistributedLeads = {
					...autoDistributedLeads,
					[user.user_id]: leads,
				};
				autoDistributedContacts = {
					...autoDistributedContacts,
					[user.user_id]: contacts,
				};

				leadsNo -= leads;
				contactsNo -= contacts;
				usersNo -= 1;
			});

			setReassignedLeads(autoDistributedLeads);
			setReassignedContacts(autoDistributedContacts);
			setLeadsLeft(0);
			setContactsLeft(0);
		}
	}, [toggle, users]);

	const handleClose = () => {
		setSearchFocus(false);
		window.onmousedown = null;
		setModal(false);
	};

	const handleSubmit = e => {
		e.preventDefault();
		let body = { user_id: memberId };

		if (action === null) {
			addError({ text: "Action is required!" });
			return;
		}
		body = { ...body, option: action };

		if (action === USER_DELETE_OPTIONS.REASSIGN) {
			if (users.length === 0) {
				addError({ text: "No user selected!" });
				return;
			}

			if (leadsLeft > 0) {
				addError({
					text:
						leadsLeft === 1
							? `${leadsLeft} lead is unassigned!`
							: `${leadsLeft} leads are unassigned!`,
				});
				return;
			}
			if (contactsLeft) {
				addError({
					text:
						contactsLeft === 1
							? `${contactsLeft} contact is unassigned!`
							: `${contactsLeft} contacts are unassigned!`,
				});
				return;
			}

			if (reassignSetting === null) {
				addError({ text: "Reassignment setting is required!" });
				return;
			}

			body = {
				...body,
				contact_reassignment_rule: reassignSetting,
				reassignTasksForLeads: reassignLeadsTasks,
				reassignTasksForContacts: reassignContactsTasks,
				reassignToForLeads: users.map(user => ({
					user_id: user.user_id,
					count: reassignedLeads[user.user_id],
				})),
				reassignToForContacts: users.map(user => ({
					user_id: user.user_id,
					count: reassignedContacts[user.user_id],
				})),
			};
		}

		removeMember(body, {
			onError: err => {
				addError({
					text: err.response?.data?.msg ?? "Some error occured while removing member!",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => addSuccess("Member removed successfully"),
		});
		handleClose();
	};

	return (
		<Modal
			isModal={modal}
			className={styles.removeMemberModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				<h3>{COMMON_TRANSLATION.REMOVE_GROUP_MEMBER[user?.language?.toUpperCase()]}</h3>
			</div>
			<div
				className={styles.body}
				style={action === USER_DELETE_OPTIONS.REASSIGN ? { overflowY: "scroll" } : {}}
			>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>{memberName}</Label>
						<div className={styles.leadsNContacts}>
							{AVAILABLE_TYPES[user.integration_type].includes(PEOPLE_TYPES.LEADS) && (
								<HighlightBox
									height={35}
									theme={HighlightBoxThemes.PURPLE}
									fontWeight={400}
									borderRadius={10}
								>
									{`${leadCounts ?? 0} leads`}
								</HighlightBox>
							)}
							{AVAILABLE_TYPES[user.integration_type].includes(PEOPLE_TYPES.CONTACTS) && (
								<HighlightBox
									height={35}
									theme={HighlightBoxThemes.PURPLE}
									fontWeight={400}
									borderRadius={10}
								>
									{`${contactCounts ?? 0} contacts`}
								</HighlightBox>
							)}
						</div>
					</div>

					{(leadCounts > 0 || contactCounts > 0) &&
						isReassignmentAvailable(user.integration_type) && (
							<div className={styles.inputGroup}>
								<Label required className={styles.action}>
									{CADENCE_TRANSLATION.ACTION[user?.language?.toUpperCase()]}
								</Label>
								<Select
									options={{
										[USER_DELETE_OPTIONS.DELETE_ALL]:
											"Delete all leads/contacts and accounts associated with this user",
										[USER_DELETE_OPTIONS.REASSIGN]:
											"Reassign leads/contacts and accounts associated with this user",
									}}
									value={action}
									setValue={setAction}
									placeholder="Select here"
								/>
							</div>
						)}
				</div>

				{action === USER_DELETE_OPTIONS.REASSIGN && (
					<div className={styles.reassign}>
						<div className={styles.inputGroup}>
							<Label>
								{CADENCE_TRANSLATION.NEW_OWNER[user?.language?.toUpperCase()]}(s)
							</Label>
							<SearchBar
								width="100%"
								height="50px"
								value={searchValue}
								setValue={setSearchValue}
								placeholder={
									CADENCE_TRANSLATION.SEARCH_FOR_A_USER[user?.language?.toUpperCase()]
								}
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
								teamId={teamId}
								users={users}
								setUsers={setUsers}
								searchFocus={searchFocus}
								searchValue={searchValue}
								setSearchFocus={setSearchFocus}
								setReassignedLeads={setReassignedLeads}
								setReassignedContacts={setReassignedContacts}
								elementRef={elementRef}
								memberId={memberId}
							/>
						</div>

						<div className={styles.reassign}>
							<div className={styles.header}>
								<p>
									{
										SETTINGS_TRANSLATION.AUTOMATIC_DISTRIBUTION[
											user?.language?.toUpperCase()
										]
									}
								</p>
								<div className={styles.distnStatus}>
									{leadsLeft > 0 && (
										<HighlightBox
											height={26}
											fontWeight={700}
											borderRadius={5}
											theme={HighlightBoxThemes.RED}
										>
											{`${leadsLeft} leads left`}
										</HighlightBox>
									)}
									{contactsLeft > 0 && (
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
							<Label required>
								{
									SETTINGS_TRANSLATION.REASSIGNMENT_SETTINGS[
										user?.language?.toUpperCase()
									]
								}
							</Label>
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
								placeholder="Select here"
								menuOnTop
							/>
						</div>

						<div className={styles.checks}>
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
								<p>
									{CADENCE_TRANSLATION.RE_ASSIGN_TASKS[user?.language?.toUpperCase()]}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={styles.footer}>
				<ThemedButton
					className={styles.removeBtn}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSubmit}
					loading={countsLoading || settingsLoading || removeMemberLoading}
					loadingText={
						action === USER_DELETE_OPTIONS.REASSIGN
							? "Re-assign and remove"
							: "Remove group member"
					}
				>
					{action === USER_DELETE_OPTIONS.REASSIGN
						? "Re-assign and remove"
						: "Remove group member"}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default RemoveMemberModal;
