import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import getGoogleSheetUrl from "./getGoogleSheetUrl";
import getHubspotUrl from "./getHubspotUrl";
import getPipedriveUrl from "./getPipedriveUrl";
import getSalesforceUrl from "./getSalesforceUrl";
import getSellsyUrl from "./getSellsyUrl";
import getZohoUrl from "./getZohoUrl";
import getBullhornUrl from "./getBullhornUrl";
import getDynamicsUrl from "./getDynamicsUrl";

export default function ({ lead, user, cadence }) {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return getSalesforceUrl(lead, user?.instance_url);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return getPipedriveUrl(lead?.integration_id, user?.instance_url);
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return getGoogleSheetUrl(
				cadence
					? cadence?.salesforce_cadence_id
					: lead?.LeadToCadences[0]?.Cadences[0]?.salesforce_cadence_id
			);
		case INTEGRATION_TYPE.SHEETS:
			return getGoogleSheetUrl(
				cadence
					? cadence?.salesforce_cadence_id
					: lead?.LeadToCadences[0]?.Cadences[0]?.salesforce_cadence_id
			);
		case INTEGRATION_TYPE.HUBSPOT:
			return getHubspotUrl(lead?.integration_id, user.company_integration_id);
		case INTEGRATION_TYPE.SELLSY:
			return getSellsyUrl(lead?.integration_id);
		case INTEGRATION_TYPE.ZOHO:
			return getZohoUrl(lead, user?.instance_url);
		case INTEGRATION_TYPE.BULLHORN:
			return getBullhornUrl(lead, user?.instance_url);
		case INTEGRATION_TYPE.DYNAMICS:
			return getDynamicsUrl(lead, user?.instance_url);
	}
}
