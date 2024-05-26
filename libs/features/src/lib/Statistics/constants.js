import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Cadence as CADENCE_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
	People as PEOPLE_TRANSLATIONS,
} from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";
import styles from "./components/Tooltip/Tooltip.module.scss";

export const COLORS = {
	call: "#36CDCF",
	callback: "#FFB12A",
	linkedin: "#0077B5",
	email: "#A282E8",
	datacheck: "#FFCC00",
	custom: "#FB7A96",
	message: "#037DFC",
	whatsapp: "#23d366",
};
export const INITIALCOLORSTATE = {
	call: "#E4E6EA",
	linkedin: "#F5F6F7",
	email: "#E4E6EA",
	datacheck: "#F5F6F7",
	custom: "#E4E6EA",
	message: "#F5F6F7",
	whatsapp: "#E4E6EA",
	callback: "#F5F6F7",
};
export const PIECHARTTASKCOLORS = {
	completed: "#5B6BE1",
	skipped: "rgba(247, 90, 146, 1)",
	pending: "#f5f6f7",
	converted: "#5eead4",
	disqualified: "#F77272",
	demobooked: "#5B6BE1",
};

export const PIECHARTEMPTYSTATE = {
	completed: "#E4E6EA",
	skipped: "#E4E6EA",
	pending: "#f5f6f7",
	converted: "#f5f6f7",
	disqualified: "#E4E6EA",
	demobooked: "#E4E6EA",
};

export const RADIALBARCOLORS = {
	Oppcreated: "#5B6BE1",
	Oppclosed: "#037DFC",
	Oppclosedwon: "#5eead4",
	Oppclosedlost: "#fb7185",
};
export const MODALCOLORS = {
	0: "#9F80E5",
	1: "#BDA9ED",
	2: "#D2C2F3",
	3: "#E7E0F8",
};
export const SKIPPEDPIECHARTCOLORS = {
	0: "#FF6486",
	1: "#FB7A96",
	2: "#FF8CA5",
	3: "#FC9CB1",
	4: "#FDA9BB",
	5: "#FDB6C6",
	6: "#FDC3D0",
	7: "#FED1DB",
	8: "#FEE0E7",
	9: "#FFEFF3",
};

export const SKIPPED_EMPTY_STATE_COLORS = {
	0: "#F5F6F7",
	1: "rgba(245, 246, 247, 0.9)",
	2: "rgba(245, 246, 247, 0.56)",
	3: "rgba(245, 246, 247, 0.32)",
	4: "rgba(245, 246, 247, 0.2)",
	5: "rgba(245, 246, 247, 0.1)",
	6: "rgba(245, 246, 247, 0.06)",
	7: "rgba(245, 246, 247, 0.05)",
	8: "rgba(245, 246, 247, 0.04)",
	9: "rgba(245, 246, 247, 0.03)",
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
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	data_check: TASKS_TRANSLATION.DATA_CHECK,
	cadence_custom: TASKS_TRANSLATION.CUSTOM,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
};

export const CADENCE_NAME = { label: CADENCE_TRANSLATION.CADENCE_NAME };
export const USER_NAME = { label: PEOPLE_TRANSLATIONS.USER_NAME };

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
	// { label: TASKS_TRANSLATION.DATA_CHECK },
	// { label: TASKS_TRANSLATION.CUSTOM },
	// { label: TASKS_TRANSLATION.PEOPEL },
	// { label: TASKS_TRANSLATION.OPP },
	// { label: TASKS_TRANSLATION.CW_OPP },
	// { label: TASKS_TRANSLATION.REVENUE },
];
export const TABLE_HEADERS = {
	totalTasks: TASKS_TRANSLATION.TOTAL_TASKS,
	doneTasks: TASKS_TRANSLATION.TASKS_DONE,
	pendingTasks: TASKS_TRANSLATION.PENDING_TASKS,
	skippedTasks: TASKS_TRANSLATION.SKIPPED_TASKS,
	calls: TASKS_TRANSLATION.CALLS,
	callback: TASKS_TRANSLATION.CALLBACK,
	automatedMails: TASKS_TRANSLATION.AUTOMATED_MAILS,
	semiAutomatedMails: TASKS_TRANSLATION.SEMIAUTOMATED_MAILS,
	disqualified: TASKS_TRANSLATION.DISQUALIFIED,
	converted: TASKS_TRANSLATION.CONVERTED,
	automatedSms: TASKS_TRANSLATION.AUTOMATED_SMS,
	semiAutomatedSms: TASKS_TRANSLATION.SEMIAUTOMATED_SMS,
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	customTask: TASKS_TRANSLATION.CUSTOM,
	demosBooked: TASKS_TRANSLATION.DEMOS_BOOKED,
	totalLeads: TASKS_TRANSLATION.TOTAL_LEADS,
	activeLeads: TASKS_TRANSLATION.ACTIVELEADS,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
	dataCheck: TASKS_TRANSLATION.DATA_CHECK,
	lateTasks: TASKS_TRANSLATION.LATE_TASKS,
	urgentTasks: TASKS_TRANSLATION.URGENT_TASKS,
};
export const TABLE_COLUMNS_OPP = [
	{ label: "CADENCE NAME" },
	{ label: "TOTAL LEADS" },
	{ label: "OPP CREATED" },
	{ label: "OPP CLOSED" },
	{ label: "CLOSED WON" },
	{ label: "CLOSED LOST" },
	{ label: "FORECAST" },
	{ label: "MRR" },
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
export const HEADER_DATA = {
	totalTasks: TASKS_TRANSLATION.TOTAL_TASKS,
	doneTasks: TASKS_TRANSLATION.TASKS_DONE,
	skippedTasks: COMMON_TRANSLATION.SKIPPED,
	calls: TASKS_TRANSLATION.CALLS,
	mails: STATISTICS_TRANSLATION.EMAIL_TASKS,
	lateTasks: TASKS_TRANSLATION.LATE_TASKS,
	urgentTasks: TASKS_TRANSLATION.URGENT_TASKS,
	disqualified: TASKS_TRANSLATION.DISQUALIFIED,
	converted: TASKS_TRANSLATION.CONVERTED,
	totalLeads: TASKS_TRANSLATION.TOTAL_LEADS,
	activeLeads: TASKS_TRANSLATION.ACTIVELEADS,
};
export const MODAL_COLUMNS = {
	totalTasks: TASKS_TRANSLATION.TOTAL_TASKS,
	doneTasks: TASKS_TRANSLATION.TASKS_DONE,
	pendingTasks: TASKS_TRANSLATION.PENDING_TASKS,
	skippedTasks: TASKS_TRANSLATION.SKIPPED_TASKS,
	calls: TASKS_TRANSLATION.CALLS,
	callback: TASKS_TRANSLATION.CALLBACK,
	automatedMails: TASKS_TRANSLATION.AUTOMATED_MAILS,
	semiAutomatedMails: TASKS_TRANSLATION.SEMIAUTOMATED_MAILS,
	disqualified: TASKS_TRANSLATION.DISQUALIFIED,
	converted: TASKS_TRANSLATION.CONVERTED,
	automatedSms: TASKS_TRANSLATION.AUTOMATED_SMS,
	semiAutomatedSms: TASKS_TRANSLATION.SEMIAUTOMATED_SMS,
	linkedin: TASKS_TRANSLATION.LINKEDIN,
	customTask: TASKS_TRANSLATION.CUSTOM_TASK,
	demosBooked: STATISTICS_TRANSLATION.DEMO_MEETINGS_BOOKED,
	totalLeads: STATISTICS_TRANSLATION.TOTAL_LEADS_IN_CADENCE,
	activeLeads: TASKS_TRANSLATION.ACTIVELEADS,
	whatsapp: TASKS_TRANSLATION.WHATSAPP,
	dataCheck: TASKS_TRANSLATION.DATA_CHECK,
	lateTasks: TASKS_TRANSLATION.LATE_TASKS,
	urgentTasks: TASKS_TRANSLATION.URGENT_TASKS,
};

export const HOUR_CONSTANTS = {
	0: "12AM-1AM",
	1: "1AM-2AM",
	2: "2AM-3AM",
	3: "3AM-4AM",
	4: "4AM-5AM",
	5: "5AM-6AM",
	6: "6AM-7AM",
	7: "7AM-8AM",
	8: "8AM-9AM",
	9: "9AM-10AM",
	10: "10AM-11AM",
	11: "11AM-12PM",
	12: "12PM-1PM",
	13: "1PM-2PM",
	14: "2PM-3PM",
	15: "3PM-4PM",
	16: "4PM-5PM",
	17: "5PM-6PM",
	18: "6PM-7PM",
	19: "7PM-8PM",
	20: "8PM-9PM",
	21: "9PM-10PM",
	22: "10PM-11PM",
	23: "11PM-12AM",
};

export const DEFAULT_COLUMNS = [
	{ label: "automatedSms", isVisible: true },
	{ label: "calls", isVisible: true },
	{ label: "doneTasks", isVisible: true },
	{ label: "pendingTasks", isVisible: true },
	{ label: "totalLeads", isVisible: true },
	{ label: "activeLeads", isVisible: true },
	{ label: "automatedMails", isVisible: false },
	{ label: "converted", isVisible: false },
	{ label: "customTask", isVisible: false },
	{ label: "dataCheck", isVisible: false },
	{ label: "demosBooked", isVisible: false },
	{ label: "disqualified", isVisible: false },
	{ label: "linkedin", isVisible: false },
	{ label: "semiAutomatedMails", isVisible: false },
	{ label: "semiAutomatedSms", isVisible: false },
	{ label: "skippedTasks", isVisible: false },
	{ label: "totalTasks", isVisible: false },
	{ label: "whatsapp", isVisible: false },
	{ label: "callback", isVisible: false },
	{ label: "lateTasks", isVisible: false },
	{ label: "urgentTasks", isVisible: false },
];

export const DEFAULT_COLUMNS1 = [
	{ label: "activeLeads", isVisible: false, order: 0 },
	{ label: "automatedMails", isVisible: false, order: 0 },
	{ label: "automatedSms", isVisible: true, order: 2 },
	{ label: "calls", isVisible: true, order: 3 },
	{ label: "callback", isVisible: true, order: 0 },
	{ label: "converted", isVisible: false, order: 0 },
	{ label: "customTask", isVisible: false, order: 0 },
	{ label: "dataCheck", isVisible: false, order: 0 },
	{ label: "demosBooked", isVisible: false, order: 0 },
	{ label: "disqualified", isVisible: false, order: 0 },
	{ label: "doneTasks", isVisible: true, order: 6 },
	{ label: "linkedin", isVisible: false, order: 0 },
	{ label: "pendingTasks", isVisible: true, order: 5 },
	{ label: "semiAutomatedMails", isVisible: true, order: 4 },
	{ label: "semiAutomatedSms", isVisible: false, order: 0 },
	{ label: "skippedTasks", isVisible: false, order: 0 },
	{ label: "totalLeads", isVisible: true, order: 1 },
	{ label: "totalTasks", isVisible: false, order: 0 },
	{ label: "whatsapp", isVisible: false, order: 0 },
	{ label: "lateTasks", isVisible: false, order: 0 },
	{ label: "urgentTasks", isVisible: false, order: 0 },
];
export const TABS = {
	USERS: "users",
	GROUPS: "groups",
};

export const CADENCE_TYPES = {
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

export const CADENCE_TOOLTIP = {
	title: "Cadences",
	content: (
		<p>
			Shows your <span style={{ color: "#36CDCF" }}>active</span>,
			<span style={{ color: "#FFB12A" }}> paused</span> and
			<span style={{ color: "#8193A8" }}> scheduled</span> cadences.
		</p>
	),
};

export const TASK_TOOLTIP = {
	title: "Tasks",
	content: (
		<>
			<p>
				Total tasks is the sum total of all tasks generated by currently active cadences.
			</p>
			<p>
				Distribution shows<span style={{ color: "#5B6BE1" }}> completed</span>,
				<span style={{ color: "#FB7A96" }}> skipped</span> and
				<span style={{ color: "#8193A8" }}> pending</span> tasks from total
			</p>
		</>
	),
};

export const LEAD_TOOLTIP = {
	title: "Leads",
	content: (
		<>
			<p>
				Total leads is the sum of leads that have been
				<span style={{ color: "#00B3A8" }}> converted </span> or
				<span style={{ color: "#F77272" }}> disqualified</span> and leads that have
				<span style={{ color: "#5B6BE1" }}> demos booked.</span>
			</p>
		</>
	),
};

export const PENDING_TASK_TOOLTIP = {
	title: "Pending tasks",
	content: (
		<>
			<p>
				Shows the total number of tasks not yet completed and includes tasks that are late
				and urgent
			</p>
			<p>
				<span style={{ color: "#00B3A8" }}>Call</span> includes call tasks
			</p>
			<p>
				<span style={{ color: "#ffb12a" }}>Callback</span> includes callback tasks
			</p>
			<p>
				<span style={{ color: "#A282E8" }}>Emails</span> includes semi-automated mail and
				semi-automated reply tasks
			</p>
			<p>
				<span style={{ color: "#037DFC" }}>SMS</span> includes only semi-automated SMS
				tasks
			</p>
			<p>
				<span style={{ color: "#FFB12A" }}>LinkedIn</span> includes LinkedIn connection
				request, profile view, interact with post and message tasks
			</p>
			<p>
				<span style={{ color: "#FB7A96" }}>Custom</span> includes only custom tasks
				irrespective of type
			</p>
			<p>
				<span style={{ color: "#FAD956" }}>Data check</span> includes only data check
				tasks
			</p>
			<p>
				<span style={{ color: "#25D366" }}>Whatsapp</span> includes only WhatsApp tasks
			</p>
		</>
	),
};
export const COMPLETED_TASK_TOOLTIP = {
	title: "Completed tasks",
	content: (
		<>
			<p>
				Shows the total number of tasks completed and skipped. Skipped tasks are not
				included in the completed task{" "}
			</p>
			<p>
				<span style={{ color: "#00B3A8" }}>Call</span> includes call tasks
			</p>
			<p>
				<span style={{ color: "#ffb12a" }}>Callback</span> includes callback tasks
			</p>
			<p>
				<span style={{ color: "#A282E8" }}>Emails</span> includes semi-automated mail and
				semi-automated reply tasks
			</p>
			<p>
				<span style={{ color: "#037DFC" }}>SMS</span> includes only semi-automated SMS
				tasks
			</p>
			<p>
				<span style={{ color: "#FFB12A" }}>LinkedIn </span>includes LinkedIn connection
				request, profile view, interact with post and message tasks{" "}
			</p>
			<p>
				<span style={{ color: "#FB7A96" }}>Custom</span> includes only custom tasks
				irrespective of type
			</p>
			<p>
				<span style={{ color: "#FAD956" }}>Data check</span> includes only data check
				tasks
			</p>
			<p>
				<span style={{ color: "#25D366" }}>Whatsapp</span> includes only WhatsApp tasks
			</p>
		</>
	),
};

export const SKIPPED_TASK_TOOLTIP = {
	title: "Skipped tasks",
	content: (
		<>
			<p>Shows the total number of tasks that have been skipped </p>
			<p>
				The <span style={{ color: "#5B6BE1" }}>pie chart</span> on the left shows the 10
				highest reasons for skipping a task
			</p>
			<p>
				The <span style={{ color: "#5B6BE1" }}>bar graph</span> on the right shows the
				distribution of skipped tasks
			</p>
		</>
	),
};
export const WEEK_DAYS = {
	Sunday: COMMON_TRANSLATION.SUNDAY,
	Monday: COMMON_TRANSLATION.MONDAY,
	Tuesday: COMMON_TRANSLATION.TUESDAY,
	Wednesday: COMMON_TRANSLATION.WEDNESDAY,
	Thursday: COMMON_TRANSLATION.THURSDAY,
	Friday: COMMON_TRANSLATION.FRIDAY,
	Saturday: COMMON_TRANSLATION.SATURDAY,
};

export const BUTTONS = [
	{
		label: "Cadence",
		value: "cadence",
	},
	{
		label: "Users",
		value: "users",
	},
];
