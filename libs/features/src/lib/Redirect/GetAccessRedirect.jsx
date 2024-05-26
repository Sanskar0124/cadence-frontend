import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { useAdminLoginAsUser } from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./RedirectPage.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const GetAccessRedirect = () => {
	const searchParams = useQuery();
	const { getData, success, loading: redirectLoading } = useAdminLoginAsUser();
	const [userRecoil, setUserRecoil] = useRecoilState(userInfo);
	const [error, setError] = useState("");

	const saveUser = usr => setUserRecoil(usr);
	const user = useRecoilValue(userInfo);

	const goTo = pathName => (window.location.href = pathName);

	useEffect(() => {
		getData(
			{ email: searchParams.get("email") },
			{
				onSuccess: data =>
					saveUser({
						...data?.data,
						token_expires_at:
							Date.now() + (data?.data.ringover_tokens.expires_in - 300) * 1000,
					}),
				onError: err => {
					setError(err?.response?.data?.msg);
				},
			}
		);
	}, []);

	useEffect(() => {
		if (success && userRecoil) goTo("/crm/home");
	}, [userRecoil]);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				{redirectLoading && (
					<>
						<p>Redirecting To User....</p>
						<div>
							<Spinner size="" className={styles.redirectSpinner} />
						</div>
					</>
				)}

				{error && (
					<>
						<span className={styles.error}>{error}</span>
						<ThemedButton
							onClick={() => goTo("/crm/settings?view=groups_and_members")}
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
						>
							{COMMON_TRANSLATION.GO_BACK[user?.language?.toUpperCase()]}
						</ThemedButton>
					</>
				)}
			</div>
		</PageContainer>
	);
};

export default GetAccessRedirect;
