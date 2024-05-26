import { SETTING_PRIORITY } from "@cadence-frontend/constants";

const NODE_TYPES = {
	MAIL: "mail",
	REPLY_TO: "reply_to",
	AUTOMATED_MAIL: "automated_mail",
	CALL: "call",
	MESSAGE: "message",
	AUTOMATED_MESSAGE: "automated_message",
	LINKEDIN_CONNECTION: "linkedin_connection",
	LINKEDIN_MESSAGE: "linkedin_message",
	LINKEDIN_PROFILE: "linkedin_profile",
	LINKEDIN_INTERACT: "linkedin_interact",
	DATA_CHECK: "data_check",
	CADENCE_CUSTOM: "cadence_custom",
	DONE_TASKS: "done_tasks",
	END: "end",
};

export const getTempTeamExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		calls_per_day: 20,
		mails_per_day: 10,
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
		late_settings: {
			[NODE_TYPES.CALL]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.MESSAGE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.MAIL]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_MESSAGE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_PROFILE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_INTERACT]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_CONNECTION]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.DATA_CHECK]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.CADENCE_CUSTOM]: 1 * 24 * 60 * 60 * 1000,
		},
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
		late_settings: {
			[NODE_TYPES.CALL]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.MESSAGE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.MAIL]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_MESSAGE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_PROFILE]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_INTERACT]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.LINKEDIN_CONNECTION]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.DATA_CHECK]: 1 * 24 * 60 * 60 * 1000,

			[NODE_TYPES.CADENCE_CUSTOM]: 1 * 24 * 60 * 60 * 1000,
		},
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
