import { useState, useEffect } from "react";
import { AuthorizedApi } from "../api";
import { useMutation, useInfiniteQuery } from "react-query";

const ENABLED_DEFAULT = {
	leads: false,
	cadences: false,
};

const useCadenceImportSellsy = ({ type }, enabled) => {
	enabled = { ...ENABLED_DEFAULT, ...(enabled ?? {}) };

	const [progress, setProgress] = useState(0);
	const [filters, setFilters] = useState(
		sessionStorage.getItem("api-import-filters")
			? JSON.parse(sessionStorage.getItem("api-import-filters"))
			: {}
	);

	const KEY = "leads-list";

	const getContactApi = async ({ queryKey, pageParam: offset = 0 }) => {
		let CONTACT_URL = "/v2/sales/department/cadence/import/sellsy/contact-list";

		const { filters } = queryKey[1];

		return await AuthorizedApi.post(CONTACT_URL, {
			order: "created_at",
			direction: "desc",
			limit: 10,
			offset: offset,
			filters: filters ?? {},
		}).then(res => res.data?.data);
	};

	const {
		data: contactData,
		fetchNextPage,
		hasNextPage,
		isLoading: contactLoading,
		isFetching,
		isFetchingNextPage,
		error: getLeadListError,
	} = useInfiniteQuery([KEY, { filters }], getContactApi, {
		enabled: enabled.leads,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage?.length) return undefined;
			return pages.length * 10;
		},
		select: data => {
			return data?.pages?.map(page => page)?.flat();
		},
	});

	const addListApi = async body => {
		setProgress(0);
		let add;
		let link;

		add =
			body.add?.contacts?.length > 0 &&
			AuthorizedApi.post(
				type === "create_lead"
					? `/v2/sales/department/cadence/import/sellsy/temp-contacts`
					: `/v2/sales/department/cadence/import/sellsy/contact/add`,
				{
					...body.add,
					contacts: body.add.contacts,
				}
			).then(res => res.data.data);
		link =
			body.link?.contacts?.length > 0 &&
			AuthorizedApi.post(`/v2/sales/department/cadence/import/sellsy/link`, {
				...body.link,
				contacts: body.link.contacts,
			}).then(res => res.data.data);

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	const deleteLeadApi = async ({ contact_id }) =>
		AuthorizedApi.delete(`/v2/sales/department/cadence/import/sellsy/${contact_id}`);

	const { mutate: deleteLead, isLoading: deleteLoading } = useMutation(deleteLeadApi);

	return {
		progress,
		addList,
		addLoading,
		isAddSuccess,
		deleteLead,
		deleteLoading,
		filters,
		setFilters,
		contactData,
		fetchNextPage,
		hasNextPage,
		contactLoading,
		isFetching,
		isFetchingNextPage,
		getLeadListError,
		// importError: { error: importError, msg: importErrorMessage?.response?.data?.msg },
	};
};

export default useCadenceImportSellsy;

//utilities

export const base64ToFile = (dataurl, filename) => {
	var arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};
