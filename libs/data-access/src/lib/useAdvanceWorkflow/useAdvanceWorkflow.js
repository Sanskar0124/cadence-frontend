import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "../api";
import { optionsStrategy, functionStrategy } from "./useAdvanceWorkflow.strategy";
// Recoil Imports
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const useAdvanceWorkflow = () => {
	const queryClient = useQueryClient();

	const KEY = "advance-workflow";
	const integration_type = useRecoilValue(userInfo).integration_type;

	const fetchAdvanceWorkflowApi = () =>
		AuthorizedApi.get("v2/admin/automated-workflow").then(res => res.data.data);

	const {
		data: workflows,
		isLoading: workflowsLoading,
		isError: workflowsError,
	} = useQuery(KEY, fetchAdvanceWorkflowApi);

	const getOptions = ({ trigger }) => {
		return Promise.all(
			optionsStrategy({ integration_type, trigger }).map(option =>
				AuthorizedApi.get(option)
			)
		).then(res => functionStrategy({ integration_type, trigger })(res));
	};
	const { mutate: fetchOptions, isLoading: fetchOptionsLoading } =
		useMutation(getOptions);

	const createWorkflowApi = async body =>
		await AuthorizedApi.post("v2/admin/automated-workflow", body).then(
			res => res.data.data
		);

	const {
		mutate: createWorkflow,
		isLoading: createWorkflowLoading,
		isError: createWorkflowError,
	} = useMutation(createWorkflowApi, {
		onSuccess: () => queryClient.invalidateQueries(KEY),
	});

	const updateWorkflowApi = async ({ id, body }) => {
		return await AuthorizedApi.put(`/v2/admin/automated-workflow/${id}`, body).then(
			res => res.data.data
		);
	};

	const {
		mutate: updateWorkflow,
		isLoading: updateWorkflowLoading,
		isError: updateWorkflowError,
		isIdle: fetchingUpdateWorkflow,
	} = useMutation(updateWorkflowApi, {
		onSuccess: () => {
			queryClient.invalidateQueries(KEY);
		},
	});

	const deleteWorkflowApi = async id => {
		return await AuthorizedApi.delete(`/v2/admin/automated-workflow/${id}`).then(
			res => res.data.data
		);
	};

	const {
		mutate: deleteWorkflow,
		isLoading: deleteWorkflowLoading,
		isError: deleteWorkflowError,
	} = useMutation(deleteWorkflowApi, {
		onSuccess: () => queryClient.invalidateQueries(KEY),
	});

	return {
		workflows,
		workflowsLoading,
		workflowsError,
		createWorkflow,
		createWorkflowLoading,
		createWorkflowError,
		updateWorkflow,
		updateWorkflowLoading,
		updateWorkflowError,
		deleteWorkflow,
		deleteWorkflowLoading,
		deleteWorkflowError,
		fetchOptions,
		fetchOptionsLoading,
	};
};

export default useAdvanceWorkflow;
