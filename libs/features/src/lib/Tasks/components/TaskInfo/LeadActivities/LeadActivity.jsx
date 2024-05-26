import { useEffect, useRef, useState } from "react";
import styles from "./LeadActivity.module.scss";

import { ErrorBoundary, Title } from "@cadence-frontend/components";
import { GlobalModals, ThemedButton } from "@cadence-frontend/widgets";
import SingleActivity from "./components/SingleActivity/SingleActivity";
import {
	renderActivityIcon,
	useLocalStorage,
	useOutsideClickHandler,
} from "@cadence-frontend/utils";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import {
	ACTIVITY_FILTER,
	ACTIVITY_FILTER_LOOKUP_TABLE,
	DEFAULT_ACTIVITY_FILTER_OPTIONS,
} from "libs/utils/src/lib/filterEnums";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import {
	Home as HOME_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { NoActivities, Tick, TriangleDown } from "@cadence-frontend/icons";

const MODAL_AVAILABLE_FOR = [
	"mail",
	"message",
	"note",
	"linkedin_connection",
	"linkedin_message",
	"whatsapp",
	"out_of_office",
	"pause_cadence_oof",
	"stop_cadence_oof",
	"custom_task",
	"custom_task_for_other",
];

const LeadActivity = ({
	activities,
	lead,
	leadLoading,
	refetchLead,
	userId,
	readActivity,
}) => {
	const [activeModalParams, setActiveModalParams] = useState(null);
	const user = useRecoilValue(userInfo);
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

	const onActivityClick = (activity, setRead) => {
		if (userId) return;
		setRead(true);
		readActivity(activity.activity_id);
		if (
			activity.type === "reply_to" ||
			activity.type === "clicked_mail" ||
			activity.type === "viewed_mail"
		)
			activity.type = "mail"; //because reply_to, viewed_mail and clicked_mail activity behaves as sameas mail
		if (MODAL_AVAILABLE_FOR.includes(activity.type)) {
			let leftCloseIcon = false;
			if (activity.type?.includes("_oof")) {
				leftCloseIcon = true;
				activity.type = activity.type?.replace("_oof", "");
			}
			setActiveModalParams({
				type: activity.type,
				modalProps: {
					isModal: true,
					leftCloseIcon,
					onClose: () => setActiveModalParams(null),
				},
				typeSpecificProps: {
					data: { ...activity, Lead: lead },
					cadence_id: activity?.cadence_id,
					preview: true,
					message_id: activity.message_id,
					lead,
					disableEdit: true,
					refetchLead,
					markTaskAsCompleteIfCurrent: () => null,
				},
			});
		}
	};

	const isMissedCall = activity =>
		activity.type === "call" &&
		activity.incoming &&
		activity.status.startsWith("Missed call");

	const getTotalSelectedFilters = () => {
		if (!activityFilters) return 0;
		return Object.values(activityFilters).reduce(
			(accumulate, filter) => accumulate + (filter === true ? 1 : 0),
			0
		);
	};

	return (
		<div className={styles.container}>
			<GlobalModals {...activeModalParams} />
			<div className={styles.header}>
				<Title size="1.2rem" className={styles.title}>
					{TASKS_TRANSLATION.ACTIVITY[user?.language?.toUpperCase()]}
				</Title>
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
			<div className={styles.body}>
				<ErrorBoundary>
					{activities?.filter(activity => filterActivities(activity))?.length > 0 ? (
						activities
							?.filter(activity => filterActivities(activity))
							?.map((act, index) => (
								<SingleActivity
									key={act.activity_id}
									loading={leadLoading}
									activity={act}
									after={
										index !==
										activities?.filter(activity => filterActivities(activity))?.length - 1
									}
									before={index !== 0}
									setActiveModalParams={setActiveModalParams}
									renderActivityIcon={renderActivityIcon}
									onActivityClick={onActivityClick}
									disabled={!!userId}
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
				</ErrorBoundary>
			</div>
		</div>
	);
};

export default LeadActivity;
