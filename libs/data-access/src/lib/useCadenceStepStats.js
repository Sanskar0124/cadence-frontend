/* eslint-disable no-console */
import { useInfiniteQuery } from "react-query";
import { AuthorizedApi } from "./api";

const MAIL_STATS_TYPES = ["bounced", "clicked", "opened", "unsubscribed", "replied"];

const STEP_ROUTE = "/v2/sales/department/cadence/statistics-leads/";
const MAIL_STEP_ROUTE = "/v2/sales/department/cadence/statistics-mail-leads/";
const SMS_STEP_ROUTE = "/v2/sales/department/cadence/statistics-message-leads/";

const STEP_KEY = "step-stats";
const MAIL_STEP_KEY = "mail-step-stats";
const MESSAGE_STEP_KEY = "message-step-stats";

const RECORDS_PER_PAGE = 10;

const useCadenceStepStats = (
	node_id,
	type,
	ab_template_id,
	isSMS,
	search_query = "",
	enabled = true
) => {
	let route, key;
	if (isSMS) {
		[route, key] = [SMS_STEP_ROUTE, MESSAGE_STEP_KEY];
	} else {
		[route, key] = MAIL_STATS_TYPES.includes(type)
			? [MAIL_STEP_ROUTE, MAIL_STEP_KEY]
			: [STEP_ROUTE, STEP_KEY];
	}

	const fetchStatsLeadsApi = async ({ queryKey, pageParam = 0 }) => {
		const { node_id, type, ab_template_id } = queryKey[1];

		let body = {
			type,
			...(key === STEP_KEY ? { lead_id_cursor: pageParam } : { offset: pageParam }),
			node_id,
			limit: RECORDS_PER_PAGE,
		};
		if (ab_template_id?.length) {
			body.abTestEnabled = true;
			body.ab_template_id = ab_template_id;
		}
		if (search_query?.length > 0) {
			body.searchQuery = search_query;
		}

		const res = await AuthorizedApi.post(route, body);
		return res.data.data?.map(lead => {
			let leadData = lead;
			if (ab_template_id?.length && leadData?.[isSMS ? "Message" : "Email"]) {
				leadData = { ...leadData, ...leadData?.[isSMS ? "Message" : "Email"] };
				delete leadData?.[isSMS ? "Message" : "Email"];
			}
			if (leadData?.Lead) {
				leadData = { ...leadData, ...leadData.Lead };
				delete leadData.Lead;
			}
			if (type === "converted" || type === "trash") {
				leadData = { ...leadData, ...leadData.Leads?.[0] };
			}

			return leadData;
		});
	};

	const {
		data: statsLeads,
		isLoading: statsLeadsLoading,
		refetch: fetchStatsLeads,
		isRefetching: StatsLeadsRefetching,
		error: fetchStatsLeadsError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery(
		[key, { node_id, type, search_query, ab_template_id: ab_template_id ?? "" }],
		fetchStatsLeadsApi,
		{
			enabled,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				if (key === STEP_KEY) return lastPage[lastPage.length - 1]?.lead_id;
				else return pages.length * RECORDS_PER_PAGE;
			},
			select: data => data?.pages?.map(page => page)?.flat(),
		}
	);

	return {
		statsLeads,
		statsLeadsLoading,
		fetchStatsLeads,
		StatsLeadsRefetching,
		fetchStatsLeadsError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	};
};

export default useCadenceStepStats;
