export const DEFAULT_COLUMNS = [
	{
		uid: "__first_name",
		label: "First Name",
		value: { name: null },
		backendField: "first_name",
		required: true,
	},
	{
		uid: "__last_name",
		label: "Last Name",
		value: { name: null },
		backendField: "last_name",
	},
	{
		uid: "__linkedin_url",
		label: "Linkedin URL",
		value: { name: null },
		backendField: "linkedin_url",
	},
	{
		uid: "__job_position",
		label: "Job position",
		value: { name: null },
		backendField: "job_position",
	},
	{
		uid: "__company_name",
		label: "Company Name",
		value: { name: null },
		backendField: "company",
		required: true,
	},
	{
		uid: "__company_phone_number",
		label: "Company Phone",
		value: { name: null },
		backendField: "company_phone_number",
	},
	{
		uid: "__company_size",
		label: "Company Size",
		value: { name: null },
		backendField: "size",
	},
	{
		uid: "__company_url",
		label: "Company URL",
		value: { name: null },
		backendField: "url",
	},
	{
		uid: "__zipcode",
		label: "Zipcode",
		value: { name: null },
		backendField: "zip_code",
	},
	{
		uid: "__country",
		label: "Country",
		value: { name: null },
		backendField: "country",
	},
	{
		uid: "__p_phone_number",
		label: "Primary Phone Number",
		value: { name: null },
		backendField: "primary_phone",
	},
	{
		uid: "__a_phone_number1",
		label: "Other Phone 1",
		value: { name: null },
		backendField: "phone_numbers",
		isArray: true,
		index: 0,
	},
	{
		uid: "__a_phone_number2",
		label: "Other Phone 2",
		value: { name: null },
		backendField: "phone_numbers",
		isArray: true,
		index: 1,
	},
	{
		uid: "__a_phone_number3",
		label: "Other Phone 3",
		value: { name: null },
		backendField: "phone_numbers",
		isArray: true,
		index: 2,
	},
	{
		uid: "__p_email",
		label: "Primary Email",
		value: { name: null },
		backendField: "primary_email",
	},
	{
		uid: "__a_email1",
		label: "Alternative Email 1",
		value: { name: null },
		backendField: "emails",
		isArray: true,
		index: 0,
	},
	{
		uid: "__a_email2",
		label: "Alternative Email 2",
		value: { name: null },
		backendField: "emails",
		isArray: true,
		index: 1,
	},
	{
		uid: "__a_email3",
		label: "Alternative Email 3",
		value: { name: null },
		backendField: "emails",
		isArray: true,
		index: 2,
	},
	{
		uid: "__owner_integration_id",
		label: "User Excel ID",
		value: { name: null },
		backendField: "owner_integration_id",
		required: true,
	},
];

export const POTENTIAL_FIELDS = {
	first_name: ["First Name", "Prénom"],
	last_name: ["Last Name", "Nom"],
	linkedin_url: ["Linkedin URL"],
	job_position: ["Job Title", "Job Position", "Intitulé du poste"],
	company: ["Company"],
	company_phone_number: ["Company Phone"],
	size: ["Size"],
	url: ["Company Website", "Website URL", "URL du site web"],
	zip_code: ["Zip", "Postal Code", "Code postal"],
	country: ["Country", "Country/Region", "Pays/Région"],
	primary_email: ["Primary Email", "E-mail"],
	primary_phone: ["Primary Phone", "Numéro de téléphone"],
	emails: ["Home Email", "Work Email", "Other Email"],
	phone_numbers: ["Home Phone", "Work Phone", "Other Phone"],
	owner_integration_id: ["User Integration ID", "User Excel ID"],
};

export const checkRequired = mappingField => {
	let missingFields = mappingField
		.filter(f => f.required)
		.filter(f => f.value.name === null);
	if (missingFields.length > 0) return missingFields.map(f => f.label).join(", ");
	return false;
};
