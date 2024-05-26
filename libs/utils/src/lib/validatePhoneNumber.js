const validCharacters = "0123456789()[]+-. ";

const validatePhoneNumber = (phoneNumber = "") => {
	if (!phoneNumber) return false;
	if (typeof phoneNumber !== "string") return false;

	for (const char of phoneNumber) if (!validCharacters.includes(char)) return false;

	return true;
};

export default validatePhoneNumber;
