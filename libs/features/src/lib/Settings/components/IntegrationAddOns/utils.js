export const cleanUpdateEnrichmentsConfigBody = config => {
	const obj = { ...config };

	const fieldsToBeRemoved = [
		"lead_phone_options",
		"lead_email_options",
		"contact_phone_options",
		"contact_email_options",
		"created_at",
		"updated_at",
	];

	for (const field of Object.keys(obj))
		if (fieldsToBeRemoved.includes(field)) delete obj[field];

	return obj;
};
