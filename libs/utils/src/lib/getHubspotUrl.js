export default function (integration_id, company_integration_id) {
	if (!integration_id || !company_integration_id) return "";
	return `https://app.hubspot.com/contacts/${company_integration_id}/contact/${integration_id}`;
}
