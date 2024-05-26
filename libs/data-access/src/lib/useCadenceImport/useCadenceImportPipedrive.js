import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "../api";

const ENABLED_DEFAULT = {
	leads: false,
	cadences: false,
};

const useCadenceImportPipedrive = (
	{ view, selectedIds, excludedIds, filter, type, lead_id },
	enabled
) => {
	enabled = { ...ENABLED_DEFAULT, ...(enabled ?? {}) };

	const [progress, setProgress] = useState(0);

	//get leads
	const onProgress = progressEvent => {
		let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
		setProgress(percentCompleted);
	};

	const getList = async () => {
		let URL = `/v2/sales/department/cadence/import/pipedrive/?resource=person&view=${view}&selectedIds=${selectedIds}&excludedIds=${excludedIds}&filter=${filter}`;
		return AuthorizedApi.get(URL, {
			onDownloadProgress: progressEvent => onProgress(progressEvent),
		}).then(res => res.data.data);
	};

	const {
		data: leads,
		isLoading: importLoading,
		isError: importError,
		error: importErrorMessage,
	} = useQuery("leads-list", getList, { enabled: enabled.leads });

	//cadences associated
	const getCadencesAssociated = async ({ queryKey }) =>
		AuthorizedApi.get(`/v2/sales/lead/cadences/${queryKey[1]}`).then(res =>
			res.data.data[0]?.LeadToCadences.map(cadence => cadence?.Cadences[0])
		);

	const {
		data: cadencesAssociated,
		isLoading: cadencesAssociatedLoading,
		refetch: fetchCadenceAssociated,
	} = useQuery(["cadences-associated", lead_id], getCadencesAssociated, {
		enabled: false,
	});

	const addListApi = async body => {
		setProgress(0);
		let add =
			body.add?.persons?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/pipedrive/${
					type === "create_lead" ? "temp-persons" : "person"
				}`,
				body.add
			).then(res => res.data.data);

		let link =
			body.link?.persons?.length > 0 &&
			AuthorizedApi.post(
				`/v2/sales/department/cadence/import/pipedrive/link`,
				body.link
			).then(res => res.data.data);

		return Promise.all([add, link]);
	};

	const {
		mutate: addList,
		isLoading: addLoading,
		isSuccess: isAddSuccess,
	} = useMutation(addListApi);

	// Get leads via filter view

	const getFilterViewLeadApi = view => {
		return (
			view?.id &&
			AuthorizedApi.get(
				`v2/sales/department/cadence/import/pipedrive?resource=${view?.type}&view=custom_view&selectedIds=&filter_id=${view?.id}&excludedIds=`
			).then(res => res?.data?.data)
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
		isAddSuccess,
		importError: {
			error: importError,
			msg: importErrorMessage?.response?.data?.msg,
			pipedriveErrorMessage: importErrorMessage?.response?.data?.error,
		},
		cadencesAssociated,
		cadencesAssociatedLoading,
		fetchCadenceAssociated,
		getFilterViewLead,
		getFilterViewLeadLoading,
	};
};

export default useCadenceImportPipedrive;
