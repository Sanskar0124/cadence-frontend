export const getSearchFilterView = (filterViewsList, searchValue) => {
	let copied = [...filterViewsList];
	return copied.filter(item =>
		item.label?.toLowerCase()?.includes(searchValue?.toLowerCase())
	);
};
