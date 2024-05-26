import { useState, useEffect } from "react";

//components
import { ErrorBoundary, Title } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Close } from "@cadence-frontend/icons";
import UserAndGroup from "./components/UserAndGroup/UserAndGroup";

//constants
import { ROLES } from "@cadence-frontend/constants";
import { DEFAULT_FILTER_OPTIONS, CADENCE_STATUS_ENUMS } from "./constants";

import styles from "./Filters.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const Filter = ({ filters, setFilters, filtersCount, onSidebarClose: onClose }) => {
	const role = useRecoilValue(userInfo).role;
	const user = useRecoilValue(userInfo);

	const handleRadioSelect = (ENUM, filterType) => {
		if (filters?.[filterType] === ENUM)
			setFilters(prev => ({ ...prev, [filterType]: null }));
		else
			setFilters(prev => ({
				...prev,
				[filterType]: ENUM,
			}));
	};

	const decideTheme = (ENUM, filterType) => {
		return filters?.[filterType]?.includes(ENUM) ? styles.active : "";
	};

	const reset = filterType => {
		if (filterType === "ALL") {
			setFilters(DEFAULT_FILTER_OPTIONS);
			return;
		}
		setFilters(prev => ({
			...prev,
			[filterType]: typeof prev[filterType] === "boolean" ? false : null,
		}));
	};

	useEffect(() => {
		localStorage.setItem("cadence_filters", JSON.stringify(filters));
	}, [filters]);

	const checkFiltersLength = () => {
		if (filtersCount > 0) return true;
	};

	const textFilter = COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()];

	const [usersAndGroups, setUsersAndGroups] = useState(false);

	const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

	return (
		<div className={styles.filters}>
			<ThemedButton
				onClick={onClose}
				className={styles.closeBtn}
				theme={ThemedButtonThemes.ICON}
			>
				<Close />
			</ThemedButton>
			<div className={styles.header}>
				<Title size="1.35rem" className={styles.heading}>
					{`${textFilter}`.slice(0, 1).toUpperCase() + `${textFilter}`.slice(1)}
				</Title>
				{checkFiltersLength() && (
					<ThemedButton
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => reset("ALL")}
						width="fit-content"
					>
						<div>{COMMON_TRANSLATION.RESET_ALL[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				)}
			</div>
			<div className={styles.body}>
				<ErrorBoundary>
					{role !== ROLES.SALESPERSON && (
						<div className={styles.filterType}>
							<div className={styles.taskType}>
								<div className={styles.label}>
									{CADENCE_TRANSLATION.CREATED_BY[user?.language?.toUpperCase()]}
								</div>
								{(filters.user_id || filters.sd_id) && (
									<ThemedButton
										theme={ThemedButtonThemes.TRANSPARENT}
										width="fit-content"
										onClick={() => {
											reset("user_id");
											reset("sd_id");
										}}
									>
										<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
									</ThemedButton>
								)}
							</div>
							<div className={styles.filterOptions}>
								<ThemedButton
									width="fit-content"
									onClick={() => setUsersAndGroups(true)}
									theme={ThemedButtonThemes.GREY}
									className={filters.user_id || filters.sd_id ? styles.active : ""}
								>
									<div>
										{CADENCE_TRANSLATION.SELECT_A_USER[user?.language?.toUpperCase()]}{" "}
										{isAdmin
											? `${CADENCE_TRANSLATION.OR_GROUP[user?.language.toUpperCase()]}`
											: ""}
									</div>
								</ThemedButton>
							</div>
						</div>
					)}
					<div className={styles.filterType}>
						<div className={styles.taskType}>
							<div className={styles.label}>
								{CADENCE_TRANSLATION.TAGS[user?.language?.toUpperCase()]}
							</div>
							{Boolean(filters["favorite"]) && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => reset("favorite")}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>
						<div className={styles.filterOptions}>
							<ThemedButton
								width="fit-content"
								onClick={() =>
									setFilters(prev => ({ ...prev, favorite: !prev.favorite }))
								}
								theme={ThemedButtonThemes.GREY}
								className={filters.favorite ? styles.active : ""}
							>
								<div>{CADENCE_TRANSLATION.FAVORITE[user?.language.toUpperCase()]}</div>
							</ThemedButton>
						</div>
					</div>
					<div className={styles.filterType}>
						<div className={styles.taskType}>
							<div className={styles.label}>
								{CADENCE_TRANSLATION.STATUS[user?.language?.toUpperCase()]}
							</div>
							{filters["status"] && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => reset("status")}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>{" "}
						<div className={styles.filterOptions}>
							{Object.keys(CADENCE_STATUS_ENUMS).map(key => (
								<ThemedButton
									width="fit-content"
									onClick={() => handleRadioSelect(key, "status")}
									theme={ThemedButtonThemes.GREY}
									className={decideTheme(key, "status")}
								>
									<div>{CADENCE_STATUS_ENUMS[key][user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							))}
						</div>
					</div>
				</ErrorBoundary>
			</div>
			<UserAndGroup
				open={usersAndGroups}
				setOpen={setUsersAndGroups}
				filters={filters}
				setFilters={setFilters}
				resetFilter={reset}
			/>
		</div>
	);
};

export default Filter;
