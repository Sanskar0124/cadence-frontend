import { AuthorizedApi, MailApi } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { userDataStrategy } from "./useUser.strategy";

const ENABLED_DEFAULT = {
	user: false,
	emails: false,
	isOnboardingComplete: false,
};

const userInfo = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useUser = enabled => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const queryClient = useQueryClient();
	const getUser = () =>
		AuthorizedApi.get("/v1/user").then(res =>
			userDataStrategy({
				user: res.data.data.user,
				integration_type: userInfo.integration_type,
			})
		);

	const {
		data: user,
		isLoading: userLoading,
		refetch: fetchUser,
	} = useQuery("user", getUser, {
		enabled: enabled.user,
	});

	const updateUserApi = body => AuthorizedApi.put(`/v1/user`, body).then(res => res.data);

	const { mutate: updateUser, isLoading: updateLoading } = useMutation(updateUserApi, {
		onMutate: async body => {
			await queryClient.cancelQueries("user");
			const previousUser = queryClient.getQueryData("user");
			queryClient.setQueryData("user", prev => ({
				...prev,
				...userDataStrategy({
					user: body,
					integration_type: userInfo.integration_type,
				}),
			}));
			return { previousUser };
		},
		onSettled: () => {
			queryClient.invalidateQueries("user");
		},
	});

	const updateInstanceUrlApi = body =>
		AuthorizedApi.patch(`/v2/admin/company-settings/update-instance-url`, body).then(
			res => res.data
		);

	const { mutate: updateInstanceUrl, isLoading: updateInstanceUrlLoading } = useMutation(
		updateInstanceUrlApi,
		{
			onMutate: async body => {
				await queryClient.cancelQueries("user");
				const previousUser = queryClient.getQueryData("user");
				queryClient.setQueryData("user", prev => ({
					...prev,
					...body,
				}));
				return { previousUser };
			},
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	const updatePasswordApi = body =>
		AuthorizedApi.put(`/v1/user/change/password`, body).then(res => res.data);

	const { mutate: updatePassword, isLoading: passwordLoading } = useMutation(
		updatePasswordApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		}
	);

	const updateProfileImageApi = body =>
		AuthorizedApi.put(`/v1/user/change/profile/pic`, body).then(res => res.data);

	const { mutate: updateProfileImage, isLoading: updateProfileImageLoading } =
		useMutation(updateProfileImageApi, {
			onSettled: () => {
				queryClient.invalidateQueries("user");
			},
		});

	const resetPasswordApi = ({ password, token, language }) =>
		AuthorizedApi.post(
			`/v2/user/change-password`,
			{ password, language },
			{ params: { a_token: token } }
		).then(res => res.data);

	const { mutate: resetPassword, isLoading: resetPasswordLoading } = useMutation(
		resetPasswordApi,
		{}
	);

	const getEmailAliases = () =>
		AuthorizedApi.get("/mail/v2/email-alias").then(res => res.data?.data);

	const { data: emails, isLoading: emailsLoading } = useQuery("emails", getEmailAliases, {
		enabled: enabled.emails,
	});

	const getOnboardingValue = () =>
		AuthorizedApi.get("/v2/user/onboarding").then(
			res => res.data.data.is_onboarding_complete
		);

	const { data: isOnboardingComplete, isLoading: isOnboardingCompleteLoading } = useQuery(
		"isOnboardingComplete",
		getOnboardingValue,
		{
			enabled: enabled.isOnboardingComplete,
		}
	);

	const updateOnboardingValueApi = body =>
		AuthorizedApi.put(`/v2/user/onboarding`, body).then(res => res.data);

	const { mutate: updateOnboardingValue, isLoading: updateOnboardingValueLoading } =
		useMutation(updateOnboardingValueApi);

	return {
		user,
		fetchUser,
		emails,
		userLoading,
		updateLoading,
		updateInstanceUrlLoading,
		emailsLoading,
		updateUser,
		updateInstanceUrl,
		updatePassword,
		updateProfileImage,
		updateOnboardingValue,
		updateOnboardingValueLoading,
		isOnboardingComplete,
		isOnboardingCompleteLoading,
		passwordLoading,
		updateProfileImageLoading,
		resetPassword,
		resetPasswordLoading,
	};
};

export default useUser;
