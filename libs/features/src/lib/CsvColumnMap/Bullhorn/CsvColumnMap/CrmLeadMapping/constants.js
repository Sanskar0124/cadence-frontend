import { deepMapKeys } from "@cadence-frontend/utils";

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

export const REQUIRED_INDEX = [0, 1, 6, 12, 13];

export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
	ACCOUNT: "account",
	CUSTOM_OBJECTS: "custom_objects",
	CANDIDATE: "candidate",
};

export const DEFAULT_IT_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
	[VIEWS.CANDIDATE]: [],
};
export const EMAIL_PHONE_FIELDS = {
	[VIEWS.LEAD]: {
		email: [],
		phone: [],
	},
	[VIEWS.CONTACT]: {
		email: [],
		phone: [],
	},
};
export const getRequiredField = (arr, leadType) => {
	//firstname, account_name, owener, id
	return arr?.map(f =>
		f.name === "id" ||
		f.name === "firstName" ||
		f.name === "companyName" ||
		// f.name === "phone" ||
		f.name === "account_name" ||
		f.name === "user_name" ||
		f.name === "owner" ||
		(leadType === VIEWS.CANDIDATE && f.name === "country")
			? { ...f, required: true }
			: { ...f, required: false }
	);
};

export const getUnique = arr => {
	let key = "name";
	const arrayUniqueByKey = [...new Map(arr?.map(item => [item[key], item])).values()];
	return arrayUniqueByKey;
};

export const checkIfEmailOrPhone = (name, checkEmailsPhone) => {
	const contactEmails = checkEmailsPhone.email;
	const contactPhones = checkEmailsPhone.phone;
	if (contactEmails.includes(name)) return { email: true };
	else if (contactPhones.includes(name)) return { phone: true };
};

const KEYS_TRANSFORMATION_TABLE = {
	// entityimage_url: "linkedin_url",
	// address1_telephone1: "company_phone_number",
	firstName: "first_name",
	// companyname: "company",
	occupation: "job_position",
	lastName: "last_name",
	// websiteurl: "url",
	// numberofemployees: "size",
	// address1_country: "country",
	// address1_postalcode: "zip_code",
	companyName: "company",
	companyURL: "url",
};

export const parseBody = obj =>
	deepMapKeys(obj, key => KEYS_TRANSFORMATION_TABLE[key] || key);

export const getFormData = (object, cadenceId) => {
	const formData = new FormData();
	formData.append("field_map", JSON.stringify(object));
	formData.append("cadence_id", cadenceId);

	return formData;
};

export const POTENTIAL_FIELDS = {
	lead: {
		owner: ["Owner", "Propriétaire"],
		firstName: ["First Name", "Prénom"],
		email: ["Email"],
		phone: ["Phone"],
		id: ["ID"],
		account_name: ["Existing Company"],
		lastName: ["Last Name"],
		occupation: ["Title"],
		role: ["Title"],
		status: ["Status"],
	},
	contact: {
		owner: ["Owner", "Propriétaire"],
		firstName: ["First Name", "Prénom"],
		email: ["Email 1"],
		phone: ["Phone", "Direct Phone"],
		mobile: ["Mobile Phone"],
		id: ["ID"],
		account_name: ["Company"],
		lastName: ["Last Name"],
		occupation: ["Title"],
		status: ["Status"],
	},
	candidate: {
		email: ["Email 1"],
		phone: ["Primary Phone"],
		id: ["ID"],
		firstName: ["First Name", "Prénom"],
		lastName: ["Last Name"],
		owner: ["Ownership"],
		occupation: ["Title"],
		companyName: ["Current Company"],
		companyURL: ["Personal URL"],
		zip_code: ["Zip"],
		country: ["Country"],
		status: ["Status"],
	},
};

export const checkRequired = (mappingField, leadType) => {
	if (
		mappingField
			.filter(
				f =>
					f.name === "id" ||
					f.name === "firstName" ||
					f.name === "companyName" ||
					// f.name === "phone" ||
					f.name === "account_name" ||
					f.name === "user_name" ||
					f.name === "owner" ||
					(leadType === VIEWS.CANDIDATE && f.name === "country")
			)
			.filter(f => f.value.name === null).length > 0
	) {
		return true;
	}
	return false;
};
