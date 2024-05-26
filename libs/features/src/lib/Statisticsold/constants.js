import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const COLORS = {
	call: "#36CDCF",
	callback: "#FFB12A",
	linkedin: "#0077B5",
	email: "#A282E8",
	datacheck: "#FFCC00",
	custom: "#FB7A96",
	message: "#037DFC",
	whatsapp: "#23D366",
};

export const ACTIVITY_FOLLOWUP_TABLE_COLS = [
	"Cadence",
	"Outbound calls",
	"Mails sent",
	"Sms sent",
	"Linkedin Message",
	"Custom tasks",
];

export const ACTIVITY_FOLLOWUP_TABLE_USER_COLS = [
	"Cadence",
	"Outbound calls",
	"Mails sent",
	"Sms sent",
	"Linkedin Connection",
	"Linkedin Profile Visits",
	"Linkedin Post",
	"Linkedin Message",
	"Custom tasks",
];
export const CADENCE_TASK_FOLLOWUP = [
	"User",
	"Completed tasks",
	"Disqualification",
	"Conversion",
];

export const CADENCE_CONTACTS_OVERVIEW = [
	"User",
	"Total contacts",
	"Active contacts",
	"Converted contacts",
	"Disqualified contacts",
];

export const CADENCE_ACTIVITY = [
	"Cadence",
	"Emails Sent",
	"Emails Bounced",
	"Emails Opened",
	"Emails Clicked",
	"Emails Unsub",
	"Profile View",
	"InMail",
	"Invitate",
	"Interact",
	"Calls",
	"SMS auto",
	"SMS manual",
	"Custom",
	"Conversion",
	"Disqualify",
];

export const TIMERANGEFILTER_OPTIONS = {
	today: COMMON_TRANSLATION.TODAY,
	yesterday: COMMON_TRANSLATION.YESTERDAY,
	this_week: COMMON_TRANSLATION.THIS_WEEK,

	last_week: COMMON_TRANSLATION.LAST_WEEK,

	this_month: COMMON_TRANSLATION.THIS_MONTH,

	last_month: COMMON_TRANSLATION.LAST_MONTH,
	// last_3_months: COMMON_TRANSLATION.LAST_3_MONTHS,
};

export const CANDENCEFILTER_OPTIONS = {
	all_cadences: "All cadences",
	personal: "Personal",
	team: "Team",
	company: "Company",
};

export const GRAPHFILTER_OPTIONS = {
	// done_tasks: TASKS_TRANSLATION.DONE_TASKS,
	// email: COMMON_TRANSLATION.EMAIL,
	// automated_mail: COMMON_TRANSLATION.AUTOMATED_MAIL,
	// message: TASKS_TRANSLATION.SMS,
	// automated_message: COMMON_TRANSLATION.AUTOMATED_MESSAGE,
	// call: TASKS_TRANSLATION.CALL,
	// linkedin: TASKS_TRANSLATION.LINKEDIN,
	// data_check: TASKS_TRANSLATION.DATA_CHECK,
	// cadence_custom: TASKS_TRANSLATION.CUSTOM,

	done_tasks: TASKS_TRANSLATION.DONE_TASKS,
	email: COMMON_TRANSLATION.SEMI_AUTOMATED_MAIL,
	automated_mail: COMMON_TRANSLATION.AUTOMATED_MAIL,
	message: COMMON_TRANSLATION.SEMI_AUTOMATED_MESSAGE,
	automated_message: COMMON_TRANSLATION.AUTOMATED_MESSAGE,
	call: TASKS_TRANSLATION.CALL,
	callback: TASKS_TRANSLATION.CALLBACK,
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	data_check: TASKS_TRANSLATION.DATA_CHECK,
	cadence_custom: TASKS_TRANSLATION.CUSTOM,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
};

export const HEATMAPFILTER_OPTIONS = {
	done_tasks: TASKS_TRANSLATION.DONE_TASKS,
	email: COMMON_TRANSLATION.SEMI_AUTOMATED_MAIL,
	automated_mail: COMMON_TRANSLATION.AUTOMATED_MAIL,
	message: COMMON_TRANSLATION.SEMI_AUTOMATED_MESSAGE,
	automated_message: COMMON_TRANSLATION.AUTOMATED_MESSAGE,
	call: TASKS_TRANSLATION.CALL,
	callback: TASKS_TRANSLATION.CALLBACK,
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	data_check: TASKS_TRANSLATION.DATA_CHECK,
	cadence_custom: TASKS_TRANSLATION.CUSTOM,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
};

export const TABLE_COLUMNS = [
	// "CADENCE NAME",
	// "USERS",
	// "TASKS DONE",
	// "CALLS",
	// "SMS",
	// "EMAILS",
	// "LINKEDIN",
	// "DATACHECK",
	// "CUSTOM",
	{
		label: CADENCE_TRANSLATION.CADENCE_NAME,
		// value:"CADENCE NAME"
	},
	// { label: TASKS_TRANSLATION.USER },
	{ label: TASKS_TRANSLATION.TASKS_DONE },
	{ label: TASKS_TRANSLATION.CALLS },
	{ label: TASKS_TRANSLATION.SMS },
	{ label: COMMON_TRANSLATION.EMAILS },
	{ label: TASKS_TRANSLATION.LINKEDIN },
	{ label: TASKS_TRANSLATION.DATA_CHECK },
	{ label: TASKS_TRANSLATION.CUSTOM },
	{ label: TASKS_TRANSLATION.PEOPEL },
	{ label: TASKS_TRANSLATION.OPP },
	{ label: TASKS_TRANSLATION.CW_OPP },
	{ label: TASKS_TRANSLATION.REVENUE },
];

export const TASKS = [
	"TASKS DONE",
	"CALLS",
	"SMS",
	"EMAILS",
	"LINKEDIN",
	"DATA CHECK",
	"CUSTOM",
	"PEOPLE",
	"OPP",
	"CWOPP",
	"REVENUE",
	"WHATSAPP",
];
export const WEEK_DAYS = {
	Sunday: COMMON_TRANSLATION.SUNDAY,
	Monday: COMMON_TRANSLATION.MONDAY,
	Tuesday: COMMON_TRANSLATION.TUESDAY,
	Wednesday: COMMON_TRANSLATION.WEDNESDAY,
	Thursday: COMMON_TRANSLATION.THURSDAY,
	Friday: COMMON_TRANSLATION.FRIDAY,
	Saturday: COMMON_TRANSLATION.SATURDAY,
};
