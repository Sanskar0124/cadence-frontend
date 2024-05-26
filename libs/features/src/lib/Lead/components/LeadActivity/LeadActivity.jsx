import { useState, useEffect, useRef, useCallback } from "react";

import SingleActivity from "./components/SingleActivity/SingleActivity";
import { GlobalModals, ThemedButton } from "@cadence-frontend/widgets";
import { Calendar, NoActivities, Tick, TriangleDown } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useSocketForActivity, useTasks } from "@cadence-frontend/data-access";
import ActivityPlaceholder from "../Placeholders/ActivityPlaceholder";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./LeadActivity.module.scss";
import { ErrorBoundary } from "@cadence-frontend/components";
import { ACTIVITY_TYPES, LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useLocalStorage, useOutsideClickHandler } from "@cadence-frontend/utils";
import {
	ACTIVITY_FILTER,
	ACTIVITY_FILTER_LOOKUP_TABLE,
	DEFAULT_ACTIVITY_FILTER_OPTIONS,
} from "libs/utils/src/lib/filterEnums";

import {
	Home as HOME_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

const MODAL_AVAILABLE_FOR = [
	"mail",
	"message",
	"note",
	"linkedin_message",
	"linkedin_connection",
	"whatsapp",
	"out_of_office",
	// oof stands for out of facility
	"pause_cadence_oof",
	"stop_cadence_oof",
	"custom_task",
	"custom_task_for_other",
];
//reply_to is basically

const LeadActivity = ({
	lead,
	cadenceList,
	activities,
	refetchLead,
	setActivities,
	user,
	leadLoading,
	handleCustomTaskModal,
	setHotLeadFromSocket,
}) => {
	const [activeModalParams, setActiveModalParams] = useState(null);
	const [latestActivityFromSocket, setLatestActivityFromSocket] = useState();
	const { readActivity } = useTasks();
	const [activityFilters, setActivityFilters] = useState(
		JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_FILTERS))
	);
	const [isDropdown, setIsDropdown] = useState(false);
	const elementRef = useRef(null);
	const dropdownBtnRef = useRef();
	const outsideClickCb = e => {
		if (dropdownBtnRef.current.contains(e.target)) {
			setIsDropdown(prev => !prev);
			e.stopPropagation();
		} else setIsDropdown(false);
	};

	useOutsideClickHandler(elementRef, outsideClickCb);

	useEffect(() => {
		if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_FILTERS)) {
			setActivityFilters(DEFAULT_ACTIVITY_FILTER_OPTIONS);
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.ACTIVITY_FILTERS,
				JSON.stringify(DEFAULT_ACTIVITY_FILTER_OPTIONS)
			);
		}
	}, []);

	const setActivityFiltersAndUpdateLocalStorage = filters => {
		setActivityFilters(filters);
		localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVITY_FILTERS, JSON.stringify(filters));
	};

	const filterActivities = activity => {
		try {
			if (leadLoading) return true;
			if (!activityFilters) return true;
			if (
				activityFilters &&
				!activityFilters?.[ACTIVITY_FILTER?.CADENCE_ACTIVITIES] &&
				!activityFilters?.[ACTIVITY_FILTER?.LEAD_ACTIVITIES] &&
				!activityFilters?.[ACTIVITY_FILTER?.TASK_ACTIVITIES]
			)
				return true;
			if (!activity?.type) return false;
			return activityFilters?.[ACTIVITY_FILTER_LOOKUP_TABLE?.[activity?.type]];
		} catch (err) {
			return true;
		}
	};
	const addActivity = activity => {
		if (parseInt(activity.lead_id) === parseInt(lead?.lead_id)) {
			setActivities(prevState => {
				const existingActivity = prevState.find(
					prev => activity.activity_id === prev.activity_id
				);
				if (existingActivity) {
					setLatestActivityFromSocket(activity);
				}
				return existingActivity
					? prevState.map(prev => {
							if (prev.activity_id === activity.activity_id) return activity;
							else return prev;
					  })
					: [activity, ...prevState];
			});
		}
	};

	const onActivityClick = (activity, setRead) => {
		// if (userId) return;
		const cadence = cadenceList?.filter(
			cadence => cadence?.Cadences?.[0]?.cadence_id === activity?.cadence_id
		)?.[0];
		setRead(true);
		readActivity(activity.activity_id);
		if (activity.type === "reply_to") activity.type = "mail";
		if (MODAL_AVAILABLE_FOR.includes(activity.type)) {
			let leftCloseIcon = false;
			if (activity.type?.includes("_oof")) {
				leftCloseIcon = true;
				activity.type = activity.type?.replace("_oof", "");
			}
			// console.log(cadence)
			setActiveModalParams({
				type: activity.type === "custom_task_for_other" ? "custom_task" : activity.type,
				modalProps: {
					isModal: true,
					leftCloseIcon,
					onClose: () =>
						setActiveModalParams(prev => ({ ...prev, modalProps: { isModal: false } })),
				},
				typeSpecificProps: {
					lead,
					cadence_id: cadence?.Cadences?.[0]?.cadence_id,
					data: activity,
					preview: true,
					message_id: activity.message_id,
					disableEdit: true,
					refetchLead,
					markTaskAsCompleteIfCurrent: () => null,
				},
			});
		}
	};

	useEffect(() => {
		if (latestActivityFromSocket) {
			if (
				latestActivityFromSocket.type === ACTIVITY_TYPES.HOT_LEAD &&
				lead.lead_id === latestActivityFromSocket.lead_id
			)
				setHotLeadFromSocket(true);
			addActivity(latestActivityFromSocket);
		}
		setLatestActivityFromSocket(null);
	}, [latestActivityFromSocket]);

	useSocketForActivity(setLatestActivityFromSocket, user?.email);

	const getTotalSelectedFilters = () => {
		if (!activityFilters) return 0;
		return Object.values(activityFilters).reduce(
			(accumulate, filter) => accumulate + (filter === true ? 1 : 0),
			0
		);
	};

	return (
		<div className={styles.leadActivity}>
			<div className={styles.header}>
				<h3>{TASKS_TRANSLATION.ACTIVITY[user?.language?.toUpperCase()]}</h3>
				<div className={styles.filter}>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						className={styles.selectFilterBtn}
						ref={dropdownBtnRef}
					>
						<div>
							{getTotalSelectedFilters()
								? `${getTotalSelectedFilters()} ${
										COMMON_TRANSLATION.FILTER[user?.language?.toUpperCase()]
								  }(s)`
								: `${COMMON_TRANSLATION.ACTIVITY_FILTERS[user?.language?.toUpperCase()]}`}
						</div>
						<TriangleDown />
					</ThemedButton>
					<div
						ref={elementRef}
						className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}
					>
						{isDropdown && (
							<div className={styles.list}>
								{typeof activityFilters === "object" &&
									activityFilters &&
									Object.keys(activityFilters)?.map((filter, index) => (
										<div
											key={index}
											onClick={() => {
												let newState = {
													...activityFilters,
													[filter]: !activityFilters?.[filter],
												};
												setActivityFiltersAndUpdateLocalStorage(newState);
											}}
											className={`${styles.filter} ${
												activityFilters?.[filter] ? styles.selected : ""
											}`}
										>
											<div className={styles.info}>
												<div>
													<span
													// style={{ textTransform: index !== 0 ? "capitalize" : "" }}
													>
														{
															COMMON_TRANSLATION?.[filter?.toUpperCase()]?.[
																user?.language?.toUpperCase()
															]
														}
													</span>
												</div>
											</div>
											{activityFilters?.[filter] && (
												<div className={styles.tick}>
													<Tick />
												</div>
											)}
										</div>
									))}
							</div>
						)}
					</div>
				</div>
			</div>
			<ErrorBoundary>
				<div className={styles.main}>
					{leadLoading ? (
						<ActivityPlaceholder rows={10} />
					) : activities?.filter(activity => filterActivities(activity))?.length > 0 ? (
						activities
							?.filter(activity => filterActivities(activity))
							?.map((act, index) => (
								<SingleActivity
									loading={leadLoading}
									activity={act}
									after={
										index !==
										activities?.filter(activity => filterActivities(activity))?.length - 1
									}
									before={index !== 0}
									onActivityClick={onActivityClick}
									cadenceList={cadenceList}
								/>
							))
					) : (
						<div className={styles.noActivities}>
							<NoActivities />
							<h4>
								{TASKS_TRANSLATION.NO_ACTIVITY_FOUND[user?.language?.toUpperCase()]}
							</h4>
						</div>
					)}
				</div>
			</ErrorBoundary>
			<GlobalModals {...activeModalParams} />
		</div>
	);
};

export default LeadActivity;
