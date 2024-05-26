import { useContext, useEffect, useState } from "react";
import styles from "./Filters.module.scss";

//components
import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { Title, Tooltip } from "@cadence-frontend/components";
import {
	LOCAL_STORAGE_KEYS,
	POWER_STATUS,
	POWER_TASK_STATUS,
	ROLES,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useSettings, useTasks } from "@cadence-frontend/data-access";
import { Close, Power } from "@cadence-frontend/icons";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	FILTER_ENUMS_BACKEND,
	GenerateCompanyOptionsFromItMap,
} from "@cadence-frontend/utils";
import { CountdownModal, InputRange, ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilState, useRecoilValue } from "recoil";
import CadencesOverlay from "./components/Cadences/Cadences";
import PowerToggle from "./components/PowerToggle/PowerToggle";
import UserAndGroup from "./components/UserAndGroup/UserAndGroup";
import {
	COMPANY_SIZE_FILTER_AVAILABLE,
	DEFAULT_FILTER_OPTIONS,
	FILTER_ENUMS,
	TASK_ACTION_ENUMS,
	getBusinessHour,
	getSameUtcTimezones,
	makeFirstLetterCapital,
} from "./constants";
import Timezone from "./components/Timezone/Timezone";

const TIMEZONE_TYPES = {
	MY_TIMEZONE: "my_timezone",
	BUSINESS_HOUR: "business_hour",
};

const Filter = ({
	filters,
	setFilters,
	filtersCount,
	userId,
	setUserId,
	tasks,
	onSidebarClose: onClose,
	leadTimezones,
	leadTimezoneLoading,
}) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [power, setPower] = useRecoilState(powerInfo);
	const [companySizeOptions, setCompanySizeOptions] = useState({});
	const [countdownModal, setCountdownModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState("");

	//overlays
	const [usersAndGroups, setUsersAndGroups] = useState(false);
	const [cadenceOverlay, setCadenceOverlay] = useState(false);
	const [isTimezones, setIsTimezones] = useState(false);
	const [businessHourTimezones, setbusinessHourTimezones] = useState([]);
	const [activeTimezoneBtn, setActiveTimezoneBtn] = useState(false);

	useEffect(() => {
		const timezones = leadTimezones
			?.filter(item => getBusinessHour(item.Task.Lead.Lead_phone_numbers[0]?.time))
			?.map(item => item.Task.Lead.Lead_phone_numbers[0].timezone);
		if (leadTimezones) setbusinessHourTimezones(timezones);
	}, [leadTimezones]);

	const { fetchSfMap } = useSettings({
		role: user.role,
		enabled: false,
	});

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

	const handleRadioSelect = (ENUM, filterType) => {
		filters?.task_type?.includes(ENUM)
			? setFilters(prev => ({
					...prev,
					[filterType]: [ENUM],
			  }))
			: setFilters(prev => ({
					...prev,
					[filterType]: [ENUM],
			  }));
	};

	const handleSlider = value => {
		// if (value === filters[FILTER_ENUMS_BACKEND.CADENCE_STEP]) return;
		if (value === 0) {
			setFilters(prev => ({
				...prev,
				[FILTER_ENUMS_BACKEND.CADENCE_STEP]: "0",
			}));
			return;
		}
		setFilters(prev => ({
			...prev,
			[FILTER_ENUMS_BACKEND.CADENCE_STEP]: value,
		}));
	};

	const decideTheme = (ENUM, filterType) => {
		return filters?.[filterType]?.includes(ENUM) ? styles.active : "";
	};

	const reset = filterType => {
		if (filterType === "ALL") {
			setFilters(DEFAULT_FILTER_OPTIONS);
			setSelectedUser("");
			setUserId(false);
		}
		if (filterType === FILTER_ENUMS_BACKEND.CADENCE_STEP) {
			setFilters(prev => ({
				...prev,
				task_step: "0",
			}));
			return;
		}
		setFilters(prev => ({
			...prev,
			[filterType]: typeof prev[filterType] === "boolean" ? false : [],
		}));
	};

	const checkFiltersLength = () => {
		if (filtersCount > 0) return true;
		if (userId) return true;
	};

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.TASK_FILTERS,
			JSON.stringify({ filters, userId })
		);
	}, [filters, userId]);

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

	//power

	const onBoostTasks = () => {
		if (filters.task_action.length !== 1)
			return addError({ text: "There must be one task action selected" });
		if (!tasks || tasks?.length === 0) return addError({ text: "No tasks to boost" });
		setCountdownModal(true);
	};

	const onBoostTasksCountdown = () => {
		setPower(prev => ({
			...prev,
			filters,
			status: POWER_STATUS.BOOSTED,
			tasks: tasks.map((t, index) => ({
				task_id: t.task_id,
				active: Boolean(index === 0),
				status: POWER_TASK_STATUS.PENDING,
				cadence: { name: t.Cadence?.name, id: t.Cadence?.cadence_id },
			})),
		}));
		onClose();
	};

	const isPowerEnabled = power.status !== POWER_STATUS.STOPPED;

	const businessHourHandler = filterType => {
		setActiveTimezoneBtn(prev =>
			prev === TIMEZONE_TYPES.BUSINESS_HOUR ? false : TIMEZONE_TYPES.BUSINESS_HOUR
		);
		if (
			filters[FILTER_ENUMS_BACKEND.LEAD_TIMEZONES]?.every(value =>
				businessHourTimezones.includes(value)
			) &&
			filters[FILTER_ENUMS_BACKEND.LEAD_TIMEZONES]?.length ===
				businessHourTimezones.length
		) {
			setFilters(prev => ({
				...prev,
				[filterType]: [],
			}));
		} else {
			setFilters(prev => ({
				...prev,
				[filterType]: businessHourTimezones,
			}));
		}
	};

	const myTimezneHandler = filterType => {
		setActiveTimezoneBtn(prev =>
			prev === TIMEZONE_TYPES.MY_TIMEZONE ? false : TIMEZONE_TYPES.MY_TIMEZONE
		);
		const timezones = getSameUtcTimezones(user.timezone, leadTimezones);
		filters?.[filterType]?.length === timezones?.length &&
		filters?.[filterType][0] === timezones?.[0]
			? setFilters(prev => ({
					...prev,
					[filterType]: [],
			  }))
			: setFilters(prev => ({
					...prev,
					[filterType]: timezones,
			  }));
	};

	return (
		<div className={styles.filters}>
			<ThemedButton
				onClick={onClose}
				className={styles.closeBtn}
				theme={ThemedButtonThemes.ICON}
				width="1.7rem"
				height="1.7rem"
			>
				<Tooltip text="Close">
					<Close color={"#000"} />
				</Tooltip>
			</ThemedButton>
			{isPowerEnabled && (
				<ThemedButton
					className={styles.boostTasksBtn}
					theme={ThemedButtonThemes.PINK}
					width="fit-content"
					disabled={
						power.status === POWER_STATUS.BOOSTED || power.status === POWER_STATUS.PAUSED
					}
					onClick={onBoostTasks}
				>
					<Power /> {TASKS_TRANSLATION.START_FOCUS[user?.language?.toUpperCase()]}
				</ThemedButton>
			)}
			<div className={styles.header}>
				<Title size="1.35rem" className={styles.heading}>
					{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.right}>
					<PowerToggle setFilters={setFilters} setUserId={setUserId} />
					{checkFiltersLength() && (
						<ThemedButton
							onClick={() => reset("ALL")}
							theme={ThemedButtonThemes.TRANSPARENT}
							width="fit-content"
						>
							<div>{COMMON_TRANSLATION.RESET_ALL[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					)}
				</div>
			</div>
			<div
				className={`${styles.body} ${
					power.status !== POWER_STATUS.STOPPED ? styles.powerActive : ""
				}`}
			>
				{user.role !== ROLES.SALESPERSON && !isPowerEnabled && (
					<div className={styles.filterType}>
						<div className={styles.filterHeader}>
							<div className={styles.taskType}>
								{TASKS_TRANSLATION.USERS_AND_GROUP[user?.language?.toUpperCase()]}
							</div>{" "}
							{userId && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => {
										setUserId(false);
										setSelectedUser("");
										reset(FILTER_ENUMS_BACKEND.TASK_CADENCES);
									}}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>
						<div className={styles.filterOptions}>
							<ThemedButton
								onClick={() => setUsersAndGroups(true)}
								theme={ThemedButtonThemes.GREY}
								className={userId ? styles.active : ""}
							>
								{selectedUser !== ""
									? selectedUser
									: TASKS_TRANSLATION.SELECT_USER_OR_GROUP[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
					</div>
				)}
				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{CADENCE_TRANSLATION.CADENCES[user?.language?.toUpperCase()]}
						</div>
						{filters[FILTER_ENUMS_BACKEND.TASK_CADENCES]?.length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_CADENCES)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() => setCadenceOverlay(true)}
							theme={ThemedButtonThemes.GREY}
							className={filters.task_cadences?.length ? styles.active : ""}
						>
							{filters?.task_cadences.length
								? `${filters?.task_cadences.length} cadence${
										filters?.task_cadences.length > 1 ? "s" : ""
								  } selected`
								: CADENCE_TRANSLATION.SELECT_CADENCE[user?.language.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
				{!isPowerEnabled && (
					<div className={styles.filterType}>
						<div className={styles.filterHeader}>
							<div className={styles.taskType}>
								{TASKS_TRANSLATION.TASK_TYPE[user?.language?.toUpperCase()]}
							</div>{" "}
							{filters[FILTER_ENUMS_BACKEND.TASK_TYPE].length > 0 && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_TYPE)}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>
						<div className={styles.filterOptions}>
							<ThemedButton
								onClick={() =>
									handleRadioSelect(
										FILTER_ENUMS.TASK_TYPE_ASSIGNED,
										FILTER_ENUMS_BACKEND.TASK_TYPE
									)
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									FILTER_ENUMS.TASK_TYPE_ASSIGNED,
									FILTER_ENUMS_BACKEND.TASK_TYPE
								)}
							>
								{TASKS_TRANSLATION.ASSIGNED[user?.language?.toUpperCase()]}
							</ThemedButton>
							<ThemedButton
								onClick={() =>
									handleRadioSelect(
										FILTER_ENUMS.TASK_TYPE_CUSTOM,
										FILTER_ENUMS_BACKEND.TASK_TYPE
									)
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									FILTER_ENUMS.TASK_TYPE_CUSTOM,
									FILTER_ENUMS_BACKEND.TASK_TYPE
								)}
							>
								{TASKS_TRANSLATION.REMINDER[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
					</div>
				)}
				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{TASKS_TRANSLATION.TASK_TAG[user?.language?.toUpperCase()]}
						</div>{" "}
						{filters[FILTER_ENUMS_BACKEND.TASK_TAG].length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_TAG)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() =>
								handleMultiSelect(
									FILTER_ENUMS.TASK_TAG_LATE,
									FILTER_ENUMS_BACKEND.TASK_TAG
								)
							}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(
								FILTER_ENUMS.TASK_TAG_LATE,
								FILTER_ENUMS_BACKEND.TASK_TAG
							)}
						>
							{TASKS_TRANSLATION.LATE[user?.language?.toUpperCase()]}
						</ThemedButton>
						<ThemedButton
							onClick={() =>
								handleMultiSelect(
									FILTER_ENUMS.TASK_TAG_URGENT,
									FILTER_ENUMS_BACKEND.TASK_TAG
								)
							}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(
								FILTER_ENUMS.TASK_TAG_URGENT,
								FILTER_ENUMS_BACKEND.TASK_TAG
							)}
						>
							{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{TASKS_TRANSLATION.TASK_ACTION[user?.language?.toUpperCase()]}
						</div>{" "}
						{filters[FILTER_ENUMS_BACKEND.TASK_ACTION].length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_ACTION)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						{TASK_ACTION_ENUMS(user).map(task_action => (
							<ThemedButton
								onClick={() =>
									isPowerEnabled
										? handleRadioSelect(
												task_action.type,
												FILTER_ENUMS_BACKEND.TASK_ACTION
										  )
										: handleMultiSelect(
												task_action.type,
												FILTER_ENUMS_BACKEND.TASK_ACTION
										  )
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									task_action.type,
									FILTER_ENUMS_BACKEND.TASK_ACTION
								)}
								data-testid={`filter-taskaction-${task_action.name.toLowerCase()}`}
							>
								<div>
									{task_action.icon} {makeFirstLetterCapital(task_action.name)}
								</div>
							</ThemedButton>
						))}
					</div>
				</div>
				{!isPowerEnabled && (
					<div className={styles.filterType}>
						<div className={styles.filterHeader}>
							<div className={styles.taskType}>
								{TASKS_TRANSLATION.TASK_COMPLETION[user?.language?.toUpperCase()]}
							</div>
							{filters[FILTER_ENUMS_BACKEND.TASK_COMPLETION].length > 0 && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_COMPLETION)}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>
						<div className={styles.filterOptions}>
							<ThemedButton
								onClick={() =>
									handleRadioSelect(
										FILTER_ENUMS.TASK_COMPLETION_DUE,
										FILTER_ENUMS_BACKEND.TASK_COMPLETION
									)
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									FILTER_ENUMS.TASK_COMPLETION_DUE,
									FILTER_ENUMS_BACKEND.TASK_COMPLETION
								)}
							>
								{COMMON_TRANSLATION.DUE[user?.language?.toUpperCase()]}
							</ThemedButton>
							<ThemedButton
								onClick={() =>
									handleRadioSelect(
										FILTER_ENUMS.TASK_COMPLETION_SCHEDULED,
										FILTER_ENUMS_BACKEND.TASK_COMPLETION
									)
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									FILTER_ENUMS.TASK_COMPLETION_SCHEDULED,
									FILTER_ENUMS_BACKEND.TASK_COMPLETION
								)}
							>
								{COMMON_TRANSLATION.SCHEDULED[user?.language?.toUpperCase()]}
							</ThemedButton>
							<ThemedButton
								onClick={() =>
									handleRadioSelect(
										FILTER_ENUMS.TASK_COMPLETION_DONE,
										FILTER_ENUMS_BACKEND.TASK_COMPLETION
									)
								}
								theme={ThemedButtonThemes.GREY}
								className={decideTheme(
									FILTER_ENUMS.TASK_COMPLETION_DONE,
									FILTER_ENUMS_BACKEND.TASK_COMPLETION
								)}
							>
								{COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
					</div>
				)}

				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{TASKS_TRANSLATION.LEAD_TAG[user?.language?.toUpperCase()]}
						</div>
						{filters[FILTER_ENUMS_BACKEND.LEAD_TAG].length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.LEAD_TAG)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() =>
								handleMultiSelect(
									FILTER_ENUMS.LEAD_TAG_HOT,
									FILTER_ENUMS_BACKEND.LEAD_TAG
								)
							}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(
								FILTER_ENUMS.LEAD_TAG_HOT,
								FILTER_ENUMS_BACKEND.LEAD_TAG
							)}
						>
							{TASKS_TRANSLATION.LEAD_TAG_HOT[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>
				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{CADENCE_TRANSLATION.CADENCE_STEP[user?.language?.toUpperCase()]}
						</div>
						{filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.CADENCE_STEP)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<InputRange
							value={filters[FILTER_ENUMS_BACKEND.CADENCE_STEP]}
							handleChange={handleSlider}
							filters={filters}
						/>
					</div>
				</div>
				{COMPANY_SIZE_FILTER_AVAILABLE.includes(user.integration_type) &&
					Object.keys(companySizeOptions)?.length > 0 && (
						<div className={styles.filterType}>
							<div className={styles.filterHeader}>
								<div className={styles.taskType}>
									<span className={styles.companySize}>
										{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
									</span>
								</div>{" "}
								{filters[FILTER_ENUMS_BACKEND.COMPANY_SIZE].length > 0 && (
									<ThemedButton
										theme={ThemedButtonThemes.TRANSPARENT}
										width="fit-content"
										onClick={() => reset(FILTER_ENUMS_BACKEND.COMPANY_SIZE)}
									>
										<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
									</ThemedButton>
								)}
							</div>
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
				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{TASKS_TRANSLATION.TASK_DATE_CREATION[user?.language?.toUpperCase()]}
						</div>{" "}
						{filters[FILTER_ENUMS_BACKEND.TASK_DATE_CREATION].length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.TASK_DATE_CREATION)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() => {
								handleRadioSelect(
									FILTER_ENUMS.TASK_DATE_CREATION_TODAY,
									FILTER_ENUMS_BACKEND.TASK_DATE_CREATION
								);
							}}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(
								FILTER_ENUMS.TASK_DATE_CREATION_TODAY,
								FILTER_ENUMS_BACKEND.TASK_DATE_CREATION
							)}
						>
							{COMMON_TRANSLATION.TODAY[user?.language?.toUpperCase()]}
						</ThemedButton>
						<ThemedButton
							onClick={() => {
								handleRadioSelect(
									FILTER_ENUMS.TASK_DATE_CREATION_YESTERDAY,
									FILTER_ENUMS_BACKEND.TASK_DATE_CREATION
								);
							}}
							theme={ThemedButtonThemes.GREY}
							className={decideTheme(
								FILTER_ENUMS.TASK_DATE_CREATION_YESTERDAY,
								FILTER_ENUMS_BACKEND.TASK_DATE_CREATION
							)}
						>
							{COMMON_TRANSLATION.YESTERDAY[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</div>

				<div className={styles.filterType}>
					<div className={styles.filterHeader}>
						<div className={styles.taskType}>
							{TASKS_TRANSLATION.TIMEZONE[user?.language?.toUpperCase()]}
						</div>
						{filters[FILTER_ENUMS_BACKEND.LEAD_TIMEZONES]?.length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={() => reset(FILTER_ENUMS_BACKEND.LEAD_TIMEZONES)}
							>
								<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<div className={styles.filterOptions}>
						<ThemedButton
							onClick={() => myTimezneHandler(FILTER_ENUMS.LEAD_TIMEZONES)}
							theme={ThemedButtonThemes.GREY}
							className={
								activeTimezoneBtn === TIMEZONE_TYPES.MY_TIMEZONE ? styles.active : ""
							}
						>
							{TASKS_TRANSLATION.MY_TIMEZONE[user?.language?.toUpperCase()]}
						</ThemedButton>
						<Tooltip
							className={styles.timezoneTooltip}
							text={
								(!leadTimezones?.length > 0 || !businessHourTimezones.length > 0) &&
								TASKS_TRANSLATION.NO_TIMEZONES_AVAILABLE[user?.language.toUpperCase()]
							}
							theme="TOP"
						>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => businessHourHandler("lead_timezones")}
								disabled={!leadTimezones?.length || !businessHourTimezones.length}
								className={
									activeTimezoneBtn === TIMEZONE_TYPES.BUSINESS_HOUR ? styles.active : ""
								}
							>
								{TASKS_TRANSLATION.WITHIN_BUSINESS_HOUR[user?.language.toUpperCase()]}
							</ThemedButton>
						</Tooltip>
					</div>
					<div className={`${styles.filterOptions}  ${styles.timezoneFilterOption}`}>
						<Tooltip
							className={styles.timezoneTooltip}
							text={
								!leadTimezones?.length &&
								TASKS_TRANSLATION.NO_TIMEZONES_AVAILABLE[user?.language.toUpperCase()]
							}
							theme="TOP"
						>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => setIsTimezones(true)}
								disabled={!leadTimezones?.length}
								className={
									leadTimezones?.some(item =>
										filters[FILTER_ENUMS_BACKEND.LEAD_TIMEZONES]?.includes(
											item.Task.Lead.Lead_phone_numbers[0]?.timezone
										)
									)
										? styles.active
										: ""
								}
							>
								{TASKS_TRANSLATION.SELECT_LEAD_TIMEZONE[user?.language.toUpperCase()]}
							</ThemedButton>
						</Tooltip>
					</div>
				</div>
			</div>

			<UserAndGroup
				open={usersAndGroups}
				setOpen={setUsersAndGroups}
				userId={userId}
				setUserId={setUserId}
				setSelectedUser={setSelectedUser}
				resetCadenceFilter={() => reset(FILTER_ENUMS_BACKEND.TASK_CADENCES)}
			/>

			<Timezone
				open={isTimezones}
				setOpen={setIsTimezones}
				leadTimezones={leadTimezones}
				leadTimezoneLoading={leadTimezoneLoading}
				filters={filters}
				handleMultiselectTimezone={handleMultiSelect}
			/>

			<CadencesOverlay
				open={cadenceOverlay}
				setOpen={setCadenceOverlay}
				filters={filters}
				handleMultiSelect={handleMultiSelect}
				userId={userId}
			/>
			<CountdownModal
				modal={countdownModal}
				setModal={setCountdownModal}
				onCountdown={onBoostTasksCountdown}
			/>
		</div>
	);
};

export default Filter;
