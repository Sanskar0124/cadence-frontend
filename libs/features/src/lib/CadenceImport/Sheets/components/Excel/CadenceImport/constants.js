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
