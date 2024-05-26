export const getShortVariable = variable => {
	let value;
	value = variable + "";

	if (value && value?.split("")?.length > 20) {
		return value?.split("").slice(0, 20).join("") + "...";
	} else {
		return value;
	}
};
