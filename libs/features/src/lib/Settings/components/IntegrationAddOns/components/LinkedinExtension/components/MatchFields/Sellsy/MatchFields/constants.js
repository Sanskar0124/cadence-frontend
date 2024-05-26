export const VIEWS = {
	CONTACT: "contact",
	COMPANY: "company",
	CUSTOM_OBJECTS: "custom_objects",
};
export const CUSTOM_OBJECT = {
	[VIEWS.CONTACT]: [],
};

//hovers are the uids from 3types of below constants
export const QUICKVIEW_FIELDS = {
	INTEGRATION_STATUS: {
		value: "qvf_integration_status",
		hovers: ["__integration_status"],
		hoversFor: [VIEWS.COMPANY],
	},
	LINKEDIN_URL: {
		value: "qvf_linkedin_url",
		hovers: ["__linkedin_url"],
		hoversFor: [VIEWS.CONTACT],
	},
	COMPANY_URL: {
		value: "qvf_company_url",
		hovers: ["__company_linkedin_url"],
		hoversFor: [VIEWS.COMPANY],
	},
	FIRST_NAME: {
		value: "qvf_first_name",
		hovers: ["__first_name"],
		hoversFor: [VIEWS.CONTACT],
	},
	LAST_NAME: {
		value: "qvf_last_name",
		hovers: ["__last_name"],
		hoversFor: [VIEWS.CONTACT],
	},
	JOB_POSITION: {
		value: "qvf_job_position",
		hovers: ["__job_position"],
		hoversFor: [VIEWS.CONTACT],
	},
	COMPANY_NAME: {
		value: "qvf_company_name",
		hovers: ["__company_name"],
		hoversFor: [VIEWS.COMPANY],
	},
	COMPANY_SIZE: {
		value: "qvf_company_size",
		hovers: ["__company_size"],
		hoversFor: [VIEWS.COMPANY],
	},
	COMPANY_PHONE_NUMBER: {
		value: "qvf_company_phone_number",
		hovers: ["__company_phone_number"],
		hoversFor: [VIEWS.COMPANY],
	},
	ZIPCODE: {
		value: "qvf_zipcode",
		hovers: ["__zipcode"],
		hoversFor: [VIEWS.COMPANY],
	},
	COUNTRY: {
		value: "qvf_country",
		hovers: ["__country"],
		hoversFor: [VIEWS.COMPANY],
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
		hoversFor: [VIEWS.LEAD, VIEWS.CONTACT],
	},
};

//parseValues are used for implementing final construction of object before sending
//hovers is used to hover in quickView

const CONTACT_FIELDS = [
	{
		uid: "__first_name",
		label: "First Name",
		value: { name: "" },
		backendField: "first_name",
		hovers: [QUICKVIEW_FIELDS.FIRST_NAME.value],
		isArray: false,
		type: ["string"],
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
		uid: "__p_phone_number",
		label: "Other Phone 1",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.P_PHONE_NUMBER.value],
		isArray: true,
		type: ["string", "number"],
		index: 0,
	},
	{
		uid: "__a_phone_number1",
		label: "Other Phone 2",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER1.value],
		isArray: true,
		type: ["string", "number"],
		index: 1,
	},
	{
		uid: "__a_phone_number2",
		label: "Other Phone 3",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER2.value],
		isArray: true,
		type: ["string", "number"],
		index: 2,
	},
	{
		uid: "__a_phone_number3",
		label: "Other Phone 4",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER3.value],
		isArray: true,
		type: ["string", "number"],
		index: 3,
	},
	{
		uid: "__a_phone_number4",
		label: "Other Phone 5",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.A_PHONE_NUMBER4.value],
		isArray: true,
		type: ["string", "number"],
		index: 4,
	},
	{
		uid: "__p_email",
		label: "Alternative Email 1",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.P_EMAIL.value],
		isArray: true,
		type: ["string"],
		index: 0,
	},
	{
		uid: "__a_email1",
		label: "Alternative Email 2",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL1.value],
		isArray: true,
		index: 1,
		type: ["string"],
	},
	{
		uid: "__a_email2",
		label: "Alternative Email 3",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL2.value],
		isArray: true,
		index: 2,
		type: ["string"],
	},
	{
		uid: "__a_email3",
		label: "Alternative Email 4",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL3.value],
		isArray: true,
		index: 3,
		type: ["string"],
	},
	{
		uid: "__a_email4",
		label: "Alternative Email 5",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.A_EMAIL4.value],
		isArray: true,
		index: 4,
		type: ["string"],
	},
];

const COMPANY_FIELDS = [
	{
		uid: "__company_name",
		label: "Company Name",
		value: { name: "" },
		backendField: "name",
		hovers: [QUICKVIEW_FIELDS.COMPANY_NAME.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__company_phone_number",
		label: "Company Phone Number",
		value: { name: "" },
		backendField: "phone_number",
		hovers: [QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER.value],
		isArray: false,
		type: ["string", "number"],
	},
	{
		uid: "__company_size",
		label: "Company Size",
		value: { name: "" },
		backendField: "size",
		hovers: [QUICKVIEW_FIELDS.COMPANY_SIZE.value],
		isArray: false,
		type: ["string"],
	},
	{
		uid: "__company_linkedin_url",
		label: "Company Website",
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
		backendField: "zipcode",
		hovers: [QUICKVIEW_FIELDS.ZIPCODE.value],
		isArray: false,
		type: ["integer"],
	},
	{
		uid: "__country",
		label: "Country",
		value: { name: "" },
		backendField: "country",
		hovers: [QUICKVIEW_FIELDS.COUNTRY.value],
		isArray: false,
		type: ["string"],
	},
];

export const RINGOVER_FIELDS = {
	[VIEWS.CONTACT]: CONTACT_FIELDS,
	[VIEWS.COMPANY]: COMPANY_FIELDS,
};

export const DEFAULT_IT_FIELDS_STRUCT = {
	[VIEWS.CONTACT]: [],
	[VIEWS.COMPANY]: [],
};

export const DEFAULT_TOPVIEW_DATA = {
	[VIEWS.CONTACT]: 0,
	[VIEWS.COMPANY]: 0,
};

export const CUSTOM_FIELDS_HEADING = {
	[VIEWS.CONTACT]: 100,
	[VIEWS.COMPANY]: 6,
};

export const DEFAULT_VALUES = {
	[VIEWS.CONTACT]: {
		__first_name: "first_name",
		__last_name: "last_name",
		__job_position: "position",
		__p_phone_number: "phone_number",
		__p_email: "email",
	},
	[VIEWS.COMPANY]: {
		__company_name: "name",
		__company_phone_number: "phone_number",
		__company_url: "website",
		__zipcode: "postal_code",
		__country: "country",
	},
};
