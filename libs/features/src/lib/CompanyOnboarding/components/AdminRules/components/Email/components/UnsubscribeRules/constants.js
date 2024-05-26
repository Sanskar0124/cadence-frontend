import { SETTING_PRIORITY } from "@cadence-frontend/constants";

export const MAIL_TYPES = {
	automatic_unsubscribed_data: "Automatic",
	semi_automatic_unsubscribed_data: "Semi Automatic",
};

export const getTempTeamExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.SUB_DEPARTMENT,
		automatic_unsubscribed_data: {
			mail: true,
		},
		semi_automatic_unsubscribed_data: {
			mail: true,
		},
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};

export const getTempUserExceptionData = data => {
	return {
		is_new: true,
		priority: SETTING_PRIORITY.USER,
		automatic_unsubscribed_data: {
			mail: true,
		},
		semi_automatic_unsubscribed_data: {
			mail: true,
		},
		company_id: data.company_id,
		sd_id: null,
		user_id: null,
	};
};
