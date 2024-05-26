import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useChatBot } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import styles from "./RedirectPage.module.scss";
import { useQuery } from "@cadence-frontend/utils";

const GrantAccessRedirect = () => {
	const [user, setUser] = useRecoilState(userInfo);
	const { supportAgentRedirect, redirectLoading } = useChatBot();
	const [error, setError] = useState(false);
	const [userData, setUserData] = useState();
	const query = useQuery();
	const id = query.get("id");

	useEffect(() => {
		supportAgentRedirect(id, {
			onSuccess: data => {
				setUserData(data);
			},
			onError: () => {
				setError(true);
			},
		});
	}, []);

	useEffect(() => {
		if (error) {
			return redirectUser("/crm/login");
		}
		if (userData) {
			const {
				ringover_tokens,
				first_name,
				last_name,
				email,
				linkedin_url,
				role,
				profile_picture,
				timezone,
				primary_email,
				primary_phone_number,
				user_id,
				sd_id,
				company_id,
				is_call_iframe_fixed,
				language,
				mail_integration_type,
				integration_type,
			} = userData;
			const userObj = {
				ringover_tokens,
				first_name,
				last_name,
				email,
				linkedin_url,
				role,
				profile_picture,
				timezone,
				primary_email,
				primary_phone_number,
				user_id,
				sd_id,
				company_id,
				is_call_iframe_fixed,
				language,
				integration_type,
				mail_integration_type,
			};
			setUser({
				...userObj,
				token_expires_at: Date.now() + (userObj?.ringover_tokens.expires_in - 300) * 1000,
			});
		}
	}, [userData, error]);

	const redirectUser = path => {
		if (path) window.location.href = path;
		else window.location.href = `/crm/home`;
	};

	useEffect(() => {
		if (user.ringover_tokens?.id_token && userData) redirectUser();
	}, [user]);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				<p>Redirecting....</p>
				<div>{redirectLoading && <Spinner className={styles.redirectSpinner} />}</div>
			</div>
		</PageContainer>
	);
};

export default GrantAccessRedirect;
