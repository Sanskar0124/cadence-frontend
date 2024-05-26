import { AuthorizedApi } from "./api";
import { useMutation, useQueryClient } from "react-query";

const useHubspot = () => {
	const queryClient = useQueryClient();
	const signInWithHubspot = () =>
		AuthorizedApi.get("/v2/oauth/hubspot/redirect").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithHubspot, {
		onSuccess: data => {
			sessionStorage.setItem("redirectAfterHubspotAuth", window.location.pathname);
			window.location.href = data.data.URI;
		},
	});

	const signOutWithHubspot = () =>
		AuthorizedApi.get("/v2/oauth/hubspot/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(signOutWithHubspot, {
		onMutate: async () => {
			await queryClient.cancelQueries("user");
			const previousUser = queryClient.getQueryData("user");
			queryClient.setQueryData("user", prev => ({
				...prev,
				Hubspot_Token: {
					...prev.Hubspot_Token,
					is_logged_out: true,
				},
			}));
			return { previousUser };
		},
		onSettled: () => {
			queryClient.invalidateQueries("user");
		},
	});

	const redirectApi = auth_code =>
		AuthorizedApi.get(`/v2/oauth/hubspot/authorize?code=${auth_code}`).then(
			res => res.data
		);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default useHubspot;
