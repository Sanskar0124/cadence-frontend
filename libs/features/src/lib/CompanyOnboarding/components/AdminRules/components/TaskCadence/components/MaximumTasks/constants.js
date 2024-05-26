import { SETTING_PRIORITY } from "@cadence-frontend/constants";

export const getTempTeamExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		calls_per_day: 20,
		mails_per_day: 20,
		messages_per_day: 20,
		linkedins_per_day: 20,
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
		linkedins_per_day: 20,
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

export const getUserSkipSettingExceptions = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.USER,
		skip_allowed_tasks: {
			mail: false,
			call: false,
			message: false,
			linkedin_connection: false,
			linkedin_message: false,
			linkedin_profile: false,
			linkedin_interact: false,
			data_check: false,
			cadence_custom: false,
			reply_to: false,
		},
		sd_id: null,
		user_id: null,
		company_id: data.company_id,
	};
};

export const getTeamSkipSettingExceptions = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		skip_allowed_tasks: {
			mail: false,
			call: false,
			message: false,
			linkedin_connection: false,
			linkedin_message: false,
			linkedin_profile: false,
			linkedin_interact: false,
			data_check: false,
			cadence_custom: false,
			reply_to: false,
		},
		sd_id: null,
		user_id: null,
		company_id: data.company_id,
	};
};

export const TackStackExceptions = {
	mail: false,
	call: false,
	message: false,
	linkedin_connection: false,
	linkedin_message: false,
	linkedin_profile: false,
	linkedin_interact: false,
	data_check: false,
	cadence_custom: false,
};
