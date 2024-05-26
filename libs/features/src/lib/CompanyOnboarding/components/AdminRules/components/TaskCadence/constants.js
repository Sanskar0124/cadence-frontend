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
