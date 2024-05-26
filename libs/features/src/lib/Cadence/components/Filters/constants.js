import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const DEFAULT_FILTER_OPTIONS = {
	status: null,
	priority: null,
	user_id: null,
	sd_id: null,
};

export const CADENCE_STATUS_ENUMS = {
	paused: CADENCE_TRANSLATION.PAUSED,
	in_progress: CADENCE_TRANSLATION.IN_PROGRESS,
	not_started: CADENCE_TRANSLATION.NOT_STARTED,
	scheduled: CADENCE_TRANSLATION.SCHEDULED,
};

export const CADENCE_PRIORITY_ENUMS = {
	standard: "Standard",
	high: "High",
};
