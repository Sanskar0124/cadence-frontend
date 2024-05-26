import moment from "moment-timezone";

export const convertFrom24Hour = time => {
	const converted = moment(time, "HH:mm").format("hh:mm A");
	if (converted !== "Invalid date") {
		const hh = converted.slice(0, 2);
		const mm = converted.slice(3, 5);
		const a = converted.slice(6, 9);
		return { hh, mm, a };
	} else return null;
};

export const convertTo24Hour = time => {
	const converted = moment(time, "hh:mm A").format("HH:mm");
	if (converted !== "Invalid date") return converted;
	return null;
};
