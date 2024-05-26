import { useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const V2_ROUTE = "/v2/sales/department/cadence";
const KEY = "cadences-leads-stats";

const useCadenceLeadsStats = ({ cadenceId }, enabled = true) => {
	const fetchCadenceLeadsStatsApi = () =>
		AuthorizedApi.get(`${V2_ROUTE}/${cadenceId}/stats`).then(res => res.data.data);

	const { data: cadenceLeadsStats, isLoading: cadenceLeadsStatsLoading } = useQuery(
		KEY,
		fetchCadenceLeadsStatsApi,
		{
			enabled,
		}
	);

	return {
		cadenceLeadsStats,
		cadenceLeadsStatsLoading,
	};
};

export default useCadenceLeadsStats;
