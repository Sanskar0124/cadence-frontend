export const getFormDataLeads = (object, previewLoaderId) => {
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
			key === "company" ||
			key === "company_phone_number" ||
			key === "company_linkedin_url" ||
			key === "url" ||
			key === "country" ||
			key === "size" ||
			key === "zip_code" ||
			key === "salesforce_owner_id"
		)
			fieldMap[key] = object[key];
	});
	formData.append("field_map", JSON.stringify(fieldMap));
	formData.append("loaderId", previewLoaderId);

	return formData;
};
