export const VIEW_MODES = {
	FILTER: "filters",
};
export const getSearchFilterView = (filterViewsList, searchValue) => {
	let copied = [...filterViewsList];
	const data = copied.filter(item =>
		item.name?.toLowerCase()?.includes(searchValue?.toLowerCase())
	);
	return data;
};
