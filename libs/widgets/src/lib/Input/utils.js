export const isWholeNumStr = value => {
	return /^(?=.*?[0-9])/.test(value);
};
export const isDecimal = value => {
	return /^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(value);
};
