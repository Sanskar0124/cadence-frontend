import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const useAdvanceWorkflow2 = () => {
	const queryClient = useQueryClient();

	const KEY = "advance-workflow";

	const fetchAdvanceWorkflowApi = () =>
		AuthorizedApi.get("v2/admin/automated-workflow").then(res => res.data.data);

	const getLeadOptions = () => {
		return Promise.all([
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/lead"),
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/user"),
		]).then(res => {
			let totalLeadOptions = [];
			res.forEach((leadoptions, index) => {
				let model_type = index == "0" ? "lead" : "user";
				let option_type = index == "0" ? "Lead" : "User";

				leadoptions?.data?.data?.forEach(
					leadoption =>
						leadoption.type !== "multipicklist" &&
						leadoption.type !== "address" &&
						leadoption.type !== "boolean" &&
						(totalLeadOptions = [
							...totalLeadOptions,
							{
								label: leadoption.label,
								value: `${leadoption.name}.${model_type}`,
								data_type: leadoption.type,
								option_type,
								model_type,
								...(leadoption.type === "picklist" && {
									picklistValues: leadoption.picklistValues.map(i => ({
										label: i?.label,
										value: i?.value,
									})),
								}),
							},
						])
				);
			});
			return totalLeadOptions;
		});
	};

	const { mutate: fetchLeadOptions, isLoading: fetchLeadOptionsLoading } =
		useMutation(getLeadOptions);

	const getContactOptions = () => {
		return Promise.all([
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/contact"),
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/user"),
			AuthorizedApi.get("/v2/admin/company-settings/company-field-map/describe/account"),
		]).then(res => {
			let totalContactOptions = [];
			res.forEach((contactoptions, index) => {
				let model_type = index == "0" ? "lead" : index == "1" ? "user" : "account";
				let option_type = index == "0" ? "Contact" : index == "1" ? "User" : "Account";

				contactoptions?.data?.data?.forEach(
					contactoption =>
						contactoption.type !== "multipicklist" &&
						contactoption.type !== "address" &&
						contactoption.type !== "boolean" &&
						(totalContactOptions = [
							...totalContactOptions,
							{
								label: contactoption.label,
								value: `${contactoption.name}.${model_type}`,
								data_type: contactoption.type,
								option_type,
								model_type,
								...(contactoption.type === "picklist" && {
									picklistValues: contactoption.picklistValues.map(i => ({
										label: i?.label,
										value: i?.value,
									})),
								}),
							},
						])
				);
			});
			return totalContactOptions;
		});
	};
	const { mutate: fetchContactOptions, isLoading: fetchContactOptionsLoading } =
		useMutation(getContactOptions);
	const {
		data: workflows,
		isLoading: workflowsLoading,
		isError: workflowsError,
	} = useQuery(KEY, fetchAdvanceWorkflowApi);

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
		onSuccess: () => queryClient.invalidateQueries(KEY),
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
		fetchContactOptions,
		fetchContactOptionsLoading,
		fetchLeadOptions,
		fetchLeadOptionsLoading,
	};
};

export default useAdvanceWorkflow2;
