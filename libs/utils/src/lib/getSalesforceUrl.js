import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export default function (lead, instanceUrl) {
	if (!lead || !instanceUrl || !lead?.integration_id) return "";
	let url = "";
	if (lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD)
		url = `${instanceUrl}/lightning/r/Lead/${lead.integration_id}/view`;
	else if (lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT)
		url = `${instanceUrl}/lightning/r/Contact/${lead.integration_id}/view`;
	return url;
}
