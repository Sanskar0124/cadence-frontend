/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "../api";
// Recoil Imports
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
// Import Strategies

const KEY = "homePage";

const LIVE_FEED_FILTER = {
	ALL: "all",
	VIEWED_MAILS: "viewed_mails",
	CLICKED_MAILS: "clicked_mails",
	REPLIED_MAILS: "replied_mails",
	UNSUBSCRIBED_MAILS: "unsubscribed_mails",
	RECEIVED_MAILS: "received_mails",
	RECEIVED_SMS: "received_sms",
	VOICEMAIL: "voicemail",
	MISSED_CALLS: "missed_calls",
};

const RECORDS_PER_PAGE = 10;
const ENABLED_DEFAULT = {
	progress: false,
	cadencesData: false,
	liveFeedData: false,
	calendar: false,
};

const useHomePage = (
	enabled,
	{ taskTag = "all", cadenceType = "personal", feedFilter = ["all"] }
) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const [liveFeedFilters, setLiveFeedFilters] = useState(LIVE_FEED_FILTER);
	const integration_type = useRecoilValue(userInfo).integration_type;

	//FETCH TASK PROGRESS
	const fetchTaskProgressApi = () =>
		AuthorizedApi.get("/v2/sales/home-page/progress", {
			params: {
				...(taskTag !== "all" && { taskTag }),
			},
		}).then(res => res.data.data);

	const {
		data: progress,
		isLoading: progressLoading,
		error: progressError,
	} = useQuery([KEY, { taskTag }], fetchTaskProgressApi);

	//FETCH CADENCES DATA
	const fetchCadencesApi = async ({ queryKey }) => {
		const { cadenceType } = queryKey[1];
		return await AuthorizedApi.get("/v2/sales/home-page/active-cadences", {
			params: {
				...(cadenceType !== "all_cadences" && { cadenceType }),
				...(taskTag !== "all" && { taskTag }),
			},
		}).then(res =>
			res.data.data.map(cad => ({ task_count: cad.task_count, ...cad.Task.Cadence }))
		);
	};

	const {
		data: cadencesData,
		isLoading: cadenceLoading,
		error: cadencesError,
	} = useQuery([KEY, { cadenceType, taskTag }], fetchCadencesApi, {
		enabled: enabled.cadencesData,
	});

	//FETCH CALENDAR
	const getCalendarData = () =>
		AuthorizedApi.get("/calendar/v2/homepage-events").then(res => res.data.data);

	const {
		data: events,
		isLoading: eventsLoading,
		error: eventsError,
		refetch: refetchEvents,
	} = useQuery("homepage-calendar", getCalendarData, {
		cacheTime: Infinity,
		enabled: enabled.calendar,
	});

	//FETCH LIVE FEED
	const fetchLiveFeed = async ({ queryKey, pageParam: offset = 0 }) => {
		const { feedFilter } = queryKey[1];
		return await AuthorizedApi.post("/v2/sales/home-page/live-feed", {
			filter: feedFilter,
			limit: RECORDS_PER_PAGE,
			offset,
		}).then(res => {
			return res.data?.data ?? [];
		});
	};

	const {
		data: liveFeedData,
		isLoading: liveFeedLoading,
		refetch: fetchFeed,
		isRefetching: liveFeedRefetching,
		error: fetchLiveFeedError,
		fetchNextPage: fetchFeedNextPage,
		hasNextPage: hasFeedNextPage,
		isFetching: isLiveFeedFetching,
		isFetchingNextPage: isFetchingLiveFeedNextPage,
	} = useInfiniteQuery([KEY, { feedFilter, liveFeedFilters }], fetchLiveFeed, {
		enabled: enabled.liveFeedData,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return pages.length * RECORDS_PER_PAGE;
		},
		select: data => data?.pages?.map(page => page)?.flat(),
	});

	return {
		//progress
		progress,
		progressLoading,
		progressError,
		//cadences
		cadencesData,
		cadenceLoading,
		cadencesError,
		//calendar
		events,
		eventsLoading,
		eventsError,
		refetchEvents,
		//livefeed
		fetchLiveFeedError,
		fetchFeedNextPage,
		hasFeedNextPage,
		isLiveFeedFetching,
		isFetchingLiveFeedNextPage,
		liveFeedData,
		liveFeedLoading,
		fetchFeed,
		liveFeedRefetching,
		setLiveFeedFilters,
	};
};

export default useHomePage;
