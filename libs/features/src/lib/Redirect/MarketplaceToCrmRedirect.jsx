import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { useRingoverOAuth } from "@cadence-frontend/data-access";
import { useQuery } from "@cadence-frontend/utils";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styles from "./RedirectPage.module.scss";

const MarketplaceToCrmRedirect = () => {
	const query = useQuery();
	const [user, setUser] = useRecoilState(userInfo);

	const { updateAccessToken, updateAccessTokenLoading } = useRingoverOAuth();

	const redirectUser = path => {
		const redirectPath = query.get("path");

		if (path) window.location.href = path;
		else window.location.href = `/crm${redirectPath}`;
	};

	useEffect(() => {
		updateAccessToken(
			{
				body: {
					id_token: user?.ringover_tokens?.id_token,
					refresh_token: user?.ringover_tokens?.refresh_token,
				},
				user: true,
			},
			{
				onSuccess: usr => {
					setUser({
						...usr,
						token_expires_at: Date.now() + (usr.ringover_tokens.expires_in - 300) * 1000,
					});
					redirectUser();
				},
			}
		);
	}, []);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				<p>Redirecting to crm....</p>
				<div>
					{updateAccessTokenLoading && (
						<Spinner size="" className={styles.redirectSpinner} />
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default MarketplaceToCrmRedirect;
