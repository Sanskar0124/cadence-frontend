import { useMutation, useQueryClient } from "react-query";
import { AuthorizedApi, PublicApi } from "./api";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";

const useRingoverOAuth = () => {
	const fetchRingoverURIApi = () =>
		PublicApi.get("/v2/oauth/ringover/redirect").then(res => res.data.data);

	const { mutate: fetchRingoverURI, isLoading: fetchRingoverURILoading } = useMutation(
		fetchRingoverURIApi,
		{
			onSuccess: data => {
				sessionStorage.setItem("redirectAfterRingoverAuth", `/crm`);
				if (data.URI) window.location.href = data.URI;
			},
		}
	);

	const fetchAuthTokensApi = code => {
		let URL =
			sessionStorage.getItem(SESSION_STORAGE_KEYS.REDIRECT_AFTER_RINGOVER_AUTH) === "/crm"
				? `/v2/oauth/ringover/authorize?code=${code}`
				: `/marketplace/v1/super-admin/authorize?code=${code}`;
		return PublicApi.get(URL).then(res => res.data.data);
	};

	const { mutate: fetchAuthTokens, isLoading: fetchAuthTokensLoading } =
		useMutation(fetchAuthTokensApi);

	const updateAccessTokenApi = ({ body, user }) =>
		AuthorizedApi.post("/v2/oauth/ringover/access-token", body, {
			params: {
				user,
			},
		}).then(res => res.data.data);

	const { mutate: updateAccessToken, isLoading: updateAccessTokenLoading } =
		useMutation(updateAccessTokenApi);

	const signOutFromRingoverApi = () =>
		AuthorizedApi.get("/v2/oauth/ringover/signout").then(res => res.data);

	const { mutate: signOutFromRingover, isLoading: signOutFromRingoverLoading } =
		useMutation(signOutFromRingoverApi);

	return {
		fetchRingoverURI,
		fetchRingoverURILoading,
		fetchAuthTokens,
		fetchAuthTokensLoading,
		updateAccessToken,
		updateAccessTokenLoading,
		signOutFromRingover,
		signOutFromRingoverLoading,
	};
};

export default useRingoverOAuth;
