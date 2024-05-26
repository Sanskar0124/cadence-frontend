import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useDynamicCSV = () => {
	const salesforceCSVDataApi = lead_type =>
		AuthorizedApi.get(`/v2/sales/lead/csv-data/salesforce/${lead_type}`).then(
			res => res?.data?.data
		);

	const { mutate: fetchCSVDataForSF, isLoading: csvDataForSFLoading } =
		useMutation(salesforceCSVDataApi);

	const pipedriveCSVDataApi = () =>
		AuthorizedApi.get(`/v2/sales/lead/csv-data/pipedrive`).then(res => res?.data?.data);

	const { mutate: fetchCSVDataForPD, isLoading: csvDataForPDLoading } =
		useMutation(pipedriveCSVDataApi);

	return {
		fetchCSVDataForSF,
		csvDataForSFLoading,
		fetchCSVDataForPD,
		csvDataForPDLoading,
	};
};

export default useDynamicCSV;
