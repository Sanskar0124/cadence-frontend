/* eslint-disable no-console */
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import {
	SalesforceBox,
	Pipedrive,
	Hubspot,
	HubspotBox,
	PipedriveBox,
	Salesforce,
	GoogleSheets,
	GoogleBox,
	SalesforceCloud,
	Excel,
	Zoho,
	ZohoBox,
	Bullhorn,
	Sellsy,
	Dynamics,
} from "@cadence-frontend/icons";

const getIntegrationIconForLead = ({ lead_integration_type, box = false }) => {
	try {
		switch (lead_integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT: {
				if (box) return SalesforceBox;
				return SalesforceCloud;
			}
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON: {
				if (box) return PipedriveBox;
				return Pipedrive;
			}
			case LEAD_INTEGRATION_TYPES.GOOGLE_SHEETS_LEAD: {
				if (box) return GoogleBox;
				return GoogleSheets;
			}
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT: {
				if (box) return HubspotBox;
				return Hubspot;
			}
			case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT: {
				return Sellsy;
			}
			case LEAD_INTEGRATION_TYPES.EXCEL_LEAD: {
				if (box) return Excel;
				return Excel;
			}
			case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
			case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT: {
				if (box) return ZohoBox;
				return ZohoBox;
			}
			case LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_GOOGLE_SHEET_PERSON:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_GOOGLE_SHEET_CONTACT:
			case LEAD_INTEGRATION_TYPES.ZOHO_GOOGLE_SHEET_LEAD:
			case LEAD_INTEGRATION_TYPES.SELLSY_GOOGLE_SHEET_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_GOOGLE_SHEET_LEAD: {
				if (box) return GoogleSheets;
				return GoogleSheets;
			}
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.PIPEDRIVE_CSV_PERSON:
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CSV_CONTACT:
			case LEAD_INTEGRATION_TYPES.ZOHO_CSV_LEAD:
			case LEAD_INTEGRATION_TYPES.SELLSY_CSV_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CSV_LEAD: {
				if (box) return Excel;
				return Excel;
			}
			case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT:
			case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE: {
				if (box) return Bullhorn;
				return Bullhorn;
			}
			case LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD:
			case LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT: {
				if (box) return Dynamics;
				return Dynamics;
			}
			default:
				return () => null;
		}
	} catch (err) {
		console.log("An error occured while fetching integration icon", err);
		return () => null;
	}
};

export default getIntegrationIconForLead;
