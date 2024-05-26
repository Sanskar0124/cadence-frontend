import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export const TABS = {
	FIELD_MAP: "field_map",
	ACCESS: "access",
};

export const EXPORT_TYPE_OPTIONS = {
	[LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD]: "Lead",
	[LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT]: "Contact",
};
