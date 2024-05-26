export const VIEW_MODES = {
	LEAD: "lead_info",
	FILTER: "filters",
	CALENDAR: "calendar",
};

export const LEAD_TYPE = [
	{ label: "Lead", value: "lead" },
	{ label: "Contact", value: "contact" },
];

export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	LEAD_INACTIVE: "lead_inactive",
};

export const getLeadsExcludingError = leads => {
	console.log(leads, "Leadss");
	return leads
		?.filter(lead => lead?.status !== LEAD_STATUS.USER_NOT_PRESENT)
		?.map(lead => lead.id);
};
export const isLeadError = lead => lead.status === LEAD_STATUS.USER_NOT_PRESENT;

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

const TYPES = {
	LEAD: "lead",
	CONTACT: "contact",
	LEAD_LIST: "lead_list",
	CONTACT_LIST: "contact_list",
};

export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
};

export const DEFAULT_SF_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
	// [VIEWS.ACCOUNT]: [],
};
