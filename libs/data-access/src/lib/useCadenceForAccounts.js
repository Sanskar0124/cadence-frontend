import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const V1_ROUTE = "/v1/sales/department/cadence";
const V2_ROUTE = "/v2/sales/department/cadence";
const KEY = "cadence-for-accounts";

const useCadenceForAccounts = ({ cadenceId }) => {
	const queryClient = useQueryClient();

	const fetchCadenceAccounts = () =>
		AuthorizedApi.get(`${V1_ROUTE}/accounts/${cadenceId}`).then(res => res.data.data);

	const { data: accounts, isLoading: accountsLoading } = useQuery(
		KEY,
		fetchCadenceAccounts,
		{
			retry: 1,
			retryDelay: 2000,
		}
	);

	return { accounts, accountsLoading };
};

export default useCadenceForAccounts;
