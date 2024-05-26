import { AuthorizedApi } from "./api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { TEMPLATE_TYPES } from "@cadence-frontend/constants";
import { useState } from "react";

const ROUTE = "/v2/sales/department/templates";
const KEY = "templates";
const TEMPLATE_ID_TYPES = {
	sms: "mt_id",
	email: "et_id",
	linkedin: "lt_id",
	script: "st_id",
	video: "vt_id",
	whatsapp: "wt_id",
};

const DEFAULT_FILTER_OPTIONS = {
	users: [],
	groups: [],
};

const TEMPLATES_PER_PAGE = 10;

const useTemplate = ({ templateLevel, templateType }) => {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState(DEFAULT_FILTER_OPTIONS);
	const [selectedStat, setSelectedStat] = useState({
		stats: null,
		type: null,
		et_id: null,
	});

	const fetchTemplatesApi = async ({ queryKey, pageParam: offset = 0 }) => {
		const { type, level, filters } = queryKey[1];

		return await AuthorizedApi.get(ROUTE, {
			params: {
				type,
				level,
				limit: TEMPLATES_PER_PAGE,
				offset,
				...filters,
			},
		}).then(res => res.data.data);
	};

	const {
		data: templates,
		isLoading: templateLoading,
		refetch,
		error: fetchTemplatesError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery(
		[KEY, { level: templateLevel, type: templateType, filters }],
		fetchTemplatesApi,
		{
			enabled: true,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				return pages.length * TEMPLATES_PER_PAGE;
			},
			select: data => data?.pages?.map(page => page)?.flat(),
			retry: false,
		}
	);

	//  create template
	const createTemplateApi = async body =>
		AuthorizedApi.post(`${ROUTE}`, body).then(res => res.data);

	const { mutate: createTemplate, isLoading: createLoading } = useMutation(
		[KEY, { level: templateLevel, type: templateType, filters }],
		createTemplateApi,
		{
			onSettled: data => {
				refetch();
			},
		}
	);

	const {
		data: leads,
		error: leadsError,
		isLoading: leadsLoading,
	} = useQuery(
		[KEY, selectedStat.et_id, selectedStat.type],
		async ({ queryKey }) => {
			return AuthorizedApi.get(
				`${ROUTE}/get-leads?et_id=${selectedStat.et_id}&status=${selectedStat.type}`
			);
		},
		{
			select: data => {
				console.log("data of leads", data);
				return data.data.data;
			},
			enabled: Boolean(selectedStat.stats),
		}
	);

	// Get total templates

	const {
		data: templateCount,
		error: countError,
		isLoading: countLoading,
		refetch: refetchCount,
	} = useQuery(
		"KEY",
		async () => {
			return AuthorizedApi.get(`${ROUTE}?get_count=1&level=${templateLevel}`).then(
				res => res.data
			);
		},
		{ enabled: false, select: data => data.data }
	);

	// update template
	const updateTemplateApi = async body =>
		AuthorizedApi.patch(`${ROUTE}`, body).then(res => res.data);

	const { mutateAsync: updateTemplate, isLoading: updateLoading } = useMutation(
		updateTemplateApi,
		{
			onSettled: () => {
				refetch();
			},
		}
	);

	// delete template
	const deleteTemplateApi = async template => {
		const id = TEMPLATE_ID_TYPES[template.type];
		return AuthorizedApi.delete(`${ROUTE}/${template[id]}?type=${template.type}`).then(
			res => res.data
		);
	};

	const { mutate: deleteTemplate } = useMutation(deleteTemplateApi, {
		onSuccess: () => {
			refetch();
		},
	});

	// duplicate template
	const duplicateTemplateApi = async body => {
		return AuthorizedApi.post(`${ROUTE}/duplicate`, { ...body, type: templateType }).then(
			res => res.data
		);
	};

	const { mutate: duplicateTemplate, isLoading: duplicateLoading } = useMutation(
		duplicateTemplateApi,
		{
			onSettled: data => {
				refetch();
			},
		}
	);

	const shareTemplateApi = async body => {
		return AuthorizedApi.post(`${ROUTE}/share`, { ...body, type: templateType }).then(
			res => res.data
		);
	};

	const { mutate: shareTemplate, isLoading: shareLoading } = useMutation(
		shareTemplateApi,
		{
			onSettled: data => {
				refetch();
			},
		}
	);

	return {
		filters,
		setFilters,
		templates,
		refetch,
		createTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,
		shareTemplate,
		templateLoading,
		updateLoading,
		createLoading,
		duplicateLoading,
		shareLoading,
		queryClient,
		infiniteLoadData: { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage },
		templateCountData: { templateCount, countLoading, refetchCount },
		leadsData: { leads, leadsLoading, leadsError },
		selectedStat,
		setSelectedStat,
		KEY,
	};
};

export default useTemplate;
