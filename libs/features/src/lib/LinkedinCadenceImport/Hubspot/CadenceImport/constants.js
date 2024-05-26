export const LEAD_STATUS = {
	USER_NOT_PRESENT: "user_not_present",
	LEAD_PRESENT_IN_TOOL: "lead_present_in_tool",
	LEAD_ABSENT_IN_TOOL: "lead_absent_in_tool",
	COMPANY_NOT_PRESENT: "company_not_present",
	UNASSIGNED: "unassigned",
};

export const getLeadsExcludingError = leads =>
	leads
		?.filter(
			lead =>
				lead.status !== LEAD_STATUS.USER_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.COMPANY_NOT_PRESENT &&
				lead.status !== LEAD_STATUS.UNASSIGNED
		)
		?.map(lead => lead.id);

export const isLeadError = lead =>
	lead?.status === LEAD_STATUS.USER_NOT_PRESENT ||
	lead?.status === LEAD_STATUS.COMPANY_NOT_PRESENT ||
	lead?.status === LEAD_STATUS.UNASSIGNED;

export const LEAD_ERROR_MSG_MAP = {
	user_not_present: "User not present in cadence",
	company_not_present: "Company not present",
	unassigned: "User not present",
};
