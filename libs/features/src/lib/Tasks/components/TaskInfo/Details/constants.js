import { ENUMS, LEAD_INTEGRATION_TYPES, LEAD_WARMTH } from "@cadence-frontend/constants";

export const TASKS = {
	mail: ENUMS.mail.task_name_in_quickview,
	automated_mail: ENUMS.automated_mail.task_name_in_quickview,
	call: ENUMS.call.task_name_in_quickview,
	callback: ENUMS.callback.task_name_in_quickview,
	message: ENUMS.message.task_name_in_quickview,
	automated_message: ENUMS.automated_message.task_name_in_quickview,
	linkedin_connection: ENUMS.linkedin_connection.task_name_in_quickview,
	linkedin_message: ENUMS.linkedin_message.task_name_in_quickview,
	linkedin_profile: ENUMS.linkedin_profile.task_name_in_quickview,
	linkedin_interact: ENUMS.linkedin_interact.task_name_in_quickview,
	reply_to: ENUMS.reply_to.task_name_in_quickview,
	automated_reply_to: ENUMS.automated_reply_to.task_name_in_quickview,
	data_check: ENUMS.data_check.task_name_in_quickview,
	cadence_custom: ENUMS.cadence_custom.task_name_in_quickview,
	whatsapp: ENUMS.whatsapp.task_name_in_quickview,
};

export const CUSTOM_VARIABLE_FIELD_AVAILABLE = [
	LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD,
	LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT,
];
