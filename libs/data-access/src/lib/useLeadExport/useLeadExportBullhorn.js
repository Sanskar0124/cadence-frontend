import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/bullhorn";

const useLeadExportBullhorn = () => {
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

	const previewCandidateApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/candidate`).then(
			res => res.data.data
		);

	const { mutate: previewCandidate, isLoading: previewCandidateLoading } =
		useMutation(previewCandidateApi);

	const searchBullhornAccountsApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-accounts`, body).then(res => res.data.data);

	const { mutate: searchBullhornAccounts, isLoading: searchBullhornAccountsLoading } =
		useMutation(searchBullhornAccountsApi);

	const exportLeadApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/lead`, body).then(res => res.data.data);

	const { mutate: exportLead, isLoading: exportLeadLoading } = useMutation(exportLeadApi);

	const exportContactApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/contact`, body).then(res => res.data.data);

	const { mutate: exportContact, isLoading: exportContactLoading } =
		useMutation(exportContactApi);

	const exportCandidateApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/candidate`, body).then(res => res.data.data);

	const { mutate: exportCandidate, isLoading: exportCandidateLoading } =
		useMutation(exportCandidateApi);

	return {
		previewLead,
		previewLeadLoading,
		previewContact,
		previewContactLoading,
		previewCandidate,
		previewCandidateLoading,
		searchBullhornAccounts,
		searchBullhornAccountsLoading,
		exportLead,
		exportLeadLoading,
		exportContact,
		exportContactLoading,
		exportCandidate,
		exportCandidateLoading,
	};
};

export default useLeadExportBullhorn;
