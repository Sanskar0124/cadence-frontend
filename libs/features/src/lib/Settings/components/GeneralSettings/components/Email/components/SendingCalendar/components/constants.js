import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const UNIT_OPTIONS = [
	{ label: COMMON_TRANSLATION.SECOND_S, value: 1 },
	{ label: COMMON_TRANSLATION.MINUTE_S, value: 60 },
	{ label: COMMON_TRANSLATION.HOUR_S, value: 3600 },
];

export const DEFAULT_WAIT_SETTINGS = {
	wait_time_lower_limit: 2,
	wait_time_upper_limit: 5,
	lower_time_limit_unit: 60,
	upper_time_limit_unit: 60,
};
