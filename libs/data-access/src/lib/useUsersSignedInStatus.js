import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const KEY = "users-signed-in-status";

const useUsersSignedInStatus = () => {
	const fetchUsersSignedInStatusApi = () =>
		AuthorizedApi.get("/v2/admin/signed-in-status").then(res => res.data.data);

	const { data: users, isLoading: usersLoading } = useQuery(
		KEY,
		fetchUsersSignedInStatusApi
	);

	return { users, usersLoading };
};

export default useUsersSignedInStatus;
