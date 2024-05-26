import { AuthorizedApi } from "./api";
import { useMutation, useQueryClient } from "react-query";

const useSalesforce = () => {
	const queryClient = useQueryClient();
	const signInWithSalesforce = () =>
		AuthorizedApi.get("/v1/salesforce/redirect").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithSalesforce, {
		onSuccess: data => {
			sessionStorage.setItem("redirectAfterSalesforceAuth", window.location.pathname);
			window.location.href = data.data.URI;
		},
	});

	const signOutWithSalesforce = () =>
		AuthorizedApi.get("/v1/salesforce/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(
		signOutWithSalesforce,
		{
			onMutate: async () => {
				await queryClient.cancelQueries("user");
				const previousUser = queryClient.getQueryData("user");
				queryClient.setQueryData("user", prev => ({
					...prev,
					Salesforce_Token: {
						is_logged_out: true,
					},
				}));
				return { previousUser };
			},
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	const redirectApi = auth_code =>
		AuthorizedApi.get(`/v1/salesforce/authorize?code=${auth_code}`).then(res => res.data);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default useSalesforce;
