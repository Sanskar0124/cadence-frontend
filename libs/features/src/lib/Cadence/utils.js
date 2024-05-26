import { ROLES } from "@cadence-frontend/constants";
import { ACTIONS, PERMISSIONS, CADENCE_TYPES, MORE_OPTION_ACTIONS } from "./constants";

export const isActionPermitted = (action, type, role, isOwnCadence = true) => {
	if (!type || !role) return false;
	const ENABLED_ACTIONS = [ACTIONS.READ, ACTIONS.SHARE];
	if (
		!ENABLED_ACTIONS.includes(action) &&
		type === CADENCE_TYPES.PERSONAL &&
		!isOwnCadence
	)
		return false;

	return PERMISSIONS[role][type].includes(action);
};

export const isMoreOptionsEnabled = (type, role, isOwnCadence = true) => {
	if (!type || !role) return false;
	// if (type === CADENCE_TYPES.PERSONAL && !isOwnCadence) return false;

	for (const action of PERMISSIONS[role][type])
		if (MORE_OPTION_ACTIONS.includes(action)) return true;

	return false;
};
export const getTextByRole = role => {
	switch (role) {
		case ROLES.SALESPERSON:
			return "You can share the template with other salesperson in the group, other groups in the company and with the company itself.";

		case ROLES.SALESPERSON_MANAGER:
			return "You can only share a cadence into your own personal cadences and team cadences";

		case ROLES.ADMIN:
			return "";

		default:
			return "";
	}
};
