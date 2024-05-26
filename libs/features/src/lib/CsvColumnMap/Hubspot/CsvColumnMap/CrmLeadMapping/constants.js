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
	integration_status: "Integration Status",
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
	zip: "zipcode",
	phone: "account_phone_number",
	website: "account_linkedin_url",
	lastname: "last_name",
	jobtitle: "job_position",
};

export const parseBody = obj =>
	deepMapKeys(obj, key => KEYS_TRANSFORMATION_TABLE[key] || key);

export const getFormData = object => {
	const formData = new FormData();
	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "last_name" ||
			key === "job_position" ||
			key === "zipcode" ||
			key === "phone_numbers" ||
			key === "account_phone_number" ||
			key === "country" ||
			key === "account_linkedin_url" ||
			key === "record_id" ||
			key === "first_name" ||
			key === "company_name" ||
			key === "company_id" ||
			key === "owner" ||
			key === "integration_status"
		) {
			if (key === "emails" || key === "phone_numbers") {
				formData.append(key, JSON.stringify(object[key]));
			} else {
				formData.append(key, object[key]);
			}
		}
	});
	return formData;
};

export const POTENTIAL_FIELDS = {
	email: ["Email", "E-mail"],
	phone: ["Phone Number", "Numéro de téléphone"],
	hs_whatsapp_phone_number: ["WhatsApp Phone Number", "Numéro de téléphone WhatsApp"],
	mobilephone: ["Mobile Phone Number", "Numéro de téléphone portable"],
	jobtitle: ["Job Title", "Intitulé du poste"],
	country: ["Country/Region", "Pays/Région"],
	website: ["Website URL", "URL du site web"],
	lastname: ["Last Name", "Nom"],
	zip: ["Postal Code", "Code postal"],
	record_id: ["Record ID"],
	first_name: ["First Name", "Prénom"],
	company_name: ["Associated Company"],
	company_id: ["Associated Company IDs", "Primary Associated Company ID"],
	owner: ["Contact owner", "Propriétaire du contact"],
	integration_status: ["Lead Status", "Statut du prospect"],
};

export const checkRequired = mappingField => {
	if (
		mappingField
			.filter(
				f =>
					f.name === "record_id" ||
					f.name === "first_name" ||
					f.name === "company_name" ||
					f.name === "company_id" ||
					f.name === "owner"
			)
			.filter(f => f.value.name === null || f.value.columnIndex === null).length > 0
	) {
		return true;
	}
	return false;
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
