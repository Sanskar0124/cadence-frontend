export const COLUMNS = {
	record_id: "Record ID",
	first_name: "First Name",
	last_name: "Last Name",
	mobile_phone_number: "Mobile Phone Number",
	work_email: "Work email",
	phone_number: "Phone Number",
	owner: "Contact owner",
	state: "State/Region",
	country: "Country/Region",
	website: "Website URL",
	job_position: "Job Title",
	email: "Email",
	company_name: "Associated Company",
	company_id: "Associated Company IDs",
};

export const FIELDS = {
	record_id: "Record ID",
	first_name: "First Name",
	last_name: "Last Name",
	linkedin_url: "Linkedin URL",
	owner: "Contact owner",
	job_position: "Job Title",
	email: "Email",
	phone_number: "Phone Number", // {"elements"  : [{type: "phone" , column_index: "1"}]}
	country: "Country/Region",
	url: "Website",
	account_phone_number: "Company Phone Number",
	account_linkedin_url: "Company Linkedin URL",
	size: "Size",
	zipcode: "Zip",
	company_name: "Associated Company",
	company_id: "Associated Company IDs",
};

export const REQUIRED_INDEX = [0, 1, 6, 12, 13];

export const VIEWS = {
	CONTACT: "contact",
	COMPANY: "company",
	CUSTOM_OBJECTS: "custom_objects",
};

export const DEFAULT_IT_FIELDS_STRUCT = {
	[VIEWS.CONTACT]: [],
	[VIEWS.COMPANY]: [],
};

export const getRequiredField = arr => {
	return arr?.map(f =>
		f.name === "record_id" ||
		f.name === "first_name" ||
		f.name === "company_name" ||
		f.name === "company_id" ||
		f.name === "owner"
			? { ...f, required: true }
			: { ...f, required: false }
	);
};

export const getUnique = arr => {
	let key = "name";
	const arrayUniqueByKey = [...new Map(arr?.map(item => [item[key], item])).values()];
	return arrayUniqueByKey;
};
