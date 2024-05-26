export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	FIRST_NAME_NOT_PRESENT: "first_name_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	COMPANY_NOT_PRESENT: "company_not_present",
	UNASSIGNED: "unassigned",
	INVALID_CONTACT_ID: "invalid_contact_id",
	LEAD_INACTIVE: "lead_inactive",
};

export const getLeadsExcludingError = leads =>
	leads
		?.filter(
			lead =>
				lead.status !== LEAD_STATUS.USER_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.COMPANY_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.UNASSIGNED &&
				lead?.status !== LEAD_STATUS.FIRST_NAME_NOT_PRESENT &&
				lead?.status !== LEAD_STATUS.INVALID_CONTACT_ID &&
				!lead.status?.toLowerCase().includes("fields missing") &&
				!lead.status?.toLowerCase().includes("does not exist") &&
				!lead.status?.toLowerCase().includes("error") &&
				!lead.status?.toLowerCase().includes("is missing") &&
				!lead.status?.toLowerCase().includes("is invalid") &&
				!lead.status?.toLowerCase().includes("characters") &&
				!lead.status?.toLowerCase().includes("should be present") &&
				!lead.status?.toLowerCase().includes("should be valid") &&
				!lead.success &&
				!lead.error
		)
		?.map(lead => lead?.id);

export const isLeadError = lead =>
	lead?.status === LEAD_STATUS.USER_NOT_PRESENT ||
	lead?.status === LEAD_STATUS.COMPANY_NOT_PRESENT ||
	lead?.status === LEAD_STATUS.UNASSIGNED ||
	lead?.status === LEAD_STATUS.FIRST_NAME_NOT_PRESENT ||
	lead?.status === LEAD_STATUS.INVALID_CONTACT_ID ||
	lead.status?.toLowerCase().includes("fields missing") ||
	lead.status?.toLowerCase().includes("does not exist") ||
	lead.status?.toLowerCase().includes("error") ||
	lead.status?.toLowerCase().includes("is missing") ||
	lead.status?.toLowerCase().includes("is invalid") ||
	lead.status?.toLowerCase().includes("characters") ||
	lead.status?.toLowerCase().includes("should be present") ||
	lead.status?.toLowerCase().includes("should be valid") ||
	lead.error;

export const isLeadSuccess = lead => lead.success;

export const LEAD_ERROR_MSG_MAP = {
	user_not_present: "User not present in cadence",
	company_not_present: "Company not present",
	first_name_not_present: "First name not present",
	unassigned: "User not present",
	invalid_contact_id: "Invalid contact id",
};

export const getDataCategoryId = type => {
	switch (type) {
		case "create_lead":
			return "contact_preview_id";
		default:
			return "integration_id";
	}
};

export const getFormDataLeads = (object, previewLoaderId) => {
	const formData = new FormData();
	const fieldMap = {};
	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "last_name" ||
			key === "job_position" ||
			key === "zipcode" ||
			key === "phone_numbers" ||
			key === "account_phone_number" ||
			key === "country" ||
			key === "account_linkedin_url" ||
			key === "record_id" ||
			key === "first_name" ||
			key === "company_name" ||
			key === "company_id" ||
			key === "owner" ||
			key === "integration_status" ||
			key === "hubspot_owner_id" ||
			key === "linkedin_url" ||
			key === "zip_code" ||
			key === "company_phone_number" ||
			key === "size"
		) {
			fieldMap[key] = object[key];
		}
	});

	formData.append("field_map", JSON.stringify(fieldMap));
	formData.append("loaderId", previewLoaderId);

	return formData;
};

export const getFormDataContacts = (object, previewLoaderId) => {
	const formData = new FormData();
	const fieldMap = {};

	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "last_name" ||
			key === "job_position" ||
			key === "zipcode" ||
			key === "phone_numbers" ||
			key === "account_phone_number" ||
			key === "country" ||
			key === "account_linkedin_url" ||
			key === "first_name" ||
			key === "company_name" ||
			key === "company_id" ||
			key === "owner" ||
			key === "integration_status" ||
			key === "record_id" ||
			key === "linkedin_url" ||
			key === "zip_code" ||
			key === "company_phone_number" ||
			key === "size"
		) {
			if (key === "emails" || key === "phone_numbers") {
				fieldMap[key] = JSON.stringify(object[key]);
			} else {
				fieldMap[key] = object[key];
			}
		}
	});

	formData.append("field_map", JSON.stringify(fieldMap));
	formData.append("loaderId", previewLoaderId);
	return formData;
};
