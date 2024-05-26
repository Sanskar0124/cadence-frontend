export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	FIRST_NAME_NOT_PRESENT: "first_name_not_present",
	COMPANY_NOT_PRESENT: "company_not_present",
	LEAD_ID_NOT_PRESENT: "lead_id_not_present",
	CONTACT_ID_NOT_PRESENT: "contact_id_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	LEAD_INACTIVE: "lead_inactive",
};

export const getLeadsExcludingError = leads =>
	leads
		?.filter(
			lead =>
				lead.status !== LEAD_STATUS.USER_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.FIRST_NAME_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.COMPANY_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.LEAD_ID_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.CONTACT_ID_NOT_PRESENT &&
				!lead.status?.toLowerCase().includes("fields missing") &&
				!lead.status?.toLowerCase().includes("does not exist") &&
				!lead.status?.toLowerCase().includes("error") &&
				!lead.success &&
				!lead.error
		)
		?.map(lead => lead?.Id);

export const isLeadError = lead =>
	lead.status === LEAD_STATUS.USER_NOT_PRESENT ||
	lead.status === LEAD_STATUS.FIRST_NAME_NOT_PRESENT ||
	lead.status === LEAD_STATUS.COMPANY_NOT_PRESENT ||
	lead.status === LEAD_STATUS.LEAD_ID_NOT_PRESENT ||
	lead.status === LEAD_STATUS.CONTACT_ID_NOT_PRESENT ||
	lead.status?.toLowerCase().includes("fields missing") ||
	lead.status?.toLowerCase().includes("does not exist") ||
	lead.status?.toLowerCase().includes("error") ||
	lead.error;

export const isLeadSuccesss = lead => lead.success;

export const LEAD_ERROR_MSG_MAP = {
	[LEAD_STATUS.USER_NOT_PRESENT]: "User not present in cadence",
	[LEAD_STATUS.COMPANY_NOT_PRESENT]: "Company not present",
	[LEAD_STATUS.FIRST_NAME_NOT_PRESENT]: "First name not present",
	[LEAD_STATUS.LEAD_ID_NOT_PRESENT]: "Lead id not present",
	[LEAD_STATUS.CONTACT_ID_NOT_PRESENT]: "Contact id not present",
};

export const DATA_CATEGORY = {
	lead: "leads",
	contact: "contacts",
	create_lead: "leads",
	lead_list: "leads",
	contact_list: "contacts",
};

export const DATA_CATEGORY_ID = {
	lead: "dynamics_lead_id",
	contact: "dynamics_contact_id",
	create_lead: "lead_preview_id",
	lead_list: "dynamics_lead_id",
	contact_list: "dynamics_contact_id",
};
