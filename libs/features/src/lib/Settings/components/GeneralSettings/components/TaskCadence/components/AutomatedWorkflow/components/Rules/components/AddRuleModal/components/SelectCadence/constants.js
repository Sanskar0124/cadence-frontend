import { CADENCE_TYPES, ROLES } from "@cadence-frontend/constants";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const TABS = [
	{ label: CADENCE_TRANSLATION.PERSONAL, value: CADENCE_TYPES.PERSONAL },
	{ label: CADENCE_TRANSLATION.GROUP, value: CADENCE_TYPES.TEAM },
	{ label: CADENCE_TRANSLATION.COMPANY, value: CADENCE_TYPES.COMPANY },
];

export const REASSIGN_PERMISSION_MAP = {
	[ROLES.SALESPERSON]: [CADENCE_TYPES.PERSONAL],
	[ROLES.SALES_MANAGER]: [CADENCE_TYPES.PERSONAL, CADENCE_TYPES.TEAM],
	[ROLES.ADMIN]: [CADENCE_TYPES.PERSONAL, CADENCE_TYPES.TEAM, CADENCE_TYPES.COMPANY],
	[ROLES.SUPER_ADMIN]: [
		CADENCE_TYPES.PERSONAL,
		CADENCE_TYPES.TEAM,
		CADENCE_TYPES.COMPANY,
	],
};
