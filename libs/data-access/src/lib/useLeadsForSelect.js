//Hook to fetch all leads with limited data
import { useInfiniteQuery } from "react-query";
import { AuthorizedApi } from "./api";

const RECORDS_PER_PAGE = 20;

const KEY = "leads-for-select";

const ENABLED_DEFAULT = {
	leads: false,
};

const useLeadsForSelect = ({ enabled, search }) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };

	const fetchLeadsListApi = ({ pageParam }) => {
		return AuthorizedApi.get("/v2/sales/lead/dropdown", {
			params: {
				limit: RECORDS_PER_PAGE,
				...(pageParam && { last_lead_id: pageParam }),
				...(search.length > 0 && { search }),
			},
		}).then(res => res.data.data);
	};

	const {
		data: leads,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery([KEY, search], fetchLeadsListApi, {
		enabled: enabled.leads,
		getNextPageParam: lastPage => {
			return lastPage?.[lastPage.length - 1]?.lead_id;
		},
		select: data => data?.pages?.map(page => page)?.flat(),
	});

	return {
		leads,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		isFetchingNextPage,
	};
};

export default useLeadsForSelect;
