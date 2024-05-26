export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	COMPANY_NOT_PRESENT: "company_not_present",
};

export const getLeadsExcludingError = leads =>
	leads
		?.filter(
			lead =>
				lead.status !== LEAD_STATUS.USER_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.COMPANY_NOT_PRESENT
		)
		?.map(lead => lead.Id);

export const isLeadError = lead =>
	lead.status === LEAD_STATUS.USER_NOT_PRESENT ||
	lead.status === LEAD_STATUS.COMPANY_NOT_PRESENT;

export const LEAD_ERROR_MSG_MAP = {
	user_not_present: "User not present in cadence",
	company_not_present: "Company not present",
};

export const DATA_CATEGORY = {
	lead: "leads",
	contact: "contacts",
	lead_list: "leads",
	contact_list: "contacts",
};

export const DATA_CATEGORY_ID = {
	lead: "salesforce_lead_id",
	contact: "salesforce_contact_id",
	lead_list: "salesforce_lead_id",
	contact_list: "salesforce_contact_id",
};
