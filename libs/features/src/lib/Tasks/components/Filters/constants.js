import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	AtrManualEmail,
	Call,
	DataCheck,
	LinkedinConnection,
	LinkedinInteract,
	LinkedinMessage,
	LinkedinProfile,
	Message,
	Reply,
	Whatsapp,
	Wrench,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import moment from "moment";

export const FILTER_ENUMS = {
	TASK_TYPE_ASSIGNED: "task_assigned",
	TASK_TYPE_CUSTOM: "task_custom",
	TASK_TAG_LATE: "task_tag_late",
	TASK_TAG_URGENT: "task_tag_urgent",
	LEAD_TAG_HOT: "lead_tag_hot",
	TASK_ACTION_CALL: "task_action_call",
	TASK_ACTION_LINKEDIN_CONNECTION: "task_action_linkedin_connection",
	TASK_ACTION_LINKEDIN_MESSAGE: "task_action_linkedin_message",
	TASK_ACTION_LINKEDIN_PROFILE: "task_action_linkedin_profile",
	TASK_ACTION_LINKEDIN_INTERACT: "task_action_linkedin_interact",
	TASK_ACTION_EMAIL: "task_action_email",
	TASK_ACTION_REPLY_TO: "task_action_reply_to",
	TASK_ACTION_SMS: "task_action_sms",
	TASK_ACTION_DATA_CHECK: "task_action_data_check",
	TASK_ACTION_CADENCE_CUSTOM: "task_action_cadence_custom",
	TASK_ACTION_WHATSAPP: "task_action_whatsapp",
	TASK_COMPLETION_DUE: "task_completion_due",
	TASK_COMPLETION_DONE: "task_completion_done",
	TASK_COMPLETION_SCHEDULED: "task_completion_scheduled",
	COMPANY_SIZE_MICRO: "company_size_micro",
	COMPANY_SIZE_SMALL: "company_size_small",
	COMPANY_SIZE_MEDIUM: "company_size_medium",
	COMPANY_SIZE_LARGE: "company_size_large",
	FAVOURITE: "favourite",
	TASK_DATE_CREATION_TODAY: "task_date_creation_today",
	TASK_DATE_CREATION_YESTERDAY: "task_date_creation_yesterday",
	LEAD_TIMEZONES: "lead_timezones",
};

export const TASK_ACTION_ENUMS = user => [
	{
		icon: <Call />,
		type: FILTER_ENUMS.TASK_ACTION_CALL,
		name: TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()],
	},
	{
		icon: <Message />,
		type: FILTER_ENUMS.TASK_ACTION_SMS,
		name: TASKS_TRANSLATION.SMS[user?.language?.toUpperCase()],
	},
	{
		icon: <AtrManualEmail />,
		type: FILTER_ENUMS.TASK_ACTION_EMAIL,
		name: COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase()],
	},
	{
		icon: <Reply />,
		type: FILTER_ENUMS.TASK_ACTION_REPLY_TO,
		name: COMMON_TRANSLATION.REPLY[user?.language?.toUpperCase()],
	},
	{
		icon: <Whatsapp />,
		type: FILTER_ENUMS.TASK_ACTION_WHATSAPP,
		name: COMMON_TRANSLATION.WHATSAPP[user?.language?.toUpperCase()],
	},
	{
		icon: <Wrench />,
		type: FILTER_ENUMS.TASK_ACTION_CADENCE_CUSTOM,
		name: TASKS_TRANSLATION.CUSTOM[user?.language?.toUpperCase()],
	},
	{
		icon: <DataCheck />,
		type: FILTER_ENUMS.TASK_ACTION_DATA_CHECK,
		name: COMMON_TRANSLATION.DATA_CHECK[user?.language?.toUpperCase()],
	},
	{
		icon: <LinkedinInteract />,
		type: FILTER_ENUMS.TASK_ACTION_LINKEDIN_INTERACT,
		name: COMMON_TRANSLATION.LINKEDIN_INTERACT[user?.language?.toUpperCase()],
	},
	{
		icon: <LinkedinMessage />,
		type: FILTER_ENUMS.TASK_ACTION_LINKEDIN_MESSAGE,
		name: COMMON_TRANSLATION.LINKEDIN_MESSAGE[user?.language?.toUpperCase()],
	},
	{
		icon: <LinkedinProfile />,
		type: FILTER_ENUMS.TASK_ACTION_LINKEDIN_PROFILE,
		name: TASKS_TRANSLATION.LINKEDIN_PROFILE[user?.language?.toUpperCase()],
	},
	{
		icon: <LinkedinConnection />,
		type: FILTER_ENUMS.TASK_ACTION_LINKEDIN_CONNECTION,
		name: COMMON_TRANSLATION.LINKEDIN_CONNECTION[user?.language?.toUpperCase()],
	},
];

export const DEFAULT_FILTER_OPTIONS = {
	task_type: [],
	task_tag: [],
	lead_tag: [],
	task_action: [],
	task_completion: [],
	company_size: [],
	task_date_creation: [],
	task_cadences: [],
	task_step: "0",
	lead_timezones: [],
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

export const COMPANY_SIZE_FILTER_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.GOOGLE_SHEETS,
	INTEGRATION_TYPE.SHEETS,
];

export const getBusinessHour = time => {
	const convert12HourTo24Hour = time => {
		let convertedTime = new Date("1970-01-01 " + time)
			.toLocaleTimeString("en-US", {
				hour12: false,
			})
			.split(":");
		return {
			hour: convertedTime[0],
			minitue: convertedTime[1],
			sec: convertedTime[2],
		};
	};
	const formattedTime = convert12HourTo24Hour(time);
	const currentTime = new Date();
	currentTime.setHours(formattedTime.hour, formattedTime.minitue, formattedTime.sec);
	// Set start and end time
	var startTime = new Date();
	startTime.setHours(9, 0, 0); // 9:00 AM
	var endTime = new Date();
	endTime.setHours(18, 0, 0); // 6:00 PM
	// Check if the given time is within the range
	if (currentTime >= startTime && currentTime <= endTime) {
		return true;
	} else {
		return false;
	}
};

export const getSameUtcTimezones = (timezone, leadTimezones) => {
	let filtered = leadTimezones
		?.filter(
			item =>
				moment().tz(item.Task.Lead.Lead_phone_numbers[0].timezone).format("Z") ===
				moment().tz(timezone).format("Z")
		)
		.map(item => item.Task.Lead.Lead_phone_numbers[0].timezone);
	return filtered;
};

export const makeFirstLetterCapital = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
