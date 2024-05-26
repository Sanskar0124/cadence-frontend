import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
export const ACTIVE_TAG_OPTIONS = [
	{ label: COMMON_TRANSLATION.ALL, value: "all" },
	{ label: TASKS_TRANSLATION.LATE, value: "late" },
	{ label: TASKS_TRANSLATION.URGENT, value: "urgent" },
];

export const ACTIVE_TAG_COLORS = {
	all: "purple",
	late: "orange",
	urgent: "red",
};
