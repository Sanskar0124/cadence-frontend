import { ENUMS } from "@cadence-frontend/constants";
import {
	Wrench,
	AtrManualEmail,
	Message,
	Linkedin,
	Call,
	DataCheck,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
export const TASK_OPTIONS = [
	{
		icon: ENUMS.mail.icon.default,
		name: COMMON_TRANSLATION.MANUAL_EMAILS,
		fieldName: "mail",
	},
	{
		icon: <Message />,
		name: COMMON_TRANSLATION.MANUAL_SMS,
		fieldName: "message",
	},
	{
		icon: <Call />,
		name: TASKS_TRANSLATION.CALL,
		fieldName: "call",
	},
	{
		icon: <Wrench />,
		name: TASKS_TRANSLATION.CUSTOM,
		fieldName: "cadence_custom",
	},
	{
		icon: <DataCheck />,
		name: COMMON_TRANSLATION.DATA_CHECK,
		fieldName: "data_check",
	},
	{
		icon: ENUMS.whatsapp.icon.default,
		name: COMMON_TRANSLATION.WHATSAPP,
		fieldName: "whatsapp",
	},
	{
		icon: ENUMS.linkedin.icon.default,
		name: ENUMS.linkedin.name,
		fieldName: "linkedin_interact",
	},
];

export const LINKEDIN = {
	LINKEDIN_CONNECTIONS_PER_DAY: "linkedin_connection",

	LINKEDIN_MESSAGES_PER_DAY: "linkedin_message",

	LINKEDIN_PROFILES_PER_DAY: "linkedin_profile",

	LINKEDIN_INTERACTS_PER_DAY: "linkedin_interact",
};
