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
	SearchBar,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import Toggle from "../Toggle/Toggle";
import HighlightBox from "./components/HighlightBox/HighlightBox";
import HighlightBoxThemes from "./components/HighlightBox/HighlightBoxThemes";
import UsersOverlay from "./components/UsersOverlay/UsersOverlay";
import UserCardsList from "./components/UserCardsList/UserCardsList";

import { USER_DELETE_OPTIONS, COMPANY_CONTACT_REASSIGNMENT_OPTIONS } from "./constants";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const RemoveMemberModal = ({ modal, setModal, teamId, memberProps }) => {
	const { memberId, memberName } = memberProps;
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
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
			setLeadsLeft(leadCounts ?? 0);
			setContactsLeft(contactCounts ?? 0);
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
					desc: err?.response?.data?.error ?? "Please contact support",
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
				<h3>Remove team member</h3>
			</div>
			<div
				className={styles.body}
				style={action === USER_DELETE_OPTIONS.REASSIGN ? { overflowY: "scroll" } : {}}
			>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>{memberName}</Label>
						<div className={styles.leadsNContacts}>
							<HighlightBox
								height={35}
								theme={HighlightBoxThemes.PURPLE}
								fontWeight={400}
								borderRadius={10}
							>
								{`${leadCounts ?? 0} leads`}
							</HighlightBox>
							<HighlightBox
								height={35}
								theme={HighlightBoxThemes.PURPLE}
								fontWeight={400}
								borderRadius={10}
							>
								{`${contactCounts ?? 0} contacts`}
							</HighlightBox>
						</div>
					</div>

					<div className={styles.inputGroup}>
						<Label>Action</Label>
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
							borderRadius={15}
							borderColor="#DADCE0"
							className={styles.action}
						/>
					</div>
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
								<p>Automatic distribution</p>
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
							<Label>Reassignment setting</Label>
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
								borderColor={"#DADCE0"}
								borderRadius={15}
								className={styles.action}
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
				>
					{action === USER_DELETE_OPTIONS.REASSIGN
						? "Re-assign and remove"
						: "Remove team member"}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default RemoveMemberModal;
