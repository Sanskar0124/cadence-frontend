import { ACTIONS, CADENCE_TYPES, PERMISSIONS } from "../../constants";
import { getLabelFromEnum } from "@cadence-frontend/utils";
import { ROLES } from "@cadence-frontend/constants";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

const CADENCE_LABELS = {
	personal: CADENCE_TRANSLATION.PERSONAL,
	team: CADENCE_TRANSLATION.GROUP,
	company: CADENCE_TRANSLATION.COMPANY,
};

export const getTypeOptions = (role, language) => {
	if (!role) return [];

	const ROLE_PERMISSIONS = PERMISSIONS[role];
	const options = [];

	for (const type of Object.keys(ROLE_PERMISSIONS)) {
		if (ROLE_PERMISSIONS[type].includes(ACTIONS.CREATE))
			options.push({ label: CADENCE_LABELS[type][language?.toUpperCase()], value: type });
	}

	return options;
};

export const showUsersOptions = (type, role) => {
	if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN)
		return type === CADENCE_TYPES.PERSONAL;
	return false;
};

export const showTeamOptions = (type, role) => {
	if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN)
		return type === CADENCE_TYPES.TEAM;
	return false;
};

export const getTeamsOptions = subDepartments => {
	return subDepartments?.map(sd => ({
		label: `${sd.name}`,
		value: sd.sd_id,
	}));
};

export const getUsersOptions = users => {
	return users?.map(user => ({
		label: `${user.first_name} ${user.last_name}`,
		value: user.user_id,
	}));
};
