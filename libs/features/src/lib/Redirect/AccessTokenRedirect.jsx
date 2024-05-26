import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import { useUserWithAccessToken } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import styles from "./RedirectPage.module.scss";

const AccessTokenRedirect = () => {
	const [searchParams] = useSearchParams();
	const [user, setUser] = useRecoilState(userInfo);

	const [accessToken, setAccessToken] = useState(searchParams.get("a_token"));

	const {
		fetchUser,
		user: userData,
		isUserError,
		userLoading,
	} = useUserWithAccessToken({
		accessToken,
		enabled: false,
	});

	const redirectUser = path => {
		const redirectPath = searchParams.get("path");

		if (path) window.location.href = path;
		else window.location.href = `/crm${redirectPath}`;
	};

	useEffect(() => {
		const a_token = searchParams.get("a_token");
		if (a_token) setAccessToken(a_token);
		else redirectUser("/crm/login");
	}, []);

	useEffect(() => {
		if (accessToken) fetchUser();
	}, [accessToken]);

	useEffect(() => {
		if (isUserError) {
			return redirectUser("/crm/login");
		}
		if (userData) {
			const {
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
				phone_system,
				mail_integration_type,
				integration_type,
			} = userData;

			let integration = INTEGRATION_TYPE.SALESFORCE;
			if (integration_type.includes(INTEGRATION_TYPE.SALESFORCE))
				integration = INTEGRATION_TYPE.SALESFORCE;
			else if (integration_type.includes(INTEGRATION_TYPE.PIPEDRIVE))
				integration = INTEGRATION_TYPE.PIPEDRIVE;
			else if (integration_type.includes(INTEGRATION_TYPE.GOOGLE_SHEETS))
				integration = INTEGRATION_TYPE.GOOGLE_SHEETS;
			else if (integration_type.includes(INTEGRATION_TYPE.SHEETS))
				integration = INTEGRATION_TYPE.SHEETS;
			else if (integration_type?.includes(INTEGRATION_TYPE.HUBSPOT))
				integration = INTEGRATION_TYPE.HUBSPOT;
			else if (integration_type?.includes(INTEGRATION_TYPE.EXCEL))
				integration = INTEGRATION_TYPE.EXCEL;
			else if (integration_type?.includes(INTEGRATION_TYPE.SELLSY))
				integration = INTEGRATION_TYPE.SELLSY;
			else if (integration_type?.includes(INTEGRATION_TYPE.ZOHO))
				integration = INTEGRATION_TYPE.ZOHO;
			else if (integration_type?.includes(INTEGRATION_TYPE.BULLHORN))
				integration = INTEGRATION_TYPE.BULLHORN;
			else if (integration_type?.includes(INTEGRATION_TYPE.DYNAMICS))
				integration = INTEGRATION_TYPE.DYNAMICS;

			const userObj = {
				accessToken,
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
				phone_system,
				instance_url: userData.Integration_Token?.instance_url ?? "",
				integration_type: integration,
				mail_integration_type,
			};
			setUser(userObj);
		}
	}, [userData, isUserError]);

	useEffect(() => {
		if (user.accessToken && userData) redirectUser();
	}, [user]);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				<p>Redirecting....</p>
				<div>{userLoading && <Spinner size="" className={styles.redirectSpinner} />}</div>
			</div>
		</PageContainer>
	);
};

export default AccessTokenRedirect;
