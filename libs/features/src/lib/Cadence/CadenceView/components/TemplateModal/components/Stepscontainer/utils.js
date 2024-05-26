import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import moment from "moment-timezone";
export const convertFromMinutes = (mins, user) => {
	let h = Math.floor(mins / 60);
	let d = Math.floor(h / 24);
	h = h - d * 24;
	let m = Math.floor(mins % 60);
	if (mins % 1440 === 0)
		return {
			time: d,
			duration:
				d > 1
					? COMMON_TRANSLATION.DAY[user?.language?.toUpperCase()]
					: COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()],
		};
	else if (mins % 60 === 0)
		return {
			time: h,
			duration: [COMMON_TRANSLATION.HOURS[user?.language?.toUpperCase()]],
		};
	return {
		time: m,
		duration: [COMMON_TRANSLATION.MINS[user?.language?.toUpperCase()]],
	};
};

export const getTotalDurationOfCadence = steps => {
	if (!steps) return "";
	const totalDurationInMins = steps.reduce(
		(total, step) => total + (step.wait_time ?? 0),
		0
	);
	return moment.duration(totalDurationInMins, "minutes").humanize();
};
