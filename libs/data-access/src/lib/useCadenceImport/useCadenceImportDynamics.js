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
	lead_list: "leads",
	contact_list: "contacts",
};

const SELECT_DATA_ROUTE = {
	lead: "leads",
	contact: "contacts",
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

const useCadenceImportDynamics = ({ id, type }, enabled) => {
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
			URL = `/v2/sales/department/cadence/import/dynamics/${type}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
				params: { id },
			}).then(res => res.data.data);
		} else {
			URL = `/v2/sales/department/cadence/import/dynamics/${type}`;
			return AuthorizedApi.get(URL, {
				onDownloadProgress: progressEvent => onProgress(progressEvent),
				params: { id },
			}).then(res => [res.data.data]);
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
				`/v2/sales/department/cadence/import/dynamics/${SELECT_DATA_ROUTE[type]}/import`,
				body.add
			).then(res => res.data.data);

		let link =
			body.link?.[SELECT_DATA[type]]?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/dynamics/link/${SELECT_DATA_ROUTE[type]}`,
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

	return {
		leads,
		importLoading,
		progress,
		addList,
		addLoading,
		importError: {
			error: importError,
			msg: importErrorMessage?.response?.data?.msg,
			dynamicsErrorMessage: importErrorMessage?.response?.data?.error,
		},
		isAddSuccess,
	};
};

export default useCadenceImportDynamics;
