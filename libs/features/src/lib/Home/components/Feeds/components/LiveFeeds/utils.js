import { ACTIVITY_TYPES } from "@cadence-frontend/constants";
import { ACTIVITY_TYPE_TO_FILTER } from "./constants";

export const isActivityTypePresentInFilters = (activity, filter) => {
	if (!activity?.incoming) {
		if (
			activity?.type !== ACTIVITY_TYPES.UNSUBSCRIBE &&
			activity?.type !== ACTIVITY_TYPES.BOUNCED_MAIL
		)
			return false;
	}
	if (activity?.type === ACTIVITY_TYPES.CALL) {
		if (
			!activity?.name.includes("missed a call") ||
			!activity?.name.includes("received a call") ||
			!activity?.name.includes("rejected a call")
		)
			return false;
	}
	if (filter?.[0] === "all") return true;

	let isPresent = false;
	if (activity?.type === ACTIVITY_TYPES.CALL) {
		ACTIVITY_TYPE_TO_FILTER[activity?.type].forEach(filter_type => {
			if (
				activity?.name.includes(`${filter_type.split("_")[0]} a call`) &&
				filter.includes(filter_type)
			)
				isPresent = true;
		});
		return isPresent;
	} else {
		if (!filter.includes(ACTIVITY_TYPE_TO_FILTER[activity?.type])) return false;
	}
	return true;
};
