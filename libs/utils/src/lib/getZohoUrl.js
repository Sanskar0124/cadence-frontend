import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export default function (lead, instanceUrl) {
	const domainUrl = instanceUrl.replace("www.zohoapis", "crm.zoho");
	if (!lead || !instanceUrl || !lead?.integration_id || !domainUrl) return "";
	let url = "";
	if (lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_LEAD)
		url = `${domainUrl}/crm/tab/Leads/${lead.integration_id}`;
	else if (lead?.integration_type === LEAD_INTEGRATION_TYPES.ZOHO_CONTACT)
		url = `${domainUrl}/crm/tab/Contacts/${lead.integration_id}`;

	return url;
}
