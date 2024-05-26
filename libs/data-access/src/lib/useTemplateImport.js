import { AuthorizedApi } from "./api";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";

const ROUTE = "/v2/sales/department/templates";
const KEY = "templates-import";

const TEMPLATE_ID_TYPES = {
	sms: "mt_id",
	email: "et_id",
	linkedin: "lt_id",
	script: "st_id",
};

const RECORDS_PER_PAGE = 10;

const useTemplateImport = ({ templateLevel, templateType, enabled = true }) => {
	const queryClient = useQueryClient();

	const fetchTemplatesApi = async ({ queryKey, pageParam: offset = 0 }) => {
		const { level, type } = queryKey[1];
		return AuthorizedApi.get(`${ROUTE}`, {
			params: {
				level,
				type,
				offset,
				limit: RECORDS_PER_PAGE,
				brief: true,
			},
		}).then(res => res.data.data);
	};

	const {
		data: templates,
		isLoading: templateLoading,
		isRefetching: templateRefetching,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery(
		[KEY, { level: templateLevel, type: templateType }],
		fetchTemplatesApi,
		{
			enabled: enabled,
			getNextPageParam: (lastPage, pages) => {
				if (!lastPage?.length) return undefined;
				return pages.length * RECORDS_PER_PAGE;
			},
			select: data => data.pages.map(page => page).flat(),
		}
	);

	return {
		templates,
		refetch,
		templateLoading,
		queryClient,
		KEY,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		refetch,
	};
};

export default useTemplateImport;
