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
		f.name === "id" || f.name === "first_name" || f.name === "owner"
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
	// zip: "zipcode",
	// phone: "account_phone_number",
	// website: "account_linkedin_url",
	[`social.linkedin`]: "linkedin_url",
	// lastname: "last_name",
	position: "job_position",
};

export const parseBody = obj =>
	deepMapKeys(obj, key => KEYS_TRANSFORMATION_TABLE[key] || key);

export const getFormData = object => {
	let obj = {};
	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "phone_numbers" ||
			key === "last_name" ||
			key === "job_position" ||
			key === "linkedin_url" ||
			key === "id" ||
			key === "first_name" ||
			key === "company_name" ||
			key === "owner"
		) {
			obj = { ...obj, [key]: object[key] };
		}
	});
	const formData = new FormData();
	formData.append("field_map", JSON.stringify(obj));
	return formData;
};

export const POTENTIAL_FIELDS = {
	email: ["Email", "E-mail"],
	phone_number: ["Phone", "Téléphone", "TÃ©lÃ©phone"],
	mobile_number: ["Mobile", "Numéro de téléphone portable"],
	fax_number: ["Fax"],
	position: ["Position", "Fonction"],
	last_name: ["Name", "Nom"],
	[`social.linkedin`]: ["linkedIN", "LinkedIN"],
	id: ["Sellsy ID", "ID Sellsy"],
	first_name: ["First name", "Prénom", "PrÃ©nom"],
	company_name: [
		"Client/prospects/suppliers linked",
		"Client / prospects / fournisseurs liés",
		"Client / prospects / fournisseurs liÃ©s",
	],
	owner: ["Owner", "Propriétaire", "PropriÃ©taire"],
};

export const checkRequired = mappingField => {
	if (
		mappingField
			.filter(f => f.name === "id" || f.name === "first_name" || f.name === "owner")
			.filter(f => f.value.name === null).length > 0
	) {
		return true;
	}
	return false;
};
