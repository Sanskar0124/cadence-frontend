import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/sellsy";

const useLeadExportSellsy = () => {
	const previewContactApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/contact`).then(
			res => res.data.data
		);

	const { mutate: previewContact, isLoading: previewContactLoading } =
		useMutation(previewContactApi);

	const searchSellsyCompaniesApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-companies`, body).then(res => res.data.data);

	const { mutate: searchSellsyCompanies, isLoading: searchCompaniesLoading } =
		useMutation(searchSellsyCompaniesApi);

	const exportContactApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/contact`, body).then(res => res.data.data);

	const { mutate: exportContact, isLoading: exportContactLoading } =
		useMutation(exportContactApi);

	return {
		previewContact,
		previewContactLoading,
		searchSellsyCompanies,
		searchCompaniesLoading,
		exportContact,
		exportContactLoading,
	};
};

export default useLeadExportSellsy;
