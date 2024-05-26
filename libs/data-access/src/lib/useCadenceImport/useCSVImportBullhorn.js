import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";

const V2_ROUTE = "/v2/sales/department/cadence/import/bullhorn";

const useCSVImportBullhorn = () => {
	const extractColumnsAPI = async () => {
		const formData = new FormData();
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		return AuthorizedApi.post(`${V2_ROUTE}/extract-columns`, formData).then(res =>
			renameDuplicatesInArray(res.data.data)
		);
	};

	const { mutate: extractColumns, isLoading: extractColumnsLoading } =
		useMutation(extractColumnsAPI);

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

	const previewLeadsAPI = async ({ formData, leadType }) => {
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.csv")
		);
		return AuthorizedApi.post(`${V2_ROUTE}/preview-${leadType}s`, formData).then(
			res => res.data.data
		);
	};

	const {
		mutate: previewLeadsMutation,
		isLoading: previewLeadsLoading,
		isSuccess: previewLeadsSuccess,
		isError: previewLeadsError,
	} = useMutation(previewLeadsAPI);

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
		extractColumns,
		extractColumnsLoading,
		previewLeadsMutation,
		previewLeadsLoading,
		previewLeadsSuccess,
		previewLeadsError,
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

const base64ToFile = (dataurl, filename) => {
	var arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};

export default useCSVImportBullhorn;
