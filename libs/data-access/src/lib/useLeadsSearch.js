import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useLeadsSearch = () => {
	const searchLeadsApi = searchValue =>
		AuthorizedApi.post("v2/sales/employee/search", { search: searchValue }).then(
			res => res.data.data
		);

	const {
		mutate: searchLeads,
		data: searchResults,
		isLoading: searchLoading,
		error: searchError,
	} = useMutation(searchLeadsApi);

	return { searchLeads, searchResults, searchLoading, searchError };
};

export default useLeadsSearch;
