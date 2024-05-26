import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/salesforce";

const useLeadExportSalesforce = () => {
	const previewLeadApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/lead`).then(res => res.data.data);

	const { mutate: previewLead, isLoading: previewLeadLoading } =
		useMutation(previewLeadApi);

	const previewContactApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/contact`).then(
			res => res.data.data
		);

	const { mutate: previewContact, isLoading: previewContactLoading } =
		useMutation(previewContactApi);

	const searchSalesforceAccountsApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-accounts`, body).then(res => res.data.data);

	const { mutate: searchSalesforceAccounts, isLoading: searchSalesforceAccountsLoading } =
		useMutation(searchSalesforceAccountsApi);

	const exportLeadApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/lead`, body).then(res => res.data.data);

	const { mutate: exportLead, isLoading: exportLeadLoading } = useMutation(exportLeadApi);

	const exportContactApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/contact`, body).then(res => res.data.data);

	const { mutate: exportContact, isLoading: exportContactLoading } =
		useMutation(exportContactApi);

	return {
		previewLead,
		previewLeadLoading,
		previewContact,
		previewContactLoading,
		searchSalesforceAccounts,
		searchSalesforceAccountsLoading,
		exportLead,
		exportLeadLoading,
		exportContact,
		exportContactLoading,
	};
};

export default useLeadExportSalesforce;
