//Here most of the names are linked to the task types.

// For example if someday enum of message changes to msg
// then in `ENUMS` constant it should be changed as well as in here.
export const GLOBAL_MODAL_TYPES = {
	//tasks
	MESSAGE: "message",
	MAIL: "mail", //compose and view change by passing prop preview
	MAIL_DELETED: "mail_deleted",
	MAIL_PROHIBTED: "mail_prohibited",
	LINKEDIN_CONNECTION: "linkedin_connection",
	LINKEDIN_INTERACT: "linkedin_interact",
	LINKEDIN_PROFILE: "linkedin_profile",
	LINKEIDN_MESSAGE: "linkedin_message",
	REPLY_TO: "reply_to",
	LINKEDIN: "linkedin",
	WHATSAPP: "whatsapp",
	CADENCE_CUSTOM: "cadence_custom",
	DATA_CHECK: "data_check",
	VIEW_SCRIPT: "view_script",
	ACCOUNT_PROGRESS: "account_progress",
	QUALIFICATION: "qualification",
	CUSTOM_TASK: "custom_task",
	OTHER: "other",
	//customs
	NOTE: "note",
	SALESFORCE_TOKEN_EXPIRED: "salesforce_token_expired",
	PIPEDRIVE_TOKEN_EXPIRED: "pipedrive_token_expired",
	INTEGRATION_TOKEN_EXPIRED: "integration_token_expired",
	MAIL_INTEGRATION_EXPIRED: "mail_integration_token_expired",
	OUT_OF_OFFICE: "out_of_office",
	PAUSE_CADENCE: "pause_cadence",
	STOP_CADENCE: "stop_cadence",
	LINKEDIN_COOKIE_ERROR: "linkedin_cookie_error",
	EDIT_LEAD: "edit_lead",
};
