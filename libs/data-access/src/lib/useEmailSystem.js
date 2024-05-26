import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useEmailSystem = () => {
	const updateEmailSystemApi = body =>
		AuthorizedApi.put("/v2/company/mail-integration", body).then(res => res.data);

	const { mutate: updateEmailSystem, isLoading: updateEmailSystemLoading } =
		useMutation(updateEmailSystemApi);

	return {
		updateEmailSystem,
		updateEmailSystemLoading,
	};
};

export default useEmailSystem;
