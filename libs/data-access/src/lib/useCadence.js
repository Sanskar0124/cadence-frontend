/* eslint-disable no-console */
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const V1_ROUTE = "/v1/sales/department/cadence";
const V2_ROUTE = "/v2/sales/department/cadence";

const KEY = "cadences";

const DEFAULT_FILTER_OPTIONS = {
	status: null,
	priority: null,
	user_id: null,
	sd_id: null,
};

// const filtersFromLocalStorage = JSON.parse(localStorage.getItem("cadence_filters"));

const RECORDS_PER_PAGE = 20;

const useCadence = (
	enabled = true,
	type = "personal",
	searchValue = "",
	move_to_another_cadence = false
) => {
	const [filters, setFilters] = useState(DEFAULT_FILTER_OPTIONS);

	const queryClient = useQueryClient();

	//FETCH
	const fetchCadencesApi = async ({ queryKey, pageParam = 0 }) => {
		const { type, filters } = queryKey[1];
		//make favorite in filters to integer
		if (filters.favorite) filters.favorite = 1;
		else delete filters.favorite;
		return await AuthorizedApi.get(V2_ROUTE, {
			params: {
				type,
				...filters,
				limit: type === "recent" ? 10 : RECORDS_PER_PAGE,
				...(type !== "recent" && { offset: pageParam }),
				...(type === "recent" && pageParam !== 0 && { updated_at: pageParam }),
				...(searchValue.length > 0 && { search: searchValue }),
				...(move_to_another_cadence && {
					move_to_another_cadence: true,
				}),
			},
		}).then(res =>
			type === "recent"
				? res.data.data.map(cad => ({ ...cad.Cadence, updated_at: cad.updated_at }))
				: res.data.data
		);
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
	} = useInfiniteQuery(
		[KEY, { type, filters, searchValue, move_to_another_cadence }],
		fetchCadencesApi,
		{
			enabled,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				if (type === "recent") return lastPage[lastPage.length - 1].updated_at;
				return pages.length * RECORDS_PER_PAGE;
			},
			select: data => data?.pages?.map(page => page)?.flat(),
		}
	);

	const launchCadenceApi = cadenceId =>
		AuthorizedApi.get(`${V1_ROUTE}/launch/${cadenceId}`).then(res => res.data);

	const { mutate: launchCadence, isLoading: launchLoading } = useMutation(
		launchCadenceApi,
		{
			onSuccess: async (_, body) => {
				const cadence_id = body;
				queryClient.setQueryData(
					[KEY, { type, filters, searchValue, move_to_another_cadence }],
					prev => {
						let newPages = prev?.pages?.map(page =>
							page.map(cad => {
								if (cad.cadence_id === cadence_id)
									return { ...cad, status: "processing" };
								return cad;
							})
						);
						return { ...prev, pages: newPages };
					}
				);
				queryClient.setQueryData(["cadence", cadence_id], prev => ({
					...prev,
					status: "processing",
				}));
			},
		}
	);

	const pauseCadenceApi = body =>
		AuthorizedApi.put(`${V1_ROUTE}/pause`, body).then(res => res.data);

	const { mutate: pauseCadence, isLoading: pauseLoading } = useMutation(pauseCadenceApi, {
		onSuccess: async (_, body) => {
			const { cadence_id } = body;
			queryClient.setQueryData(
				[KEY, { type, filters, searchValue, move_to_another_cadence }],
				prev => {
					let newPages = prev?.pages?.map(page =>
						page.map(cad => {
							if (cad.cadence_id === cadence_id) return { ...cad, status: "processing" };
							return cad;
						})
					);
					return { ...prev, pages: newPages };
				}
			);
			queryClient.setQueryData(["cadence", cadence_id], prev => ({
				...prev,
				status: "processing",
			}));
		},
	});

	const duplicateCadenceApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/duplicate`, body).then(res => res.data.data);

	const {
		mutate: duplicateCadence,
		data: duplicateCadenceData,
		isLoading: duplicateCadenceLoading,
	} = useMutation(duplicateCadenceApi);

	// CREATE
	const createCadenceApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}`, body).then(res => res.data.data);

	const {
		mutate: createCadence,
		data: createdCadenceData,
		isLoading: createCadenceLoading,
	} = useMutation(createCadenceApi);

	// UPDATE
	const updateCadenceApi = cadence =>
		AuthorizedApi.put(`${V1_ROUTE}/${cadence.cadence_id}`, cadence).then(res => res.data);

	const { mutate: updateCadence, isLoading: updateLoading } = useMutation(
		updateCadenceApi,
		{
			onSuccess: async (_, body) => {
				await queryClient.cancelQueries([
					KEY,
					{ type, filters, searchValue, move_to_another_cadence },
				]);
				await queryClient.cancelQueries(["cadence", body.cadence_id]);
				queryClient.setQueryData(
					[KEY, { type, filters, searchValue, move_to_another_cadence }],
					prev => {
						let newPages = prev?.pages?.map(page =>
							page.map(cad => {
								if (cad.cadence_id === body.cadence_id)
									return {
										...cad,
										...(body.name && { name: body.name }),
										...(body.description && { description: body.description }),
										...(body.priority && { priority: body.priority }),
									};
								return cad;
							})
						);
						return { ...prev, pages: newPages };
					}
				);
				queryClient.setQueryData(["cadence", body.cadence_id], prev => ({
					...prev,
					...(body.name && { name: body.name }),
					...(body.description && { description: body.description }),
					...(body.priority && { priority: body.priority }),
				}));
			},
		}
	);

	// DELETE
	const deleteCadenceApi = cadence =>
		AuthorizedApi.delete(`${V1_ROUTE}/${cadence.cadence_id}`).then(res => res.data.data);

	const { mutate: deleteCadence, isLoading: deleteCadenceLoading } = useMutation(
		deleteCadenceApi,
		{
			onSuccess: (_, cadence) => {
				queryClient.setQueryData([KEY, { type, filters }], prev =>
					prev?.filter(cad => cad.cadence_id !== cadence.cadence_id)
				);
			},
		}
	);

	const stopCadenceForLeadApi = async body => {
		try {
			const url = `${V1_ROUTE}/lead/stop`;
			const res = await AuthorizedApi({
				method: "POST",
				data: body,
				url: url,
			});
			return res.data;
		} catch (err) {
			console.group("Error occured while stopping cadence for lead");
			console.log(err.message);
			console.groupEnd();
			throw new Error(err.message);
		}
	};

	const { mutate: stopCadenceforLead, isLoading: stopCadenceforLeadLoading } =
		useMutation(stopCadenceForLeadApi);

	const stopCadenceCurrentApi = async body => {
		try {
			const url = `${V2_ROUTE}/stop-current`;
			const res = await AuthorizedApi({
				method: "POST",
				data: body,
				url: url,
			});
			return res.data;
		} catch (err) {
			console.group("Error occured while stopping cadence");
			console.log(err.message);
			console.groupEnd();
			throw new Error(err.message);
		}
	};

	const { mutate: stopCadenceCurrent } = useMutation(stopCadenceCurrentApi);

	const shareCadenceApi = body =>
		AuthorizedApi.post(`${V2_ROUTE}/share`, body).then(res => res.data.data);

	const { mutate: shareCadence, isLoading: shareCadenceLoading } =
		useMutation(shareCadenceApi);

	// UPDATE
	const updateFavoriteApi = body =>
		AuthorizedApi.put(`${V2_ROUTE}/${body.cadence_id}/favorite`, {
			favorite: body.favorite,
		}).then(res => res.data);

	const { mutate: updateFavorite, isLoading: updateFavoriteLoading } = useMutation(
		updateFavoriteApi,
		{
			onSuccess: async (_, body) => {
				queryClient.setQueryData([KEY, { type, filters, searchValue }], prev => {
					let newPages = prev?.pages?.map(page =>
						page.map(cad => {
							if (cad.cadence_id === body.cadence_id)
								return {
									...cad,
									favorite: Boolean(body.favorite),
								};
							return cad;
						})
					);
					return { ...prev, pages: newPages };
				});
				queryClient.setQueryData(["cadence", body.cadence_id], prev => ({
					...prev,
					favorite: Boolean(body.favorite),
				}));
			},
		}
	);

	const getWorkflowsCountApi = cadenceId =>
		AuthorizedApi.get(`${V2_ROUTE}/check-workflow/${cadenceId}`).then(
			res => res.data.data
		);

	const {
		mutate: getWorkflowsCount,
		isLoading: getWorkflowsCountLoading,
		error: getWorkflowsCountError,
		data: workflowsCount,
	} = useMutation(getWorkflowsCountApi);

	useEffect(() => {
		return () => {
			queryClient.removeQueries([KEY, { type, filters, searchValue }], { exact: true });
		};
	}, [type]);

	return {
		filters,
		setFilters,
		cadencesData,
		fetchCadences,
		fetchCadencesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		launchCadence,
		pauseCadence,
		duplicateCadence,
		duplicateCadenceData,
		duplicateCadenceLoading,
		createCadence,
		createdCadenceData,
		updateCadence,
		updateLoading,
		deleteCadence,
		cadenceLoading,
		createCadenceLoading,
		cadenceRefetching,
		deleteCadenceLoading,
		actionLoading: launchLoading || pauseLoading,
		stopCadenceforLead,
		stopCadenceforLeadLoading,
		stopCadenceCurrent,
		shareCadence,
		shareCadenceLoading,
		updateFavorite,
		updateFavoriteLoading,
		workflowsCount,
		getWorkflowsCount,
		getWorkflowsCountLoading,
		getWorkflowsCountError,
	};
};

export default useCadence;
