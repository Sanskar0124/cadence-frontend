import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const ALL_ROLES = {
	super_admin: "Super Admin",
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

export const LANGUAGE_OPTIONS = [
	{ label: COMMON_TRANSLATION.ENGLISH, value: "english" },
	{ label: COMMON_TRANSLATION.FRENCH, value: "french" },
	{ label: COMMON_TRANSLATION.SPANISH, value: "spanish" },
];

export const getIntegrationIdLabel = (integration_id, isUppercase) => {
	switch (integration_id) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.SHEETS:
		case INTEGRATION_TYPE.ZOHO:
			return isUppercase ? `${integration_id.toUpperCase()} ID` : `${integration_id} Id`;

		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return isUppercase ? "G SHEETS ID" : "google sheets id";
	}
};
export const TEAM_CHANGE_ACTIONS = [
	{
		label: "Move all leads and contacts to a new cadence",
		value: "move_leads_to_another_cadence",
	},
	{
		label: "Remove all leads from Cadence but keep them in the tool",
		value: "unlink_leads_from_cadence",
	},
	{
		label: "Remove and delete all leads and contacts",
		value: "delete_leads",
	},
];
export const TEAM_CHANGE_OPTIONS = {
	MOVE: "move_leads_to_another_cadence",
	UNLINK: "unlink_leads_from_cadence",
	REMOVE: "delete_leads",
};

export const TYPES_OF_CADENCE_OPTIONS = [
	{ label: `Personal`, value: "personal" },
	{ label: `Company`, value: "company" },
];

export const ACTION_MSG = {
	MOVE: "All Google sheet leads will be permanently deleted from Cadence. You will not be able to access these leads in the tool anymore.",
	UNLINK:
		"All leads will be unassociated with cadences, however you can find leads from people page and add them to cadences. Leads will not be deleted from the CRM.",
	REMOVE:
		"All leads will be permanently deleted from Cadence but leads will be present in CRM. User will be unable to check past activity for leads ",
};
