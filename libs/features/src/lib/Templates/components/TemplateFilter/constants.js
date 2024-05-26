import { ROLES } from "@cadence-frontend/constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

export const TABS = {
	USERS: "users",
	GROUPS: "groups",
};

const BUTTONS = [
	{ label: TASKS_TRANSLATION.USERS, value: TABS.USERS },
	{ label: TASKS_TRANSLATION.GROUPS, value: TABS.GROUPS },
];

export const getTabOptions = (role, user) => {
	if (!role) return [];

	switch (role) {
		case ROLES.ADMIN:
		case ROLES.SUPER_ADMIN:
			return BUTTONS.map(opt => ({
				label: opt.label[user?.language?.toUpperCase()],
				value: opt.value,
			}));

		case ROLES.SALES_MANAGER:
			return BUTTONS.map(opt => ({
				label: opt.label[user?.language?.toUpperCase()],
				value: opt.value,
			})).filter(tab => tab.value === TABS.USERS);

		// case ROLES.SALESPERSON:
		// 	return BUTTONS.filter(tab => tab.value === TABS.USERS);

		default:
			return [];
	}
};
