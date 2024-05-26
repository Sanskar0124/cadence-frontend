import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const CADENCES_TAB_OPTIONS = [
	{ label: CADENCE_TRANSLATION.PERSONAL, value: CADENCE_TYPES.PERSONAL },
	{ label: CADENCE_TRANSLATION.GROUP, value: CADENCE_TYPES.TEAM },
	{ label: CADENCE_TRANSLATION.COMPANY, value: CADENCE_TYPES.COMPANY },
];
