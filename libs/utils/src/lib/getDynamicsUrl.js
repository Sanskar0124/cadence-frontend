import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export default function (lead, instanceUrl) {
	if (!lead || !instanceUrl || !lead?.integration_id) return "";
	let url = "";
	if (lead?.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD)
		url = `${instanceUrl}/main.aspx?pagetype=entityrecord&etn=lead&id=${lead.integration_id}`;
	else if (lead?.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT)
		url = `${instanceUrl}/main.aspx?pagetype=entityrecord&etn=contact&id=${lead.integration_id}`;
	return url;
}
