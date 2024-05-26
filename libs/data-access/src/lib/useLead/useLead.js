import { useState } from "react";
import { AuthorizedApi } from "../api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { LeadDataStrategy, getAddLeadsUrl } from "./useLead.strategy";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const ENABLED_DEFAULT = {
	leadInfo: true,
	fieldMap: true,
	cadenceList: true,
	activities: true,
};

const useLead = (
	task_id,
	enabled,
	lead_id,
	reasons = false,
	crmLeadInfoEnabled = false
) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };

	const queryClient = useQueryClient();
	const [activeLeadId, setActiveLeadId] = useState(null);
	const [error, setError] = useState(null);
	const [next_node_id, setNextNodeId] = useState(null);

	const getLeadInfo = async ({ queryKey }) => {
		const [_, { activeLeadId, nx }] = queryKey;
		if (activeLeadId) {
			return await AuthorizedApi.get(
				`v2/sales/lead/info/${activeLeadId}?next_node_id=${nx}`
			)
				.then(res => {
					if (res.status !== 200)
						throw new Error(res.data.message || "lead fetch failed");
					return res.data?.data;
				})
				.catch(error => {
					if (error.response.status === 404)
						return (window.location.href = `/crm/404?type=lead`);
					if (error.response.status === 403)
						return (window.location.href = `/crm/404?type=lead_not_associated`);
				});
		} else return null;
	};

	const {
		data: leadInfo,
		refetch: leadInfoRefetch,
		isFetching: leadInfoLoading,
	} = useQuery(["lead-info", { activeLeadId, nx: next_node_id }], getLeadInfo, {
		enabled: enabled.leadInfo,
	});

	const getLeadFieldMap = async () => {
		if (
			activeLeadId &&
			user?.integration_type !== INTEGRATION_TYPE.SHEETS &&
			user?.integration_type !== INTEGRATION_TYPE.EXCEL
		) {
			return await AuthorizedApi.get(`v2/sales/lead/field-map`).then(res => {
				return LeadDataStrategy({
					data: res.data?.data,
					integration_type: user.integration_type,
				});
			});
		} else return null;
	};

	const {
		data: fieldMap,
		refetch: fieldMapRefetch,
		isFetching: fieldMapLoading,
	} = useQuery(["lead-field-map", { activeLeadId }], getLeadFieldMap, {
		enabled: enabled.fieldMap,
	});

	const getCadenceList = async () => {
		if (activeLeadId) {
			return await AuthorizedApi.get(`v2/sales/lead/cadence-list/${activeLeadId}`).then(
				res => {
					return res.data?.data;
				}
			);
		} else return null;
	};

	const {
		data: cadenceList,
		refetch: cadenceListRefetch,
		isFetching: cadenceListLoading,
	} = useQuery(["lead-cadence-list", { activeLeadId }], getCadenceList, {
		enabled: enabled.cadenceList,
	});

	const getLeadActivities = async () => {
		if (activeLeadId) {
			return await AuthorizedApi.get(`v2/sales/lead/activities/${activeLeadId}`).then(
				res => {
					return res.data?.data;
				}
			);
		} else return null;
	};

	const {
		data: leadActivities,
		refetch: activitiesRefetch,
		isFetching: activitiesLoading,
	} = useQuery(["lead-activities", { activeLeadId }], getLeadActivities, {
		enabled: enabled.activities,
	});

	const getLeadInfoFromCRM = async ({ queryKey }) => {
		const { lead_id } = queryKey[1];
		if (lead_id)
			return await AuthorizedApi.get(`/v2/sales/lead/crm-data/${lead_id}`).then(
				res => res?.data?.data
			);
		return null;
	};

	const {
		data: crmLeadInfo,
		refetch: refetchCrmLeadInfo,
		isLoading: crmLeadInfoLoading,
		isRefetching: refetchingCrmLeadInfo,
		error: crmLeadInfoError,
	} = useQuery(["crm-lead-info", { lead_id }], getLeadInfoFromCRM, {
		enabled: !!crmLeadInfoEnabled,
	});

	// This route is for only Sellsy to  get addresses of the company(country and zipcode)
	const getAddresses = accountId =>
		AuthorizedApi.get(
			`/v2/sales/lead/addresses?account_id=${accountId}&integration_type=sellsy`
		).then(res => res.data.data);

	const { mutate: fetchAddresses, isLoading: fetchAddressesLoading } =
		useMutation(getAddresses);

	const removeDuplicatesApi = lead_id =>
		AuthorizedApi.post(`/v1/sales/lead/duplicate/remove`, { lead_id }).then(
			res => res.data
		);

	const { mutate: removeDuplicates } = useMutation(removeDuplicatesApi);

	const getDuplicateLeadsAPI = lead_id =>
		AuthorizedApi.get(`/v2/sales/lead/duplicate/${lead_id}`)
			.then(res => {
				return res.data.data.data.duplicates;
			})
			.catch(error => {
				if (
					error.response.status === 400 &&
					error.response.data.msg.includes("Duplicates not found")
				)
					removeDuplicates(lead_id);
				return [];
			});

	const { mutate: getDuplicateLeads, isLoading: duplicateLeadsLoading } =
		useMutation(getDuplicateLeadsAPI);

	const updateLeadApi = body =>
		AuthorizedApi.post(`/v2/sales/lead/update`, body).then(res => res.data);

	const { mutateAsync: updateLead, isLoading: updateLeadLoading } = useMutation(
		updateLeadApi,
		{
			onSettled: (_, err, { lead_id }) => {
				queryClient.invalidateQueries(["lead", lead_id]);
			},
		}
	);

	//activities
	const markActivityRead = async (id, cb) => {
		setError("");
		try {
			const url = `/sales/lead/activity/read/${id}`;
			const res = await AuthorizedApi.get(url);
			const data = await res.data;
			if (res.status != 200)
				throw new Error(data.msg || "Failed to mark activity as read");
			if (cb && typeof cb === "function") cb();
		} catch (err) {
			setError(err.message);
		}
	};

	const enrichLeadWithLushaApi = lead_id =>
		AuthorizedApi.post(`/v2/sales/lead/${lead_id}/enrich/lusha`).then(res => res.data);

	const { mutate: enrichLeadWithLusha, isLoading: enrichLeadLushaLoading } =
		useMutation(enrichLeadWithLushaApi);

	const enrichLeadWithKasprApi = lead_id =>
		AuthorizedApi.post(`/v2/sales/lead/${lead_id}/enrich/kaspr`).then(res => res.data);

	const { mutate: enrichLeadWithKaspr, isLoading: enrichLeadKasprLoading } =
		useMutation(enrichLeadWithKasprApi);

	const enrichLeadWithHunterApi = lead_id =>
		AuthorizedApi.post(`/v2/sales/lead/${lead_id}/enrich/hunter`).then(res => res.data);

	const { mutate: enrichLeadWithHunter, isLoading: enrichLeadHunterLoading } =
		useMutation(enrichLeadWithHunterApi);

	const enrichLeadWithDropcontactApi = lead_id =>
		AuthorizedApi.post(`/v2/sales/lead/${lead_id}/enrich/dropcontact`).then(
			res => res.data
		);

	const { mutate: enrichLeadWithDropcontact, isLoading: enrichLeadDropcontactLoading } =
		useMutation(enrichLeadWithDropcontactApi);

	const enrichLeadWithSnovApi = lead_id =>
		AuthorizedApi.post(`/v2/sales/lead/${lead_id}/enrich/snov`).then(res => res.data);

	const { mutate: enrichLeadWithSnov, isLoading: enrichLeadSnovLoading } =
		useMutation(enrichLeadWithSnovApi);

	const updateLeadStatusApi = async body => {
		let url = "";
		url =
			body?.tab === "account"
				? `/v2/sales/lead/status/account/${body?.account_id}`
				: `/v2/sales/lead/status/lead/${body.lead_id}`;
		return await AuthorizedApi.put(url, {
			status: body.status,
		}).then(res => res.data);
	};

	// lead/status/lead/{lead.id} it works for lead, candidate, and contact
	// lead/status/account/{account.id} for account => bullhorn

	const { mutate: updateLeadStatus, isLoading: updateLeadStatusLoading } =
		useMutation(updateLeadStatusApi);

	const convertLeadApi = async body => {
		return await AuthorizedApi.post("/v2/sales/lead/convert", body).then(res => res.data);
	};

	const { mutate: updateConvertLead, isLoading: updateConvertLeadLoading } =
		useMutation(convertLeadApi);

	const disqualifiedLeadApi = async body => {
		return await AuthorizedApi.post("/v2/sales/lead/disqualify", body).then(
			res => res.data
		);
	};

	const { mutate: updateDisqalifyLead, isLoading: updateDisqualifyLoading } =
		useMutation(disqualifiedLeadApi);

	const customWebhookApi = async body => {
		return await AuthorizedApi.post("/v2/sales/lead/execute-webhook", body).then(
			res => res.data
		);
	};

	const { mutate: customWebhook, isLoading: customWebhookLoading } =
		useMutation(customWebhookApi);

	const removeHotLeadStatusApi = async body => {
		return await AuthorizedApi.put(
			`/v2/sales/lead/reset-lead-score/${body.lead_id}`
		).then(res => res.data);
	};

	const { mutate: removeHotLeadStatus, isLoading: removeHotLeadStatusLoading } =
		useMutation(removeHotLeadStatusApi);

	//FETCH
	let KEY = "GET_LEAD_SCORE_REASONS";
	let RECORDS_PER_PAGE = 10;
	const getLeadScoreReasonsForLeadApi = async ({ queryKey, pageParam: offset = 0 }) => {
		if (lead_id) {
			let { lead_id } = queryKey[1];
			return AuthorizedApi.get(`/v2/sales/lead/lead-score-reasons/${lead_id}`, {
				params: {
					limit: RECORDS_PER_PAGE,
					offset,
				},
			}).then(res => {
				return res.data.data;
			});
		} else return null;
	};

	const {
		data: leadScoreReasonsData,
		isLoading: leadScoreReasonsLoading,
		refetch: refetchLeadScoreReasons,
		isRefetching: leadScoreReasonsRefetching,
		error: leadScoreReasonsError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery(
		[
			KEY,
			{
				lead_id,
			},
		],
		getLeadScoreReasonsForLeadApi,
		{
			enabled: reasons,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				return pages.length * RECORDS_PER_PAGE;
			},
			select: data => data?.pages?.map(page => page)?.flat(),
		}
	);

	// Fetch lead score
	const fetchLeadScoreApi = ({ queryKey }) => {
		let { lead_id } = queryKey[1];
		if (lead_id)
			return AuthorizedApi.get(`/v2/sales/lead/lead-score/${lead_id}`).then(
				res => res.data?.data
			);
		return null;
	};

	const { data: leadScoreData, loading: leadScoreDataLoading } = useQuery(
		["leadScore", { lead_id }],
		fetchLeadScoreApi,
		{
			enabled: reasons,
		}
	);

	// Fetch lead country for bullhorn only

	const fetchLeadCountryApi = () => {
		return AuthorizedApi.get(
			`v2/admin/company-settings/company-field-map/describePicklist/country`
		).then(res => res.data?.data);
	};

	const { mutate: leadCountryData, isLoading: leadCountryDataLoading } =
		useMutation(fetchLeadCountryApi);

	const addLeadsToCadenceApi = ({ body, integration_type, type }) =>
		AuthorizedApi.post(getAddLeadsUrl({ integration_type, type }), body).then(
			res => res.data?.data
		);

	const { mutate: addLeadsToCadence, isLoading: addLeadsToCadenceLoading } =
		useMutation(addLeadsToCadenceApi);

	return {
		fetchAddresses,
		fetchAddressesLoading,
		leadInfo,
		leadInfoRefetch,
		leadInfoLoading,
		fieldMap,
		fieldMapRefetch,
		fieldMapLoading,
		cadenceList,
		cadenceListRefetch,
		cadenceListLoading,
		leadActivities,
		activitiesLoading,
		activitiesRefetch,
		updateLead,
		updateLeadLoading,
		activeLeadId,
		setActiveLeadId,
		crmLeadInfo,
		refetchCrmLeadInfo,
		crmLeadInfoLoading,
		refetchingCrmLeadInfo,
		crmLeadInfoError,
		setNextNodeId,
		markActivityRead,
		enrichLeadWithLusha,
		enrichLeadLushaLoading,
		enrichLeadWithKaspr,
		enrichLeadKasprLoading,
		enrichLeadWithHunter,
		enrichLeadHunterLoading,
		enrichLeadWithDropcontact,
		enrichLeadDropcontactLoading,
		enrichLeadWithSnov,
		enrichLeadSnovLoading,
		getDuplicateLeads,
		duplicateLeadsLoading,
		updateLeadStatus,
		updateLeadStatusLoading,
		updateConvertLead,
		updateConvertLeadLoading,
		updateDisqalifyLead,
		updateDisqualifyLoading,
		customWebhook,
		customWebhookLoading,
		removeHotLeadStatus,
		removeHotLeadStatusLoading,
		leadScoreReasonsData,
		leadScoreReasonsLoading,
		refetchLeadScoreReasons,
		leadScoreReasonsRefetching,
		leadScoreReasonsError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		leadScoreData,
		leadScoreDataLoading,

		// Lead country Data for bullhorn
		leadCountryData,
		leadCountryDataLoading,
		//Add Leads To Cadence
		addLeadsToCadence,
		addLeadsToCadenceLoading,
	};
};

export default useLead;
