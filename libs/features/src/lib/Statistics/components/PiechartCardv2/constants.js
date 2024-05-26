import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
export const INITIAL_PIE_STATE = {
	TASKS: [
		{
			value: 0,
			name: "completed",
			percentage: 0,
		},
		{
			value: 0,
			name: "skipped",
			percentage: 0,
		},
		{
			value: 0,
			name: "pending",
			percentage: 0,
		},
	],
	LEADS: [
		{
			value: 0,
			name: "converted",
			percentage: 0,
		},
		{
			value: 0,
			name: "disqualified",
			percentage: 0,
		},
		{
			value: 0,
			name: "demobooked",
			percentage: 0,
		},
	],
};

export const INITIAL_EMPTY_STATE = {
	TASKS: [
		{ name: "completed", value: 30 },
		{ name: "skipped", value: 20 },
		{ name: "pending", value: 10 },
	],
	LEADS: [
		{ name: "converted", value: 10 },
		{ name: "disqualified", value: 20 },
		{ name: "demobooked", value: 15 },
	],
};
export const TASKS_AND_PEOPLE = {
	completed: TASKS_TRANSLATION.COMPLETED,
	pending: COMMON_TRANSLATION.PENDING,
	demobooked: TASKS_TRANSLATION.DEMO_BOOKED,
	skipped: COMMON_TRANSLATION.SKIPPED,
	converted: COMMON_TRANSLATION.CONVERTED,
	disqualified: COMMON_TRANSLATION.DISQUALIFIED,
};
