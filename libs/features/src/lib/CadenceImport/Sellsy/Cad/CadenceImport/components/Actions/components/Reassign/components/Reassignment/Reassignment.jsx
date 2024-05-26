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
	STATUS,
	CONTACT_REASSIGNMENT,
	COMPANY_CONTACT_REASSIGNMENT_OPTIONS,
} from "./constants";

const Reassignment = ({ modal, setModal, list, checkedLeads }) => {
	// const { memberId, memberName } = memberProps;
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const [contactSetting, setContactSetting] = useState(CONTACT_REASSIGNMENT.ALL_CONTACTS);
	const elementRef = useRef(null);
	const [users, setUsers] = useState([]);
	const [action, setAction] = useState(null);
	const [toggle, setToggle] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [reassignedContacts, setReassignedContacts] = useState({});
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
	const onlyCheckedLead = list?.filter(lead => checkedLeads?.find(ld => ld === lead.id));
	useEffect(() => {
		if (modal) {
			setUsers([]);
			setAction(null);
			setToggle(false);
			setSearchValue("");
			setReassignedContacts({});
		}
	}, [modal]);

	useEffect(() => {
		if (contactSetting === CONTACT_REASSIGNMENT.ALL_CONTACTS) {
			setFilteredList(onlyCheckedLead);
			dispatch(prev => !prev);
			return;
		}
		const lst = onlyCheckedLead.filter(
			lead =>
				(contactSetting === CONTACT_REASSIGNMENT.NOT_IN_CADENCE) &
					(lead.status !== STATUS.LEAD_PRESENT) ||
				(contactSetting === CONTACT_REASSIGNMENT.ONLY_CONTACT_IN_CADENCE) &
					(lead.status === STATUS.LEAD_PRESENT)
		);

		removedLeads.current.clear();
		setFilteredList(lst);
		dispatch(prev => !prev);
	}, [contactSetting]);
	useEffect(() => {
		if (toggle && users.length > 0) {
			let contactsNo = filteredList.length;
			let usersNo = users.length;
			let autoDistributedContacts = {};
			users.forEach(user => {
				const contacts = Math.ceil(contactsNo / usersNo);
				autoDistributedContacts = {
					...autoDistributedContacts,
					[user.user_id]: contacts,
				};
				contactsNo -= contacts;
				usersNo -= 1;
			});
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
		if (contactsLeft > 0) {
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
				count: reassignedContacts[user.user_id],
			})),
			type: "contact",
			leads: filteredList.filter(lead => !removedLeads.current.has(lead?.lead_id)),
		};
		reassign(body, {
			onError: err => {
				addError({
					text: err.response?.data?.msg ?? "Some error occured while reassigning leads!",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: data => {
				if (data.msg.includes("Error") || data.msg.includes("error"))
					return addError({ text: "Unable to reassign" });

				addSuccess(data.msg);
				handleClose();
				// window.location.reload();
			},
		});
	};

	return (
		<Div className={styles.reassignment}>
			<div className={styles.heading}>
				<h3>Reassignment {`- ${filteredList.length} people`}</h3>
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
						removedLeads={removedLeads.current}
						dispatch={dispatch}
						list={list}
						checkedLeads={checkedLeads}
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

							<Select
								options={Object.freeze({
									[CONTACT_REASSIGNMENT.ALL_CONTACTS]: "Reassign all contacts",
									[CONTACT_REASSIGNMENT.ONLY_CONTACT_IN_CADENCE]:
										"Reassign contacts only present in cadence",
									[CONTACT_REASSIGNMENT.NOT_IN_CADENCE]:
										"Reassign contacts not present in cadence",
								})}
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								menuOnTop
								value={contactSetting}
								setValue={setContactSetting}
								className={styles.contact_select_options}
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
