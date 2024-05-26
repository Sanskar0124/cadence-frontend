import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const ALL_ROLES = {
	admin: "Admin",
	sales_person: "Sales Agent",
	sales_manager: "Sales Manager",
};

export const ADMIN_ROLES = [
	{
		label: COMMON_TRANSLATION.ADMIN,
		value: "admin",
	},
	{
		label: COMMON_TRANSLATION.SUPER_ADMIN,
		value: "super_admin",
		isDisabled: true,
	},
];

export const OTHER_ROLES = {
	sales_person: COMMON_TRANSLATION.SALES_AGENT,
	sales_manager: COMMON_TRANSLATION.SALES_MANAGER,
};

export const getIntegrationIdLabel = (integration_id, isUppercase) => {
	switch (integration_id) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.SHEETS:
			return isUppercase ? `${integration_id.toUpperCase()} ID` : `${integration_id} Id`;

		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return isUppercase ? "G SHEETS ID" : "google sheets id";
	}
};
