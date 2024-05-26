export const getFilteredOptions = (options, selectedOptions) => {
	return options?.map(option => ({
		label: option,
		value: option,
		isDisabled: selectedOptions.includes(option),
	}));
};
