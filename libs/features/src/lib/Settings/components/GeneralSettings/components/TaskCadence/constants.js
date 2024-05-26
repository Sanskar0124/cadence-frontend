import { INTEGRATION_TYPE, SETTING_PRIORITY } from "@cadence-frontend/constants";

export const getTempTeamExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		calls_per_day: 20,
		mails_per_day: 20,
		messages_per_day: 20,
		linkedin_connections_per_day: 5,
		linkedin_interacts_per_day: 5,
		linkedin_messages_per_day: 5,
		linkedin_profiles_per_day: 5,
		data_checks_per_day: 10,
		cadence_customs_per_day: 10,
		tasks_to_be_added_per_day: 100,
		max_tasks: 200,
		high_priority_split: 80,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};

export const getTempUserExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.USER,
		calls_per_day: 20,
		mails_per_day: 20,
		messages_per_day: 20,
		linkedin_connections_per_day: 5,
		linkedin_interacts_per_day: 5,
		linkedin_messages_per_day: 5,
		linkedin_profiles_per_day: 5,
		data_checks_per_day: 10,
		cadence_customs_per_day: 10,
		tasks_to_be_added_per_day: 100,
		max_tasks: 200,
		high_priority_split: 80,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};

export const WORKFLOWS_AVAILABLE = [INTEGRATION_TYPE.SHEETS];
export const AUTOMATED_WORKFLOWS_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.HUBSPOT,
	INTEGRATION_TYPE.SELLSY,
	INTEGRATION_TYPE.ZOHO,
	INTEGRATION_TYPE.BULLHORN,
	INTEGRATION_TYPE.DYNAMICS,
];
export const WEBHOOKS_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.HUBSPOT,
	INTEGRATION_TYPE.BULLHORN,
];
export const LEAD_SCORING_AVAILABLE = Object.values(INTEGRATION_TYPE);
