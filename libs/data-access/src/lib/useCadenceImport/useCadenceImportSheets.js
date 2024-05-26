import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "../api";

const useCadenceImportSheets = ({ sheet_url, sheet_field_map, cadence_id }) => {
	const previewLeadsApi = body =>
		AuthorizedApi.post("/v1/google/sheets/preview-leads", {
			url: sheet_url,
			field_map: sheet_field_map,
			cadence_id,
			...body,
		}).then(res => res.data.data.previewLeads);

	const {
		mutate: importLeads,
		isLoading: importLoading,
		isRefetching: importRefetching,
		isError: importError,
		error: importErrorMessage,
	} = useMutation(previewLeadsApi);

	const addListApi = async body => {
		body.add.url = sheet_url;
		body.add.cadence_id = cadence_id;
		body.link.url = sheet_url;
		body.link.cadence_id = cadence_id;

		let add =
			body.add?.leads?.length &&
			AuthorizedApi.post("/v1/google/sheets/create-leads", body.add).then(
				res => res.data.data
			);
		let link =
			body.link?.leads?.length &&
			AuthorizedApi.post("/v1/google/sheets/link-leads", body.link).then(
				res => res.data.data
			);
		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	const resyncSheetApi = body =>
		AuthorizedApi.post(`/v1/google/sheets/resync-leads`, body).then(res => res.data);

	const { mutate: resyncSheet, isLoading: resyncLoading } = useMutation(resyncSheetApi);

	const getHeadersApi = body =>
		AuthorizedApi.post(`/v1/google/sheets/headers`, body).then(
			res => res.data.data.headers
		);

	const {
		mutate: getHeaders,
		isLoading: headersLoading,
		isError: headersError,
		error: headersErrorMessage,
	} = useMutation(getHeadersApi);

	return {
		importLeads,
		importLoading: importLoading || importRefetching,
		importError: { error: importError, msg: importErrorMessage?.response?.data?.msg },
		addList,
		addLoading,
		isAddSuccess,
		resyncSheet,
		resyncLoading,
		getHeaders,
		headersLoading,
		headersError: { error: headersError, msg: headersErrorMessage?.response?.data?.msg },
	};
};

export default useCadenceImportSheets;
