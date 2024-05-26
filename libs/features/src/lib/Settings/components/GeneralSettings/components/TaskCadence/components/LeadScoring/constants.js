import { SETTING_PRIORITY } from "@cadence-frontend/constants";

export const getUserLeadScoreSettingExceptions = data => {
	return {
		priority: SETTING_PRIORITY.USER,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
		total_score: 0,
		email_clicked: 0,
		email_opened: 0,
		email_replied: 0,
		demo_booked: 0,
		sms_clicked: 0,
		outgoing_call: 0,
		outgoing_call_duration: 0,
		incoming_call_received: 0,
		status_update: {
			picklist_values_account: {},
			picklist_values_lead: {},
		},
		score_threshold: 10,
		is_new: true,
	};
};

export const getTeamLeadScoreSettingExceptions = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
		total_score: 0,
		email_clicked: 0,
		email_opened: 0,
		email_replied: 0,
		demo_booked: 0,
		outgoing_call: 0,
		sms_clicked: 0,
		outgoing_call_duration: 0,
		incoming_call_received: 0,
		status_update: {
			picklist_values_account: {},
			picklist_values_lead: {},
		},
		score_threshold: 10,
	};
};
