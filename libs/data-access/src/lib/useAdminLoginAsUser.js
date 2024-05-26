import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useAdminLoginAsUser = () => {
	const sendUserEmailApi = body => {
		return AuthorizedApi.post(`/v2/user/login-as-user`, body).then(res => res.data);
	};

	const {
		mutate: getData,
		data,
		isLoading: loading,
		isSuccess: success,
	} = useMutation(sendUserEmailApi);
	return {
		getData,
		data,
		loading,
		success,
	};
};

export default useAdminLoginAsUser;
