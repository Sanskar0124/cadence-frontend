import { AuthorizedApi } from "../api";
import { useMutation, useQueryClient } from "react-query";
import { capitalize } from "@cadence-frontend/utils";
import {
	getIntegrationRedirectURL,
	getSignInURL,
	getSignOutURL,
} from "./useIntegration.strategy";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useIntegration = () => {
	const queryClient = useQueryClient();
	const signInWithIntegration = () =>
		AuthorizedApi.get(getSignInURL({ integration_type: user.integration_type })).then(
			res => res.data
		);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(
		signInWithIntegration,
		{
			onSuccess: data => {
				sessionStorage.setItem(
					`redirectAfterAuth`,
					`${window.location.pathname}${window.location.search}`
				);
				window.location.href = data.data.URI;
			},
		}
	);

	const signOutWithSalesforce = () =>
		AuthorizedApi.get(getSignOutURL({ integration_type: user.integration_type })).then(
			res => res.data
		);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(
		signOutWithSalesforce,
		{
			onMutate: async () => {
				await queryClient.cancelQueries("user");
				const previousUser = queryClient.getQueryData("user");
				queryClient.setQueryData("user", prev => ({
					...prev,
					Integration_Token: {
						...prev.Integration_Token,
						is_logged_out: true,
					},
				}));
				return null;
			},
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	const redirectApi = auth_code =>
		AuthorizedApi.get(
			getIntegrationRedirectURL({
				integration_type: user.integration_type,
				auth_code,
			})
		).then(res => res.data);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default useIntegration;
