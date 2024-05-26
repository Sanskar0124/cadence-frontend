import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";
export const CADENCE_COLORS = { 0: "#5B6BE1", 1: "#00B3A8", 2: "#037DFC", 3: "#FB7A96" };
export const BAR_CHART_COLORS = {
	0: "#5B6BE1",
	1: "#3EDCCF",
	2: "#037DFC",
	3: "#FB7A96",
};
export const CADENCE_BG_COLORS = {
	0: Colors.lightPurpleGradient,
	1: Colors.greenGradient,
	2: Colors.blueShade3,
	3: Colors.lightPinkshade,
};

export const TABS = {
	ALL: "all",
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

export const DUMMY_DATA = [
	{
		name: "FR_AE_Pistes_Premier_Contact_Directeur_Commercial",
		status: "In progress",
		no_of_users: 8,
		steps: 10,
		people: 1342,
		isSelected: true,
	},
	{
		name: "Prospection_Call_SDR",
		status: "Paused",
		no_of_users: 12,
		steps: 18,
		people: 2332,
		isSelected: false,
	},
	{
		name: "Contact_Directeur_Commercial",
		status: "Paused",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "FR_AE_Pistes_Premier_Contact_Directeur_Commercial",
		status: "Not started",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "Contact_Directeur_Commercial",
		status: "Not started",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "Contact_Directeur_Commercial",
		status: "Paused",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "FR_AE_Pistes_Premier_Contact_Directeur_Commercial",
		status: "In progress",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "Contact_Directeur_Commercial",
		status: "Not started",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "FR_AE_Pistes_Premier_Contact_Directeur_Commercial",
		status: "Paused",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
	{
		name: "Contact_Directeur_Commercial",
		status: "Paused",
		no_of_users: 8,
		steps: 12,
		people: 2322,
		isSelected: false,
	},
];

export const TASKS = [
	"total tasks",
	"tasks completed",
	"tasks skipped",
	"calls",
	"emails",
	"SMS",
	"linkedIn",
	"custom task",
	"data check",
	"callback",
	"whatsApp",
];
export const TASKS_OPTION = {
	total_tasks: "Total tasks",
	done_tasks: "Tasks completed",
	skipped_tasks: "Tasks skipped",
	calls: "Calls",
	emails: "Emails",
	sms: "SMS",
	callback: "Callback",
	linkedin: "LinkedIn",
	custom_task: "Custom task",
	data_check: "Data check",
	whatsapp: "WhatsApp",
};
export const LEADS = [
	"total leads",
	"leads left in Cadence",
	"disqualified leads",
	"converted leads",
	"demo meetings booked",
];
export const LEADS_OPTION = {
	total_leads: "Total leads",
	active_leads: "Active leads",
	disqualified_leads: "Disqualified leads",
	converted_leads: "Converted leads",
	demos_booked: "Demo booked",
};
export const TIMERANGEFILTER_OPTIONS = {
	today: COMMON_TRANSLATION.TODAY,
	yesterday: COMMON_TRANSLATION.YESTERDAY,
	this_week: COMMON_TRANSLATION.THIS_WEEK,
	last_week: COMMON_TRANSLATION.LAST_WEEK,
	this_month: COMMON_TRANSLATION.THIS_MONTH,
	last_month: COMMON_TRANSLATION.LAST_MONTH,
};
export const ABSOLUTE_VALUES = {
	ABSOLUTE: "absolute_values",
	PERCENTAGE: "percentage_values",
};
export const COMPARISON_TYPE = {
	VALUE_OVER_TIME: "value_over_time",
	TOTAL_VALUE: "total_value",
};
export const CALL_TASKS_VALUES = {
	TOTAL_CALL_TASK: "node_tasks",
	TOTAL_TASKS: "total_tasks",
};
export const CADENCE_STATUS = {
	in_progress: "In progress",
	paused: "Paused",
	not_started: "Not started",
};
export const EMPTY_STATE = [
	{ name: "1", count: 40 },
	{ name: "2", count: 40 },
	{ name: "3", count: 40 },
	{ name: "4", count: 40 },
];
