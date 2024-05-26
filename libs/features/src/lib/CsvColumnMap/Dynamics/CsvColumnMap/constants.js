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
};

export const DEFAULT_IT_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
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
export const getRequiredField = arr => {
	return arr?.map(f =>
		f.name === "id" ||
		f.name === "firstname" ||
		f.name === "companyname" ||
		f.name === "user_name"
			? // f.name === "owner"
			  { ...f, required: true }
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
	entityimage_url: "linkedin_url",
	address1_telephone1: "company_phone_number",
	firstname: "first_name",
	companyname: "company",
	jobtitle: "job_position",
	lastname: "last_name",
	websiteurl: "url",
	numberofemployees: "size",
	address1_country: "country",
	address1_postalcode: "zip_code",
};

export const parseBody = obj =>
	deepMapKeys(obj, key => KEYS_TRANSFORMATION_TABLE[key] || key);

export const getFormData = (object, cadenceId) => {
	console.log(object, "Heyyy");

	const supportedFields = [
		"first_name",
		"last_name",
		"linkedin_url",
		"job_position",
		"emails",
		"phone_numbers",
		"company",
		"size",
		"url",
		"country",
		"zip_code",
		"company_phone_number",
		"account_name",
		"user_name",
		"id",
	];
	Object.keys(object).forEach(
		key => !supportedFields.includes(key) && delete object[key]
	);
	const formData = new FormData();
	formData.append("field_map", JSON.stringify(object));
	formData.append("cadence_id", cadenceId);
	// Object.keys(object).forEach(key => {
	// 	// if (
	// 	// 	key === "email" ||
	// 	// 	key === "last_name" ||
	// 	// 	key === "job_position" ||
	// 	// 	// key === "zipcode" ||
	// 	// 	key === "phone_number" ||
	// 	// 	key === "mobile_number" ||
	// 	// 	key === "fax_number" ||
	// 	// 	key === "linkedin_url" ||
	// 	// 	key === "sellsy_id" ||
	// 	// 	key === "first_name" ||
	// 	// 	key === "company_name" ||
	// 	// 	// key === "company_id" ||
	// 	// 	key === "owner"
	// 	// ) {
	// 	if (key === "emails" || key === "phone_numbers") {
	// 		formData.append(key, JSON.stringify(object[key]));
	// 	} else {
	// 		formData.append(key, object[key]);
	// 	}
	// 	// }
	// });
	return formData;
};

export const POTENTIAL_FIELDS = {
	lead: {
		emailaddress1: ["Email"],
		emailaddress2: ["Email Address 2"],
		emailaddress3: ["Email Address 3"],
		mobilephone: ["Mobile Phone", "Téléphone"],
		telephone2: ["Home Phone", "Téléphone"],
		// telephone3: ["Phone", "Téléphone"],
		fax: ["Fax", "Téléphone"],
		address1_telephone1: ["Address 1: Telephone 1"],
		companyname: ["Company Name"],
		telephone1: ["Business Phone"],
		address1_country: ["Country/Region"],
		firstname: ["First Name", "Prénom"],
		jobtitle: ["Job Title", "Fonction"],
		lastname: ["Last Name", "Nom"],
		entityimage_url: ["linkedIN", "LinkedIN"],
		id: ["(Do Not Modify) Lead", "ID Dynamics"],
		// owner: ["Owner", "Propriétaire"],
		numberofemployees: ["No. of Employees"],
		websiteurl: ["Website"],
		address1_postalcode: ["ZIP/Postal Code"],
		user_name: ["User Name (Owning User) (User)"],
	},
	contact: {
		emailaddress1: ["Email"],
		emailaddress2: ["Email Address 2"],
		emailaddress3: ["Email Address 3"],
		firstname: ["First Name", "Prénom"],
		jobtitle: ["Job Title", "Fonction"],
		lastname: ["Last Name", "Nom"],
		account_name: ["Company Name"],
		mobilephone: ["Mobile Phone"],
		telephone1: ["Business Phone"],
		// assistantphone: ["Phone", "Téléphone"],
		fax: ["Fax"],
		company: ["Phone"],
		// owner: ["Owner", "Propriétaire"],
		id: ["(Do Not Modify) Contact", "ID Dynamics"],
		user_name: ["User Name (Owning User) (User)"],
	},
};

export const checkRequired = mappingField => {
	if (
		mappingField
			.filter(
				f =>
					f.name === "id" ||
					f.name === "first_name" ||
					f.name === "companyname" ||
					f.name === "user_name"
				// f.name === "owner"
			)
			.filter(f => f.value.name === null).length > 0
	) {
		return true;
	}
	return false;
};
