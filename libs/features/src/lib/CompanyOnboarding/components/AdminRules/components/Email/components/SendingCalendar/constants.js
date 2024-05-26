import moment from "moment-timezone";
import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const tempData = {
	general: {
		working_days: [],
		start_hour: moment.now(),
		end_hour: moment.now(),
		max_emails_per_day: 0,
		time_between_emails: "delay",
		delay_duration: 3,
	},
	exceptions: [],
};

export const TIME_BETWEEN_EMAILS_TAB_OPTIONS = [
	{
		label: COMMON_TRANSLATION.RANDOM,
		value: true,
	},
	{
		label: COMMON_TRANSLATION.DELAY,
		value: false,
	},
];

export const getTempTeamExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		working_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
		delay: 1,
		start_hour: "09:00",
		end_hour: "17:00",
		is_wait_time_random: true,
		max_emails_per_day: 200,
		max_sms_per_day: 100,
		wait_time_lower_limit: 30,
		wait_time_upper_limit: 120,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};

export const getTempUserExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.USER,
		working_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
		delay: 1,
		start_hour: "09:00",
		end_hour: "17:00",
		is_wait_time_random: true,
		max_emails_per_day: 200,
		max_sms_per_day: 100,
		wait_time_lower_limit: 30,
		wait_time_upper_limit: 120,
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};
