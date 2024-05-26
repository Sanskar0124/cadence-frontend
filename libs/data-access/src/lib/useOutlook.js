import { AuthorizedApi } from "./api";
import { useMutation, useQueryClient } from "react-query";

const useOutlook = () => {
	const queryClient = useQueryClient();
	const signInWithOutlook = () =>
		AuthorizedApi.get("/v2/outlook/oauth").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithOutlook, {
		onSuccess: data => {
			sessionStorage.setItem(
				"redirectAfterOutlookAuth",
				`${window.location.pathname}${window.location.search}`
			);
			window.location = data.data;
		},
	});

	const signOutWithOutlook = () =>
		AuthorizedApi.get("/v2/outlook/oauth/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(signOutWithOutlook, {
		onMutate: async () => {
			await queryClient.cancelQueries("user");
			const previousUser = queryClient.getQueryData("user");
			queryClient.setQueryData("user", prev => ({
				...prev,
				is_outlook_token_expired: true,
				is_google_token_expired: true, // FIXME: temp fix
			}));
			return { previousUser };
		},
		onSettled: () => {
			queryClient.invalidateQueries("user");
		},
	});

	const redirectApi = auth_code =>
		AuthorizedApi.post("/v2/outlook/oauth", { auth_code }).then(res => res.data);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default useOutlook;
