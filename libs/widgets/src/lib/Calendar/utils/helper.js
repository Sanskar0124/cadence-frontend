const convertHours = mins => {
	const hour = Math.floor(mins / 60);
	mins %= 60;
	const converted = `${pad(hour, 2)}:${pad(mins, 2)}`;
	return converted;
};

const pad = (str, max) => {
	str = str.toString();
	return str.length < max ? pad(`0${str}`, max) : str;
};

export const calculateTimeSlots = (start_time, end_time, interval = "30") => {
	if (interval === 0) {
		interval = 30;
	}
	const time_slots = [];
	for (let i = start_time; i <= end_time; i = i + interval) {
		const startTime = convertHours(i);
		const endTime = convertHours(i + interval);
		if (i !== end_time) {
			time_slots.push({ startTime, endTime });
		}
	}
	return time_slots;
};

export const parseTime = s => {
	const c = s.split(":");
	return parseInt(c[0]) * 60 + parseInt(c[1]);
};
export const generateVideoLink = lead => {
	let videoSlug = `${lead?.first_name}-from-${lead?.Account?.name}`;
	videoSlug = videoSlug.replace(/[^a-zA-Z0-9-]+/g, "");
	return `https://meet.ringover.io/${videoSlug}`;
};
