import React, { useState, useEffect } from "react";
import { userInfo } from "@cadence-frontend/atoms";

import {
	useTemplateEmployees,
	useSubDepartments,
	useEmployees,
} from "@cadence-frontend/data-access";
import { Close, Tick, TriangleDown } from "@cadence-frontend/icons";
import { ROLES } from "@cadence-frontend/constants";
import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import { Div, Image, Tooltip } from "@cadence-frontend/components";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import { getTabOptions, TABS } from "./constants";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";

import styles from "./TemplateFilter.module.scss";
import { TEMPLATE_SIDEBAR_OPTIONS } from "../../constants";

const TemplateFilter = ({
	sidebarState,
	filtersCount,
	filters,
	setFilters,
	handleFilterClose,
	templateLevel,
}) => {
	const { user_id, role } = useRecoilValue(userInfo);
	const [tab, setTab] = useState(TABS.USERS);

	const [accordion, setAccordion] = useState(null);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);

	const { employees, employeesLoading } = useEmployees(
		tab === TABS.USERS,
		role,
		accordion
	);
	const { subDepartments, subDepartmentsLoading } = useSubDepartments(
		tab === TABS.GROUPS
	);

	const checkUserSelect = user_id => {
		return usersSelected?.includes(user_id);
	};

	const clearAll = () => setFilters({ users: [], groups: [] });

	const usersSelected = filters?.users;

	const handleUserSelect = user_id => {
		usersSelected?.includes(user_id)
			? setFilters(prevState => {
					return {
						...prevState,
						users: prevState.users.filter(userId => userId !== user_id),
					};
			  })
			: setFilters(prevState => {
					return {
						...prevState,
						users: [...prevState.users, user_id],
					};
			  });
	};

	const checkFiltersLength = () => {
		if (filtersCount > 0) return true;
		// if (userId) return true;
	};

	useEffect(() => {
		setSearchValue("");
		if (
			tab === TABS.USERS &&
			(role === ROLES.SALESPERSON || role === ROLES.SALES_MANAGER)
		)
			setAccordion("own");
		else {
			if (tab === TABS.USERS) setAccordion(null);
		}
	}, [tab]);

	const handleGroupSelect = sd_id => {
		groupsSelected?.includes(sd_id)
			? setFilters(prevState => {
					return {
						...prevState,
						groups: prevState.groups.filter(ksd_id => sd_id !== ksd_id),
					};
			  })
			: setFilters(prevState => {
					return {
						...prevState,
						groups: [...prevState.groups, sd_id],
					};
			  });
	};

	const showFilter = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER;
	const showCard = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.TEMPLATE_DATA;
	const showStats = sidebarState === TEMPLATE_SIDEBAR_OPTIONS.STAT_DATA;

	return (
		<div
			className={`${styles.filter}  ${
				showFilter && showCard && showStats
					? styles.preview
					: showFilter && !showCard && !showStats
					? styles.launch
					: styles.close
			} `}
		>
			<div className={styles.filterActions}>
				<span className={styles.filterHeader}>
					<div className={styles.title}>
						<ThemedButton
							className={styles.closeBtn}
							theme={ThemedButtonThemes.ICON}
							onClick={handleFilterClose}
						>
							<Tooltip text={COMMON_TRANSLATION.CLOSE[user?.language?.toUpperCase()]}>
								<Close color={"#567191"} />
							</Tooltip>
						</ThemedButton>
						<h3>{TASKS_TRANSLATION.SELECT_A_USER[user?.language?.toUpperCase()]}</h3>
					</div>
					{checkFiltersLength() && (
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							className={styles.filterResetBtn}
							onClick={clearAll}
						>
							{TASKS_TRANSLATION.CLEAR_FILTERS[user?.language?.toUpperCase()]}
						</ThemedButton>
					)}
				</span>
				{getTabOptions(role, user).length > 1 && (
					<TabNavSlider
						theme={TabNavThemes.WHITE}
						btnTheme={TabNavBtnThemes.PRIMARY_AND_WHITE}
						buttons={getTabOptions(role, user)}
						value={tab}
						width="400px"
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
					placeholderText={
						tab === TABS.USERS
							? TEMPLATES_TRANSLATION.SEARCH_BY_USER[user?.language.toUpperCase()]
							: TEMPLATES_TRANSLATION.SEARCH_BY_GROUP[user?.language.toUpperCase()]
					}
				/>
			</div>

			{tab === TABS.USERS ? (
				<div className={`${styles.employeeList} ${styles.admin}`}>
					{employeesLoading ? (
						<Placeholder />
					) : (
						employees
							?.filter(emp =>
								`${emp.first_name} ${emp.last_name}`
									.toLowerCase()
									.includes(searchValue.toLowerCase())
							)
							?.sort((a, b) => a.first_name.localeCompare(b.first_name))
							?.sort((a, b) => {
								if (a.user_id === user_id) return -1;
								return 0;
							})
							?.map(user => (
								<div
									key={user.user_id}
									onClick={() => handleUserSelect(user.user_id)}
									className={`${checkUserSelect(user.user_id) ? styles.selected : ""}`}
								>
									<div className={styles.info}>
										<Image src={user.profile_picture} />
										<div>
											<span>
												{user_id === user.user_id
													? "You"
													: `${user.first_name} ${user.last_name}`}
											</span>
											<span>{user.Sub_Department?.name ?? ""}</span>
										</div>
									</div>
									<div className={styles.tick}>
										<Tick />
									</div>
								</div>
							))
					)}
				</div>
			) : (
				<div className={styles.sdList}>
					{subDepartmentsLoading ? (
						<Placeholder />
					) : (
						subDepartments
							?.filter(subd =>
								subd.name.toLowerCase().includes(searchValue.toLowerCase())
							)
							?.sort((a, b) => a.name.localeCompare(b.name))
							.map(subd => (
								<>
									<div
										key={subd.sd_id}
										onClick={() =>
											setAccordion(prev => (prev === subd.sd_id ? null : subd.sd_id))
										}
										className={accordion === subd.sd_id ? styles.selected : ""}
									>
										<div className={styles.info}>
											<Image
												src={
													subd.is_profile_picture_present
														? subd.profile_picture
														: "https://cdn.ringover.com/img/users/default.jpg"
												}
											/>
											<div>
												<span>{subd.name}</span>
											</div>
										</div>
										<div className={styles.arrow}>
											<TriangleDown />
										</div>
									</div>
									{accordion === subd.sd_id && (
										<div className={styles.dropdown}>
											{employeesLoading ? (
												<Placeholder />
											) : employees?.length > 0 ? (
												employees?.map(user => (
													<div
														key={user.user_id}
														onClick={() => handleUserSelect(user.user_id)}
														className={`${
															checkUserSelect(user.user_id) ? styles.selected : ""
														}`}
													>
														<div className={styles.info}>
															<Image src={user.profile_picture} />
															<div>
																<span>
																	{user.first_name} {user.last_name}
																</span>
															</div>
														</div>
														<div className={styles.tick}>
															<Tick />
														</div>
													</div>
												))
											) : (
												<span className={styles.noEmp}>
													{
														COMMON_TRANSLATION.NO_EMPLOYEES_PRESENT[
															user?.language?.toUpperCase()
														]
													}
												</span>
											)}
										</div>
									)}
								</>
							))
					)}
				</div>
			)}
		</div>
	);
};

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(6).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};

export default React.memo(TemplateFilter);
