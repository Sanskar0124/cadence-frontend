import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Message, AtrManualEmail } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const ICON_SIZE = "20px";

export const DEFAULT_FILTER_OPTIONS = {
	lead_tags: [],
	company_size: [],
	lead_cadences: [],
	lead_activity: [],
};

export const COMPANY_SIZE_ENUMS = {
	company_size_1_10: "1-10",
	company_size_11_50: "11-50",
	company_size_51_200: "51-200",
	company_size_201_500: "201-500",
	company_size_501_1000: "501-1000",
	company_size_1001_5000: "1001-5000",
	company_size_5000_10000: "5000-10000",
	company_size_10000: "10000+",
};

export const TAGS_ENUMS = {
	lead_tags_new: COMMON_TRANSLATION.NEW,
	lead_tags_duplicated: COMMON_TRANSLATION.DUPLICATED,
	lead_tags_converted: COMMON_TRANSLATION.CONVERTED,
	lead_tags_disqualified: COMMON_TRANSLATION.DISQUALIFIED,
	lead_tags_hot: COMMON_TRANSLATION.HOT_LEAD,
};

export const ACTIVITY_ENUMS = {
	lead_activity_email: "Unread emails",
	lead_activity_sms: "Unread sms",
};

export const ACTIVITY_ENUMS_ICONS = {
	lead_activity_email: <AtrManualEmail size={ICON_SIZE} />,
	lead_activity_sms: <Message size={ICON_SIZE} />,
};

export const COMPANY_SIZE_FILTER_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.GOOGLE_SHEETS,
];
