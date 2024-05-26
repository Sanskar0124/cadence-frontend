import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useLogoutUsers = () => {
	const logoutUsersApi = body =>
		AuthorizedApi.post("/v2/admin/logout-user", body).then(res => res.data.data);

	const { mutate: logoutUsers, isLoading: logoutUsersLoading } =
		useMutation(logoutUsersApi);

	const disconnectUsersApi = () =>
		AuthorizedApi.get("/v2/user/disconnect").then(res => res.data.data);

	const { mutate: disconnectUsers, isLoading: disconnectUsersLoading } =
		useMutation(disconnectUsersApi);

	return {
		logoutUsers,
		logoutUsersLoading,
		disconnectUsers,
		disconnectUsersLoading,
	};
};

export default useLogoutUsers;
