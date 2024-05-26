import { ROLES } from "@cadence-frontend/constants";
import { getLabelFromEnum } from "@cadence-frontend/utils";
import { CADENCE_TYPES } from "../../constants";

export const getTextByRole = role => {
	switch (role) {
		case ROLES.SALESPERSON:
			return "You can only duplicate a cadence into your own personal cadences";

		case ROLES.SALESPERSON_MANAGER:
			return "You can only duplicate a cadence into your own personal cadences and team cadences";

		case ROLES.ADMIN:
			return "";

		default:
			return "";
	}
};

export const getDuplicateType = (cadence, user) => {
	if (!cadence || !user) return "";

	let type = null;

	if (user.role !== ROLES.ADMIN) type = cadence.type;
	else {
		if (cadence.type === CADENCE_TYPES.PERSONAL) {
			if (cadence.user_id === user.user_id) type = cadence.type;
			else type = CADENCE_TYPES.TEAM;
		} else type = cadence.type;
	}

	return type;
};

export const cleanRequestBody = body => {
	const bodyObj = { ...body };

	const ACCEPTED_FIELDS = [
		"cadence_id",
		"name",
		"type",
		"priority",
		"integration_type",
		"inside_sales",
		"is_workflow",
		"company_id",
		"sd_id",
		"user_id",
		"description",
		"is_workflow",
	];

	for (const key of Object.keys(bodyObj))
		if (!ACCEPTED_FIELDS.includes(key)) delete bodyObj[key];

	return bodyObj;
};
