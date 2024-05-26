import { useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const KEY = "leads-filter-cadences";

const useLeadsCadences = () => {
	const fetchLeadsCadencesApi = () =>
		AuthorizedApi.get("/v2/sales/department/cadence/lead-filter").then(
			res => res.data.data
		);

	const { data: cadences, isLoading: cadencesLoading } = useQuery(
		KEY,
		fetchLeadsCadencesApi,
		{
			retry: false,
		}
	);

	return { cadences, cadencesLoading };
};

export default useLeadsCadences;
