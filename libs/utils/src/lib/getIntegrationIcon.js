/* eslint-disable no-console */
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
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
	Sellsy,
	Excel,
	Zoho,
	ZohoBox,
	Bullhorn,
	Dynamics,
} from "@cadence-frontend/icons";

const getIntegrationIcon = ({ integration_type, box = false }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE: {
				if (box) return SalesforceBox;
				return SalesforceCloud;
			}
			case INTEGRATION_TYPE.PIPEDRIVE: {
				if (box) return PipedriveBox;
				return Pipedrive;
			}
			case INTEGRATION_TYPE.GOOGLE_SHEETS: {
				if (box) return GoogleBox;
				return GoogleSheets;
			}
			case INTEGRATION_TYPE.SHEETS: {
				if (box) return GoogleBox;
				return GoogleSheets;
			}
			case INTEGRATION_TYPE.HUBSPOT: {
				if (box) return HubspotBox;
				return Hubspot;
			}
			case INTEGRATION_TYPE.SELLSY: {
				// if (box) return Sellsy;
				return Sellsy;
			}
			case INTEGRATION_TYPE.DYNAMICS: {
				if (box) return Dynamics;
				return Dynamics;
			}
			case INTEGRATION_TYPE.EXCEL: {
				if (box) return () => null;
				return Excel;
			}
			case INTEGRATION_TYPE.ZOHO: {
				if (box) return ZohoBox;
				return ZohoBox;
			}
			case INTEGRATION_TYPE.BULLHORN: {
				if (box) return Bullhorn;
				return Bullhorn;
			}
			default:
				return () => null;
		}
	} catch (err) {
		console.log("An error occured while fetching integration icon", err);
		return () => null;
	}
};

export default getIntegrationIcon;
