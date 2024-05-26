import {
	AtrManualEmail,
	Call,
	DataCheck,
	Linkedin,
	Message,
	Whatsapp,
	Wrench,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ACTIVE_TAG_ENUM } from "../../constants";

export const FILTER_ENUMS = {
	TASK_TAG_LATE: "task_tag_late",
	TASK_TAG_URGENT: "task_tag_urgent",
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
};

export const TASK_ENUMS = user => [
	{
		icon: <Call />,
		type: "call",
		filter_type: [FILTER_ENUMS.TASK_ACTION_CALL],
		name: TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()],
	},
	{
		icon: <AtrManualEmail />,
		type: "email",
		filter_type: [FILTER_ENUMS.TASK_ACTION_EMAIL, FILTER_ENUMS.TASK_ACTION_REPLY_TO],
		name: COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase()],
	},
	{
		icon: <Message />,
		type: "message",
		filter_type: [FILTER_ENUMS.TASK_ACTION_SMS],
		name: TASKS_TRANSLATION.SMS[user?.language?.toUpperCase()],
	},
	{
		icon: <Linkedin />,
		type: "linkedin",
		filter_type: [
			FILTER_ENUMS.TASK_ACTION_LINKEDIN_CONNECTION,
			FILTER_ENUMS.TASK_ACTION_LINKEDIN_MESSAGE,
			FILTER_ENUMS.TASK_ACTION_LINKEDIN_PROFILE,
			FILTER_ENUMS.TASK_ACTION_LINKEDIN_INTERACT,
		],
		name: COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()],
	},
	{
		icon: <Whatsapp />,
		type: "whatsapp",
		filter_type: [FILTER_ENUMS.TASK_ACTION_WHATSAPP],
		name: COMMON_TRANSLATION.WHATSAPP[user?.language?.toUpperCase()],
	},
	{
		icon: <Wrench />,
		type: "cadence_custom",
		filter_type: [FILTER_ENUMS.TASK_ACTION_CADENCE_CUSTOM],
		name: TASKS_TRANSLATION.CUSTOM[user?.language?.toUpperCase()],
	},
	{
		icon: <DataCheck />,
		type: "data_check",
		filter_type: [FILTER_ENUMS.TASK_ACTION_DATA_CHECK],
		name: COMMON_TRANSLATION.DATA_CHECK[user?.language?.toUpperCase()],
	},
];

export const TASK_TAG_ENUMS = {
	[ACTIVE_TAG_ENUM.late]: FILTER_ENUMS.TASK_TAG_LATE,
	[ACTIVE_TAG_ENUM.urgent]: FILTER_ENUMS.TASK_TAG_URGENT,
};

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
};
