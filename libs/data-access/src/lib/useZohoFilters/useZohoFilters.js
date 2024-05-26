import { AuthorizedApi } from "../api";
import { useMutation, useQuery } from "react-query";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { getDescribeLeadURL, describeLeadStrategy } from "./useZohoFilters.strategy";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useZohoFilters = (enabled = false) => {
	const getLeadFields = () =>
		AuthorizedApi.get(
			getDescribeLeadURL({
				integration_type: user?.integration_type,
			})
		).then(res =>
			describeLeadStrategy({
				integration_type: user?.integration_type,
				res,
			})
		);

	const { mutate: fetchLeadFields, isLoading: leadFieldsLoading } =
		useMutation(getLeadFields);

	const getContactZohoFields = () =>
		AuthorizedApi.get(
			"/v2/admin/company-settings/company-field-map/describe/contact"
		).then(res =>
			res?.data.data.map(item => {
				let obj = {
					name: item.api_name,
					label: item.display_label,
					type: item.data_type,
					editable: item.allowed_permissions_to_update.read_write,
					types: item.json_type,
				};
				if (obj.type === "picklist" || obj.type === "multipicklist")
					obj.picklistValues = item.pick_list_values;
				if (obj.type === "reference") {
					obj.reference_to = item.referenceTo;
				}
				return obj;
			})
		);

	const { mutate: fetchContactZohoFields, isLoading: contactZohoFieldsLoading } =
		useMutation(getContactZohoFields);

	return {
		fetchLeadFields,
		leadFieldsLoading,
		fetchContactZohoFields,
		contactZohoFieldsLoading,
	};
};

export default useZohoFilters;
