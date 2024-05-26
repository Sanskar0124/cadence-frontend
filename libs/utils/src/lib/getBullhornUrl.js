export default function (lead, instanceUrl) {
	const indexOfCom = instanceUrl?.indexOf(".com") + 4;
	const instanceLink = instanceUrl?.substring(0, indexOfCom)?.replace("rest", "cls");

	const leadId = lead?.integration_id;
	const leadType =
		lead?.integration_type === "bullhorn_candidate"
			? "Candidate"
			: lead?.integration_type === "bullhorn_lead"
			? "Lead"
			: lead?.integration_type === "bullhorn_contact"
			? "ClientContact"
			: "";

	//https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153
	//https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Lead&id=14156
	//https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Candidate&id=14171

	let url = "";
	if (leadId && leadType)
		url = `${instanceLink}/BullhornSTAFFING/OpenWindow.cfm?Entity=${leadType}&id=${leadId}`;
	return url;
}
