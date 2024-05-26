export const TEAM_CHANGE_OPTIONS = {
	MOVE_LEADS_TO_ANOTHER_CADENCE: "move_leads_to_another_cadence",
	UNLINK_LEADS_FROM_CADENCE: "unlink_leads_from_cadence",
	DELETE_LEADS: "delete_leads",
};

export const TEAM_CHANGE_DESCRIPTIONS = {
	[TEAM_CHANGE_OPTIONS.MOVE_LEADS_TO_ANOTHER_CADENCE]:
		"All your leads and contacts have been moved to new cadences.",
	[TEAM_CHANGE_OPTIONS.UNLINK_LEADS_FROM_CADENCE]:
		"All your leads and contacts have been removed from the running cadences. Please go to the people page to add the leads to your current cadences.",
	[TEAM_CHANGE_OPTIONS.DELETE_LEADS]:
		"All your leads and contacts have been deleted from the tool.",
};
