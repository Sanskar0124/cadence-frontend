export const getSearchFilterView = (filterViewsList, searchValue) => {
	let copied = [...filterViewsList];
	return copied.filter(item => item?.name?.includes(searchValue));
};
