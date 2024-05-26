import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/hubspot";

const useLeadExportHubspot = () => {
	const previewContactApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/contact`).then(
			res => res.data.data
		);

	const { mutate: previewContact, isLoading: previewContactLoading } =
		useMutation(previewContactApi);

	const searchHubspotCompaniesApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-companies`, body).then(res => res.data.data);

	const { mutate: searchHubspotCompanies, isLoading: searchCompaniesLoading } =
		useMutation(searchHubspotCompaniesApi);

	const exportContactApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/contact`, body).then(res => res.data.data);

	const { mutate: exportContact, isLoading: exportContactLoading } =
		useMutation(exportContactApi);

	return {
		previewContact,
		previewContactLoading,
		searchHubspotCompanies,
		searchCompaniesLoading,
		exportContact,
		exportContactLoading,
	};
};

export default useLeadExportHubspot;
