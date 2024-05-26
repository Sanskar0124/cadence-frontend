import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
export const convertFromMinutes = (mins, user) => {
	let h = Math.floor(mins / 60);
	let d = Math.floor(h / 24);
	h = h - d * 24;
	let m = Math.floor(mins % 60);
	if (mins % 1440 === 0)
		return { time: d, duration: COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()] };
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
