import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";
import { base64ToFile } from "@cadence-frontend/utils";

const V2_ROUTE = "/v2/sales/department/cadence/import/pipedrive";

const useCSVImportPipedrive = () => {
	const extractColumnsFromCSVAPI = async () => {
		const formData = new FormData();
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		return AuthorizedApi.post(`${V2_ROUTE}/csv/extract-columns`, formData).then(res =>
			renameDuplicatesInArray(res.data.data)
		);
	};
	const {
		mutate: extractColumnsFromCSV,
		isLoading: extractColumnsFromCSVLoading,
		isError: extractColumnsFromCSVError,
		error: extractColumnsFromCSVErrorMsg,
	} = useMutation(extractColumnsFromCSVAPI);

	const extractColumnsFromSheetsAPI = async () => {
		const sheetUrl = sessionStorage.getItem("sheet_url");
		return AuthorizedApi.post(`${V2_ROUTE}/sheets/extract-columns`, {
			url: sheetUrl,
		}).then(res => renameDuplicatesInArray(res.data.data));
	};
	const {
		mutate: extractColumnsFromSheets,
		isLoading: extractColumnsFromSheetsLoading,
		isError: extractColumnsFromSheetsError,
		error: extractColumnsFromSheetsErrorMsg,
	} = useMutation(extractColumnsFromSheetsAPI);

	const previewLeadsViaCSVApi = async formData => {
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		const res = await AuthorizedApi.post(`${V2_ROUTE}/csv/preview-leads`, formData);
		return res.data.data;
	};

	const { mutate: previewLeadsViaCSV, isLoading: previewLeadsViaCSVLoading } =
		useMutation(previewLeadsViaCSVApi);

	const previewLeadsViaSheetsApi = async body => {
		body.url = sessionStorage.getItem("sheet_url");
		const res = await AuthorizedApi.post(`${V2_ROUTE}/sheets/preview-leads`, body);
		return res.data.data;
	};

	const { mutate: previewLeadsViaSheets, isLoading: previewLeadsViaSheetsLoading } =
		useMutation(previewLeadsViaSheetsApi);

	return {
		extractColumnsFromCSV,
		extractColumnsFromCSVLoading,
		extractColumnsErrorFromCSV: {
			error: extractColumnsFromCSVError,
			msg: extractColumnsFromCSVErrorMsg?.response?.data?.msg,
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

export default useCSVImportPipedrive;
