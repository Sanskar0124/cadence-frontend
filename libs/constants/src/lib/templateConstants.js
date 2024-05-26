import React from "react";
import { ROLES } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";

import {
	User,
	Linkedin,
	Message,
	AtrManualEmail,
	Call,
	Company,
	BadgeAccountHorizontal,
} from "@cadence-frontend/icons";

export const TEMPLATE_TYPES = {
	// EMAIL: COMMON_TRANSLATION.EMAIL,
	// SMS: COMMON_TRANSLATION.SMS,
	// LINKEDIN: COMMON_TRANSLATION.LINKEDIN,
	// SCRIPT: COMMON_TRANSLATION.SCRIPT,
	EMAIL: "email",
	SMS: "sms",
	LINKEDIN: "linkedin",
	SCRIPT: "script",
	VIDEO: "video",
	WHATSAPP: "whatsapp",
};

export const TEMPLATE_TYPES_OPTIONS = [
	{
		label: COMMON_TRANSLATION.EMAIL,
		value: "email",
	},
	{
		label: COMMON_TRANSLATION.SMS,
		value: "sms",
	},
	{
		label: COMMON_TRANSLATION.LINKEDIN,
		value: "linkedin",
	},
	{
		label: COMMON_TRANSLATION.WHATSAPP,
		value: "whatsapp",
	},
	{
		label: COMMON_TRANSLATION.SCRIPT,
		value: "script",
	},
	{
		label: COMMON_TRANSLATION.VIDEO,
		value: "video",
	},
];

export const TEMPLATE_SIDEBAR_OPTIONS = {
	FILTER: "filter",
	TEMPLATE_DATA: "template data",
	STAT_DATA: "stat data",
};

export const TEMPLATE_LEVELS_OPTIONS = [
	{
		label: CADENCE_TRANSLATION.PERSONAL,
		value: "personal",
	},
	{
		label: CADENCE_TRANSLATION.GROUP,
		value: "team",
	},
	{
		label: CADENCE_TRANSLATION.COMPANY,
		value: "company",
	},
];

export const TEMPLATE_HEADINGS = {
	// SMS: "SMS",
	// EMAIL: "Email",
	// LINKEDIN: "LinkedIn",
	// SCRIPT: "Scripts",

	SMS: COMMON_TRANSLATION.SMS,
	EMAIL: COMMON_TRANSLATION.EMAIL,
	LINKEDIN: COMMON_TRANSLATION.LINKEDIN,
	SCRIPT: COMMON_TRANSLATION.SCRIPT,
	VIDEO: COMMON_TRANSLATION.VIDEO,
	WHATSAPP: COMMON_TRANSLATION.WHATSAPP,
};

export const TEMPLATE_LEVELS = {
	USER: "personal",
	SUB_DEPARTMENT: "team",
	COMPANY: "company",
};

export const TEMPLATE_LEVELS_LABELS = {
	USER: CADENCE_TRANSLATION.PERSONAL,
	SUB_DEPARTMENT: CADENCE_TRANSLATION.GROUP,
	COMPANY: CADENCE_TRANSLATION.COMPANY,
};

export const TEMPLATE_LEVELS_ICONS = {
	USER: <User />,
	SUB_DEPARTMENT: <BadgeAccountHorizontal />,
	COMPANY: <Company />,
};

export const EmailTemplatesArray = [
	{
		et_id: 1,
		name: "Template 1",
		subject: "Get in contact",
		body: `Hi {{firstName}}, Did you know that integrating your CRM with Ringover enables your teams to make more calls and have better answer rates?`,
	},
];

export const TEMPLATE_TAB_ICONS = {
	SMS: <Message />,
	EMAIL: <AtrManualEmail />,
	LINKEDIN: <Linkedin />,
	SCRIPT: <Call />,
};

export const ACTIONS = {
	CREATE: "create",
	READ: "read",
	UPDATE: "update",
	DELETE: "delete",
	DUPLICATE: "duplicate",
	SHARE: "share",
};

export const EMAIL_TYPES = ["unseen", "bounced", "clicked", "replied", "opened"];

export const MORE_OPTION_ACTIONS = [ACTIONS.DUPLICATE, ACTIONS.DELETE, ACTIONS.SHARE];

const SALESPERSON_PERMISSONS = {
	[TEMPLATE_LEVELS.USER]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[TEMPLATE_LEVELS.SUB_DEPARTMENT]: [ACTIONS.READ],
	[TEMPLATE_LEVELS.COMPANY]: [ACTIONS.READ],
};

const MANAGER_PERMISSIONS = {
	[TEMPLATE_LEVELS.USER]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[TEMPLATE_LEVELS.SUB_DEPARTMENT]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[TEMPLATE_LEVELS.COMPANY]: [ACTIONS.READ, ACTIONS.SHARE],
};

const ADMIN_PERMISSIONS = {
	[TEMPLATE_LEVELS.USER]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[TEMPLATE_LEVELS.SUB_DEPARTMENT]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[TEMPLATE_LEVELS.COMPANY]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
};

export const TEMPLATE_PERMISSIONS = {
	[ROLES.SALESPERSON]: SALESPERSON_PERMISSONS,
	[ROLES.SALES_MANAGER]: MANAGER_PERMISSIONS,
	[ROLES.ADMIN]: ADMIN_PERMISSIONS,
	[ROLES.SUPER_ADMIN]: ADMIN_PERMISSIONS,
};
