/* eslint-disable no-console */
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const KEY = "workflows";

const useCadenceWorkflows = ({ cadence_id = 0 }) => {
	const queryClient = useQueryClient();
	const fetchCadenceWorkflowsApi = async ({ queryKey }) => {
		const cadence_id = queryKey[1];
		return await AuthorizedApi.get(
			`/v2/admin/workflow?option=cadence&cadence_id=${cadence_id}`
		).then(res => res.data.data);
	};

	const {
		data: fetchCadenceWorkflows,
		isLoading: cadenceWorkflowsLoading,
		isError: fetchError,
		refetch: refetchCadenceWorkflows,
	} = useQuery([KEY, cadence_id], fetchCadenceWorkflowsApi);

	const createWorkflowApi = body => {
		// console.log(body)
		body?.id && delete body?.id;
		body?.index && delete body?.index;
		return AuthorizedApi.post("/v2/admin/workflow", body).then(res => res.data);
	};

	const { mutate: createWorkflow, isLoading: createWorkflowLoading } = useMutation(
		createWorkflowApi,
		{
			onSuccess: () => {
				queryClient.invalidateQueries(KEY);
			},
		}
	);

	const updateWorkflowApi = ({ id, body }) => {
		AuthorizedApi.put(`/v2/admin/workflow/${id}`, body).then(res => res.data);
	};
	const {
		mutate: updateWorkflow,
		isLoading: updateWorkflowLoading,
		isSuccess: updateWorkflowSuccess,
	} = useMutation(updateWorkflowApi, {
		onSuccess: () => {
			setTimeout(() => {
				queryClient.invalidateQueries(KEY);
			}, 10);
		},
	});

	const deleteWorkflowApi = (id, body) =>
		AuthorizedApi.delete(`/v2/admin/workflow/${id}`, body).then(res => res.data);

	const { mutate: deleteWorkflow, isLoading: deleteWorkflowLoading } = useMutation(
		deleteWorkflowApi,
		{
			onSuccess: () => {
				setTimeout(() => {
					queryClient.invalidateQueries(KEY);
				}, 10);
			},
		}
	);

	return {
		createWorkflow,
		updateWorkflow,
		deleteWorkflow,
		createWorkflowLoading,
		updateWorkflowLoading,
		deleteWorkflowLoading,
		updateWorkflowSuccess,
		fetchCadenceWorkflows,
		cadenceWorkflowsLoading,
	};
};

export default useCadenceWorkflows;
