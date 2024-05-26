import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

export const INITIAL_PIE_STATE = {
	PENDING: [
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "call",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "callback",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "message",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "custom",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "email",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "datacheck",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "linkedin",
		},
		{
			value: 0,
			urgent: 0,
			late: 0,
			name: "whatsapp",
		},
	],
	DONE: [
		{
			value: 0,
			skipped: 0,
			name: "call",
		},
		{
			value: 0,
			skipped: 0,
			name: "callback",
		},
		{
			value: 0,
			skipped: 0,
			name: "message",
		},
		{
			value: 0,
			skipped: 0,
			name: "custom",
		},
		{
			value: 0,
			skipped: 0,
			name: "email",
		},
		{
			value: 0,
			skipped: 0,
			name: "datacheck",
		},

		{
			value: 0,
			skipped: 0,
			name: "linkedin",
		},

		{
			value: 0,
			skipped: 0,
			name: "whatsapp",
		},
	],
};

export const TASK_TYPES = {
	call: TASKS_TRANSLATION.CALL,
	callback: TASKS_TRANSLATION.CALLBACK,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
	datacheck: COMMON_TRANSLATION.DATA_CHECK,
	custom: TASKS_TRANSLATION.CUSTOM,
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	email: COMMON_TRANSLATION.EMAIL,
	message: COMMON_TRANSLATION.MESSAGE,
};
