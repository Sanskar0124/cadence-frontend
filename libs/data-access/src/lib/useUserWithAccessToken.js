import { PublicApi } from "./api";
import { useQuery } from "react-query";

const KEY = "user";

const useUserWithAccessToken = ({ accessToken, enabled = false }) => {
	const getUser = ({ queryKey }) => {
		const { accessToken } = queryKey[1];
		return PublicApi.get("/v1/user", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}).then(res => res.data.data.user);
	};

	const {
		data: user,
		isLoading: userLoading,
		refetch: fetchUser,
		error: userError,
		isError: isUserError,
	} = useQuery([KEY, { accessToken }], getUser, {
		enabled,
	});

	return {
		user,
		fetchUser,
		userLoading,
		userError,
		isUserError,
	};
};

export default useUserWithAccessToken;
