/* eslint-disable no-console */
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const KEY = "workflows";

const useWorkflows = (enabled = true) => {
	const queryClient = useQueryClient();

	const fetchWorkflows = () =>
		AuthorizedApi.get("/v2/admin/workflow?option=company").then(res => res.data.data);

	const { data: workflows, isLoading: workflowsLoading } = useQuery(KEY, fetchWorkflows, {
		enabled,
	});

	const createWorkflowApi = body => {
		// console.log(body)
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
			}, 1000);
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
		workflows,
		workflowsLoading,
		createWorkflow,
		updateWorkflow,
		deleteWorkflow,
		createWorkflowLoading,
		updateWorkflowLoading,
		deleteWorkflowLoading,
		updateWorkflowSuccess,
	};
};

export default useWorkflows;
