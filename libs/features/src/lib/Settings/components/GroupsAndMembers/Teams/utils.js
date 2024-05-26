import { ROLES } from "@cadence-frontend/constants";
import { TEAM_PERMISSIONS } from "./constants";

export const isActionPermitted = ({ role, sdId, userSdId, action }) => {
	if (!role) return false;

	// sales_manager has all permissions for his team
	if (role === ROLES.SALES_MANAGER && sdId && userSdId && sdId === userSdId) return true;

	if (!action) return false;

	return TEAM_PERMISSIONS[role].includes(action);
};
