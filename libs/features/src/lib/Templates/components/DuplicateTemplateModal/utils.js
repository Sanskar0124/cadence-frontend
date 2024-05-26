import { ROLES } from "@cadence-frontend/constants";

import { TEMPLATE_LEVELS } from "../../constants";

export const getTextByRole = role => {
	switch (role) {
		case ROLES.SALESPERSON:
			return "You can only duplicate a template into your own personal templates";

		case ROLES.SALESPERSON_MANAGER:
			return "You can only duplicate a template into your own personal templates and team templates";

		case ROLES.ADMIN:
		case ROLES.SUPER_ADMIN:
			return "";

		default:
			return "";
	}
};

export const getDuplicateLevel = (template, user) => {
	if (!template || !user) return "";

	let level = template.level;

	// if (user.role === ROLES.SALESPERSON) {
	// 	level = template.level;
	// } else if (user.role === ROLES.SALES_MANAGER) {
	// 	if (template.level !== TEMPLATE_LEVELS.COMPANY) {
	// 		if (template.user_id === user.user_id) level = template.level;
	// 	}
	// } else if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN)
	// 	level = template.level;

	return level;
};
