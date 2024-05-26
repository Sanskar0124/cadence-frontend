import React from "react";
import { AuthorizedApi } from "./api";
import { useMutation, useQueryClient } from "react-query";

const useGoogle = () => {
	const queryClient = useQueryClient();
	const signInWithGoogle = () =>
		AuthorizedApi.get("/v1/google/oauth").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithGoogle, {
		onSuccess: data => {
			sessionStorage.setItem(
				"redirectAfterGoogleAuth",
				`${window.location.pathname}${window.location.search}`
			);
			window.location = data.data;
		},
	});

	const signOutWithGoogle = () =>
		AuthorizedApi.get("/v1/google/oauth/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(signOutWithGoogle, {
		onMutate: async () => {
			await queryClient.cancelQueries("user");
			const previousUser = queryClient.getQueryData("user");
			queryClient.setQueryData("user", prev => ({
				...prev,
				is_google_token_expired: true,
			}));
			return { previousUser };
		},
		onSettled: () => {
			queryClient.invalidateQueries("user");
		},
	});

	const redirectApi = auth_code =>
		AuthorizedApi.post("/v1/google/oauth", { auth_code }).then(res => res.data);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default useGoogle;
