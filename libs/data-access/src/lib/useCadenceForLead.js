import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { AuthorizedApi } from "./api";

const V1_ROUTE = "/v1/sales/department/cadence";
const V2_ROUTE = "/v2/sales/department/cadence";
const KEY = "cadence-for-lead";

const DEFAULT_FILTER_OPTIONS = {
	status: null,
	user_ids: [],
};

const filtersFromLocalStorage = () =>
	JSON.parse(localStorage.getItem("cadence_leads_filters"));

const RECORDS_PER_PAGE = 20;

const useCadenceForLead = (
	{ cadenceId },
	enabled = true,
	searchValue = "",
	selectAllLeads
) => {
	const queryClient = useQueryClient();

	const [filters, setFilters] = useState(DEFAULT_FILTER_OPTIONS);

	const getLeadsApi = ({ pageParam: offset = 0 }) => {
		const body = {
			...filters,
			cadence_id: cadenceId,
			limit: RECORDS_PER_PAGE,
			offset,
			...(searchValue.length > 0 && { search: searchValue }),
		};
		return AuthorizedApi.post(`${V2_ROUTE}/leads`, body).then(res =>
			res.data.data.map(lead => ({
				...lead.Leads[0],
				lead_cadence_id: lead.lead_cadence_id,
				unix_resume_at: lead.unix_resume_at,
				lead_cadence_status: lead.status,
			}))
		);
	};

	const {
		data: leadsData,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		refetch: refetchLeads,
	} = useInfiniteQuery([KEY, { filters, searchValue }], getLeadsApi, {
		enabled,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return pages.length * RECORDS_PER_PAGE;
		},
		select: data => {
			return data.pages.map(page => page).flat();
		},
	});

	const resumeCadenceForLeadApi = body => {
		const { lead_id, cadence_ids } = body;
		const bodyObj = { lead_id, cadence_ids };
		return AuthorizedApi.post(`${V1_ROUTE}/lead/resume`, bodyObj).then(res => res.data);
	};

	const { mutate: resumeCadenceForLead, isLoading: resumeLoading } = useMutation(
		resumeCadenceForLeadApi,
		{
			onSuccess: (_, body) => {
				const { lead_id } = body;
				queryClient.setQueryData([KEY, { filters, searchValue }], prev => {
					let newPages = prev?.pages?.map(page =>
						page.map(lead => {
							if (lead.lead_id === lead_id)
								return { ...lead, lead_cadence_status: "in_progress" };
							return lead;
						})
					);
					return { ...prev, pages: newPages };
				});
			},
		}
	);

	const pauseCadenceForLeadApi = body => {
		let { lead_id, lead_ids, cadence_ids, pauseFor } = body;
		if (lead_id) lead_ids = [lead_id];
		const bodyObj = { lead_ids, cadence_ids, pauseFor };
		return AuthorizedApi.post(`${V1_ROUTE}/lead/pause`, bodyObj).then(
			res => res.data,
			err => err.message
		);
	};

	const {
		mutateAsync: pauseCadenceForLead,
		isLoading: pauseLoading,
		data: pauseCadenceForLeadData,
	} = useMutation(pauseCadenceForLeadApi, {
		onSuccess: (_, body) => {
			const { lead_id } = body;
			queryClient.setQueryData([KEY, { filters, searchValue }], prev => {
				let newPages = prev?.pages?.map(page =>
					page.map(lead => {
						if (lead.lead_id === lead_id)
							return { ...lead, lead_cadence_status: "paused" };
						return lead;
					})
				);
				return { ...prev, pages: newPages };
			});
		},
	});

	const bulkPauseCadenceApi = body => {
		let { cadence_id, lead_ids, option } = body;
		const bodyObj = {
			cadence_id,
			...(!selectAllLeads && { lead_ids: lead_ids }),
			option,
		};
		return AuthorizedApi.post(`${V2_ROUTE}/pause`, bodyObj).then(res => res.data);
	};
	const {
		mutateAsync: bulkPauseCadence,
		isLoading: bulkPauseLoading,
		data: bulkPauseCadenceData,
	} = useMutation(bulkPauseCadenceApi);

	const bulkStopCadenceApi = body => {
		let { cadence_id, lead_ids, option } = body;
		const bodyObj = {
			cadence_id,
			...(!selectAllLeads && { lead_ids: lead_ids }),
			option,
		};
		return AuthorizedApi.post(`${V2_ROUTE}/stop`, bodyObj).then(res => res.data);
	};
	const {
		mutateAsync: bulkStopCadence,
		isLoading: bulkStopLoading,
		data: bulkStopCadenceData,
	} = useMutation(bulkStopCadenceApi);

	const bulkResumeCadenceApi = body => {
		let { cadence_id, lead_ids, option } = body;
		const bodyObj = {
			cadence_id,
			...(!selectAllLeads && { lead_ids: lead_ids }),
			option,
		};
		return AuthorizedApi.post(`${V2_ROUTE}/resume`, bodyObj).then(res => res.data);
	};
	const {
		mutateAsync: bulkResumeCadence,
		isLoading: bulkResumeLoading,
		data: bulkResumeCadenceData,
	} = useMutation(bulkResumeCadenceApi);

	// const stopCadenceForLeadApi = body =>
	// 	AuthorizedApi.post(`${V2_ROUTE}/stop-current`, body).then(res => res.data);

	// const { mutate: stopCadenceForLead, isLoading: stopLoading } =
	// 	useMutation(stopCadenceForLeadApi);

	const stopCadenceForLeadApi = body => {
		// let { lead_ids, status, reason, cadence_ids } = req.body;
		return AuthorizedApi.post(`${V1_ROUTE}/lead/stop`, body).then(
			res => res.data,
			err => err.message
		);
	};

	const deleteLeadsApi = body => {
		let { cadence_id, lead_ids, option, cadence_option } = body;
		const bodyObj = {
			cadence_id,
			...(!selectAllLeads && { lead_ids }),
			option,
			cadence_option,
		};
		return AuthorizedApi.delete(`/v2/sales/lead/delete`, { data: bodyObj }).then(
			res => res.data
		);
	};

	const { mutate: deleteLeads, isLoading: deleteLeadsLoading } = useMutation(
		deleteLeadsApi,
		{
			onSuccess: () => {
				queryClient.invalidateQueries([KEY, { filters, searchValue }]);
				queryClient.invalidateQueries("cadences-leads-stats");
			},
		}
	);

	const {
		mutate: stopCadenceForLead,
		isLoading: stopLoading,
		data: stopCadenceForLeadData,
	} = useMutation(stopCadenceForLeadApi);

	const stopAndReassignCadenceApi = body => {
		let { cadence_to_stop, cadence_to_start, lead_ids, option } = body;
		const bodyObj = {
			cadence_to_stop,
			cadence_to_start,
			...(!selectAllLeads && { lead_ids: lead_ids }),
			option,
		};
		return AuthorizedApi.post(`${V1_ROUTE}/reassign`, bodyObj).then(res => res.data);
	};

	const { mutate: stopAndReassignCadence, isLoading: stopAndReassignLoading } =
		useMutation(stopAndReassignCadenceApi);

	const reassignCadenceLeadsApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/reassign/leads`, {
			...body,
			cadence_id: `${cadenceId}`,
		}).then(res => res.data);

	const { mutate: reassignLeads, isLoading: reassignLeadsLoading } = useMutation(
		reassignCadenceLeadsApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries([KEY, { filters, searchValue }]);
			},
		}
	);

	//For reassignment
	const getAllLeadsApi = () => {
		const body = {
			...filters,
			cadence_id: cadenceId,
		};
		return AuthorizedApi.post(`${V2_ROUTE}/leads`, body).then(res =>
			res.data.data.map(lead => ({
				...lead.Leads[0],
				lead_cadence_id: lead.lead_cadence_id,
				unix_resume_at: lead.unix_resume_at,
				lead_cadence_status: lead.status,
			}))
		);
	};

	const { mutate: getAllLeadsData, isLoading: getAllLeadsLoading } =
		useMutation(getAllLeadsApi);
	const importGoogleSheetApi = body =>
		AuthorizedApi.post("/v1/google/sheets/create-leads", body).then(res => res.data);

	const { mutate: importGoogleSheet, isLoading: importGoogleSheetLoading } =
		useMutation(importGoogleSheetApi);

	useEffect(() => {
		setFilters(filtersFromLocalStorage() ?? DEFAULT_FILTER_OPTIONS);
		return () => {
			queryClient.removeQueries([KEY, { filters, searchValue }], { exact: true });
		};
	}, []);

	return {
		leadsData,
		fetchNextPage,
		hasNextPage,
		RECORDS_PER_PAGE,
		isFetching,
		isFetchingNextPage,
		filters,
		setFilters,
		resumeCadenceForLead,
		pauseCadenceForLead,
		stopCadenceForLead,
		stopAndReassignCadence,
		reassignLeads,
		getAllLeadsData,
		deleteLeads,
		resumeLoading,
		pauseLoading,
		stopLoading,
		deleteLeadsLoading,
		pauseCadenceForLeadData,
		stopAndReassignLoading,
		reassignLeadsLoading,
		getAllLeadsLoading,
		stopCadenceForLeadData,
		importGoogleSheet,
		importGoogleSheetLoading,
		refetchLeads,
		bulkPauseCadence,
		bulkPauseLoading,
		bulkPauseCadenceData,
		bulkStopCadence,
		bulkStopLoading,
		bulkStopCadenceData,
		bulkResumeCadence,
		bulkResumeLoading,
		bulkResumeCadenceData,
	};
};

export default useCadenceForLead;
