import { ENUMS } from "@cadence-frontend/constants";
import {
	Wrench,
	AtrManualEmail,
	Message,
	Linkedin,
	Call,
	DataCheck,
	Whatsapp,
	Callback,
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
		icon: ENUMS.whatsapp.icon.default,
		name: COMMON_TRANSLATION.WHATSAPP,
		fieldName: "whatsapp",
	},
	{
		icon: <Message />,
		name: COMMON_TRANSLATION.MANUAL_SMS,
		fieldName: "message",
	},
	{
		icon: ENUMS.linkedin.icon.default,
		name: ENUMS.linkedin.name,
		fieldName: "linkedin_interact",
	},
	// {
	// 	icon: ENUMS.linkedin_connection.icon.default,
	// 	name: ENUMS.linkedin_connection.name,
	// 	fieldName: "linkedin_connections_per_day",
	// },
	// {
	// 	icon: ENUMS.linkedin_message.icon.default,
	// 	name: ENUMS.linkedin_message.name,
	// 	fieldName: "linkedin_messages_per_day",
	// },
	// {
	// 	icon: ENUMS.linkedin_profile.icon.default,
	// 	name: ENUMS.linkedin_profile.name,
	// 	fieldName: "linkedin_profiles_per_day",
	// },
	// {
	// 	icon: ENUMS.linkedin_profile.icon.default,
	// 	name: ENUMS.linkedin_interact.name,
	// 	fieldName: "linkedin_interacts_per_day",
	// },
	{
		icon: <Call />,
		name: TASKS_TRANSLATION.CALL,
		fieldName: "call",
	},
	// TO_ASK
	// {
	// 	icon: <Callback />,
	// 	name: TASKS_TRANSLATION.CALLBACK,
	// 	fieldName: "callback",
	// },
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
];

export const LINKEDIN = {
	LINKEDIN_CONNECTIONS_PER_DAY: "linkedin_connection",

	LINKEDIN_MESSAGES_PER_DAY: "linkedin_message",

	LINKEDIN_PROFILES_PER_DAY: "linkedin_profile",

	LINKEDIN_INTERACTS_PER_DAY: "linkedin_interact",
};
