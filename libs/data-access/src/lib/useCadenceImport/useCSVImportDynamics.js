import { useMutation } from "react-query";
import { AuthorizedApi } from "../api";

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

const useCSVImportDynamics = () => {
	const extractColumnsAPI = async () => {
		const formData = new FormData();
		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.xlsx")
		);
		return AuthorizedApi.post(
			"/v2/sales/department/cadence/import/dynamics/extract-columns",
			formData
		).then(res => renameDuplicatesInArray(res.data.data));
	};
	const { mutate: extractColumns, isLoading: extractColumnsLoading } =
		useMutation(extractColumnsAPI);

	const postContactsAPI = async ({ formData, type }) => {
		// const formData = new FormData();
		// formData.append("job_position", "Position");
		// formData.append("linkedin_url", "linkedIN");
		// formData.append("owner", "Owner");
		// formData.append("dynamics_id", "dynamics ID");
		// formData.append("first_name", "First name");
		// formData.append("last_name", "Name");
		// formData.append("email", "Email");
		// formData.append("phone_number", "Phone");
		// formData.append("mobile_number", "Mobile");
		// formData.append("fax_number", "Fax");

		formData.append(
			"file",
			base64ToFile(sessionStorage.getItem("people-csv"), "contacts.xlsx")
		);
		return AuthorizedApi.post(
			`/v2/sales/department/cadence/import/dynamics/preview-${type}s`,
			formData
		).then(res => res.data.data);
	};
	const {
		mutate: postContactsMutation,
		isLoading: postContactsLoading,
		isSuccess: postContactsSuccess,
		isError: postContactsError,
	} = useMutation(postContactsAPI);

	return {
		postContactsMutation,
		postContactsLoading,
		postContactsSuccess,
		postContactsError,
		extractColumns,
		extractColumnsLoading,
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

export default useCSVImportDynamics;
