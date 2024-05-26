export const TIME_UNITS_OPTIONS = [
	{
		label: "Seconds",
		value: "seconds",
	},
	{
		label: "Minutes",
		value: "minutes",
	},
	{
		label: "Hours",
		value: "hours",
	},
];

export const NO_OF_RETRIES = [
	{
		label: 1,
		value: 1,
	},
	{
		label: 2,
		value: 2,
	},
	{
		label: 3,
		value: 3,
	},
];

export const getInput = node => {
	const input = {};
	input.script = node?.data?.script;
	input.retries = node?.data?.retries;
	input.is_urgent = node?.is_urgent;
	input.template_type = node?.data?.template_type;
	input.template_id = node?.data?.template_id;
	if (node?.data?.duration % 3600 === 0) {
		input.duration = node?.data?.duration / 3600;
		input.duration_time_unit = TIME_UNITS_OPTIONS[2].value;
	} else if (node?.data?.duration % 60 === 0) {
		input.duration = node?.data?.duration / 60;
		input.duration_time_unit = TIME_UNITS_OPTIONS[1].value;
	} else {
		input.duration = node?.data?.duration;
		input.duration_time_unit = TIME_UNITS_OPTIONS[0].value;
	}

	if (node?.data?.retry_after % 3600 === 0) {
		input.retry_after = node?.data?.retry_after / 3600;
		input.retry_after_time_unit = TIME_UNITS_OPTIONS[2].value;
	} else if (node?.data?.retry_after % 60 === 0) {
		input.retry_after = node?.data?.retry_after / 60;
		input.retry_after_time_unit = TIME_UNITS_OPTIONS[1].value;
	} else {
		input.retry_after = node?.data?.retry_after;
		input.retry_after_time_unit = TIME_UNITS_OPTIONS[0].value;
	}

	return input;
};
