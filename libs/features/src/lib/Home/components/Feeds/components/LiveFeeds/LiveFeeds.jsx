import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./LiveFeeds.module.scss";

import { GlobalModals } from "@cadence-frontend/widgets";
import SingleFeed from "./components/SingleFeed/SingleFeed";

import { userInfo } from "@cadence-frontend/atoms";
import { SOCKET_ON_EVENTS } from "@cadence-frontend/constants";
import { SocketContext } from "@cadence-frontend/contexts";
import { useHomePage, useTasks } from "@cadence-frontend/data-access";
import { NoActivities2 } from "@cadence-frontend/icons";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { renderActivityIcon } from "@cadence-frontend/utils";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { LiveFeedsPlaceholder } from "../../../Placeholder/Placeholder";
import { Icons } from "./Icons";
import { isActivityTypePresentInFilters } from "./utils";

const MODAL_AVAILABLE_FOR = [
	"mail",
	"message",
	"note",
	"linkedin_connection",
	"linkedin_message",
	"linkedin_profile",
	"linkedin_interact",
	"out_of_office",
	"pause_cadence_oof",
	"stop_cadence_oof",
];

const LiveFeeds = ({ leadLoading, userId, filter, setActiveLeadId }) => {
	const [activeModalParams, setActiveModalParams] = useState(null);
	const [activities, setActivities] = useState([]);
	const [activitiesFromSocket, setActivitiesFromSocket] = useState([]);
	const { addSocketHandler } = useContext(SocketContext);
	const user = useRecoilValue(userInfo);
	const liveFeedDataAccess = useHomePage({ liveFeedData: true }, { feedFilter: filter });
	const {
		liveFeedData,
		hasFeedNextPage,
		isLiveFeedFetching,
		isFetchingLiveFeedNextPage,
		fetchFeed,
		fetchFeedNextPage,
	} = liveFeedDataAccess;
	const observer = useRef();
	const { readActivity } = useTasks();
	const navigate = useNavigate();

	const onActivityClick = (activity, setRead) => {
		setActiveLeadId(activity.lead_id);
		if (userId) return;
		setRead(true);
		readActivity(activity.activity_id);
		let type = activity.type;
		let cadence_id = activity.cadence_id;
		if (type === "reply_to" || type === "clicked_mail" || type === "viewed_mail")
			type = "mail"; //because reply_to, viewed_mail and clicked_mail activity behaves as sameas mail
		if (MODAL_AVAILABLE_FOR.includes(type)) {
			let leftCloseIcon = false;
			if (activity.type?.includes("_oof")) {
				leftCloseIcon = true;
				type = activity.type?.replace("_oof", "");
			}
			setActiveModalParams({
				type,

				modalProps: {
					isModal: true,
					leftCloseIcon,
					onClose: () => setActiveModalParams(null),
					// showPauseStopCadence: true,
				},
				typeSpecificProps: {
					data: activity,
					preview: true,
					cadence_id,
					refetchLead: fetchFeed,
					message_id: activity.message_id,
					lead: activity.Lead,
					disableEdit: true,
					markTaskAsCompleteIfCurrent: () => null,
				},
			});
		}

		if (type === "hot_lead") {
			navigate(`/leads/${activity.lead_id}`);
		}
	};

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.ACTIVITY,
			key: "live-feeds",
			handler: handleSocketEvent,
		});
	}, [filter]);

	const handleSocketEvent = activity => {
		if (isActivityTypePresentInFilters(activity, filter)) {
			setActivitiesFromSocket(prev => [...new Set([activity, ...prev])]);
		}
	};

	useEffect(() => {
		if (liveFeedData?.length >= 0) {
			setActivities(liveFeedData);
		}
	}, [liveFeedData]);

	// Refetch Live Feed on Infinite Scroll
	const lastLiveFeedRef = useCallback(
		feed => {
			if (isFetchingLiveFeedNextPage || isLiveFeedFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting) {
					fetchFeedNextPage();
				}
			});
			if (feed) observer.current.observe(feed);
		},
		[isFetchingLiveFeedNextPage, isLiveFeedFetching, hasFeedNextPage]
	);

	useEffect(() => {
		setActivitiesFromSocket([]);
	}, [filter]);

	const renderDate = (activity, currIndex) => {
		let filtered = activities
			.map((act, index) => ({ ...act, index }))
			.filter(
				act =>
					moment(act?.created_at).format("DDD") ===
					moment(activity?.created_at).format("DDD")
			);

		if (filtered[0].index === currIndex)
			return (
				<div className={styles.date}>
					<span>
						{moment(activity?.created_at).dayOfYear() === moment().dayOfYear()
							? "Today"
							: moment(activity?.created_at).dayOfYear() ===
							  moment().subtract(1, "days").dayOfYear()
							? "Yesterday"
							: moment(activity?.created_at).format("D MMMM, YYYY")}
					</span>
				</div>
			);
		return null;
	};

	return (
		<div className={styles.container}>
			<GlobalModals {...activeModalParams} />
			{isLiveFeedFetching && !isFetchingLiveFeedNextPage ? (
				<LiveFeedsPlaceholder />
			) : activities?.length > 0 || activitiesFromSocket?.length > 0 ? (
				<>
					{activitiesFromSocket?.map((act, index) => (
						<SingleFeed
							key={act?.activity_id}
							loading={leadLoading}
							activity={act}
							after={index !== activitiesFromSocket?.length - 1}
							before={index !== 0}
							setActiveModalParams={setActiveModalParams}
							renderActivityIcon={renderActivityIcon}
							Icons={Icons}
							onActivityClick={onActivityClick}
							disabled={!!userId}
							showCadence={activitiesFromSocket?.Email !== null}
							ref={null}
						/>
					))}
					{activities?.map((act, index) => (
						<>
							{renderDate(act, index)}
							<SingleFeed
								key={act?.activity_id}
								loading={leadLoading}
								activity={act}
								after={index !== activities?.length - 1}
								before={index !== 0}
								setActiveModalParams={setActiveModalParams}
								renderActivityIcon={renderActivityIcon}
								Icons={Icons}
								onActivityClick={onActivityClick}
								disabled={!!userId}
								showCadence={activities?.Email !== null}
								ref={activities?.length > 9 ? lastLiveFeedRef : null}
							/>
						</>
					))}
				</>
			) : (
				<div className={styles.noActivities}>
					<NoActivities2 />
					<h4>{TASKS_TRANSLATION.NO_ACTIVITY_FOUND[user?.language?.toUpperCase()]}</h4>
				</div>
			)}
		</div>
	);
};

export default LiveFeeds;
