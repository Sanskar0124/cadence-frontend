const numberFields = [
	"calls_per_day",
	"mails_per_day",
	"messages_per_day",
	"linkedin_connections_per_day",
	"linkedin_interacts_per_day",
	"linkedin_messages_per_day",
	"linkedin_profiles_per_day",
	"data_checks_per_day",
	"cadence_customs_per_day",
];

const numberRegex = /^\d+$/;

const validateTaskSetting = exception => {
	let sum = 0;

	for (const field in exception) {
		if (numberFields.includes(field)) {
			if (!numberRegex.test(exception[field]))
				return [false, "Please enter only valid numerical values in Task Split."];
			sum += parseInt(exception[field]);
		}
	}

	if (!Number.isInteger(exception.high_priority_split))
		return [false, "Please enter a valid numerical value for priority split"];

	if (sum > exception.max_tasks)
		return [false, "The total number of tasks is greater than the maximum tasks."];

	return [true, null];
};

const getTotalTasks = exception => {
	let sum = 0;

	for (const field in exception)
		if (numberFields.includes(field)) sum += parseInt(exception[field]);

	return sum;
};

export { validateTaskSetting, getTotalTasks };
