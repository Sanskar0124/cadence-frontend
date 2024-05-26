import { ROLES } from "@cadence-frontend/constants";

export const ACTIONS = {
	VIEW: "view",
	CREATE: "create",
	UPDATE: "update",
	DELETE: "delete",
};

export const TEAM_PERMISSIONS = {
	[ROLES.MANAGER]: [ACTIONS.VIEW],
	[ROLES.ADMIN]: Object.values(ACTIONS),
	[ROLES.SUPER_ADMIN]: Object.values(ACTIONS),
};
