import { CADENCE_PRIORITY, CADENCE_TAGS, CADENCE_INTEGRATIONS } from "../../constants";
import moment from "moment-timezone";

export const PRIORITY_OPTIONS = {
	[CADENCE_PRIORITY.HIGH]: "High",
	[CADENCE_PRIORITY.STANDARD]: "Standard",
};

export const TAG_OPTIONS = {
	[CADENCE_TAGS.INBOUND]: "Inbound (2 hours)",
	[CADENCE_TAGS.OUTBOUND]: "Outbound (12 hours)",
};

export const INTEGRATION_OPTIONS = {
	[CADENCE_INTEGRATIONS.SALESFORCE]: "Salesforce",
};

export const defaultPauseStateFields = {
	time: `${moment().format("HH:mm")}`,
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
