import { TABS, REASSIGN_PERMISSION_MAP } from "./constants";

export const getTabs = (role, language) => {
	return TABS.map(obj => ({
		label: obj.label[language?.toUpperCase()],
		value: obj.value,
	})).filter(tab => REASSIGN_PERMISSION_MAP[role].includes(tab.value));
};
