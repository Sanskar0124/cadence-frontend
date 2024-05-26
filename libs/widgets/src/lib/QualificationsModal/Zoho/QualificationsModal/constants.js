import moment from "moment-timezone";

export const defaultPauseStateFields = {
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
};
export const REFERENCES = {
	[VIEWS.LEAD]: {},
	[VIEWS.CONTACT]: {},
	[VIEWS.ACCOUNT]: {},
};
