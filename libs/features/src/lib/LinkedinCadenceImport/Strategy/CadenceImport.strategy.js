import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useQuery } from "@cadence-frontend/utils";

export const useParametersForCadenceImport = ({ integration_type, cadencesDropdown }) => {
	const query = useQuery();
	let parameters = {};
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE: {
			const salesforce_id = query.get("salesforce_id");
			const list_id = query.get("list_id");
			const type = query.get("type");
			const selections = query.get("selections")?.split(",");
			parameters = {
				salesforce_id,
				list_id,
				type,
				selections,
				lead_id: cadencesDropdown,
			};
			return parameters;
		}
		case INTEGRATION_TYPE.PIPEDRIVE: {
			const view = query.get("view");
			const type = "persons"; //temp
			const selectedIds = query.get("selectedIds");
			const excludedIds = query.get("excludedIds");
			parameters = {
				view,
				type,
				selectedIds,
				excludedIds,
				lead_id: cadencesDropdown,
			};
			return parameters;
		}
		case INTEGRATION_TYPE.GOOGLE_SHEETS: {
			const sheet_url = sessionStorage.getItem("sheet_url");
			const cadence_id = query.get("cadence_id");
			const cadence_name = query.get("cadence_name");
			const type = "google_sheets_leads";
			parameters = {
				sheet_url,
				cadence_id,
				cadence_name,
				type,
			};
			return parameters;
		}
		case INTEGRATION_TYPE.HUBSPOT: {
			const webhook = query.get("webhook");
			const cadence_id = query.get("cadence_id");
			const cadence_name = query.get("cadence_name");
			const type = "hubspot_contacts";
			parameters = {
				webhook,
				cadence_id,
				cadence_name,
				type,
			};
			return parameters;
		}
		case INTEGRATION_TYPE.SELLSY: {
			const webhook = query.get("webhook");
			const cadence_id = query.get("cadence_id");
			const cadence_name = query.get("cadence_name");
			const type = "sellsy_contacts";
			parameters = {
				webhook,
				cadence_id,
				cadence_name,
				type,
			};
			return parameters;
		}
		default:
			return parameters;
	}
};
