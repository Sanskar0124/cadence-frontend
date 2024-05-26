import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const RECORDS_PER_PAGE = 20;
const KEY = "templates";

const ENABLED_DEFAULT = {
	template: false,
};

const useCadencesTemplates = (
	enabled,
	{ language = "english", searchValue = "", type, created_at }
) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const fetchCadencesTemplateApi = async ({ queryKey, pageParam }) => {
		const { type, language, searchValue } = queryKey[1];
		return await AuthorizedApi.get("/v2/sales/department/cadence-template", {
			params: {
				...(type !== "all_templates" && { type: type }),
				language,
				...(pageParam, { created_at: pageParam }),
				...(searchValue.length > 0 && { search: searchValue }),
			},
		}).then(res => res.data.data);
	};
	const {
		data: cadenceTemplates,
		isLoading: cadenceTemplateLoading,
		refetch: fetchCadenceTemplate,
		isRefetching: cadenceTempalteRefetching,
		error: fetchCadenceTemplateError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery([KEY, { type, language, searchValue }], fetchCadencesTemplateApi, {
		enabled: enabled.template,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return lastPage?.[lastPage.length - 1]?.created_at;
		},

		select: data => data?.pages?.map(page => page)?.flat(),
	});

	const sendTemplate = body => {
		const URL = "/v2/sales/department/cadence-template/use-template";
		return AuthorizedApi.post(URL, body).then(res => {
			return res?.data?.data;
		});
	};

	const {
		mutate: getSelectedTemplate,
		data,
		isLoading: templateLoading,
		isSuccess: success,
	} = useMutation(sendTemplate);

	return {
		cadenceTemplates,
		cadenceTemplateLoading,
		cadenceTempalteRefetching,
		fetchCadenceTemplate,
		fetchCadenceTemplateError,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		getSelectedTemplate,
		data,
		templateLoading,
		success,
	};
};
export default useCadencesTemplates;
