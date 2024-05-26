import { deepMapKeys } from "@cadence-frontend/utils";

export const getFormDataForNew = (object, previewLoaderId) => {
	const formData = new FormData();
	const fieldMap = {};
	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "phone_numbers" ||
			key === "first_name" ||
			key === "last_name" ||
			key === "linkedin_url" ||
			key === "job_position" ||
			key === "company_name" ||
			key === "company_phone_number" ||
			key === "url" ||
			key === "country" ||
			key === "size" ||
			key === "zip_code" ||
			key === "bullhorn_owner_id"
		)
			fieldMap[key] = object[key];
	});
	formData.append("field_map", JSON.stringify(fieldMap));
	formData.append("loaderId", previewLoaderId);
	return formData;
};

export const getFormDataForExisting = (object, cadenceId, previewLoaderId) => {
	const formData = new FormData();
	formData.append("field_map", JSON.stringify(object));
	formData.append("cadence_id", cadenceId);
	formData.append("loaderId", previewLoaderId);

	return formData;
};

const KEYS_TRANSFORMATION_TABLE = {
	firstName: "first_name",
	occupation: "job_position",
	lastName: "last_name",
	companyName: "company",
	companyURL: "url",
};

export const parseBody = obj =>
	deepMapKeys(obj, key => KEYS_TRANSFORMATION_TABLE[key] || key);
