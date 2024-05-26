import { AuthorizedApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useCalendlyAuth = enabled => {
	const queryClient = useQueryClient();
	const signInWithCalendly = () =>
		AuthorizedApi.get("/v2/oauth/calendly/redirect").then(res => res.data);

	const { isLoading: signInLoading, mutate: signIn } = useMutation(signInWithCalendly, {
		onSuccess: data => {
			sessionStorage.setItem(
				`redirectAfterAuth`,
				`${window.location.pathname}${window.location.search}`
			);
			window.location.href = data.data.URI;
		},
	});

	const signOutWithCalendly = () =>
		AuthorizedApi.get("/v2/oauth/calendly/signout").then(res => res.data);

	const { isLoading: signOutLoading, mutate: signOut } = useMutation(
		signOutWithCalendly,
		{
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	const redirectApi = auth_code =>
		AuthorizedApi.get(`/v2/oauth/calendly/authorize?code=${auth_code}`).then(
			res => res.data
		);

	const { isLoading: redirectLoading, mutate: redirect } = useMutation(redirectApi);

	const getCalendlyEventTypes = () =>
		AuthorizedApi.get("/v2/webhook/calendly/event-types").then(res => res.data.data);
	const {
		data: calendlyEventType,
		isLoading: calendlyEventTypeLoading,
		refetch: refetchCalendlyEventTypes,
	} = useQuery("calendly-event", getCalendlyEventTypes, {
		enabled: enabled,
	});

	const setCalendlyUrlApi = data =>
		AuthorizedApi.post(`/v2/webhook/calendly/set-url`, data).then(res => res.data);

	const { mutate: setCalendlyUrl, isLoading: setCalendlyUrlLoading } = useMutation(
		setCalendlyUrlApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	return {
		signIn,
		signOut,
		signInLoading,
		signOutLoading,
		redirect,
		redirectLoading,
		calendlyEventType,
		calendlyEventTypeLoading,
		refetchCalendlyEventTypes,
		setCalendlyUrl,
		setCalendlyUrlLoading,
	};
};

export default useCalendlyAuth;
