import { useState, useEffect } from "react";
import { AuthorizedApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const TYPES = {
	LEAD: "lead",
	CONTACT: "contact",
	LEAD_LIST: "lead_list",
	CONTACT_LIST: "contact_list",
};

const SELECT_DATA = {
	lead: "leads",
	contact: "contacts",
	create_lead: "leads",
	lead_list: "leads",
	contact_list: "contacts",
};

const SELECT_DATA_ROUTE = {
	lead: "leads",
	contact: "contacts",
	create_lead: "temp-leads",
	lead_list: "leads",
	contact_list: "contacts",
};

const SELECT_DATA_SINGLE = {
	lead: "lead",
	contact: "contact",
	lead_list: "lead",
	contact_list: "contact",
};

const ENABLED_DEFAULT = {
	leads: false,
	cadences: false,
};

const useCadenceImportSalesforce = (
	{ salesforce_id, list_id, type, selections, lead_id },
	enabled
) => {
	enabled = { ...ENABLED_DEFAULT, ...(enabled ?? {}) };
	const queryClient = useQueryClient();

	const [progress, setProgress] = useState(0);

	//get leads
	const onProgress = progressEvent => {
		let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
		setProgress(percentCompleted);
	};

	const getList = async () => {
		let URL = "";
		if (type === TYPES.CONTACT_LIST || type === TYPES.LEAD_LIST) {
			URL = `/v2/sales/department/cadence/import/salesforce/${type}/${list_id}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
				params: { selections: selections?.join(",") },
			}).then(res => res.data.data[SELECT_DATA[type]]);
		} else {
			URL = `/v2/sales/department/cadence/import/salesforce/${type}/${salesforce_id}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
				params: { selections: selections?.join(",") },
			}).then(res => [res.data.data[SELECT_DATA_SINGLE[type]]]);
		}
	};

	const {
		data: leads,
		isLoading: importLoading,
		isError: importError,
		error: importErrorMessage,
	} = useQuery("leads-list", getList, { enabled: enabled.leads });

	const addListApi = async body => {
		setProgress(0);
		let add =
			body.add?.[SELECT_DATA[type]]?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/salesforce/${SELECT_DATA_ROUTE[type]}`,
				body.add
			).then(res => res.data.data);

		let link =
			body.link?.[SELECT_DATA[type]]?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/salesforce/link/${SELECT_DATA_ROUTE[type]}`,
				body.link
			).then(res => res.data.data);

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	useEffect(() => {
		return () => {
			queryClient.removeQueries(["cadences", type], { exact: true });
		};
	}, [type]);

	// Get leade via filter view
	const getFilterViewLeadApi = view => {
		return (
			view?.id &&
			AuthorizedApi.get(
				`/v2/sales/department/cadence/import/salesforce/${view?.type}/${view?.id}`
			).then(res => res.data.data)
		);
	};

	const { mutate: getFilterViewLead, isLoading: getFilterViewLeadLoading } =
		useMutation(getFilterViewLeadApi);

	return {
		leads,
		importLoading,
		progress,
		addList,
		addLoading,
		importError: {
			error: importError,
			msg: importErrorMessage?.response?.data?.msg,
			salesforceErrorMessage: importErrorMessage?.response?.data?.error,
		},
		isAddSuccess,

		// Filter View
		getFilterViewLead,
		getFilterViewLeadLoading,
	};
};

export default useCadenceImportSalesforce;
