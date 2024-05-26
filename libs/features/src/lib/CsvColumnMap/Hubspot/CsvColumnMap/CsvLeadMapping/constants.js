import { deepMapKeys } from "@cadence-frontend/utils";

export const COLUMNS = {
	first_name: "First Name",
	last_name: "Last Name",
	linkedin_url: "Linkedin URL",
	job_position: "Job Position",
	company_name: "Company Name",
	company_phone_number: "Company Phone Number",
	company_linkedin_url: "Company Linkedin URL",
	url: "Company Website",
	country: "Country",
	size: "Company Size",
	zip_code: "Zipcode",
};

export const PHONE_COLUMNS = [
	"Primary Phone Number",
	"Mobile Phone",
	"Work Phone",
	"Other Phone 1",
	"Other Phone 2",
];

export const EMAIL_COLUMNS = [
	"Primary Email",
	"Alternate Mail 1",
	"Alternate Mail 2",
	"Alternate Mail 3",
	"Alternate Mail 4",
];

export const getRequiredField = arr => {
	return arr?.map(f =>
		f.name === "first_name" ||
		f.name === "last_name" ||
		f.name === "company_name" ||
		f.name === "hubspot_owner_id"
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

export const getFormData = object => {
	const formData = new FormData();
	const fieldMap = {};
	Object.keys(object).forEach(key => {
		if (
			key === "emails" ||
			key === "phone_numbers" ||
			key === "first_name" ||
			key === "last_name" ||
			key === "linkedin_url" ||
			key === "job_position" ||
			key === "company_name" ||
			key === "company_phone_number" ||
			key === "company_linkedin_url" ||
			key === "url" ||
			key === "country" ||
			key === "size" ||
			key === "zip_code" ||
			key === "hubspot_owner_id"
		)
			fieldMap[key] = object[key];
	});
	formData.append("field_map", JSON.stringify(fieldMap));
	return formData;
};

export const POTENTIAL_FIELDS = {
	first_name: ["First Name"],
	last_name: ["Last Name"],
	linkedin_url: ["Linkedin URL"],
	job_position: ["Job Position"],
	country: ["Country"],
	company_name: ["Company Name"],
	company_phone_number: ["Company Phone"],
	company_linkedin_url: ["Company Linkedin URL"],
	url: ["Company Website"],
	size: ["Company Size"],
	zip_code: ["Zipcode"],
	hubspot_owner_id: ["Hubspot Owner ID"],
};

export const checkRequired = mappingField => {
	if (
		mappingField
			.filter(
				f =>
					f.name === "first_name" ||
					f.name === "last_name" ||
					f.name === "company_name" ||
					f.name === "hubspot_owner_id"
			)
			.filter(f => f.value.name === null || f.value.columnIndex === null).length > 0
	) {
		return true;
	}
	return false;
};
