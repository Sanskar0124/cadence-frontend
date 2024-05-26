import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useLeadImport = () => {
	const importLeadToSalesforceApi = body =>
		AuthorizedApi.post("/lead-extension/extension/salesforce/import", body).then(
			res => res.data.data
		);

	const {
		mutate: importLeadToSalesforce,
		isLoading: importLeadToSalesforceLoading,
		error: importLeadsToSalesforceError,
	} = useMutation(importLeadToSalesforceApi);

	const importLeadsToSalesforceApi = body =>
		AuthorizedApi.post("/lead-extension/extension/salesforce/import/multiple", body).then(
			res => res.data.data
		);

	const { mutate: importLeadsToSalesforce, isLoading: importLeadsToSalesforceLoading } =
		useMutation(importLeadsToSalesforceApi);

	const importLeadToCadenceApi = body =>
		AuthorizedApi.post("/v1/sales/salesforce/integration/lead", body).then(
			res => res.data.data
		);

	const { mutate: importLeadToCadence, isLoading: importLeadToCadenceLoading } =
		useMutation(importLeadToCadenceApi);

	return {
		importLeadToSalesforce,
		importLeadToSalesforceLoading,
		importLeadsToSalesforceError,
		importLeadToCadence,
		importLeadToCadenceLoading,
		importLeadsToSalesforce,
		importLeadsToSalesforceLoading,
	};
};

export default useLeadImport;
