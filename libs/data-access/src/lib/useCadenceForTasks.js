/* eslint-disable no-console */
import { useInfiniteQuery } from "react-query";
import { AuthorizedApi } from "./api";

const RECORDS_PER_PAGE = 10;

const useCadenceForTasks = (enabled, type, searchValue = "", userId) => {
	//FETCH
	const fetchCadencesApi = async ({ queryKey, pageParam: offset = 0 }) => {
		const { type, searchValue, userId } = queryKey[1];
		return await AuthorizedApi.post("/v2/sales/department/cadence/task-filter", {
			type,
			limit: RECORDS_PER_PAGE,
			offset,
			...(searchValue.length > 0 && { search: searchValue }),
			...(userId && { user_id: userId }),
		}).then(res =>
			res.data.data.map(cad => ({ ...cad.Task.Cadence, cadence_id: cad.Task.cadence_id }))
		);
	};

	const {
		data: cadences,
		isLoading: cadencesLoading,
		refetch: fetchCadences,
		isRefetching: cadencesRefetching,
		error: fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery(
		["cadencesForTaskFilter", { type, searchValue, userId }],
		fetchCadencesApi,
		{
			enabled,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				return pages.length * RECORDS_PER_PAGE;
			},
			select: data => data?.pages?.map(page => page)?.flat(),
		}
	);

	return {
		cadences,
		cadencesLoading,
		cadencesRefetching,
		fetchCadences,
		fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	};
};
export default useCadenceForTasks;
