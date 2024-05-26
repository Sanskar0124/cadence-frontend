import { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

import styles from "./SelectUser.module.scss";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { TriangleDown } from "@cadence-frontend/icons";

import { ROLES } from "@cadence-frontend/constants";
import AllUsers from "./components/AllUsers/AllUsers";
import { BUTTONS, TABS } from "./constants";
import CadenceUsers from "./components/CadenceUsers/CadenceUsers";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import {
	Statistics as STATISTICS_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	useEmployees,
	useStatistics,
	useSubDepartments,
} from "@cadence-frontend/data-access";

const SelectUser = ({ usersSelected, setUsersSelected, cadenceSelected }) => {
	const elementRef = useRef(null);
	const role = useRecoilValue(userInfo).role;
	const user = useRecoilValue(userInfo);
	const noOfcadenceSelected = Object.values(cadenceSelected).flat().length;
	const [accordian, setAccordian] = useState(false);
	const [Ids, setIds] = useState({ departmentId: user.sd_id, userId: user.user_id });
	const [tab, setTab] = useState(TABS.USERS);

	const { employees } = useEmployees(Boolean(accordian), role, accordian);
	let { users, usersLoading } = useStatistics(
		{ allUsers: Boolean(tab) },
		{ cadenceSelected: [] }
	);

	const [isDropdown, setIsDropdown] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const dropdownRef = useRef();

	useOutsideClickHandler(dropdownRef, () => setIsDropdown(false));

	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
	const isSalesManager =
		role === ROLES.SALES_MANAGER || role === ROLES.SALESPERSON_MANAGER;
	const isSalesPerson = role === ROLES.SALESPERSON;

	useEffect(() => {
		if (isSalesPerson) {
			setTab(TABS.USERS);
			if (Ids.userId) {
				// setUsersSelected(
				// 	users
				// 		?.map(user => user.user_id === Ids.userId && user.user_id)
				// 		?.filter(id => id)
				// );

				// return usersSelected?.map(id => checkUserSelect(id));
				setUsersSelected(prev => [...prev, Ids.userId]);
			}
		}
		return () => setIds(prev => ({ ...prev, userId: null }));
	}, []);

	useEffect(() => {
		if (isSalesManager) {
			setTab(TABS.GROUPS);
			// setAccordian(
			// 	subDepartments?.map(depart => depart.sd_id === user.sd_id && depart.sd_id)
			// );
			// setAccordian(prev => (prev === user.sd_id ? null : user.sd_id));

			if (Ids.departmentId) {
				setAccordian(Ids.departmentId);
				setUsersSelected(employees?.map(emp => emp.sd_id === user.sd_id && emp.user_id));
				if (accordian) {
					return usersSelected?.map(id => checkUserSelect(id));
				}
			}
		}
		return () => setIds(prev => ({ ...prev, departmentId: null }));
	}, [employees]);

	const checkUserSelect = user_id => {
		return (
			(usersSelected?.length === 0 && user_id === "all_users") ||
			usersSelected?.includes(user_id)
		);
	};

	const clearUsers = () => {
		setUsersSelected([]);
	};

	return (
		<div className={styles.selectUser} ref={dropdownRef}>
			<ThemedButton
				theme={
					usersSelected?.length > 0 ? ThemedButtonThemes.ACTIVE : ThemedButtonThemes.WHITE
				}
				className={styles.selectUserBtn}
				onClick={event => setIsDropdown(curr => !curr)}
			>
				<p className={usersSelected?.length > 0 ? "" : styles.capitalize}>
					{usersSelected?.length === 0
						? STATISTICS_TRANSLATION.ALL_USERS[user?.language?.toUpperCase()]
						: `${usersSelected?.length ?? ""} User(s)`}
				</p>
				<TriangleDown />
			</ThemedButton>
			{isDropdown && (
				<div
					ref={elementRef}
					className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}
				>
					{isAdmin && noOfcadenceSelected === 0 && (
						<TabNavSlider
							theme={TabNavThemes.GREY}
							buttons={BUTTONS.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
							value={tab}
							setValue={setTab}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
						/>
					)}
					<SearchBar
						width="100%"
						height="40px"
						value={searchValue}
						setValue={setSearchValue}
						className={styles.searchBar}
						placeholderText={
							tab === "users"
								? CADENCE_TRANSLATION.SEARCH_FOR_A_USER[user?.language.toUpperCase()]
								: TEMPLATES_TRANSLATION.SEARCH_BY_GROUP[user?.language.toUpperCase()]
						}
					/>
					<div className={styles.totalSelected}>
						<span>
							{COMMON_TRANSLATION.SELECTED[user?.language?.toUpperCase()]} :{" "}
							{`(${usersSelected?.length})`}
						</span>
						{usersSelected?.length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={clearUsers}
							>
								<div>{COMMON_TRANSLATION.CLEAR[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					{noOfcadenceSelected > 0 ? (
						<CadenceUsers
							searchValue={searchValue}
							usersSelected={usersSelected}
							setUsersSelected={setUsersSelected}
							cadenceSelected={cadenceSelected}
							checkUserSelect={checkUserSelect}
						/>
					) : (
						<AllUsers
							tab={tab}
							setTab={setTab}
							searchValue={searchValue}
							usersSelected={usersSelected}
							setUsersSelected={setUsersSelected}
							accordian={accordian}
							setAccordian={setAccordian}
							checkUserSelect={checkUserSelect}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default SelectUser;
