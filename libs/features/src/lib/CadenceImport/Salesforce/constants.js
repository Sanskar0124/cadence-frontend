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
		?.map(lead => lead?.Id);

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

export const isLeadSuccesss = lead => lead.success;

export const LEAD_ERROR_MSG_MAP = {
	user_not_present: "User not present in cadence",
	company_not_present: "Company not present",
	first_name_not_present: "First name not present",
	unassigned: "User not present",
	invalid_contact_id: "Invalid contact id",
};

export const DATA_CATEGORY = {
	lead: "leads",
	contact: "contacts",
	create_lead: "leads",
	lead_list: "leads",
	contact_list: "contacts",
};

export const DATA_CATEGORY_ID = {
	lead: "salesforce_lead_id",
	contact: "salesforce_contact_id",
	create_lead: "lead_preview_id",
	lead_list: "salesforce_lead_id",
	contact_list: "salesforce_contact_id",
};

export const LEAD_TYPE = [
	{ label: "Lead", value: "lead" },
	{ label: "Contact", value: "contact" },
];

export const LEADTYPE = { LEAD: "lead", CONTACT: "contact" };
