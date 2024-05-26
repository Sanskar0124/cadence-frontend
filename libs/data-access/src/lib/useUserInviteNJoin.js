import { useState } from "react";
import { AuthorizedApi, PublicApi } from "./api";
import { useMutation } from "react-query";

const useUserInviteNJoin = () => {
	const [joiningToken, setJoiningToken] = useState(null);

	const sendRequestApi = user_ids =>
		AuthorizedApi.post("/v2/sales/sub-department/user/invite", {
			user_ids,
		}).then(res => res.data);

	const { mutate: sendRequest, isLoading: sendRequestLoading } =
		useMutation(sendRequestApi);

	const checkJoinApi = async token => {
		setJoiningToken(token);
		const res = await PublicApi.get("/v2/sales/sub-department/user/join", {
			params: { a_token: token },
		});
		return res.data;
	};

	const { mutate: checkJoin, isLoading: checkJoinLoading } = useMutation(checkJoinApi);

	const setupPasswordApi = body =>
		PublicApi.post("/v2/sales/sub-department/user/setup", body, {
			params: { a_token: joiningToken },
		}).then(res => res.data);

	const { mutate: setupPassword, isLoading: setupLoading } =
		useMutation(setupPasswordApi);

	return {
		sendRequest,
		sendRequestLoading,
		checkJoin,
		checkJoinLoading,
		setupPassword,
		setupLoading,
	};
};

export default useUserInviteNJoin;
