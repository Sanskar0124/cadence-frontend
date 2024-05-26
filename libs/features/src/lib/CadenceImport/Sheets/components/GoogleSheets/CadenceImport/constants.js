export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	ANOTHER: "another",
};

export const getLeadsExcludingError = leads =>
	leads
		?.filter(
			lead =>
				lead.status !== LEAD_STATUS.USER_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.ANOTHER
		)
		?.map(lead => lead.sr_no);

export const isLeadError = lead =>
	lead.status === LEAD_STATUS.USER_NOT_PRESENT || lead.status === LEAD_STATUS.ANOTHER;

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
