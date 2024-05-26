import { useContext, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { CallIframeContext } from "@salesforce/context";

//components
import { Container, ErrorBoundary, Title, Tooltip } from "@cadence-frontend/components";
import {
	ADD_LINKEDIN_STEP_TYPES,
	IFRAME_POSITION,
	INITIAL_TOUR_STEPS_ENUM,
	LOCAL_STORAGE_KEYS,
	POWER_MODAL_TYPES,
	POWER_STATUS,
	POWER_TASK_STATUS,
	PRODUCT_TOUR_STATUS,
	SOCKET_ON_EVENTS,
} from "@cadence-frontend/constants";
import { useLeadsSearch, useTasks, useUser } from "@cadence-frontend/data-access";
import { Calendar, NoTasks, Power, Sort as SortIcon } from "@cadence-frontend/icons";
import {
	PowerModals,
	SearchBar,
	SearchResults,
	ThemedButton,
} from "@cadence-frontend/widgets";
import Analytics from "./components/Analytics/Analytics";
import { FILTER_ENUMS } from "./components/Filters/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import TaskCard from "./components/TaskCard/TaskCard";
import { VIEW_MODES } from "./constants";

import {
	powerDelay,
	powerInfo,
	timeElapsed as timeElapsedAtom,
	tourInfo,
	userInfo,
} from "@cadence-frontend/atoms";

import { MessageContext, SocketContext } from "@cadence-frontend/contexts";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, DEFAULT_FILTER_OPTIONS, useQuery } from "@cadence-frontend/utils";
import { TASKS_LOADER } from "./components/Placeholder/Placeholder";
import PowerControls from "./components/Power/PowerControls/PowerControls";
import PowerTasksOverview from "./components/Power/PowerTasksOverview/PowerTasksOverview";
import styles from "./Tasks.module.scss";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
	const navigate = useNavigate();
	const query = useQuery();
	const task_id = query.get("task_id");
	const { setPosition, forceUpdate } = useContext(CallIframeContext);
	const user = useRecoilValue(userInfo);
	const { addSocketHandler } = useContext(SocketContext);
	const { addError } = useContext(MessageContext);

	const [tour, setTour] = useRecoilState(tourInfo);
	//power
	const [power, setPower] = useRecoilState(powerInfo);
	const [timeElapsed, setTimeElapsed] = useRecoilState(timeElapsedAtom);
	const serPowerDelay = useSetRecoilState(powerDelay);
	const [powerModals, setPowerModals] = useState(false);

	const { updateUser } = useUser();
	const tasksDataAccess = useTasks(
		{ tasks: true, taskActivity: true, timezones: true },
		user.role
	);

	const {
		tasks: tasksFromServer,
		taskLoading,
		refetchTasks,
		taskActivity,
		filters,
		setFilters,
		userId,
		setUserId,
		timeszones,
		timezonesLoading,
	} = tasksDataAccess;
	const { searchLeads, searchResults, searchLoading, searchError } = useLeadsSearch();

	const [searchValue, setSearchValue] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [viewMode, setViewMode] = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [filtersCount, setFiltersCount] = useState();
	const [activeTaskInfo, setActiveTaskInfo] = useState(null);
	const [cardInfoWidth, setCardInfoWidth] = useState("400px");
	const [tasks, setTasks] = useState([]);

	//functions
	const onSearch = () => {
		if (searchValue) searchLeads(searchValue);
		if (!isSearchFocused) setIsSearchFocused(true);
	};

	const onClose = () => {
		navigate(`/tasks`);
		setViewMode(null);
	};

	//tour
	const sortTasksForTour = a => {
		if (tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) return 0;
		let NEXT_TASK_ID = parseInt(
			localStorage.getItem(LOCAL_STORAGE_KEYS.NEXT_TASK_ID_FOR_TOUR)
		);
		if (!NEXT_TASK_ID) return 0;
		if (a.task_id === NEXT_TASK_ID) return -1;
		return 0;
	};

	//power

	const stopPower = type => {
		switch (type) {
			case POWER_MODAL_TYPES.CADENCE_STOPPED:
			case POWER_MODAL_TYPES.MAILS_LIMIT_REACHED:
			case POWER_MODAL_TYPES.ALL_CADENCES_STOPPED:
				setPowerModals({ modalType: type });
				break;
			case POWER_MODAL_TYPES.POWER_COMPLETE:
				setPowerModals({
					modalType: type,
					tasks: power.tasks.length,
					time: timeElapsed.power,
				});
				break;
			default:
				break;
		}
		//reset power
		setFilters(DEFAULT_FILTER_OPTIONS);
		setTimeElapsed(prev => ({ ...prev, power: 0 }));
		serPowerDelay(0);
		setViewMode(null);
		setPower(prev => ({
			...prev,
			status: POWER_STATUS.STOPPED,
			filters: {},
			tasks: [],
		}));
	};

	const checkPowerTasks = () => {
		if (!tasksFromServer) return;
		//take out pending tasks
		let pendingTasks = power.tasks.filter(
			t => t.status === POWER_TASK_STATUS.PENDING && t.dontRecalculate !== true
		);
		//check pending tasks in actual tasks if they exists
		let missingTasks = [];
		pendingTasks.forEach(t => {
			if (!tasksFromServer?.find(orgT => orgT.task_id === t.task_id))
				missingTasks.push(t);
		});
		//if no tasks left, stop power
		if (missingTasks.length === power.tasks.length) {
			stopPower(POWER_MODAL_TYPES.ALL_CADENCES_STOPPED);
			return;
		}
		//show modal for cadences stopped and remove them from power queue
		let cadencesStoppedNames = [...new Set(missingTasks.map(t => t.cadence.name))];
		let cadencesStoppedIds = [...new Set(missingTasks.map(t => t.cadence.id))];
		if (cadencesStoppedNames.length) {
			setPower(prev => {
				let newTasks = prev.tasks.filter(t => !cadencesStoppedIds.includes(t.cadence.id));
				if (!newTasks.find(t => t.active))
					newTasks = newTasks.map((t, i) => ({ ...t, active: i === 0 ? true : false }));
				return {
					...prev,
					tasks: newTasks,
				};
			});
			setPowerModals({
				modalType: POWER_MODAL_TYPES.CADENCE_STOPPED,
				cadences: cadencesStoppedNames,
				tasks: missingTasks.length,
			});
			return;
		}
		//TODO: add power is paused automatically
		// if (power.status === POWER_STATUS.PAUSED)
		// 	setPowerModals({ modalType: POWER_MODAL_TYPES.POWER_PAUSED });
	};

	const filterTasksForPower = task => {
		if (!filters.task_action.length) return true;
		if (power.status === POWER_STATUS.BOOSTED || power.status === POWER_STATUS.PAUSED)
			return checkIfTaskIsPresentInPower(task.task_id);
		if (power.status === POWER_STATUS.IN_SETUP) return checkIfTaskHasSufficientData(task);
		return true;
	};

	const checkIfTaskIsPresentInPower = task_id =>
		power.tasks.find(pt => pt.task_id === task_id);

	const checkIfTaskHasSufficientData = task => {
		if (
			task.Node.type === "call" ||
			task.Node.type === "message" ||
			task.Node.type === "whatsapp"
		) {
			const numbers = [
				...task.Lead.Lead_phone_numbers?.filter(pn => pn.phone_number),
				task.Lead.Account?.phone_number,
			].filter(num => num);
			return Boolean(numbers.length);
		}
		if (task.Node.type === "mail" || task.Node.type === "reply_to") {
			return Boolean(task.Lead?.Lead_emails?.filter(em => em.email_id.length).length);
		}
		if (ADD_LINKEDIN_STEP_TYPES.includes(task.Node.type)) {
			return Boolean(task.Lead?.linkedin_url);
		}
		return true;
	};

	//side effects

	useEffect(() => {
		//add recalculate socket handler
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.RECALCULATE,
			key: "recalculate_tasks",
			handler: () => refetchTasks(),
		});

		//set filters from local storage
		let filtersFromStorage = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_KEYS.TASK_FILTERS)
		);
		if (filtersFromStorage?.filters) setFilters(filtersFromStorage.filters);
		if (filtersFromStorage?.userId) setUserId(filtersFromStorage.userId);
		return () => {
			setPosition(IFRAME_POSITION.RIGHT);
			if (power.status === POWER_STATUS.BOOSTED) {
				setPower(prev => ({ ...prev, status: POWER_STATUS.PAUSED }));
			}
		};
	}, []);

	useEffect(() => {
		if (tasksFromServer) {
			let sortedTasks = [...tasksFromServer].sort(sortTasksForTour);
			setTasks(sortedTasks);
			if (task_id && tasksFromServer?.find(task => task.task_id === parseInt(task_id))) {
				setActiveTaskInfo(
					tasksFromServer?.find(task => task.task_id === parseInt(task_id))
				);
				setViewMode(VIEW_MODES.TASK);
			}
		}

		//logic for instant task switch only if power is disabled
		let nextTaskId = parseInt(localStorage.getItem("next_task_id")) ?? null;
		if (
			nextTaskId &&
			tasksFromServer?.find(task => task.task_id === nextTaskId) &&
			power.status !== POWER_STATUS.BOOSTED
		) {
			setActiveTaskInfo(tasksFromServer?.find(task => task.task_id === nextTaskId));
			localStorage.removeItem("next_task_id");
		}
	}, [tasksFromServer]);

	useEffect(() => {
		//if product tour is pending then handle step according to tasks request
		const moveToNextStep = () => {
			localStorage.removeItem(LOCAL_STORAGE_KEYS.NEXT_TASK_ID_FOR_TOUR);
			let NEW_STEP = tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
			updateUser(
				{
					product_tour_step: {
						step: NEW_STEP,
						url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
					},
				},
				{
					onSuccess: () => {
						setTour(prev => ({
							...prev,
							currentStep: NEW_STEP,
							currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
							currentStepCompleted: false,
							isLoading: false,
						}));
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						setTour(prev => ({
							...prev,
							currentStepCompleted: false,
							isError: true,
						}));
					},
				}
			);
		};

		if (
			tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
			tour?.currentStep === INITIAL_TOUR_STEPS_ENUM.YOUR_TASKS &&
			tasksFromServer &&
			tour?.currentStepCompleted
		)
			moveToNextStep();

		// if (
		// 	tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
		// 	[
		// 		INITIAL_TOUR_STEPS_ENUM.CLICK_SEND_EMAIL,
		// 		INITIAL_TOUR_STEPS_ENUM.CLICK_HANGUP_CALL,
		// 		INITIAL_TOUR_STEPS_ENUM.CLICK_SEND_SMS,
		// 	].includes(tour?.currentStep) &&
		// 	tasksFromServer &&
		// 	tour?.currentStepCompleted &&
		// 	tasksFromServer?.find(
		// 		task =>
		// 			task.task_id ===
		// 			parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.NEXT_TASK_ID_FOR_TOUR))
		// 	)
		// )
		// 	moveToNextStep();
	}, [tasksFromServer, tour]);

	useEffect(() => {
		//if power is in setup show a warning if tasks have insufficient data
		if (power.status === POWER_STATUS.IN_SETUP && filters.task_action.length) {
			let tasksWithInsufficentData = tasksFromServer?.filter(
				t => !checkIfTaskHasSufficientData(t)
			);
			if (tasksWithInsufficentData?.length) {
				setPowerModals({
					modalType: POWER_MODAL_TYPES.INSUFFICIENT_DATA,
					tasks: tasksWithInsufficentData.length,
				});
			}
		}
	}, [tasksFromServer, power]);

	useEffect(() => {
		if (viewMode === VIEW_MODES.TASK) {
			setSidebarWidth("50%");
			setCardInfoWidth("200px");
			setPosition(IFRAME_POSITION.CENTER);
		} else if (viewMode === null) {
			setSidebarWidth("0%");
			setCardInfoWidth("400px");
			setActiveTaskInfo(null);
			setPosition(IFRAME_POSITION.RIGHT);
		} else {
			setSidebarWidth("430px");
			setCardInfoWidth("350px");
			setPosition(IFRAME_POSITION.RIGHT);
			setActiveTaskInfo(null);
		}
		forceUpdate();
	}, [viewMode]);

	useEffect(() => {
		setFiltersCount(0);
		Object.keys(filters).forEach(key => {
			if (key === "task_step" && filters[key] !== "0") {
				setFiltersCount(prev => prev + 1);
				return;
			}
			if (key !== "task_step" && filters[key]?.length > 0) {
				setFiltersCount(prev => prev + filters[key].length);
			}
		});
		!!userId && setFiltersCount(prev => prev + 1);
	}, [filters, userId]);

	//power

	useEffect(() => {
		//if viewmode is changed to calendar then don't open task quickview
		if (viewMode === VIEW_MODES.CALENDAR) return;
		// if power is on
		if (power.status === POWER_STATUS.BOOSTED || power.status === POWER_STATUS.PAUSED) {
			checkPowerTasks();
			//set filters
			setFilters(power.filters);
		}
		if (
			(power.status === POWER_STATUS.BOOSTED || power.status === POWER_STATUS.PAUSED) &&
			tasksFromServer
		) {
			//open task which is active
			if (
				tasksFromServer?.find(
					task => task.task_id === power.tasks.find(t => t.active)?.task_id
				)
			) {
				setActiveTaskInfo(
					tasksFromServer?.find(
						task => task.task_id === power.tasks.find(t => t.active)?.task_id
					)
				);
				setViewMode(VIEW_MODES.TASK);
			}
		}
	}, [power, tasksFromServer, viewMode]);

	useEffect(() => {
		if (power.status === POWER_STATUS.BOOSTED) {
			if (
				activeTaskInfo === null ||
				power.tasks.find(t => t.active)?.task_id !== activeTaskInfo?.task_id
			)
				setPower(prev => ({ ...prev, status: POWER_STATUS.PAUSED }));
		}
	}, [activeTaskInfo]);

	return (
		<Container className={styles.tasks} onClick={() => setIsSearchFocused(false)}>
			<div className={styles.header}>
				<div>
					<div className={styles.title}>
						{power.status === POWER_STATUS.STOPPED ? (
							<>
								<Title className={styles.tasksTitle}>
									{filters?.task_date_creation?.length !== 0
										? filters?.task_date_creation?.includes(
												FILTER_ENUMS.TASK_DATE_CREATION_TODAY
										  )
											? COMMON_TRANSLATION.TODAYS_TASKS[user?.language?.toUpperCase()]
											: COMMON_TRANSLATION.YESTERDAYS_TASKS[user?.language?.toUpperCase()]
										: COMMON_TRANSLATION.PENDING_TASKS[user?.language?.toUpperCase()]}
								</Title>
								<span>
									{TASKS_TRANSLATION.TOTAL_TASKS[user?.language?.toUpperCase()]} :{" "}
									{tasks?.length}
								</span>
							</>
						) : (
							<Title className={styles.tasksTitle}>
								{power.status === POWER_STATUS.PAUSED ? (
									<>
										<Power size="1.71rem" color={Colors.red} /> Focus mode paused
									</>
								) : (
									<>
										<Power size="1.71rem" color={Colors.mainPurple} /> Focus mode
									</>
								)}
							</Title>
						)}
					</div>
					{tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
						power.status === POWER_STATUS.STOPPED && (
							<Analytics taskActivity={taskActivity} user={user} />
						)}
				</div>
				<div className={styles.right}>
					{tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
						power?.status === POWER_STATUS.STOPPED && (
							<div className={styles.search}>
								<SearchBar
									onSearch={onSearch}
									value={searchValue}
									setValue={setSearchValue}
									onClick={() => setIsSearchFocused(true)}
								/>
								<SearchResults
									input={searchValue}
									results={searchResults}
									active={isSearchFocused}
									loading={searchLoading}
									error={searchError}
								/>
							</div>
						)}
					{power.status === POWER_STATUS.PAUSED ||
					power.status === POWER_STATUS.BOOSTED ? (
						<PowerControls stopPower={stopPower} />
					) : (
						<ThemedButton
							theme={
								viewMode === VIEW_MODES.FILTER || filtersCount > 0
									? ThemedButtonThemes.ACTIVE
									: ThemedButtonThemes.WHITE
							}
							width="fit-content"
							className={styles.filterBtn}
							onClick={() => {
								navigate(`/tasks`);
								setViewMode(viewMode !== VIEW_MODES.FILTER ? VIEW_MODES.FILTER : null);
							}}
						>
							<SortIcon />
							<div>
								{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}{" "}
								{`${!filtersCount ? "" : "(" + filtersCount + ")"}`}
							</div>
						</ThemedButton>
					)}

					<div className={styles.divider} />
					<Tooltip text="Calendar" className={styles.calendarTooltip}>
						<ThemedButton
							theme={
								viewMode === VIEW_MODES.CALENDAR
									? ThemedButtonThemes.ACTIVE
									: ThemedButtonThemes.WHITE
							}
							width="50px"
							onClick={() => {
								navigate(`/tasks`);
								setViewMode(
									viewMode !== VIEW_MODES.CALENDAR ? VIEW_MODES.CALENDAR : null
								);
							}}
							className={styles.calendarBtn}
						>
							<Calendar />
						</ThemedButton>
					</Tooltip>
				</div>
			</div>
			<div
				className={`${styles.body} `}
				style={{ width: !viewMode ? `calc(100%-${sidebarWidth})` : "100%" }}
			>
				<ErrorBoundary>
					<div className={styles.tasksContainer}>
						{power.status !== POWER_STATUS.STOPPED && (
							<ErrorBoundary>
								<PowerTasksOverview
									tasksDataAccess={tasksDataAccess}
									filterTasksForPower={filterTasksForPower}
								/>
							</ErrorBoundary>
						)}
						{taskLoading ? (
							<TASKS_LOADER />
						) : tasks?.length > 0 ? (
							tasks
								.filter(task => filterTasksForPower(task))
								.map((task, index) => (
									<TaskCard
										key={task.task_id}
										cardInfoWidth={cardInfoWidth}
										active={activeTaskInfo === task}
										viewMode={viewMode}
										onClick={() => {
											navigate(`?task_id=${task.task_id}`);
											setActiveTaskInfo(task);
											setViewMode(VIEW_MODES.TASK);
										}}
										task={task}
										userTimeZone={user.timezone}
										index={index}
									/>
								))
						) : (
							<div className={styles.noTasks}>
								<NoTasks />
								<h4>{TASKS_TRANSLATION.NO_TASK_FOUND[user?.language?.toUpperCase()]}</h4>
							</div>
						)}
					</div>
				</ErrorBoundary>
				<div
					style={{
						width: sidebarWidth,
						transition: "0.25s ease-in-out",
						position: "relative",
					}}
				>
					<Sidebar
						filterProps={{ filters, setFilters, filtersCount }}
						viewMode={viewMode}
						activeTaskInfo={activeTaskInfo}
						setViewMode={setViewMode}
						onClose={onClose}
						tasks={tasks?.filter(task => filterTasksForPower(task))}
						setTasks={setTasks}
						userId={userId}
						setUserId={setUserId}
						stopPower={stopPower}
						leadTimezones={timeszones}
						leadTimezoneLoading={timezonesLoading}
						refetchTasks={refetchTasks}
					/>
				</div>
			</div>
			<PowerModals modal={powerModals} setModal={setPowerModals} />
		</Container>
	);
};

export default Tasks;
