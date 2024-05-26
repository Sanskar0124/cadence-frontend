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

const useCadenceImportLinkedinSalesforce = (
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
				`/v2/sales/department/cadence/import/salesforce/${SELECT_DATA[type]}`,
				body.add
			).then(res => res.data.data);

		let link =
			body.link?.[SELECT_DATA[type]]?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/salesforce/link/${SELECT_DATA[type]}`,
				body.link
			).then(res => res.data.data);

		return Promise.all([add, link]);
	};

	const { mutate: addList, isLoading: addLoading } = useMutation(addListApi);

	useEffect(() => {
		return () => {
			queryClient.removeQueries(["cadences", type], { exact: true });
		};
	}, [type]);

	const useSearchExport = () => {
		const postSearchExportApi = body =>
			AuthorizedApi.post(`/lead-extension/extension/linkedin/search-url`, body).then(
				res => res.data
			);

		const { mutate: postSearchExport, isLoading: postSearchExportLoading } =
			useMutation(postSearchExportApi);

		return {
			postSearchExport,
			postSearchExportLoading,
		};
	};

	const useBulkEnrichments = () => {
		const postBulkEnrichmentApi = body =>
			AuthorizedApi.post(`/lead-extension/extension/linkedin/bulk/lead/data`, body).then(
				res => res.data
			);

		const { mutate: postBulkEnrichment, isLoading: postBulkEnrichmentLoading } =
			useMutation(postBulkEnrichmentApi);

		return {
			postBulkEnrichment,
			postBulkEnrichmentLoading,
		};
	};

	const useExtensionFieldMap = () => {
		const postEnrichmentApi = body =>
			AuthorizedApi.post(`/lead-extension/extension/linkedin/field-map`, body).then(
				res => res.data
			);

		const { mutate: postExtensionFieldMap, isLoading: postExtensionFieldMapLoading } =
			useMutation(postEnrichmentApi);

		return {
			postExtensionFieldMap,
			postExtensionFieldMapLoading,
		};
	};

	const useProfilesExport = () => {
		const postProfilesExportApi = body =>
			AuthorizedApi.post(
				`/lead-extension/extension/integrations/import/profiles`,
				body
			).then(res => res.data);

		const { mutate: postProfilesExport, isLoading: postProfilesExportLoading } =
			useMutation(postProfilesExportApi);

		return {
			postProfilesExport,
			postProfilesExportLoading,
		};
	};

	return {
		leads,
		importLoading,
		progress,
		addList,
		addLoading,
		importError: { error: importError, msg: importErrorMessage?.response?.data?.msg },
		useSearchExport,
		useBulkEnrichments,
		useProfilesExport,
		useExtensionFieldMap,
	};
};

export default useCadenceImportLinkedinSalesforce;
