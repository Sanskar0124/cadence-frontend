import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

export const DEFAULT_FILTER_OPTIONS = {
	lead_tags: [],
	company_size: [],
	lead_cadences: [],
	lead_activity: [],
};

const RECORDS_PER_PAGE = 20;

const KEY = "leads";

const filtersFromLocalStorage = JSON.parse(localStorage.getItem("lead_filters"));

const ENABLED_DEFAULT = {
	leads: false,
	leadsData: false,
};

const useLeads = enabled => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const queryClient = useQueryClient();

	const [filters, setFilters] = useState(
		filtersFromLocalStorage ?? DEFAULT_FILTER_OPTIONS
	);
	const [userId, setUserId] = useState(null);

	const fetchLeadsListApi = ({ pageParam = 0 }) => {
		let URL = `/v2/sales/lead/list`;
		return AuthorizedApi.post(URL, filters, {
			params: {
				limit: RECORDS_PER_PAGE,
				offset: pageParam,
			},
		}).then(res => res.data.data);
	};

	const {
		data: leadsData,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery([KEY, filters], fetchLeadsListApi, {
		enabled: enabled.leadsData,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return pages.length * RECORDS_PER_PAGE;
		},
		select: data => data?.pages?.map(page => page)?.flat(),
	});

	//Get all events
	const getAllOngoingLeadsApi = () =>
		AuthorizedApi.get("/v2/sales/lead/dropdown").then(res => res.data.data);

	const {
		data: leads,
		isLoading: leadsLoading,
		error: leadError,
	} = useQuery("ongoingLeads", getAllOngoingLeadsApi, {
		enabled: enabled.leads,
	});

	useEffect(() => {
		return () => {
			queryClient.removeQueries([KEY, filters], { exact: true });
		};
	}, []);

	return {
		leadsData,
		fetchNextPage,
		hasNextPage,
		filters,
		setFilters,
		userId,
		setUserId,
		isLoading,
		isFetching,
		isFetchingNextPage,
		leads,
		leadsLoading,
		leadError,
	};
};

export default useLeads;
