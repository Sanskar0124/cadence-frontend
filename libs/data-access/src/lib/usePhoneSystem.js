import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const KEY = "phone-system";
const URL = "/v2/admin/company-settings/phone-system";

const usePhoneSystem = (enabled = true) => {
	const fetchPhoneSystemApi = () =>
		AuthorizedApi.get(URL).then(res => res.data.data.phone_system);

	const { data: phone_system, isLoading: phoneSystemLoading } = useQuery(
		KEY,
		fetchPhoneSystemApi,
		{
			retry: 2,
		}
	);

	const updatePhoneSystemApi = body =>
		AuthorizedApi.patch(URL, body).then(res => res.data);

	const { mutate: updatePhoneSystem, isLoading: updatePhoneSystemLoading } =
		useMutation(updatePhoneSystemApi);

	return {
		phone_system,
		phoneSystemLoading,
		updatePhoneSystem,
		updatePhoneSystemLoading,
	};
};

export default usePhoneSystem;
