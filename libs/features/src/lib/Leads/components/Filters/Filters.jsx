import { useEffect, useState } from "react";

//components
import { useLeadsCadences, useSettings } from "@cadence-frontend/data-access";
import { Close } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ErrorBoundary, Title } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import CadencesOverlay from "./components/Cadences/Cadences";
import UserAndGroup from "./components/UserAndGroup/UserAndGroup";

//constants
import {
	COMPANY_SIZE_FILTER_AVAILABLE,
	DEFAULT_FILTER_OPTIONS,
	TAGS_ENUMS,
} from "./constants";

import {
	FILTER_ENUMS_BACKEND,
	GenerateCompanyOptionsFromItMap,
} from "@cadence-frontend/utils";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import styles from "./Filters.module.scss";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const Filter = ({
	filters,
	setFilters,
	filtersCount,
	userId,
	setUserId,
	onSidebarClose: onClose,
}) => {
	const user = useRecoilValue(userInfo);
	const { cadences } = useLeadsCadences();
	const [companySizeOptions, setCompanySizeOptions] = useState({});
	const { fetchSfMap, fetchSfMapLoading } = useSettings({
		role: user.role,
		enabled: false,
	});

	useEffect(() => {
		const newCompanySizeOptions = {};
		user?.Integration_Field_Map?.account_map?.size?.picklist_values?.forEach(
			({ label, value }, _) => {
				newCompanySizeOptions[value] = label;
			}
		);
		setCompanySizeOptions(newCompanySizeOptions);
	}, [user]);

	const handleMultiSelect = (ENUM, filterType) => {
		filters?.[filterType]?.includes(ENUM)
			? setFilters(prev => ({
					...prev,
					[filterType]: prev?.[filterType].filter(f => f !== ENUM),
			  }))
			: setFilters(prev => ({
					...prev,
					[filterType]: [...prev?.[filterType], ENUM],
			  }));
	};

	const decideTheme = (ENUM, filterType) => {
		return filters?.[filterType]?.includes(ENUM) ? styles.active : "";
	};

	const reset = filterType => {
		if (filterType === "ALL") {
			setFilters(DEFAULT_FILTER_OPTIONS);
			setUserId(null);
		}
		setFilters(prev => ({
			...prev,
			[filterType]: typeof prev[filterType] === "boolean" ? false : [],
		}));
	};

	useEffect(() => {
		localStorage.setItem("lead_filters", JSON.stringify(filters));
	}, [filters]);

	const checkFiltersLength = () => {
		if (filtersCount > 0) return true;
		if (userId) return true;
	};

	const [usersAndGroups, setUsersAndGroups] = useState(false);
	const [cadenceOverlay, setCadenceOverlay] = useState(false);

	//companySize
	useEffect(() => {
		fetchSfFieldMap();
	}, []);

	const fetchSfFieldMap = () => {
		fetchSfMap(null, {
			onSuccess: ringoverFieldsFromServer => {
				setCompanySizeOptions(GenerateCompanyOptionsFromItMap(ringoverFieldsFromServer));
			},
		});
	};

	return (
		<div className={styles.filters}>
			<ThemedButton
				onClick={onClose}
				className={styles.closeBtn}
				theme={ThemedButtonThemes.ICON}
			>
				<Close color={"#000"} />
			</ThemedButton>
			<div className={styles.header}>
				<Title size="1.35rem" className={styles.heading}>
					{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}
				</Title>
				{checkFiltersLength() && (
					<div
						className={styles.resetAllButton}
						onClick={() => {
							reset("ALL");
						}}
					>
						{COMMON_TRANSLATION.RESET_ALL[user?.language?.toUpperCase()]}
					</div>
				)}
			</div>
			<div className={styles.body}>
				{/* {user.role !== ROLES.SALESPERSON && (
					<div className={styles.filterType}>
						<div className={styles.taskType}>Users and groups</div>{" "}
						{userId && (
							<div className={styles.resetButton} onClick={() => setUserId(null)}>
								Reset
							</div>
						)}
						<div className={styles.filterOptions}>
							<ThemedButton
								onClick={() => setUsersAndGroups(true)}
								theme={ThemedButtonThemes.GREY}
								className={userId ? styles.active : ""}>
								Select a user
							</ThemedButton>
						</div>
					</div>
				)} */}
				{/* <div className={styles.filterType}>
					<div className={styles.taskType}> Task type</div>{" "}
					{filters["task_type"].length > 0 && (
						<div
							className={styles.resetButton}
							onClick={() => {
								reset("task_type");
							}}>
							Reset
						</div>
					)}
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() =>
								handleRadioSelect(FILTER_ENUMS.TASK_TYPE_ASSAGNED, "task_type")
							}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(FILTER_ENUMS.TASK_TYPE_ASSAGNED, "task_type")}>
							Assigned
						</ThemedButton>
						<ThemedButton
							onClick={() =>
								handleRadioSelect(FILTER_ENUMS.TASK_TYPE_CUSTOM, "task_type")
							}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(FILTER_ENUMS.TASK_TYPE_CUSTOM, "task_type")}>
							Custom
						</ThemedButton>
					</div>
				</div> */}
				{/* <div className={styles.filterType}>
					<div className={styles.taskType}> Cadence</div>{" "}
					{filters["lead_cadences"]?.length > 0 && (
						<div
							className={styles.resetButton}
							onClick={() => {
								reset("lead_cadences");
							}}>
							Reset
						</div>
					)}
					<div className={styles.filterOptions}>
						{cadences
							?.sort((a, b) => a.name.localeCompare(b.name))
							?.slice(0, 2)
							?.map(cadence => (
								<ThemedButton
									onClick={() => handleMultiSelect(cadence.cadence_id, "lead_cadences")}
									theme={ThemedButtonThemes.GREY}
									className={
										filters.lead_cadences?.includes(cadence.cadence_id)
											? styles.active
											: ""
									}
									title={cadence.name.length > 15 && cadence.name}>
									{cadence.name.length > 15
										? `${cadence.name.slice(0, 15)}...`
										: cadence.name}
								</ThemedButton>
							))}
						{cadences?.length > 2 && (
							<ThemedButton
								onClick={() => setCadenceOverlay(true)}
								theme={ThemedButtonThemes.GREY}
								className={
									cadences
										?.sort((a, b) => a.name.localeCompare(b.name))
										?.slice(2)
										?.map(c => c.cadence_id)
										?.some(value => filters.lead_cadences?.includes(value))
										? styles.active
										: ""
								}>
								+ {cadences?.length - 2} more
							</ThemedButton>
						)}
					</div>
				</div> */}
				<ErrorBoundary>
					<div className={styles.filterType}>
						<div className={styles.taskType}>
							{CADENCE_TRANSLATION.TAGS[user?.language?.toUpperCase()]}
						</div>{" "}
						{filters["lead_tags"]?.length > 0 && (
							<div
								className={styles.resetButton}
								onClick={() => {
									reset("lead_tags");
								}}
							>
								{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}
							</div>
						)}
						<div className={styles.filterOptions}>
							{Object.keys(TAGS_ENUMS).map(key => (
								<ThemedButton
									onClick={() => handleMultiSelect(key, "lead_tags")}
									theme={ThemedButtonThemes.GREY}
									className={decideTheme(key, "lead_tags")}
								>
									{TAGS_ENUMS[key][user?.language?.toUpperCase()]}
								</ThemedButton>
							))}
						</div>
					</div>
					{COMPANY_SIZE_FILTER_AVAILABLE.includes(user.integration_type) && (
						<div className={styles.filterType}>
							{Object.keys(companySizeOptions)?.length ? (
								<div className={styles.taskType}>
									{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
								</div>
							) : null}
							{filters[FILTER_ENUMS_BACKEND.COMPANY_SIZE]?.length > 0 && (
								<div
									className={styles.resetButton}
									onClick={() => {
										reset(FILTER_ENUMS_BACKEND.COMPANY_SIZE);
									}}
								>
									{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}
								</div>
							)}
							<div className={styles.filterOptions}>
								{Object.keys(companySizeOptions).map(key => (
									<ThemedButton
										onClick={() =>
											handleMultiSelect(key, FILTER_ENUMS_BACKEND.COMPANY_SIZE)
										}
										theme={ThemedButtonThemes.GREY}
										className={decideTheme(key, FILTER_ENUMS_BACKEND.COMPANY_SIZE)}
									>
										{companySizeOptions[key]}
									</ThemedButton>
								))}
							</div>
						</div>
					)}
				</ErrorBoundary>
			</div>
			<UserAndGroup
				open={usersAndGroups}
				setOpen={setUsersAndGroups}
				userId={userId}
				setUserId={setUserId}
			/>
			<CadencesOverlay
				open={cadenceOverlay}
				setOpen={setCadenceOverlay}
				filters={filters}
				cadences={cadences}
				handleMultiSelect={handleMultiSelect}
			/>
		</div>
	);
};

export default Filter;
