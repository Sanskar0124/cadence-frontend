import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const ENABLE_RELATED_LEADS = [
	LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD,
	LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT,
	LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD,
	LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT,
	LEAD_INTEGRATION_TYPES.ZOHO_LEAD,
	LEAD_INTEGRATION_TYPES.ZOHO_CONTACT,
	LEAD_INTEGRATION_TYPES.SELLSY_CONTACT,
];
const useRelatedLead = ({ lead, enabled = false }) => {
	let body = {};
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
		case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
		case LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD:
			body.account_name = lead?.Account?.name;
			break;

		case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
		case LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT:
		case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT:
			body.id = lead?.Account?.integration_id;
			break;

		default:
			body.account_name = lead?.Account?.name;
	}

	const getRelatedLeadsApi = () =>
		AuthorizedApi.post("v2/sales/lead/getRelatedLeads", body).then(res => res.data?.data);

	const { data, isLoading: relatedLeadLoading } = useQuery(
		["related-lead", { body }],
		(lead?.Account?.integration_id || lead?.Account?.name) && getRelatedLeadsApi,
		{
			enabled: enabled && ENABLE_RELATED_LEADS.includes(lead?.integration_type),
		}
	);

	const stopAllCadencesApi = body =>
		AuthorizedApi.post("/v2/sales/department/cadence/stop-all-cadences", body).then(
			res => res.data.data
		);

	const { mutate: stopAllCadences, isLoading: stopAllCadencesLoading } =
		useMutation(stopAllCadencesApi);
	return {
		data,
		relatedLeadLoading,
		stopAllCadences,
		stopAllCadencesLoading,
	};
};
export default useRelatedLead;
