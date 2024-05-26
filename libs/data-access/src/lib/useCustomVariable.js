import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useCustomVariables = lead_id => {
	const replaceCustomVariablesSalesforceApi = body =>
		AuthorizedApi.post(`/v2/sales/lead/custom-variable`, { lead_id, body }).then(
			res => res?.data?.data
		);
	const { isLoading: replaceCustomVariablesLoading, mutate: replaceCustomVariables } =
		useMutation(replaceCustomVariablesSalesforceApi);
	return {
		replaceCustomVariables,
		replaceCustomVariablesLoading,
	};
};
export default useCustomVariables;
