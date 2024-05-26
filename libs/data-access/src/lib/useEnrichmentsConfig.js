import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const KEY = "enrichments-config";

const useEnrichmentsConfig = (enabled = true) => {
	const queryClient = useQueryClient();

	const fetchEnrichmentConfigApi = () =>
		AuthorizedApi.get("/v2/admin/enrichments/config").then(res => res.data);

	const {
		data: enrichmentsConfig,
		refetch: fetchEnrichmentsConfig,
		isLoading: enrichmentsConfigLoading,
	} = useQuery(KEY, fetchEnrichmentConfigApi, {
		enabled,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		select: data => data.data,
	});

	const updateEnrichmentsConfigApi = body =>
		AuthorizedApi.put("/v2/admin/enrichments/config", body).then(res => res.data);

	const { mutate: updateEnrichmentsConfig, isLoading: updateEnrichmentsConfigLoading } =
		useMutation(updateEnrichmentsConfigApi, {
			onSuccess: () => {
				queryClient.invalidateQueries("enrichments");
			},
		});

	return {
		enrichmentsConfig,
		fetchEnrichmentsConfig,
		enrichmentsConfigLoading,
		updateEnrichmentsConfig,
		updateEnrichmentsConfigLoading,
	};
};

export default useEnrichmentsConfig;
