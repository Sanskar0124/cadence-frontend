import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";

const V2_ROUTE = "/v2/sales/lead/export/pipedrive";

const useLeadExportPipedrive = () => {
	const previewPersonApi = lead_id =>
		AuthorizedApi.get(`${V2_ROUTE}/preview/${lead_id}/person`).then(res => res.data.data);

	const { mutate: previewPerson, isLoading: previewPersonLoading } =
		useMutation(previewPersonApi);

	const searchPipedriveOrganizationsApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/search-organizations`, body).then(
			res => res.data.data
		);

	const { mutate: searchPipedriveOrganizations, isLoading: searchOrganizationsLoading } =
		useMutation(searchPipedriveOrganizationsApi);

	const exportPersonApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/person`, body).then(res => res.data.data);

	const { mutate: exportPerson, isLoading: exportPersonLoading } =
		useMutation(exportPersonApi);

	return {
		previewPerson,
		previewPersonLoading,
		searchPipedriveOrganizations,
		searchOrganizationsLoading,
		exportPerson,
		exportPersonLoading,
	};
};

export default useLeadExportPipedrive;
