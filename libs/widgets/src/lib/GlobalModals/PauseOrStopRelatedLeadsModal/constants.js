import moment from "moment-timezone";

export const defaultPauseStateFields = {
	time: `${moment().format("HH:mm")}`,
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
