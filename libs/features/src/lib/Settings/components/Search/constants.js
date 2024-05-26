import {
	Profile as PROFILE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { TABS } from "../../constants";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const SEARCH_CATEGORY = {
	PERSONAL_INFO: "personal_info",
	PHONE: "phone",
	EMAIL: "email",
	FOCUS_MODE: "focus_mode",
	TIME_AND_LANG: "time_and_lang",
	TOOL_OPERATION: "tool_operation",
	CRM: "crm",
	PHONE_SYSTEM: "phone_system",
	CALENDAR: "calendar",
	LINKEDIN: "linkedin",
	CRM_SYNC: "crm_sync",
	FIELD_MAPPING: "field_mapping",
	EMAIL_SYSTEM: "email_system",
	COMPANY_GROUPS: "company_groups",
	EMAILS: "emails",
	TASK_AND_CADENCE: "task_and_cadence",
	PACKAGE_ADDONS: "package_addons",
};

export const SEARCH_OPTIONS = {
	//my account
	MY_DETAILS: "my_details",
	PRIMARY_PHONE: "primary_phone",
	RINGOVER_I_FRAME: "ringover_i_frame",
	CALLBACK_DEVICES: "callback_devices",
	EMAILS: "emails",
	EMAIL_SIGNATURES: "email_signatures",
	TIMER: "timer",
	TIMEZONE: "timezone",
	LANGUAGE: "language",
	CLEAR_CACHE: "clear_cache",
	//my connections
	CONNECT_INTEGRATION: "connect_integration",
	CONNECT_ANOTHER_SOURCE: "connect_another_source",
	CONNECT_CALENDLY: "connect_calendly",
	SELECT_EVENT: "select_event",
	INSTALL_EXTENSION: "install_extension",
	LINKEDIN_SESSION_COOKIE: "linkedin_session_cookie",
	//crm & mf
	CONNECTED_CRM: "connected_crm",
	INSTALL_PACKAGE: "install_package",
	API_TOKEN: "api_token",
	LOG_ACTIVITIES: "log_activities",
	CRM_ADMIN: "crm_admin",
	FIELD_MAPPING: "field_mapping",
	//email setup
	CONNECTED_MAIL_SYSTEM: "connected_mail_system",
	SETUP_GOOGLE_DOMAIN: "setup_google_domain",
	//phone system
	SELECT_PHONE_SYSTEM: "select_phone_system",
	SMS_ACTIVITES: "sms_activities",
	//groups & members
	COMPANY_GROUPS: "company_groups",
	//general settings
	SENDING_CALENDAR: "sending_calendar",
	UNSUBSCRIBE_RULES: "unsubscribe_rules",
	BOUNCED_EMAIL_RULES: "bounced_email_rules",
	DOMAIN_VERIFICATION: "domain_verification",
	TASK_SETTINGS: "task_settings",
	SKIP_TASK_SETTINGS: "skip_task_settings",
	LEAD_SCORING: "lead_scoring",
	WORKFLOWS: "workflows",
	WEBHOOK: "webhook",
};

export const getSearchCategoryLabel = (category, language) => {
	return {
		//my account
		[SEARCH_CATEGORY.PERSONAL_INFO]: PROFILE_TRANSLATION.PERSONAL_INFO[language],
		[SEARCH_CATEGORY.PHONE]: PROFILE_TRANSLATION.PHONE[language],
		[SEARCH_CATEGORY.EMAIL]: COMMON_TRANSLATION.EMAIL[language],
		[SEARCH_CATEGORY.TIME_AND_LANG]: PROFILE_TRANSLATION.TIME_AND_LANGUAGE[language],
		[SEARCH_CATEGORY.FOCUS_MODE]: PROFILE_TRANSLATION.FOCUS_MODE[language],
		[SEARCH_CATEGORY.TOOL_OPERATION]:
			COMMON_TRANSLATION.TOOL_OPERATION_SERVICES[language],
		//my connections
		[SEARCH_CATEGORY.CRM]: COMMON_TRANSLATION.CRM[language],
		[SEARCH_CATEGORY.PHONE_SYSTEM]: COMMON_TRANSLATION.PHONE_SYSTEM[language],
		[SEARCH_CATEGORY.CALENDAR]: COMMON_TRANSLATION.CALENDAR[language],
		[SEARCH_CATEGORY.LINKEDIN]: COMMON_TRANSLATION.LINKEDIN[language],
		//crm & mf
		[SEARCH_CATEGORY.CRM_SYNC]: SETTINGS_TRANSLATION.CRM_SYNC[language],
		[SEARCH_CATEGORY.FIELD_MAPPING]: SETTINGS_TRANSLATION.FIELD_MAPPING[language],
		//email setup
		[SEARCH_CATEGORY.EMAIL_SYSTEM]: SETTINGS_TRANSLATION.EMAIL_SYSTEM[language],
		//phone system
		[SEARCH_CATEGORY.PHONE_SYSTEM]: COMMON_TRANSLATION.PHONE_SYSTEM[language],
		//groups & members
		[SEARCH_CATEGORY.COMPANY_GROUPS]: SETTINGS_TRANSLATION.COMPANY_GROUPS[language],
		//general settings
		[SEARCH_CATEGORY.EMAILS]: COMMON_TRANSLATION.EMAILS[language],
		[SEARCH_CATEGORY.TASK_AND_CADENCE]: SETTINGS_TRANSLATION.TASK_AND_CADENCE[language],
		//package addons
		[SEARCH_CATEGORY.PACKAGE_ADDONS]: SETTINGS_TRANSLATION.PACKAGE_ADDONS[language],
	}[category];
};

export const getSearchOptions = (language, INTEGRATION_TRANSLATION) => {
	return [
		//my account
		{
			category: SEARCH_CATEGORY.PERSONAL_INFO,
			label: PROFILE_TRANSLATION.MY_DETAILS[language],
			keywords: [SEARCH_CATEGORY.PERSONAL_INFO, PROFILE_TRANSLATION.MY_DETAILS[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.MY_DETAILS}`,
		},
		{
			category: SEARCH_CATEGORY.PHONE,
			label: PROFILE_TRANSLATION.PRIMARY_PHONE[language],
			keywords: [SEARCH_CATEGORY.PHONE, PROFILE_TRANSLATION.PRIMARY_PHONE[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.PRIMARY_PHONE}`,
		},
		{
			category: SEARCH_CATEGORY.PHONE,
			label: PROFILE_TRANSLATION.RINGOVER_I_FRAME[language],
			keywords: [SEARCH_CATEGORY.PHONE, PROFILE_TRANSLATION.RINGOVER_I_FRAME[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.RINGOVER_I_FRAME}`,
		},
		{
			category: SEARCH_CATEGORY.PHONE,
			label: PROFILE_TRANSLATION.CALLBACK_DEVICES[language],
			keywords: [SEARCH_CATEGORY.PHONE, PROFILE_TRANSLATION.CALLBACK_DEVICES[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.CALLBACK_DEVICES}`,
		},
		{
			category: SEARCH_CATEGORY.EMAIL,
			label: COMMON_TRANSLATION.EMAILS[language],
			keywords: [SEARCH_CATEGORY.EMAIL, COMMON_TRANSLATION.EMAILS[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.EMAILS}`,
		},
		{
			category: SEARCH_CATEGORY.EMAIL,
			label: COMMON_TRANSLATION.EMAIL_SIGNATURE[language],
			keywords: [SEARCH_CATEGORY.EMAIL, COMMON_TRANSLATION.EMAIL_SIGNATURE[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.EMAIL_SIGNATURES}`,
		},
		{
			category: SEARCH_CATEGORY.FOCUS_MODE,
			label: PROFILE_TRANSLATION.TIMER[language],
			keywords: [SEARCH_CATEGORY.FOCUS_MODE, PROFILE_TRANSLATION.TIMER[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.TIMER}`,
		},
		{
			category: SEARCH_CATEGORY.TIME_AND_LANG,
			label: PROFILE_TRANSLATION.TIMEZONE[language],
			keywords: [SEARCH_CATEGORY.TIME_AND_LANG, PROFILE_TRANSLATION.TIMEZONE[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.TIMEZONE}`,
		},
		{
			category: SEARCH_CATEGORY.TIME_AND_LANG,
			label: PROFILE_TRANSLATION.LANGUAGE[language],
			keywords: [SEARCH_CATEGORY.TIME_AND_LANG, PROFILE_TRANSLATION.LANGUAGE[language]],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.LANGUAGE}`,
		},
		{
			category: SEARCH_CATEGORY.TOOL_OPERATION,
			label: PROFILE_TRANSLATION.CLEAR_CACHE[language],
			keywords: [
				SEARCH_CATEGORY.TIME_AND_LANG,
				PROFILE_TRANSLATION.CLEAR_CACHE[language],
			],
			link: `?view=${TABS.MY_ACCOUNT}&search=${SEARCH_OPTIONS.CLEAR_CACHE}`,
		},
		//my connections
		{
			category: SEARCH_CATEGORY.CRM,
			label: PROFILE_TRANSLATION.CONNECT_TO_INTEGRATION[language],
			keywords: [
				SEARCH_CATEGORY.CRM,
				PROFILE_TRANSLATION.CONNECT_TO_INTEGRATION[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.CONNECT_INTEGRATION}`,
		},
		{
			category: SEARCH_CATEGORY.EMAIL,
			label: PROFILE_TRANSLATION.CONNECT_FROM_ANOTHER_SOURCE[language],
			keywords: [
				SEARCH_CATEGORY.EMAIL,
				PROFILE_TRANSLATION.CONNECT_FROM_ANOTHER_SOURCE[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.CONNECT_ANOTHER_SOURCE}`,
		},
		{
			category: SEARCH_CATEGORY.CALENDAR,
			label: PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[language],
			keywords: [
				SEARCH_CATEGORY.CALENDAR,
				PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.CONNECT_CALENDLY}`,
		},
		{
			category: SEARCH_CATEGORY.CALENDAR,
			label: PROFILE_TRANSLATION.SELECT_CALENDLY_EVENT[language],
			keywords: [
				SEARCH_CATEGORY.CALENDAR,
				PROFILE_TRANSLATION.SELECT_CALENDLY_EVENT[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.SELECT_EVENT}`,
		},
		{
			category: SEARCH_CATEGORY.LINKEDIN,
			label: PROFILE_TRANSLATION.INSTALL_EXTENSION[language],
			keywords: [
				SEARCH_CATEGORY.LINKEDIN,
				PROFILE_TRANSLATION.INSTALL_EXTENSION[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.INSTALL_EXTENSION}`,
		},
		{
			category: SEARCH_CATEGORY.LINKEDIN,
			label: PROFILE_TRANSLATION.LINKEDIN_SESSION_COOKIE[language],
			keywords: [
				SEARCH_CATEGORY.LINKEDIN,
				PROFILE_TRANSLATION.LINKEDIN_SESSION_COOKIE[language],
			],
			link: `?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.LINKEDIN_SESSION_COOKIE}`,
		},
		//crm & mf
		{
			category: SEARCH_CATEGORY.CRM_SYNC,
			label: SETTINGS_TRANSLATION.CRM_SYNC[language],
			keywords: [SEARCH_CATEGORY.CRM_SYNC, SETTINGS_TRANSLATION.CRM_SYNC[language]],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.CONNECTED_CRM}`,
		},
		{
			category: SEARCH_CATEGORY.CRM_SYNC,
			label: SALESFORCE_TRANSLATION.INSTALL_SALESFORCE_PACKAGE[language],
			keywords: [
				SEARCH_CATEGORY.CRM_SYNC,
				SALESFORCE_TRANSLATION.INSTALL_SALESFORCE_PACKAGE[language],
			],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.INSTALL_PACKAGE}`,
			integration_not_available: Object.values(INTEGRATION_TYPE).filter(
				it => it !== INTEGRATION_TYPE.SALESFORCE
			),
		},
		{
			category: SEARCH_CATEGORY.CRM_SYNC,
			label: INTEGRATION_TRANSLATION.API_TOKEN[language],
			keywords: [SEARCH_CATEGORY.CRM_SYNC, INTEGRATION_TRANSLATION.API_TOKEN[language]],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.API_TOKEN}`,
			integration_not_available: Object.values(INTEGRATION_TYPE).filter(
				it => it !== INTEGRATION_TYPE.SALESFORCE
			),
		},
		{
			category: SEARCH_CATEGORY.CRM_SYNC,
			label: SETTINGS_TRANSLATION.LOG_ACTIVITIES[language],
			keywords: [SEARCH_CATEGORY.CRM_SYNC, SETTINGS_TRANSLATION.LOG_ACTIVITIES[language]],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.LOG_ACTIVITIES}`,
		},
		{
			category: SEARCH_CATEGORY.CRM_SYNC,
			label: INTEGRATION_TRANSLATION.INTEGRATION_ADMINISTRATOR[language],
			keywords: [
				SEARCH_CATEGORY.CRM_SYNC,
				INTEGRATION_TRANSLATION.INTEGRATION_ADMINISTRATOR[language],
			],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.CRM_ADMIN}`,
		},
		{
			category: SEARCH_CATEGORY.FIELD_MAPPING,
			label: SETTINGS_TRANSLATION.FIELD_MAPPING[language],
			keywords: [
				SEARCH_CATEGORY.FIELD_MAPPING,
				SETTINGS_TRANSLATION.FIELD_MAPPING[language],
			],
			link: `?view=${TABS.CRM_AND_MF}&search=${SEARCH_OPTIONS.FIELD_MAPPING}`,
			integration_not_available: [
				INTEGRATION_TYPE.EXCEL,
				INTEGRATION_TYPE.GOOGLE_SHEETS,
				INTEGRATION_TYPE.SHEETS,
			],
		},
		//email setup
		{
			category: SEARCH_CATEGORY.EMAIL_SYSTEM,
			label: SETTINGS_TRANSLATION.CONNECTED_MAIL_SYSTEM[language],
			keywords: [
				SEARCH_CATEGORY.EMAIL_SYSTEM,
				SETTINGS_TRANSLATION.CONNECTED_MAIL_SYSTEM[language],
			],
			link: `?view=${TABS.EMAIL_SETUP}&search=${SEARCH_OPTIONS.CONNECTED_MAIL_SYSTEM}`,
		},
		{
			category: SEARCH_CATEGORY.EMAIL_SYSTEM,
			label: SETTINGS_TRANSLATION.SETUP_GOOGLE_DOMAIN[language],
			keywords: [
				SEARCH_CATEGORY.EMAIL_SYSTEM,
				SETTINGS_TRANSLATION.SETUP_GOOGLE_DOMAIN[language],
			],
			link: `?view=${TABS.EMAIL_SETUP}&search=${SEARCH_OPTIONS.SETUP_GOOGLE_DOMAIN}`,
		},
		//phone system
		{
			category: SEARCH_CATEGORY.PHONE_SYSTEM,
			label: SETTINGS_TRANSLATION.SELECT_YOUR_PHONE_SYSTEM[language],
			keywords: [
				SEARCH_CATEGORY.PHONE_SYSTEM,
				SETTINGS_TRANSLATION.SELECT_YOUR_PHONE_SYSTEM[language],
			],
			link: `?view=${TABS.PHONE_SYSTEM}&search=${SEARCH_OPTIONS.SELECT_PHONE_SYSTEM}`,
		},
		{
			category: SEARCH_CATEGORY.PHONE_SYSTEM,
			label: SETTINGS_TRANSLATION.SMS_ACTIVITIES[language],
			keywords: [
				SEARCH_CATEGORY.PHONE_SYSTEM,
				SETTINGS_TRANSLATION.SMS_ACTIVITIES[language],
			],
			link: `?view=${TABS.PHONE_SYSTEM}&search=${SEARCH_OPTIONS.SMS_ACTIVITES}`,
		},
		//groups and members
		{
			category: SEARCH_CATEGORY.COMPANY_GROUPS,
			label: SETTINGS_TRANSLATION.COMPANY_GROUPS[language],
			keywords: [
				SEARCH_CATEGORY.COMPANY_GROUPS,
				SETTINGS_TRANSLATION.COMPANY_GROUPS[language],
			],
			link: `?view=${TABS.GROUPS_AND_MEMBERS}`,
		},
		//general settings
		{
			category: SEARCH_CATEGORY.EMAILS,
			label: SETTINGS_TRANSLATION.SENDING_CALENDER[language],
			keywords: [SEARCH_CATEGORY.EMAILS, SETTINGS_TRANSLATION.SENDING_CALENDER[language]],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.SENDING_CALENDAR}`,
		},
		{
			category: SEARCH_CATEGORY.EMAILS,
			label: SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES[language],
			keywords: [
				SEARCH_CATEGORY.EMAILS,
				SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.UNSUBSCRIBE_RULES}`,
		},
		{
			category: SEARCH_CATEGORY.EMAILS,
			label: SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES[language],
			keywords: [
				SEARCH_CATEGORY.EMAILS,
				SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.BOUNCED_EMAIL_RULES}`,
		},
		{
			category: SEARCH_CATEGORY.EMAILS,
			label: COMMON_TRANSLATION.DOMAIN_VERIFICATION[language],
			keywords: [
				SEARCH_CATEGORY.EMAILS,
				COMMON_TRANSLATION.DOMAIN_VERIFICATION[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.DOMAIN_VERIFICATION}`,
		},
		{
			category: SEARCH_CATEGORY.TASK_AND_CADENCE,
			label: SETTINGS_TRANSLATION.TASK_SETTINGS[language],
			keywords: [
				SEARCH_CATEGORY.TASK_AND_CADENCE,
				SETTINGS_TRANSLATION.TASK_SETTINGS[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.TASK_SETTINGS}`,
		},
		{
			category: SEARCH_CATEGORY.TASK_AND_CADENCE,
			label: SETTINGS_TRANSLATION.SKIP_TASK_SETTINGS[language],
			keywords: [
				SEARCH_CATEGORY.TASK_AND_CADENCE,
				SETTINGS_TRANSLATION.SKIP_TASK_SETTINGS[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.SKIP_TASK_SETTINGS}`,
		},
		{
			category: SEARCH_CATEGORY.TASK_AND_CADENCE,
			label: COMMON_TRANSLATION.LEAD_SCORE_SETTINGS[language],
			keywords: [
				SEARCH_CATEGORY.TASK_AND_CADENCE,
				COMMON_TRANSLATION.LEAD_SCORE_SETTINGS[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.LEAD_SCORING}`,
		},
		{
			category: SEARCH_CATEGORY.TASK_AND_CADENCE,
			label: COMMON_TRANSLATION.WORKFLOW[language],
			keywords: [SEARCH_CATEGORY.TASK_AND_CADENCE, COMMON_TRANSLATION.WORKFLOW[language]],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.WORKFLOWS}`,
			integration_not_available: [
				INTEGRATION_TYPE.EXCEL,
				INTEGRATION_TYPE.GOOGLE_SHEETS,
				INTEGRATION_TYPE.SHEETS,
			],
		},
		{
			category: SEARCH_CATEGORY.TASK_AND_CADENCE,
			label: SETTINGS_TRANSLATION.WEB_HOOK[language],
			keywords: [
				SEARCH_CATEGORY.TASK_AND_CADENCE,
				SETTINGS_TRANSLATION.WEB_HOOK[language],
			],
			link: `?view=${TABS.GENERAL_SETTINGS}&search=${SEARCH_OPTIONS.WEBHOOK}`,
			integration_not_available: Object.values(INTEGRATION_TYPE).filter(
				it => it !== INTEGRATION_TYPE.SALESFORCE && it !== INTEGRATION_TYPE.HUBSPOT
			),
		},
		//integration addons
		{
			category: SEARCH_CATEGORY.PACKAGE_ADDONS,
			label: SETTINGS_TRANSLATION.PACKAGE_ADDONS[language],
			keywords: [
				SEARCH_CATEGORY.TASK_AND_CADENCE,
				SETTINGS_TRANSLATION.PACKAGE_ADDONS[language],
			],
			link: `?view=${TABS.INTEGRATION_ADD_ONS}`,
		},
	];
};
