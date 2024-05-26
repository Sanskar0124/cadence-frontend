import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const getLabelFromEnum = (enumString, user) => {
	if (!enumString) return "";
	let label = enumString.toUpperCase();

	return COMMON_TRANSLATION?.[label]?.[user?.language?.toUpperCase()];
};

export const getExportByLeadIntegration = lead_integration_type => {
	switch (lead_integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD:
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON:
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD:
		case LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT:
		case LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CSV_LEAD:
		case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD:
			return true;

		default:
			return false;
	}
};
