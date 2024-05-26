import moment from "moment-timezone";
export const DEFAULT_FORM_DATA_FOR_LEAD = {
	Lead_Position__c: null,
	Lead_Role__c: null,
	Potential_licence_form__c: null,
	Landline_Operator_Engagement_End_Date__c: null,
	Landline_Operator__c: null,
	CRM_1__c: null,
	Helpdesk_1__c: null,
	Sales_Engagement_Platform__c: null,
	Identified_Project__c: false,
	Estimated_Project_Start_Date__c: null,
	Estimated_Project_Timing__c: null,
	Compelling_Event__c: null,
	Identified_Pain_Points__c: null,
	Identified_Needs__c: null,
	Identified_Pain_Points_Comments__c: null,
	Identified_Needs_Comments__c: null,
};
export const DEFAULT_FORM_DATA_FOR_ACCOUNT = {
	// introduction
	Meeting_Booked__c: false,
	Demo_During_Intro_Disco_Call__c: false,
	Date_du_Meeting__c: null,
	Effectif__c: null,
	of_Potential_Licenses__c: null,
	Potential_Department_s__c: null,
	// software
	CRM_1__c: null,
	CRM_2__c: null,
	CRM_Comments__c: "",
	Helpdesk_1__c: null,
	Helpdesk_2__c: null,
	Helpdesk_Comments__c: "",
	Video_Software_1__c: null,
	Video_Software_2__c: null,
	Video_Software_Comments__c: "",
	// operator
	VOIP__c: false,
	Landline_Operator__c: null,
	Mobile_Operator__c: null,
	Internet_Provider__c: null,
	Landline_Operator_Engagement_End_Date__c: null,
	Mobile_Operator_Engagement_End_Date__c: null,
	// account
	Final_Purchase_Decision: false, // custom field
	Decision_Maker__c: null,
	Resum_de_Qualification_du_Compte__c: "",
};

export const COMPANY_SIZE_OPTIONS = [
	{ label: "Inconnu", value: "Inconnu" },
	{ label: "1-10", value: "1-10" },
	{ label: "11-50", value: "11-50" },
	{ label: "51-200", value: "51-200" },
	{ label: "201-500", value: "201-500" },
	{ label: "501-1000", value: "501-1000" },
	{ label: "1001-5000", value: "1001-5000" },
	{ label: "5000-10 000", value: "5000-10 000" },
	{ label: "+10 000", value: "+10 000" },
];

export const CRM_OPTIONS = [
	{
		label: "None",
		value: "None",
	},
	{
		label: "Salesforce",
		value: "Salesforce",
	},
	{
		label: "SugarCRM",
		value: "SugarCRM",
	},
	{
		label: "Hubspot",
		value: "Hubspot",
	},
	{
		label: "Pipedrive",
		value: "Pipedrive",
	},
	{
		label: "Dynamics",
		value: "Dynamics",
	},
	{
		label: "Sellsy",
		value: "Sellsy",
	},
	{
		label: "Zoho CRM",
		value: "Zoho CRM",
	},
	{
		label: "Zapier",
		value: "Zapier",
	},
	{
		label: "Front",
		value: "Front",
	},
	{
		label: "Immofacile",
		value: "Immofacile",
	},
	{
		label: "Teamleader",
		value: "Teamleader",
	},
	{
		label: "Other",
		value: "Other",
	},
];

export const HELPDESK_OPTIONS = [
	{
		label: "None",
		value: "None",
	},
	{
		label: "Freshdesk",
		value: "Freshdesk",
	},
	{
		label: "Freshservice",
		value: "Freshservice",
	},
	{
		label: "Front",
		value: "Front",
	},
	{
		label: "Helpdesk",
		value: "Helpdesk",
	},
	{
		label: "Jira",
		value: "Jira",
	},
	{
		label: "Zendesk",
		value: "Zendesk",
	},
	{
		label: "Zoho Desk",
		value: "Zoho Desk",
	},
	{
		label: "Intercom",
		value: "Intercom",
	},
	{
		label: "Other",
		value: "Other",
	},
];

export const VIDEO_SOFT_OPTIONS = [
	{
		label: "Google Hangouts",
		value: "Google Hangouts",
	},
	{
		label: "Microsoft Teams",
		value: "Microsoft Teams",
	},
	{
		label: "Zoom",
		value: "Zoom",
	},
	{
		label: "Skype",
		value: "Skype",
	},
	{
		label: "Slack",
		value: "Slack",
	},
	{
		label: "Webex",
		value: "Webex",
	},
	{
		label: "Other",
		value: "Other",
	},
];

export const MOBILE_OPERATOR_OPTIONS = [
	{
		label: "None",
		value: "None",
	},
	{
		label: "I didn't get",
		value: "I didn't get",
	},
	{
		label: "3CX",
		value: "3CX",
	},
	{
		label: "Aircall",
		value: "Aircall",
	},
	{
		label: "Bouygues",
		value: "Bouygues",
	},
	{
		label: "Free",
		value: "Free",
	},
	{
		label: "Keyyo",
		value: "Keyyo",
	},
	{
		label: "Orange",
		value: "Orange",
	},
	{
		label: "Other",
		value: "Other",
	},
	{
		label: "OVH",
		value: "OVH",
	},
	{
		label: "SFR",
		value: "SFR",
	},
	{
		label: "Skype for Business",
		value: "Skype for Business",
	},
	{
		label: "Axialys",
		value: "Axialys",
	},
	{
		label: "Ringcentral",
		value: "Ringcentral",
	},
	{
		label: "Ottspot",
		value: "Ottspot",
	},
	{
		label: "Circleloop",
		value: "Circleloop",
	},
	{
		label: "Dialpad",
		value: "Dialpad",
	},
	{
		label: "8x8",
		value: "8x8",
	},
	{
		label: "Talkdesk",
		value: "Talkdesk",
	},
	{
		label: "Cloudeco",
		value: "Cloudeco",
	},
	{
		label: "A6Telecom",
		value: "A6Telecom",
	},
	{
		label: "Twilio",
		value: "Twilio",
	},
	{
		label: "Coriolis",
		value: "Coriolis",
	},
	{
		label: "Completel",
		value: "Completel",
	},
	{
		label: "Colt",
		value: "Colt",
	},
	{
		label: "Aveya",
		value: "Aveya",
	},
	{
		label: "Mitel",
		value: "Mitel",
	},
	{
		label: "BT",
		value: "BT",
	},
	{
		label: "Cloud Talk",
		value: "Cloud Talk",
	},
	{
		label: "Just Call",
		value: "Just Call",
	},
	{
		label: "Vonage",
		value: "Vonage",
	},
	{
		label: "bOnline",
		value: "bOnline",
	},
	{
		label: "Nextiva",
		value: "Nextiva",
	},
	{
		label: "Cloud Call",
		value: "Cloud Call",
	},
	{
		label: "OnOff",
		value: "OnOff",
	},
];

export const LANDLINE_OPERATOR_OPTIONS = MOBILE_OPERATOR_OPTIONS;

export const INTERNET_PROVIDER_OPTIONS = MOBILE_OPERATOR_OPTIONS;

export const POTENTIAL_DEPARTMENT_OPTIONS = [
	{
		label: "Sales",
		value: "Sales",
	},
	{
		label: "Support",
		value: "Support",
	},
	{
		label: "Customer Service",
		value: "Customer Service",
	},
	{
		label: "Other",
		value: "Other",
	},
];

export const LEAD_POSITION_OPTIONS = [
	{ label: "CEO", value: "CEO" },
	{ label: "COO", value: "COO" },
	{ label: "CTO", value: "CTO" },
	{ label: "ISD", value: "ISD" },
	{ label: "Sales Director", value: "Sales Director" },
	{ label: "Sales Manager", value: "Sales Manager" },
	{ label: "Sales representative", value: "Sales representative" },
	{ label: "Customer Service Director", value: "Customer Service Director" },
	{ label: "Customer Service Manager", value: "Customer Service Manager" },
	{ label: "Purchase Director", value: "Purchase Director" },
	{ label: "Sales Ops", value: "Sales Ops" },
	{ label: "Care Ops", value: "Care Ops" },
	{ label: "Other please specify", value: "Other please specify" },
];

export const LEAD_ROLE_OPTIONS = [
	{
		label: "Decision Maker",
		value: "Decision Maker",
	},
	{
		label: "Strong Prescriptor",
		value: "Strong Prescriptor",
	},
	{
		label: "Champion",
		value: "Champion",
	},
	{
		label: "Buyer",
		value: "Buyer",
	},
	{
		label: "To Convince",
		value: "To Convince",
	},
];

export const POTENTIAL_LICENCES_OPTIONS = [
	{
		label: "1-10",
		value: "1-10",
	},
	{
		label: "11-50",
		value: "11-50",
	},
	{
		label: "51-200",
		value: "51-200",
	},
	{
		label: "201-99999",
		value: "201-99999",
	},
];

export const SALES_ENGAGEMENT_OPTIONS = [
	{
		label: "Lemlist",
		value: "Lemlist",
	},
	{
		label: "Salesloft",
		value: "Salesloft",
	},
	{
		label: "Outreach",
		value: "Outreach",
	},
	{
		label: "Salesforce",
		value: "Salesforce",
	},
	{
		label: "Hubspot",
		value: "Hubspot",
	},
	{
		label: "Other",
		value: "Other",
	},
];

export const IDENTIFIED_PAIN_POINTS_OPTIONS = [
	{
		label: "Outgrown current system",
		value: "Outgrown current system",
	},
	{
		label: "Have bad customer retention",
		value: "Have bad customer retention",
	},
	{
		label: "No statistics on calls",
		value: "No statistics on calls",
	},
	{
		label: "No way to properly direct calls",
		value: "No way to properly direct calls",
	},
	{
		label: "No visibility over what their team do",
		value: "No visibility over what their team do",
	},
	{
		label: "No system for team to work from home",
		value: "No system for team to work from home",
	},
	{
		label: "Can’t do international calls",
		value: "Can’t do international calls",
	},
	{
		label: "Bugs or missing features in current system",
		value: "Bugs or missing features in current system",
	},
	{
		label: "Current system too expensive",
		value: "Current system too expensive",
	},
	{
		label: "Other please specify",
		value: "Other please specify",
	},
];

export const IDENTIFIED_NEEDS_OPTIONS = [
	{
		label: "Need for productivity",
		value: "Need for productivity",
	},
	{
		label: "Need for accountability",
		value: "Need for accountability",
	},
	{
		label: "Need for data",
		value: "Need for data",
	},
	{
		label: "Need to make international calls",
		value: "Need to make international calls",
	},
	{
		label: "Need to direct calls",
		value: "Need to direct calls",
	},
	{
		label: "Call double listening",
		value: "Call double listening",
	},
	{
		label: "CRM integration",
		value: "CRM integration",
	},
	{
		label: "Other please specify",
		value: "Other please specify",
	},
];

export const COMPELLING_EVENT_OPTIONS = [
	{
		label: "New business tool",
		value: "New business tool",
	},
	{
		label: "New organisation",
		value: "New organisation",
	},
	{
		label: "End of telco contract",
		value: "End of telco contract",
	},
	{
		label: "Activity peak",
		value: "Activity peak",
	},
];

export const PRODUCT_INTEREST_OPTIONS = [
	{
		label: "GC1000 series",
		value: "GC1000 series",
	},
	{
		label: "GC5000 series",
		value: "GC5000 series",
	},
	{
		label: "GC3000 series",
		value: "GC3000 series",
	},
];

export const PRIMARY_OPTIONS = [
	{
		label: "No",
		value: "No",
	},
	{
		label: "Yes",
		value: "Yes",
	},
];

export const defaultPauseStateFields = {
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
export const VIEWS = {
	PERSON: "person",
	ORGANIZATION: "organization",
};
export const REFERENCES = {
	[VIEWS.PERSON]: {},
	[VIEWS.ORGANIZATION]: {},
};
export const PHONE_OPTIONS = [
	{
		label: "Home",
		value: "home",
	},
	{
		label: "Work",
		value: "work",
	},
	{
		label: "Mobile",
		value: "mobile",
	},
	{
		label: "Other",
		value: "other",
	},
];
export const EMAIL_OPTIONS = [
	{
		label: "Home",
		value: "home",
	},
	{
		label: "Work",
		value: "work",
	},
	{
		label: "Other",
		value: "other",
	},
];
