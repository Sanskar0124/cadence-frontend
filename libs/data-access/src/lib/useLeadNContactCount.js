import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const useLeadNContactCount = user_id => {
	const getCounts = body =>
		AuthorizedApi.get(`/v2/sales/lead/count/${user_id}`, body).then(res => res.data.data);

	const { data: counts, isLoading: countsLoading } = useQuery(
		["lead-contact-counts", user_id],
		getCounts,
		{
			enabled: Boolean(user_id),
		}
	);

	return {
		leadCounts: counts?.leadCount || counts?.personsCount || 0,
		contactCounts: counts?.contactCount || counts?.hubspotContactCount || 0,
		countsLoading,
	};
};

export default useLeadNContactCount;
