import { ROLES, CADENCE_TYPES } from "@cadence-frontend/constants";
import { SHARE_OPTIONS } from "./constants";

export const getTextByRole = role => {
	switch (role) {
		case ROLES.SALESPERSON:
			return "You can only share a cadence with those who are in your team";

		case ROLES.SALESPERSON_MANAGER:
			return "You can only share a cadence into your own personal cadences and team cadences";

		case ROLES.ADMIN:
			return "";

		default:
			return "";
	}
};

export const getShareCadenceOptions = (role, cadenceType, language) => {
	if (
		(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) &&
		cadenceType !== CADENCE_TYPES.COMPANY
	)
		return SHARE_OPTIONS.map(obj => ({
			label: obj.label[language?.toUpperCase()],
			value: obj.value,
		}));
	else
		return SHARE_OPTIONS.map(obj => ({
			label: obj.label[language?.toUpperCase()],
			value: obj.value,
		})).filter(opt => opt.value !== CADENCE_TYPES.COMPANY);
};

export const cleanRequestBody = body => {
	const bodyObj = { ...body };

	const ACCEPTED_FIELDS = [
		"cadence_id",
		"name",
		"type",
		"priority",
		"integration_type",
		"is_workflow",
		"inside_sales",
		"company_id",
		"sd_ids",
		"user_ids",
		"description",
		"is_workflow",
	];

	for (const key of Object.keys(bodyObj))
		if (!ACCEPTED_FIELDS.includes(key)) delete bodyObj[key];

	return bodyObj;
};
