import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/zoho";

const useLeadExportZoho = () => {
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

	const searchZohoAccountsApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-accounts`, body).then(res => res.data.data);

	const { mutate: searchZohoAccounts, isLoading: searchZohoAccountsLoading } =
		useMutation(searchZohoAccountsApi);

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
		searchZohoAccounts,
		searchZohoAccountsLoading,
		exportLead,
		exportLeadLoading,
		exportContact,
		exportContactLoading,
	};
};

export default useLeadExportZoho;
