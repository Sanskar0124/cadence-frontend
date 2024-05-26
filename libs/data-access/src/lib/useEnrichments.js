import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const KEY = "enrichments";

const useEnrichments = (enabled = true) => {
	const fetchEnrichmentsApi = () =>
		AuthorizedApi.get("/v2/admin/enrichments").then(res => res.data);

	const { data: enrichmentsData, isLoading: enrichmentsLoading } = useQuery(
		KEY,
		fetchEnrichmentsApi,
		{
			enabled,
			refetchOnWindowFocus: false,
			select: data => {
				return data.data;
			},
		}
	);

	return { enrichmentsData, enrichmentsLoading };
};

export default useEnrichments;
