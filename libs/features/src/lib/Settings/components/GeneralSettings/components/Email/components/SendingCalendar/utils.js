export const validateSendingCalendarSetting = exception => {
	if (!exception.delay) return [true, null];

	const MSG = "Please enter only numerical values in Delay(Time between emails).";

	const numberRegex = /^\d+$/;
	if (typeof delay === "string") {
		const isValid = numberRegex.test(exception.delay);
		return [isValid, isValid ? null : MSG];
	}

	if (!Number.isInteger(exception.delay)) return [false, MSG];

	return [true, null];
};
