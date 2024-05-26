import { ROLES } from "@cadence-frontend/constants";
import {
	TEMPLATE_PERMISSIONS,
	ACTIONS,
	TEMPLATE_LEVELS,
	TEMPLATE_LEVELS_OPTIONS,
} from "./constants";

export const isActionPermitted = (action, templateLevel, role, isOwnTemplate = true) => {
	switch (action) {
		case ACTIONS.DUPLICATE: {
			if (
				role === ROLES.ADMIN ||
				role === ROLES.SUPER_ADMIN ||
				role == ROLES.SALES_MANAGER
			) {
				if (templateLevel == TEMPLATE_LEVELS.SUB_DEPARTMENT)
					return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action);
			}
			if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
				if (templateLevel === TEMPLATE_LEVELS.COMPANY) {
					return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action);
				}
			}
			return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action) && isOwnTemplate;
		}
		case ACTIONS.UPDATE:
		case ACTIONS.DELETE:
			if (
				(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) &&
				(templateLevel === TEMPLATE_LEVELS.SUB_DEPARTMENT ||
					templateLevel === TEMPLATE_LEVELS.COMPANY)
			) {
				return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action);
			} else if (
				role === ROLES.SALES_MANAGER &&
				templateLevel === TEMPLATE_LEVELS.SUB_DEPARTMENT
			)
				return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action);
			return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action) && isOwnTemplate;
		default:
			return TEMPLATE_PERMISSIONS[role][templateLevel].includes(action);
	}
};

export const isDropDownEnabled = (actions, templateLevel, role, isOwnTemplate = true) => {
	let res = false;

	actions.forEach(action => {
		res = res || TEMPLATE_PERMISSIONS[role][templateLevel]?.includes(action);
	});

	return res;
};

export const getCreateTemplateOptions = (role, user) => {
	const availableOptions = TEMPLATE_LEVELS_OPTIONS.map(opt => ({
		label: opt.label[user?.language?.toUpperCase()],
		value: opt.value,
	})).filter(option => {
		return TEMPLATE_PERMISSIONS[role][option.value].includes(ACTIONS.CREATE);
	});

	return availableOptions;
};

export const getUpdateTemplateOptions = (role, user) => {
	const availableOptions = TEMPLATE_LEVELS_OPTIONS.map(opt => ({
		label: opt.label[user?.language?.toUpperCase()],
		value: opt.value,
	})).filter(option => {
		return TEMPLATE_PERMISSIONS[role][option.value].includes(ACTIONS.UPDATE);
	});

	return availableOptions;
};

export const getShareTemplateOptions = (role, templateLevel) => {
	if (role === ROLES.SALESPERSON) {
		if (templateLevel === TEMPLATE_LEVELS.USER) return TEMPLATE_LEVELS_OPTIONS;
	} else if (
		role === ROLES.SALES_MANAGER ||
		role === ROLES.ADMIN ||
		role === ROLES.SUPER_ADMIN
	) {
		if (templateLevel !== TEMPLATE_LEVELS.COMPANY) return TEMPLATE_LEVELS_OPTIONS;
		else
			return TEMPLATE_LEVELS_OPTIONS.filter(opt => opt.value !== TEMPLATE_LEVELS.COMPANY);
	}
};

export const getUsersOptions = users => {
	return users?.map(user => ({
		label: `${user.first_name} ${user.last_name}`,
		value: user.user_id,
	}));
};

export const cleanRequestBody = body => {
	const bodyObj = { ...body };

	const EXTRAFIELDS = [
		"User",
		"Sub_Department",
		"Company",
		"Emails",
		"used",
		"redirectUrl",
		"linkText",
		"unseen",
		"bounced",
		"clicked",
		"replied",
		"opened",
		"unsubscribed",
		"sent",
	];

	for (const key of Object.keys(bodyObj))
		if (EXTRAFIELDS.includes(key)) delete bodyObj[key];

	console.log("2", bodyObj);
	return bodyObj;
};

export const convertEmailStatsToPercentage = template => {
	if (template) {
		let templatePercentage = null;

		const bouncedPercentage = (template.bounced / template.sent) * 100;
		const clickedPercentage = (template.clicked / template.sent) * 100;
		const repliedPercentage = (template.replied / template.sent) * 100;
		const openedPercentage = (template.opened / template.sent) * 100;
		const unsubscribedPercentage = (template.unsubscribed / template.sent) * 100;

		const formatPercentage = value => {
			// return Number(value).toFixed(2).substring(Number(value).toFixed(2).indexOf(".")) ===
			// 	".00"
			// 	? Math.trunc(value)
			// 	: value.toFixed(2);

			return Number(value).toFixed();
		};

		templatePercentage = {
			bounced: Number.isNaN(bouncedPercentage)
				? ""
				: `${formatPercentage(bouncedPercentage)}`,
			clicked: Number.isNaN(clickedPercentage)
				? ""
				: `${formatPercentage(clickedPercentage)}`,
			replied: Number.isNaN(repliedPercentage)
				? ""
				: `${formatPercentage(repliedPercentage)}`,
			opened: Number.isNaN(openedPercentage)
				? ""
				: `${formatPercentage(openedPercentage)}`,
			unsubscribed: Number.isNaN(unsubscribedPercentage)
				? ""
				: `${formatPercentage(unsubscribedPercentage)}`,
		};
		return templatePercentage;
	}
};
