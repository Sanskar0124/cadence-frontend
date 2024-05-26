import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const RECORDS_PER_PAGE = 20;
const KEY = "cadences";

const useCadencesNew = (type = "all", searchValue = "") => {
	const fetchCadencesApi = async ({ queryKey, pageParam: offset = 0 }) => {
		const { type } = queryKey[1];
		return await AuthorizedApi.get("/statistics/v2/cadences", {
			params: {
				type,
				limit: RECORDS_PER_PAGE,
				offset,
				...(searchValue.length > 0 && { search: searchValue }),
			},
		}).then(res => res.data.data);
	};
	const {
		data: cadencesData,
		isLoading: cadenceLoading,
		refetch: fetchCadences,
		isRefetching: cadenceRefetching,
		error: fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery([KEY, { type, searchValue }], fetchCadencesApi, {
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return pages.length * RECORDS_PER_PAGE;
		},
		select: data => data?.pages?.map(page => page)?.flat(),
	});
	return {
		cadencesData,
		cadenceLoading,
		cadenceRefetching,
		fetchCadences,
		fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	};
};
export default useCadencesNew;
