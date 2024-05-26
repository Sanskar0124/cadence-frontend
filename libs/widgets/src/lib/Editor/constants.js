/* eslint-disable no-console */
import { INTEGRATION_TYPE, MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

export const COUNT_AVAILABLE = ["sms", "script", "whatsapp", "linkedin"];

export const parseEditorValues = value => {
	if (!value) return "";
	// const withoutHTMLTags = value.replace(/<\/?[^>]+(>|$)/g, "");
	// // Remove "&nbsp;" entities
	// const withoutNbsp = withoutHTMLTags.includes("&nbsp;")
	// 	? withoutHTMLTags.replace(/&nbsp;/g, " ")
	// 	: withoutHTMLTags;

	return value;
};

export const CUSTOM_VARIABLES_OPTIONS = [
	"Person",
	"{{first_name}}",
	"{{last_name}}",
	"{{full_name}}",
	"{{email}}",
	"{{phone}}",
	"{{owner}}",
	"{{linkedin_url}}",
	"{{job_position}}",
	"Company",
	"{{company_linkedin_url}}",
	"{{website}}",
	"{{size}}",
	"{{zipcode}}",
	"{{country}}",
	"{{company_name}}",
	"{{company_phone_number}}",
	"Sender",
	"{{sender_first_name}}",
	"{{sender_last_name}}",
	"{{sender_name}}",
	"{{sender_email}}",
	"{{sender_phone_number}}",
	"{{sender_company}}",
	"Date",
	"{{today}}",
	"{{today_day(en)}}",
	"{{today_day(fr)}}",
	"{{today_day(es)}}",
	"{{tomorrow}}",
	"{{tomorrow_day(en)}}",
	"{{tomorrow_day(fr)}}",
	"{{tomorrow_day(es)}}",
	"{{N_days}}",
	"{{N_days_day(en)}}",
	"{{N_days_day(fr)}}",
	"{{N_days_day(es)}}",
	"{{N_days_ago}}",
	"{{N_days_ago_day(en)}}",
	"{{N_days_ago_day(fr)}}",
	"{{N_days_ago_day(es)}}",
	"{{N_week_days_from_now}}",
	"{{N_week_days_from_now_day(en)}}",
	"{{N_week_days_from_now_day(fr)}}",
	"{{N_week_days_from_now_day(es)}}",
	"{{N_week_days_ago}}",
	"{{N_week_days_ago_day(en)}}",
	"{{N_week_days_ago_day(fr)}}",
	"{{N_week_days_ago_day(es)}}",
	"Misc",
	"{{ringover_meet}}",
	"{{calendly_link}}",
	"{{custom_link()}}",
];

export const LEAD_CUSTOM_VARIABLES = {
	"{{first_name}}": {
		predicate: lead => lead?.first_name !== null && lead?.first_name !== undefined,
	},
	"{{last_name}}": {
		predicate: lead => lead?.last_name !== null && lead?.last_name !== undefined,
	},
	"{{full_name}}": {
		predicate: lead =>
			(lead?.first_name !== null && lead?.first_name !== undefined) ||
			(lead?.last_name !== null && lead?.last_name !== undefined),
	},
	"{{email}}": {
		predicate: lead =>
			(lead?.emails && lead?.emails?.length > 0) ||
			(lead?.Lead_emails?.length > 0 &&
				lead?.Lead_emails?.filter(email => email.email_id && email.is_primary)?.length >
					0),
	},
	"{{phone}}": {
		predicate: lead =>
			(lead?.phone_numbers && lead?.phone_numbers?.length > 0) ||
			(lead?.Lead_phone_numbers?.length > 0 &&
				lead?.Lead_phone_numbers?.filter(phone => phone.phone_number && phone.is_primary)
					?.length > 0),
	},
	"{{linkedin_url}}": {
		predicate: lead => lead?.linkedin_url !== null && lead?.linkedin_url !== undefined,
	},
	"{{owner}}": {
		predicate: lead => true, // owner is not a part of field maps, always include
	},
	"{{job_position}}": {
		predicate: lead => lead?.job_position !== null && lead?.job_position !== undefined,
	},
};

export const ACCOUNT_CUSTOM_VARIABLES = {
	"{{company_linkedin_url}}": {
		predicate: account => {
			return account.linkedin_url;
		},
	},
	"{{website}}": {
		predicate: account => account?.url !== null && account?.url !== undefined,
	},
	"{{size}}": {
		predicate: account =>
			(account?.size?.name !== null && account?.size?.name !== undefined) ||
			typeof account.size === "string",
	},
	"{{zipcode}}": {
		predicate: account =>
			(account?.zip_code !== null && account?.zip_code !== undefined) ||
			(account?.zipcode !== null && account?.zipcode !== undefined),
	},
	"{{country}}": {
		predicate: account =>
			(account?.country?.name !== null && account?.country?.name !== undefined) ||
			(account?.country !== null &&
				account?.name !== undefined &&
				typeof account?.country === "string"),
	},
	"{{company_name}}": {
		predicate: account =>
			(account?.company !== null && account?.company !== undefined) ||
			(account?.name !== null && account?.name !== undefined),
	},
	"{{company_phone_number}}": {
		predicate: account => {
			return account?.phone_number || account?.Account_phone_numbers?.length > 0;
		},
	},
};

export const USER_CUSTOM_VARIABLES = {
	"{{sender_first_name}}": {
		predicate: user => user?.first_name !== null && user?.first_name !== undefined,
	},
	"{{sender_last_name}}": {
		predicate: user => user?.last_name !== null && user?.last_name !== undefined,
	},
	"{{sender_name}}": {
		predicate: user =>
			(user?.first_name !== null && user?.last_name !== undefined) ||
			(user?.last_name !== null && user?.last_name !== undefined),
	},
	"{{sender_email}}": {
		predicate: user =>
			(user?.email !== null && user?.email !== undefined) ||
			(user?.primary_email !== null && user?.primary_email !== undefined),
	},
	"{{sender_phone_number}}": {
		predicate: user =>
			(user?.primary_phone_number !== null && user?.primary_phone_number !== undefined) ||
			(user?.primary_phone_number !== null && user?.primary_phone_number !== undefined),
	},
	"{{sender_company}}": {
		predicate: user => user?.company_id !== null && user?.company_id !== undefined,
	},
};

export const INTEGRATION_MAP_KEYS = {
	[INTEGRATION_TYPE.SALESFORCE]: {
		lead_map: "lead_map",
		account_map: "account_map",
	},
	[INTEGRATION_TYPE.PIPEDRIVE]: {
		lead_map: "lead_map",
		account_map: "organization_map",
	},
	[INTEGRATION_TYPE.HUBSPOT]: {
		lead_map: "contact_map",
		account_map: "company_map",
	},
	[INTEGRATION_TYPE.DYNAMICS]: {
		lead_map: "lead_map",
		account_map: "account_map",
	},
	[INTEGRATION_TYPE.ZOHO]: {
		lead_map: "lead_map",
		account_map: "account_map",
	},
	[INTEGRATION_TYPE.SELLSY]: {
		lead_map: "contact_map",
		account_map: "company_map",
	},
	[INTEGRATION_TYPE.BULLHORN]: {
		lead_map: "lead_map",
		account_map: "account_map",
		candidate_map: "candidate_map",
	},
};

export const getLeadAccountVariablesByIntegration = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			return [
				"Person",
				"{{first_name}}",
				"{{last_name}}",
				"{{full_name}}",
				"{{email}}",
				"{{phone}}",
				"{{linkedin_url}}",
				"{{job_position}}",
				"{{owner}}",
				"Company",
				"{{company_name}}",
				"{{size}}",
				"{{website}}",
				"{{zipcode}}",
				"{{country}}",
			];

		default:
			return [];
	}
};

export const MISC_CUSTOM_VARIABLES = [
	"Date",
	"{{today}}",
	"{{today_day(en)}}",
	"{{today_day(fr)}}",
	"{{today_day(es)}}",
	"{{tomorrow}}",
	"{{tomorrow_day(en)}}",
	"{{tomorrow_day(fr)}}",
	"{{tomorrow_day(es)}}",
	"{{N_days}}",
	"{{N_days_day(en)}}",
	"{{N_days_day(fr)}}",
	"{{N_days_day(es)}}",
	"{{N_days_ago}}",
	"{{N_days_ago_day(en)}}",
	"{{N_days_ago_day(fr)}}",
	"{{N_days_ago_day(es)}}",
	"{{N_week_days_from_now}}",
	"{{N_week_days_from_now_day(en)}}",
	"{{N_week_days_from_now_day(fr)}}",
	"{{N_week_days_from_now_day(es)}}",
	"{{N_week_days_ago}}",
	"{{N_week_days_ago_day(en)}}",
	"{{N_week_days_ago_day(fr)}}",
	"{{N_week_days_ago_day(es)}}",
	"Misc",
	"{{ringover_meet}}",
	"{{user_signature}}",
	"{{calendly_link}}",
	"{{custom_link()}}",
	"{{unsubscribe(Unsubscribe)}}",
];

export const IS_CUSTOM_VAR_FIELD_MAP_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.HUBSPOT,
	INTEGRATION_TYPE.DYNAMICS,
	INTEGRATION_TYPE.ZOHO,
	INTEGRATION_TYPE.BULLHORN,
];

const fontSizeOptions = {
	options: [
		{
			title: "Tiny",
			model: "10px",
		},
		{
			title: "Small",
			model: "12px",
		},
		{ title: "Normal", model: "14px" },
		{
			title: "Large",
			model: "16px",
		},
		{
			title: "Huge",
			model: "18px",
		},
	],
};

export const EDITOR_CONFIG = {
	email: {
		toolbar: {
			items: [
				"fontStylesDropdown",
				"insertTable",
				"attachment",
				"emoji",
				"bulletedList",
				"imageInsert",
				"link",
				"htmlEmbed",
				"customVariables",
			],
			shouldNotGroupWhenFull: true,
		},
		fontSize: fontSizeOptions,
	},
	message: {
		toolbar: {
			items: ["emoji", "customVariables"],
			shouldNotGroupWhenFull: true,
		},
	},
	no_attachments: {
		toolbar: {
			items: [
				"fontStylesDropdown",
				"insertTable",
				"emoji",
				"bulletedList",
				"imageInsert",
				"link",
				"htmlEmbed",
				"customVariables",
			],
			shouldNotGroupWhenFull: true,
		},
		fontSize: fontSizeOptions,
	},
	only_attachments: {
		toolbar: {
			items: ["attachment"],
			shouldNotGroupWhenFull: true,
		},
		fontSize: fontSizeOptions,
	},
};

export const clearAttachments = () => {
	try {
		//attachment support will not work if environment is not a web browser
		if (!window) return;
		const attachments = Object.keys(window.sessionStorage).filter(key =>
			key.includes("attachment")
		);

		//delete all session storage attachments
		attachments.forEach(key => {
			window.sessionStorage.removeItem(key);
		});
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		return;
	}
};

export const EDITOR_ATTACHMENT_EVENTS_ENUM = {
	FILE_UPLOAD_BEGIN: "FILE_UPLOAD_BEGIN",
	FILE_UPLOAD_SUCCESS: "FILE_UPLOAD_SUCCESS",
	ATTACHMENT_LIMIT: "ATTACHMENT_LIMIT",
	FILE_SIZE_LIMIT: "FILE_SIZE_LIMIT",
};

export const CUSTOM_VARS_NAMES_BY_INTEGRATION = {
	[INTEGRATION_TYPE.SALESFORCE]: {
		lead: "Leads",
		account: "Account",
	},
	[INTEGRATION_TYPE.HUBSPOT]: {
		lead: "Contact",
		account: "Company",
	},
	[INTEGRATION_TYPE.PIPEDRIVE]: {
		lead: "Person",
		account: "Organization",
	},
	[INTEGRATION_TYPE.ZOHO]: {
		lead: "Lead",
		account: "Account",
	},
	[INTEGRATION_TYPE.SELLSY]: {
		lead: "Contact",
		account: "Company",
	},
	[INTEGRATION_TYPE.BULLHORN]: {
		lead: "Leads",
		account: "Account",
	},
};

export const formatter = (str, variable_type) => {
	str = str.replaceAll("-", " ");
	str = str.replaceAll("_", " ");
	str = str.replaceAll("'", " ");
	let modStr = "";
	str.split(" ").forEach(subStr => {
		if (subStr !== "") modStr += subStr.charAt(0).toUpperCase() + subStr.slice(1);
	});
	switch (variable_type) {
		case "lead":
			modStr = `{{${modStr}_L}}`;
			break;
		case "contact":
			modStr = `{{${modStr}_C}}`;
			break;
		case "account":
			modStr = `{{${modStr}_A}}`;
			break;
		case "person":
			modStr = `{{${modStr}_P}}`;
			break;
		case "organization":
			modStr = `{{${modStr}_O}}`;
			break;
		case "company":
			modStr = `{{${modStr}_Co}}`;
			break;
		case "candidate":
			modStr = `{{${modStr}_Cn}}`;
			break;
	}
	return modStr;
};

export const reconcileAttachments = files => {
	try {
		if (files && files.length <= 0) return;
		for (let index in files) {
			let attachmentKey = files?.[index]?.original_name + "-attachment";

			let attachmentObject = {
				original_name: files?.[index]?.original_name,
				attachment_id: files?.[index]?.attachment_id,
				attachment_url: files?.[index]?.attachment_url,
			};
			sessionStorage.setItem(attachmentKey, JSON.stringify(attachmentObject));
		}
	} catch (err) {
		console.log(err);
	}
};
