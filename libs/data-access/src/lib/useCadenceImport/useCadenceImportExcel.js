import { base64ToFile } from "@cadence-frontend/utils";
import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "../api";

const useCadenceImportExcel = ({ excel_field_map, cadence_id, previewLoaderId }) => {
	const previewLeadsApi = () => {
		const formData = new FormData();
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "leads.csv")
		);
		formData.append("field_map", JSON.stringify(excel_field_map));
		formData.append("cadence_id", cadence_id);
		formData.append("loaderId", previewLoaderId);

		return AuthorizedApi.post("/v2/excel/preview-leads", formData).then(res => res.data);
	};

	const {
		mutate: previewLeadsViaExcel,
		isLoading: previewLeadsViaExcelLoading,
		isError: previewLeadsViaExcelError,
		error: previewLeadsViaExcelErrorMsg,
	} = useMutation(previewLeadsApi);

	const addListApi = async body => {
		body.add.cadence_id = cadence_id;
		body.link.cadence_id = cadence_id;

		let add =
			body.add?.leads?.length &&
			AuthorizedApi.post("/v2/excel/create-leads", body.add).then(res => res.data.data);
		let link =
			body.link?.leads?.length &&
			AuthorizedApi.post("/v2/excel/link-leads", body.link).then(res => res.data.data);
		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	//delete node
	const resyncSheetApi = body =>
		AuthorizedApi.post(`/v1/google/sheets/resync-leads`, body).then(res => res.data);

	const { mutate: resyncSheet, isLoading: resyncLoading } = useMutation(resyncSheetApi);

	return {
		previewLeadsViaExcel,
		previewLeadsViaExcelLoading,
		previewLeadsViaExcelError: {
			error: previewLeadsViaExcelError,
			msg: previewLeadsViaExcelErrorMsg?.response?.data?.msg,
		},
		addList,
		addLoading,
		isAddSuccess,
		resyncSheet,
		resyncLoading,
	};
};

export default useCadenceImportExcel;
