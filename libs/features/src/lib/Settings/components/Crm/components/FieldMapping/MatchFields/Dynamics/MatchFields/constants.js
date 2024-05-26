import {
	Common as COMMON_TRANSLATION,
	Email as EMAIL_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
	CUSTOM_OBJECTS: "custom_objects",
};

export const CUSTOM_OBJECT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
};

//hovers are the uids from 3types of below constants
export const QUICKVIEW_FIELDS = {
	INTEGRATION_STATUS: {
		value: "qvf_integration_status",
		hovers: ["__integration_status"],
		hoversFor: [VIEWS.LEAD, VIEWS.ACCOUNT],
	},
	LINKEDIN_URL: {
		value: "qvf_linkedin_url",
		hovers: ["__linkedin_url"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	COMPANY_URL: {
		value: "qvf_company_url",
		hovers: ["__company_url"],
		hoversFor: [VIEWS.ACCOUNT, VIEWS.LEAD],
	},
	// ZOOM_INFO: {
	// 	value: "qvf_zoom_info",
	// 	hovers: ["__zoom_info"],
	// 	hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	// },
	FIRST_NAME: {
		value: "qvf_first_name",
		hovers: ["__first_name"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	LAST_NAME: {
		value: "qvf_last_name",
		hovers: ["__last_name"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	JOB_POSITION: {
		value: "qvf_job_position",
		hovers: ["__job_position"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	COMPANY_NAME: {
		value: "qvf_company_name",
		hovers: ["__lead_company_name", "__company_name"],
		hoversFor: [VIEWS.ACCOUNT, VIEWS.LEAD],
	},
	COMPANY_SIZE: {
		value: "qvf_company_size",
		hovers: ["__company_size"],
		hoversFor: [VIEWS.ACCOUNT, VIEWS.LEAD],
	},
	COMPANY_PHONE_NUMBER: {
		value: "qvf_company_phone_number",
		hovers: ["__company_phone_number"],
		hoversFor: [VIEWS.LEAD, VIEWS.ACCOUNT],
	},
	ZIPCODE: {
		value: "qvf_zipcode",
		hovers: ["__zipcode"],
		hoversFor: [VIEWS.ACCOUNT, VIEWS.LEAD],
	},
	COUNTRY: {
		value: "qvf_country",
		hovers: ["__country"],
		hoversFor: [VIEWS.ACCOUNT, VIEWS.LEAD],
	},
	P_EMAIL: {
		value: "qvf_p_email",
		hovers: ["__p_email"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_EMAIL1: {
		value: "qvf_a_email1",
		hovers: ["__a_email1"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_EMAIL2: {
		value: "qvf_a_email2",
		hovers: ["__a_email2"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_EMAIL3: {
		value: "qvf_a_email3",
		hovers: ["__a_email3"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_EMAIL4: {
		value: "qvf_a_email4",
		hovers: ["__a_email4"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	P_PHONE_NUMBER: {
		value: "qvf_p_phone_number",
		hovers: ["__p_phone_number"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_PHONE_NUMBER1: {
		value: "qvf_a_phone_number1",
		hovers: ["__a_phone_number1"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_PHONE_NUMBER2: {
		value: "qvf_a_phone_number2",
		hovers: ["__a_phone_number2"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_PHONE_NUMBER3: {
		value: "qvf_a_phone_number3",
		hovers: ["__a_phone_number3"],
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
	A_PHONE_NUMBER4: {
		value: "qvf_a_phone_number4",
		hovers: ["__a_phone_number4"],
		hoversFor: [VIEWS.CONTACT, VIEWS.LEAD],
	},
};

//parseValues are used for implementing final construction of object before sending
//hovers is used to hover in quickView

const LEAD_FIELDS = [
	{
		uid: "__first_name",
		label: "First Name",
		// label: COMMON_TRANSLATION.FIRST_NAME,
		value: { name: "" },
		backendField: "first_name",
		hovers: [QUICKVIEW_FIELDS.FIRST_NAME.value],
		isArray: false,
		type: ["string"],
		required: true,
	},
	{
		uid: "__last_name",
		label: "Last Name",
		value: { name: "" },
		backendField: "last_name",
		hovers: [QUICKVIEW_FIELDS.LAST_NAME.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__linkedin_url",
		label: "Linkedin URL",
		value: { name: "" },
		backendField: "linkedin_url",
		hovers: [QUICKVIEW_FIELDS.LINKEDIN_URL.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__job_position",
		label: "Job position",
		value: { name: "" },
		backendField: "job_position",
		hovers: [QUICKVIEW_FIELDS.JOB_POSITION.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__lead_company_name",
		label: "Company Name",
		value: { name: "" },
		backendField: "account",
		hovers: [QUICKVIEW_FIELDS.COMPANY_NAME.value],
		isArray: false,
		type: ["string"],
		required: true,
	},
	{
		uid: "__company_phone_number",
		label: "Company Phone",
		value: { name: "" },
		backendField: "company_phone_number",
		hovers: [QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER.value],
		isArray: false,
		type: ["string"],
		index: 2,
	},
	{
		uid: "__company_size",
		label: "Company Size",
		value: { name: "" },
		backendField: "size",
		hovers: [QUICKVIEW_FIELDS.COMPANY_SIZE.value],
		isArray: false,
		type: ["integer", "picklist"],
	},
	{
		uid: "__company_url",
		label: "Company URL",
		value: { name: "" },
		backendField: "url",
		hovers: [QUICKVIEW_FIELDS.COMPANY_URL.value],
		type: ["string"],
		isArray: false,
	},
	{
		uid: "__zipcode",
		label: "Zipcode",
		value: { name: "" },
		backendField: "zip_code",
		hovers: [QUICKVIEW_FIELDS.ZIPCODE.value],
		type: ["string"],
		isArray: false,
	},
	{
		uid: "__country",
		label: "Country",
		value: { name: "" },
		backendField: "country",
		hovers: [QUICKVIEW_FIELDS.COUNTRY.value],
		type: ["string"],
		isArray: false,
	},
	// {
	// 	uid: "__zoom_info",
	// 	label: "Zoom Info",
	// 	value: { name: "" },
	// 	backendField: "zoom_info",
	// 	hovers: [QUICKVIEW_FIELDS.ZOOM_INFO.value],
	// 	type: ["string"],
	// 	isArray: false,
	// },
	{
		uid: "__p_phone_number",
		label: "Primary Phone Number",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.P_PHONE_NUMBER.value],
		isArray: true,
		type: ["string"],
		index: 0,
	},
	{
		uid: "__a_phone_number1",
		label: "Other Phone 1",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER1.value],
		isArray: true,
		type: ["string"],
		index: 1,
	},
	{
		uid: "__a_phone_number2",
		label: "Other Phone 2",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER2.value],
		isArray: true,
		type: ["string"],
		index: 2,
	},
	{
		uid: "__a_phone_number3",
		label: "Other Phone 3",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER3.value],
		isArray: true,
		type: ["string"],
		index: 3,
	},
	{
		uid: "__a_phone_number4",
		label: "Other Phone 4",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER4.value],
		isArray: true,
		type: ["string"],
		index: 4,
	},
	{
		uid: "__p_email",
		label: "Primary Email",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.P_EMAIL.value],
		isArray: true,
		type: ["string"],
		index: 0,
	},
	{
		uid: "__a_email1",
		label: "Alternative Email 1",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL1.value],
		isArray: true,
		index: 1,
		type: ["string"],
	},
	{
		uid: "__a_email2",
		label: "Alternative Email 2",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL2.value],
		isArray: true,
		index: 2,
		type: ["string"],
	},
	{
		uid: "__a_email3",
		label: "Alternative Email 3",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL3.value],
		isArray: true,
		index: 3,
		type: ["string"],
	},
	{
		uid: "__a_email4",
		label: "Alternative Email 4",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL4.value],
		isArray: true,
		index: 4,
		type: ["string"],
	},
	// {
	// 	uid: "__integration_status",
	// 	label: "Integration Status",
	// 	value: {
	// 		name: "",
	// 	},
	// 	backendField: "integration_status",
	// 	hovers: [QUICKVIEW_FIELDS.INTEGRATION_STATUS.value],
	// 	isArray: false,
	// 	type: ["picklist"],
	// },
	// {
	// 	uid: "__disqualification_reasons",
	// 	label: "Disqualify Reasons",
	// 	picklist_values: [],
	// 	value: { name: "DisqualificationReason", picklist_values: [] },
	// 	backendField: "disqualification_reason",
	// 	hovers: [],
	// 	isArray: false,
	// 	type: ["picklist"],
	// },
	// {
	// 	uid: "__variable1",
	// 	label: "Variable 1",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 0,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable2",
	// 	label: "Variable 2",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 1,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable3",
	// 	label: "Variable 3",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 2,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable4",
	// 	label: "Variable 4",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 3,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable5",
	// 	label: "Variable 5",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 4,
	// 	type: ["string", "picklist"],
	// },
];

const CONTACT_FIELDS = [
	{
		uid: "__first_name",
		label: "First Name",
		value: { name: "" },
		backendField: "first_name",
		hovers: [QUICKVIEW_FIELDS.FIRST_NAME.value],
		isArray: false,
		type: ["string"],
		required: true,
	},
	{
		uid: "__last_name",
		label: "Last Name",
		value: { name: "" },
		backendField: "last_name",
		hovers: [QUICKVIEW_FIELDS.LAST_NAME.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__linkedin_url",
		label: "Linkedin URL",
		value: { name: "" },
		backendField: "linkedin_url",
		hovers: [QUICKVIEW_FIELDS.LINKEDIN_URL.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__job_position",
		label: "Job position",
		value: { name: "" },
		backendField: "job_position",
		hovers: [QUICKVIEW_FIELDS.JOB_POSITION.value],
		isArray: false,
		type: ["string"],
	},
	// {
	// 	uid: "__zoom_info",
	// 	label: "Zoom Info",
	// 	value: { name: "" },
	// 	backendField: "zoom_info",
	// 	hovers: [QUICKVIEW_FIELDS.ZOOM_INFO.value],
	// 	type: ["string"],
	// 	isArray: false,
	// },
	{
		uid: "__p_phone_number",
		label: "Primary Phone Number",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.P_PHONE_NUMBER.value],
		isArray: true,
		index: 0,
		type: ["string"],
	},
	{
		uid: "__a_phone_number1",
		label: "Other Phone 1",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER1.value],
		isArray: true,
		index: 1,
		type: ["string"],
	},
	{
		uid: "__a_phone_number2",
		label: "Other Phone 2",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER2.value],
		isArray: true,
		index: 2,
		type: ["string"],
	},
	{
		uid: "__a_phone_number3",
		label: "Other Phone 3",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER3.value],
		isArray: true,
		index: 3,
		type: ["string"],
	},
	{
		uid: "__a_phone_number4",
		label: "Other Phone 4",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER4.value],
		isArray: true,
		index: 4,
		type: ["string"],
	},
	{
		uid: "__p_email",
		label: "Primary Email",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.P_EMAIL.value],
		isArray: true,
		index: 0,
		type: ["string"],
	},
	{
		uid: "__a_email1",
		label: "Alternative Email 1",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL1.value],
		isArray: true,
		index: 1,
		type: ["string"],
	},
	{
		uid: "__a_email2",
		label: "Alternative Email 2",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL2.value],
		isArray: true,
		index: 2,
		type: ["string"],
	},
	{
		uid: "__a_email3",
		label: "Alternative Email 3",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL3.value],
		isArray: true,
		index: 3,
		type: ["string"],
	},
	{
		uid: "__a_email4",
		label: "Alternative Email 4",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL4.value],
		isArray: true,
		index: 4,
		type: ["string"],
	},
	// {
	// 	uid: "__variable1",
	// 	label: "Variable 1",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 0,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable2",
	// 	label: "Variable 2",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 1,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable3",
	// 	label: "Variable 3",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 2,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable4",
	// 	label: "Variable 4",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 3,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable5",
	// 	label: "Variable 5",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 4,
	// 	type: ["string", "picklist"],
	// },
];

const ACCOUNT_FIELDS = [
	{
		uid: "__company_name",
		label: "Company Name",
		value: { name: "" },
		backendField: "name",
		hovers: [QUICKVIEW_FIELDS.COMPANY_NAME.value],
		isArray: false,
		type: ["string"],
		required: true,
	},
	{
		uid: "__company_phone_number",
		label: "Company Phone",
		value: { name: "" },
		backendField: "phone_number",
		hovers: [QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__company_size",
		label: "Company Size",
		value: { name: "" },
		backendField: "size",
		hovers: [QUICKVIEW_FIELDS.COMPANY_SIZE.value],
		isArray: false,
		type: ["integer", "picklist"],
	},
	{
		uid: "__company_url",
		label: "Company URL",
		value: { name: "" },
		backendField: "url",
		hovers: [QUICKVIEW_FIELDS.COMPANY_URL.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__zipcode",
		label: "Zipcode",
		value: { name: "" },
		backendField: "zip_code",
		hovers: [QUICKVIEW_FIELDS.ZIPCODE.value],
		type: ["string"],
		isArray: false,
	},
	{
		uid: "__country",
		label: "Country",
		value: { name: "" },
		backendField: "country",
		hovers: [QUICKVIEW_FIELDS.COUNTRY.value],
		type: ["string"],
		isArray: false,
	},
	// {
	// 	uid: "__integration_status",
	// 	label: "Integration Status",
	// 	value: {
	// 		name: "",
	// 		picklist_values: [],
	// 		converted: {},
	// 		disqualified: {},
	// 	},
	// 	backendField: "integration_status",
	// 	hovers: [QUICKVIEW_FIELDS.INTEGRATION_STATUS.value],
	// 	isArray: false,
	// 	type: ["picklist"],
	// },
	// {
	// 	uid: "__disqualification_reasons",
	// 	label: "Disqualify Reasons",
	// 	value: { name: "DisqualificationReason", picklist_values: [] },
	// 	backendField: "disqualification_reason",
	// 	hovers: [],
	// 	isArray: false,
	// 	type: ["picklist"],
	// },
	// {
	// 	uid: "__variable1",
	// 	label: "Variable 1",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 0,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable2",
	// 	label: "Variable 2",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 1,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable3",
	// 	label: "Variable 3",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 2,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable4",
	// 	label: "Variable 4",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 3,
	// 	type: ["string", "picklist"],
	// },
	// {
	// 	uid: "__variable5",
	// 	label: "Variable 5",
	// 	value: { name: "", label: "" },
	// 	backendField: "variables",
	// 	hovers: [],
	// 	isArray: true,
	// 	index: 4,
	// 	type: ["string", "picklist"],
	// },
];

export const RINGOVER_FIELDS = {
	[VIEWS.LEAD]: LEAD_FIELDS,
	[VIEWS.CONTACT]: CONTACT_FIELDS,
	[VIEWS.ACCOUNT]: ACCOUNT_FIELDS,
};

export const DEFAULT_SF_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
	[VIEWS.ACCOUNT]: [],
};

export const DEFAULT_TOPVIEW_DATA = {
	[VIEWS.LEAD]: 0,
	[VIEWS.CONTACT]: 0,
	[VIEWS.ACCOUNT]: 0,
};

export const CUSTOM_VARIABLES_HEADING = {
	[VIEWS.LEAD]: 20,
	[VIEWS.CONTACT]: 14,
	[VIEWS.ACCOUNT]: 7,
};

export const CUSTOM_FIELDS_HEADING = {
	[VIEWS.LEAD]: 19,
	[VIEWS.CONTACT]: 102,
	[VIEWS.ACCOUNT]: 6,
};

export const DEFAULT_VALUES = {
	[VIEWS.LEAD]: {
		__first_name: "firstname",
		__last_name: "lastname",
		__job_position: "jobtitle",
		__lead_company_name: "companyname",
		__company_url: "websiteurl",
		__zipcode: "address1_postalcode",
		__country: "address1_country",
		__p_phone_number: "mobilephone",
		__a_phone_number1: "telephone2",
		__p_email: "emailaddress1",
		__company_size: "numberofemployees",
	},
	[VIEWS.ACCOUNT]: {
		__company_name: "name",
		__company_phone_number: "address1_telephone3",
		__company_url: "websiteurl",
		__zipcode: "address1_postalcode",
		__country: "address1_country",
		__company_size: "numberofemployees",
	},
	[VIEWS.CONTACT]: {
		__first_name: "firstname",
		__last_name: "lastname",
		__job_position: "jobtitle",
		__p_phone_number: "telephone1",
		__p_email: "emailaddress1",
	},
};

export const MAPPING_FIELDS = {
	"First Name": COMMON_TRANSLATION.FIRST_NAME,
	"Last Name": COMMON_TRANSLATION.LAST_NAME,
	"Linkedin URL": COMMON_TRANSLATION.LINKEDIN_URL,
	"Job position": COMMON_TRANSLATION.JOB_POSITION,
	"Company Name": COMMON_TRANSLATION.COMPANY_NAME,
	"Company Phone": COMMON_TRANSLATION.COMPANY_PHONE,
	"Company Size": TASKS_TRANSLATION.COMPANY_SIZE,
	"Company URL": TASKS_TRANSLATION.COMPANY_URL,
	Zipcode: COMMON_TRANSLATION.ZIPCODE,
	Country: COMMON_TRANSLATION.COUNTRY,
	"Primary Phone Number": COMMON_TRANSLATION.PRIMARY_PHONE_NUMBER,
	// "Mobile Phone": COMMON_TRANSLATION.MOBILE_PHONE,
	"Other Phone 1": COMMON_TRANSLATION.OTHER_PHONE_1,
	"Other Phone 2": COMMON_TRANSLATION.OTHER_PHONE_2,
	"Other Phone 3": COMMON_TRANSLATION.OTHER_PHONE_3,
	"Other Phone 4": COMMON_TRANSLATION.OTHER_PHONE_4,
	"Primary Email": EMAIL_TRANSLATION.PRIMARY_EMAIL,
	"Alternative Email 1": COMMON_TRANSLATION.ALTERNATIVE_MAIL_1,
	"Alternative Email 2": COMMON_TRANSLATION.ALTERNATIVE_MAIL_2,
	"Alternative Email 3": COMMON_TRANSLATION.ALTERNATIVE_MAIL_3,
	"Alternative Email 4": COMMON_TRANSLATION.ALTERNATIVE_MAIL_4,
	// "Integration Status": COMMON_TRANSLATION.INTEGRATION_STATUS,
	// "Disqualify Reasons": COMMON_TRANSLATION.DISQUALIFY_REASONS,
	// "Variable 1": COMMON_TRANSLATION.VARIABLE_1,
	// "Variable 2": COMMON_TRANSLATION.VARIABLE_2,
	// "Variable 3": COMMON_TRANSLATION.VARIABLE_3,
	// "Variable 4": COMMON_TRANSLATION.VARIABLE_4,
	// "Variable 5": COMMON_TRANSLATION.VARIABLE_5,
};
