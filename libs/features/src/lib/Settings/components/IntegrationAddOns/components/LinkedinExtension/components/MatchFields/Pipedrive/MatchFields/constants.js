export const VIEWS = {
	PERSON: "person",
	ORGANIZATION: "organization",
	CUSTOM_OBJECTS: "custom_objects",
};
export const CUSTOM_OBJECT = {
	[VIEWS.PERSON]: [],
};

//hovers are the uids from 3types of below constants
export const QUICKVIEW_FIELDS = {
	INTEGRATION_STATUS: {
		value: "qvf_integration_status",
		hovers: ["__integration_status"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	LINKEDIN_URL: {
		value: "qvf_linkedin_url",
		hovers: ["__linkedin_url"],
		hoversFor: [VIEWS.PERSON],
	},
	COMPANY_URL: {
		value: "qvf_company_url",
		hovers: ["__company_linkedin_url"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	FIRST_NAME: {
		value: "qvf_first_name",
		hovers: ["__first_name"],
		hoversFor: [VIEWS.PERSON],
	},
	LAST_NAME: {
		value: "qvf_last_name",
		hovers: ["__last_name"],
		hoversFor: [VIEWS.PERSON],
	},
	JOB_POSITION: {
		value: "qvf_job_position",
		hovers: ["__job_position"],
		hoversFor: [VIEWS.PERSON],
	},
	COMPANY_NAME: {
		value: "qvf_company_name",
		hovers: ["__company_name"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	COMPANY_SIZE: {
		value: "qvf_company_size",
		hovers: ["__company_size"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	COMPANY_PHONE_NUMBER: {
		value: "qvf_company_phone_number",
		hovers: ["__company_phone_number"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	ZIPCODE: {
		value: "qvf_zipcode",
		hovers: ["__zipcode"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	COUNTRY: {
		value: "qvf_country",
		hovers: ["__country"],
		hoversFor: [VIEWS.ORGANIZATION],
	},
	// ZOOM_INFO: {
	// 	value: "qvf_zoom_info",
	// 	hovers: ["__zoom_info"],
	// 	hoversFor: [VIEWS.PERSON],
	// },
	P_EMAIL: {
		value: "qvf_p_email",
		hovers: ["__p_email"],
		hoversFor: [VIEWS.PERSON],
	},
	P_PHONE_NUMBER: {
		value: "qvf_p_phone_number",
		hovers: ["__p_phone_number"],
		hoversFor: [VIEWS.PERSON],
	},
};

//parseValues are used for implementing final construction of object before sending
//hovers is used to hover in quickView

const PERSON_FIELDS = [
	{
		uid: "__first_name",
		label: "First Name",
		value: { name: "" },
		backendField: "first_name",
		hovers: [QUICKVIEW_FIELDS.FIRST_NAME.value],
		isArray: false,
		type: ["varchar", "double", "int"],
	},
	{
		uid: "__last_name",
		label: "Last Name",
		value: { name: "" },
		backendField: "last_name",
		hovers: [QUICKVIEW_FIELDS.LAST_NAME.value],
		isArray: false,
		type: ["varchar", "double", "int"],
	},
	{
		uid: "__linkedin_url",
		label: "Linkedin URL",
		value: { name: "" },
		backendField: "linkedin_url",
		hovers: [QUICKVIEW_FIELDS.LINKEDIN_URL.value],
		isArray: false,
		type: ["varchar"],
	},
	{
		uid: "__job_position",
		label: "Job position",
		value: { name: "" },
		backendField: "job_position",
		hovers: [QUICKVIEW_FIELDS.JOB_POSITION.value],
		isArray: false,
		type: ["varchar"],
	},
	// {
	// 	uid: "__zoom_info",
	// 	label: "Zoom Info",
	// 	value: { name: "" },
	// 	backendField: "zoom_info",
	// 	hovers: [QUICKVIEW_FIELDS.ZOOM_INFO.value],
	// 	type: "any",
	// 	isArray: false,
	// },
	{
		uid: "__p_phone_number",
		label: "Phone Number",
		value: { name: "" },
		backendField: "phone_numbers",
		hovers: [QUICKVIEW_FIELDS.P_PHONE_NUMBER.value],
		type: ["varchar", "double", "phone", "int"],
	},
	{
		uid: "__p_email",
		label: "Email",
		value: { name: "" },
		backendField: "emails",
		hovers: [QUICKVIEW_FIELDS.P_EMAIL.value],
		type: ["varchar", "double", "int"],
	},
];

const ORGANIZATION_FIELDS = [
	{
		uid: "__company_name",
		label: "Company Name",
		value: { name: "" },
		backendField: "name",
		hovers: [QUICKVIEW_FIELDS.COMPANY_NAME.value],
		isArray: false,
		type: ["varchar", "double", "int"],
	},
	{
		uid: "__company_phone_number",
		label: "Company Phone Number",
		value: { name: "" },
		backendField: "phone_number",
		hovers: [QUICKVIEW_FIELDS.COMPANY_PHONE_NUMBER.value],
		isArray: false,
		type: ["varchar", "double", "int", "phone"],
	},
	{
		uid: "__company_size",
		label: "Company Size",
		value: { name: "" },
		backendField: "size",
		hovers: [QUICKVIEW_FIELDS.COMPANY_SIZE.value],
		isArray: false,
		type: ["enum"],
	},
	{
		uid: "__company_linkedin_url",
		label: "Company Linkedin URL",
		value: { name: "" },
		backendField: "linkedin_url",
		hovers: [QUICKVIEW_FIELDS.COMPANY_URL.value],
		isArray: false,
		type: ["varchar"],
	},
	{
		uid: "__zipcode",
		label: "Zipcode",
		value: { name: "" },
		backendField: "zip_code",
		hovers: [QUICKVIEW_FIELDS.ZIPCODE.value],
		type: ["varchar", "double", "int"],
		isArray: false,
	},
	{
		uid: "__country",
		label: "Country",
		value: { name: "" },
		backendField: "country",
		hovers: [QUICKVIEW_FIELDS.COUNTRY.value],
		type: ["varchar"],
		isArray: false,
	},
];

export const RINGOVER_FIELDS = {
	[VIEWS.PERSON]: PERSON_FIELDS,
	[VIEWS.ORGANIZATION]: ORGANIZATION_FIELDS,
};

export const DEFAULT_IT_FIELDS_STRUCT = {
	[VIEWS.PERSON]: [],
	[VIEWS.ORGANIZATION]: [],
};

export const DEFAULT_TOPVIEW_DATA = {
	[VIEWS.PERSON]: 0,
	[VIEWS.ORGANIZATION]: 0,
};

export const CUSTOM_FIELDS_HEADING = {
	[VIEWS.PERSON]: 100,
	[VIEWS.ORGANIZATION]: 6,
};
