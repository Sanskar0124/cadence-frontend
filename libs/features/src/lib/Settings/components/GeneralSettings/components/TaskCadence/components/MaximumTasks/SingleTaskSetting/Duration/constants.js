import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const getWaitTimeOptions = user => {
	return {
		mins: [COMMON_TRANSLATION.MINUTE_S[user?.language?.toUpperCase()]],
		hours: [COMMON_TRANSLATION.HOUR_S[user?.language?.toUpperCase()]],
		days: [COMMON_TRANSLATION.DAY_S[user?.language?.toUpperCase()]],
	};
};

export const convertFromMinutes = mins => {
	let h = Math.floor(mins / 60);
	let d = Math.floor(h / 24);
	h = h - d * 24;
	let m = Math.floor(mins % 60);
	if (mins % 1440 === 0) return { time: d, duration: "days" };
	else if (mins % 60 === 0) return { time: h, duration: "hours" };
	return { time: m, duration: "mins" };
};

export const convertToMinutes = (t, d) => {
	if (d === "mins") return t;
	else if (d === "hours") return t * 60;
	return t * 1440;
};
