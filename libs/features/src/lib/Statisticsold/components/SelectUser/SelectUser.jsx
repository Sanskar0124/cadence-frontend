import { useState, useRef } from "react";
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
	Cadence as CADENCE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";

const SelectUser = ({ usersSelected, setUsersSelected, cadenceSelected }) => {
	const elementRef = useRef(null);
	const role = useRecoilValue(userInfo).role;
	const user = useRecoilValue(userInfo);
	const noOfcadenceSelected = Object.values(cadenceSelected).flat().length;

	const [isDropdown, setIsDropdown] = useState(false);
	const [tab, setTab] = useState(TABS.USERS);
	const [searchValue, setSearchValue] = useState("");

	const dropdownRef = useRef();

	useOutsideClickHandler(dropdownRef, () => setIsDropdown(false));

	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

	const clearUsers = () => setUsersSelected([]);

	return (
		<div className={styles.selectUser} ref={dropdownRef}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectUserBtn}
				onClick={event => setIsDropdown(curr => !curr)}
			>
				<p
					className={
						usersSelected?.length > 0 ? styles.capitalizeFirstLetter : styles.capitalize
					}
				>
					{usersSelected.length === 0
						? STATISTICS_TRANSLATION.ALL_USERS[user?.language?.toUpperCase()]
						: `${usersSelected.length} ${
								TASKS_TRANSLATION.USER[user?.language.toUpperCase()]
						  }(s)`}
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
							CADENCE_TRANSLATION.SEARCH_FOR_A_USER[user?.language.toUpperCase()]
						}
					/>
					<div className={styles.totalSelected}>
						<span>
							{COMMON_TRANSLATION.SELECTED[user?.language?.toUpperCase()]} :{" "}
							{`(${usersSelected.length})`}
						</span>
						{usersSelected.length > 0 && (
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
						/>
					) : (
						<AllUsers
							tab={tab}
							searchValue={searchValue}
							usersSelected={usersSelected}
							setUsersSelected={setUsersSelected}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default SelectUser;
