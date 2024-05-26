import moment from "moment-timezone";

export const defaultPauseStateFields = () => {
	const cur = moment();
	return {
		time: `${cur.format("HH:mm")}`,
		DD: cur.format("DD"),
		MM: cur.format("MM"),
		YYYY: cur.format("YYYY"),
	};
};
