import { ENUMS } from "@cadence-frontend/constants";
import { Wrench, Message, Call, DataCheck } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";

export const TASK_OPTIONS = [
	{
		icon: ENUMS.mail.icon.default,
		name: COMMON_TRANSLATION.MANUAL_EMAILS,
		fieldName: "mails_per_day",
	},
	{
		icon: <Message />,
		name: COMMON_TRANSLATION.MANUAL_SMS,
		fieldName: "messages_per_day",
	},
	{
		icon: ENUMS.linkedin_connection.icon.default,
		name: ENUMS.linkedin_connection.name,
		fieldName: "linkedin_connections_per_day",
	},
	{
		icon: ENUMS.linkedin_message.icon.default,
		name: ENUMS.linkedin_message.name,
		fieldName: "linkedin_messages_per_day",
	},
	{
		icon: ENUMS.linkedin_profile.icon.default,
		name: ENUMS.linkedin_profile.name,
		fieldName: "linkedin_profiles_per_day",
	},
	{
		icon: ENUMS.linkedin_profile.icon.default,
		name: ENUMS.linkedin_interact.name,
		fieldName: "linkedin_interacts_per_day",
	},
	{
		icon: <Call />,
		name: TASKS_TRANSLATION.CALL,
		fieldName: "calls_per_day",
	},
	{
		icon: <Wrench />,
		name: TASKS_TRANSLATION.CUSTOM,
		fieldName: "cadence_customs_per_day",
	},
	{
		icon: <DataCheck />,
		name: COMMON_TRANSLATION.DATA_CHECK,
		fieldName: "data_checks_per_day",
	},
];
