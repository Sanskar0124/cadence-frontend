import { ENUMS, ACTIVITY_TYPES } from "@cadence-frontend/constants";

export const isMissedCall = activity =>
	activity.type === ACTIVITY_TYPES.CALL &&
	activity.incoming &&
	activity.name.startsWith("You missed a call");

const renderActivityIcon = (activity, read) => {
	if (isMissedCall(activity)) return ENUMS[activity.type]?.icon?.missed;
	else {
		if (activity.type === "custom_task" || activity.type === "custom_task_for_other") {
			if (activity.task_type && activity.task_type !== "other")
				return ENUMS[activity.task_type]?.icon?.default;
		}
		if (
			activity.type === "clicked_mail" ||
			activity.type === "viewed_mail" ||
			activity.type === "unsubscribe" ||
			activity.type === "clicked_message"
		) {
			return ENUMS[activity.type]?.icon?.default;
		}
		if ("incoming" in activity && activity.incoming !== null) {
			if (activity.incoming) {
				if (read) return ENUMS[activity.type]?.icon?.incoming;
				else {
					if (activity.type === ACTIVITY_TYPES.CALL)
						return ENUMS[activity.type]?.icon?.incoming;
					else return ENUMS[activity.type]?.icon?.unread;
				}
			} else return ENUMS[activity.type]?.icon?.outgoing;
		} else return ENUMS[activity.type]?.icon?.default;
	}
};

export default renderActivityIcon;
