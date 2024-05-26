import { AuthorizedApi } from "./api";
import { useMutation, useQueryClient } from "react-query";

const usePipedrive = () => {
	const queryClient = useQueryClient();
	const signInWithPipedrive = () =>
		AuthorizedApi.get("/v2/oauth/pipedrive/redirect").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithPipedrive, {
		onSuccess: data => {
			sessionStorage.setItem("redirectAfterPipedriveAuth", window.location.pathname);
			window.location.href = data.data.URI;
		},
	});

	const signOutWithPipedrive = () =>
		AuthorizedApi.get("/v2/oauth/pipedrive/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(
		signOutWithPipedrive,
		{
			onMutate: async () => {
				await queryClient.cancelQueries("user");
				const previousUser = queryClient.getQueryData("user");
				queryClient.setQueryData("user", prev => ({
					...prev,
					Pipedrive_Token: {
						...prev.Pipedrive_Token,
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
		AuthorizedApi.get(`/v2/oauth/pipedrive/authorize?code=${auth_code}`).then(
			res => res.data
		);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	return { signIn, signOut, signInLoading, signOutLoading, redirect, redirectLoading };
};

export default usePipedrive;
