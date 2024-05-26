import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";
import { base64ToFile } from "@cadence-frontend/utils";
//v2/sales/department/cadence/import/hubspot/csv/extract-column
const useCSVImportHubspot = () => {
	const extractColumnsAPI = async () => {
		const formData = new FormData();
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		return AuthorizedApi.post("/v2/excel/extract-columns", formData).then(res =>
			renameDuplicatesInArray(res.data.data)
		);
	};
	const {
		mutate: extractColumns,
		isLoading: extractColumnsLoading,
		isError: extractColumnsError,
		error: extractColumnsErrorMsg,
	} = useMutation(extractColumnsAPI);

	const extractColumnsFromSheetsAPI = async () => {
		const sheetUrl = sessionStorage.getItem("sheet_url");
		return AuthorizedApi.post(
			`/v2/sales/department/cadence/import/hubspot/sheets/extract-columns`,
			{
				url: sheetUrl,
			}
		).then(res => renameDuplicatesInArray(res.data.data));
	};
	const {
		mutate: extractColumnsFromSheets,
		isLoading: extractColumnsFromSheetsLoading,
		isError: extractColumnsFromSheetsError,
		error: extractColumnsFromSheetsErrorMsg,
	} = useMutation(extractColumnsFromSheetsAPI);

	const postContactsAPI = async formData => {
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		return AuthorizedApi.post(
			"/v2/sales/department/cadence/import/hubspot/csv/contacts",
			formData
		).then(res => res.data.data);
	};
	const {
		mutate: postContactsMutation,
		isLoading: postContactsLoading,
		isSuccess: postContactsSuccess,
		isError: postContactsError,
	} = useMutation(postContactsAPI);

	const previewLeadsViaCSVApi = async formData => {
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		const res = await AuthorizedApi.post(
			`/v2/sales/department/cadence/import/hubspot/csv/preview-leads`,
			formData
		);
		return res.data.data;
	};
	const { mutate: previewLeadsViaCSV, isLoading: previewLeadsViaCSVLoading } =
		useMutation(previewLeadsViaCSVApi);

	const previewLeadsViaSheetsApi = async body => {
		body.url = sessionStorage.getItem("sheet_url");
		const res = await AuthorizedApi.post(
			`/v2/sales/department/cadence/import/hubspot/sheets/preview-leads`,
			body
		);
		return res.data.data;
	};
	const { mutate: previewLeadsViaSheets, isLoading: previewLeadsViaSheetsLoading } =
		useMutation(previewLeadsViaSheetsApi);

	return {
		postContactsMutation,
		postContactsLoading,
		postContactsSuccess,
		postContactsError,
		extractColumns,
		extractColumnsLoading,
		extractColumnsError: {
			error: extractColumnsError,
			msg: extractColumnsErrorMsg?.response?.data?.msg,
		},
		extractColumnsFromSheets,
		extractColumnsFromSheetsLoading,
		extractColumnsErrorFromSheets: {
			error: extractColumnsFromSheetsError,
			msg: extractColumnsFromSheetsErrorMsg?.response?.data?.msg,
		},
		previewLeadsViaCSV,
		previewLeadsViaCSVLoading,
		previewLeadsViaSheets,
		previewLeadsViaSheetsLoading,
	};
};

//utilities
function renameDuplicatesInArray(arr) {
	let count = {};
	arr.forEach(function (x, i) {
		if (arr.indexOf(x) !== i) {
			const c = x in count ? (count[x] = count[x] + 1) : (count[x] = 1);
			let j = c + 1;
			let k = x + " (" + j + ")";

			while (arr.indexOf(k) !== -1) k = x + " (" + ++j + ")";
			arr[i] = k;
		}
	});
	return arr;
}

export default useCSVImportHubspot;
