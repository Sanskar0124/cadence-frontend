import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const KEY = "extension-field-map";

const useExtensionFieldMap = (enabled = false) => {
	const queryClient = useQueryClient();

	const fetchExtensionFieldMapsApi = () =>
		AuthorizedApi.get("/v2/admin/company-settings/extension-field-map").then(
			res => res.data?.data
		);

	const {
		data: extensionFieldMaps,
		refetch: fetchExtensionFieldMaps,
		isLoading: fetchExtensionFieldMapsLoading,
	} = useQuery(KEY, fetchExtensionFieldMapsApi, {
		enabled,
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const updateAllExtensionFieldMapsApi = body =>
		AuthorizedApi.post("/v2/admin/company-settings/extension-field-map/all", body).then(
			res => res.data
		);

	const {
		mutate: updateAllExtensionFieldMaps,
		isLoading: updateAllExtensionFieldMapsLoading,
	} = useMutation(updateAllExtensionFieldMapsApi, {
		onSuccess: () => {
			queryClient.invalidateQueries(KEY);
		},
	});

	return {
		extensionFieldMaps,
		fetchExtensionFieldMaps,
		fetchExtensionFieldMapsLoading,
		updateAllExtensionFieldMaps,
		updateAllExtensionFieldMapsLoading,
	};
};

export default useExtensionFieldMap;
