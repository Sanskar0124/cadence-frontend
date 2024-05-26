export const getSearchFilterView = (filterViewsList, searchValue) => {
	let copied = [...filterViewsList];
	return copied.filter(item =>
		item.display_value?.toLowerCase()?.includes(searchValue?.toLowerCase())
	);
};
export const LEAD_TYPES = [
	{ label: "Lead", value: "lead" },
	{ label: "Contact", value: "contact" },
];
