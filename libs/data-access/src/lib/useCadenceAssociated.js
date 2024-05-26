/* eslint-disable no-console */
import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const useCadenceAssociated = (enabled, leadId, cadenceId) => {
	const cadenceAssociatedApi = async ({ queryKey }) => {
		const lead_Id = queryKey[1];
		const cadence_Id = queryKey[2];

		return await AuthorizedApi.get(
			`/v1/sales/department/cadence/lead/sidebar/${lead_Id}/${cadence_Id}`
		).then(res => res.data.data);
	};

	const {
		data: cadenceAssociated,
		isLoading: cadenceAssociatedLoading,
		refetch: fetchCadenceAssociated,
		isRefetching: cadenceAssociatedRefetching,
	} = useQuery(["cadence-associated", leadId, cadenceId], cadenceAssociatedApi, {
		enabled,
	});

	return {
		cadenceAssociated,
		cadenceAssociatedLoading,
		fetchCadenceAssociated,
		cadenceAssociatedRefetching,
	};
};

export default useCadenceAssociated;
