import { AuthorizedApi } from "./api";
import { useMutation, useQuery } from "react-query";

const KEY = "enrichments-access";

const useEnrichmentsAccess = (enabled = true) => {
	const fetchEnrichmentAccessApi = () =>
		AuthorizedApi.get("/v2/admin/enrichments/sub-departments").then(res => res.data);

	const { data: subDepartments, isLoading: enrichmentsAccessLoading } = useQuery(
		KEY,
		fetchEnrichmentAccessApi,
		{
			enabled,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			select: data => data.data,
		}
	);

	const updateEnrichmentsAccessApi = body =>
		AuthorizedApi.put("/v2/admin/enrichments/access", body).then(res => res.data);

	const { mutate: updateEnrichmentsAccess, isLoading: updateEnrichmentsAccessLoading } =
		useMutation(updateEnrichmentsAccessApi, {});

	return {
		subDepartments,
		enrichmentsAccessLoading,
		updateEnrichmentsAccess,
		updateEnrichmentsAccessLoading,
	};
};

export default useEnrichmentsAccess;
