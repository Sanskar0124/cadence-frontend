/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { useCompanyIntegration, useRingoverOAuth } from "@cadence-frontend/data-access";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import LinkedinExtensionSuccess from "./components/LinkedinExtensionSuccess/LinkedinExtensionSuccess";

import styles from "../RedirectPage.module.scss";
import { useNavigate } from "react-router-dom";
import {
	INTEGRATION_TYPE,
	PRODUCT_TOUR_STATUS,
	ROLES,
	SESSION_STORAGE_KEYS,
} from "@cadence-frontend/constants";
import { CadenceLogo, ErrorGradient } from "@cadence-frontend/icons";

const RingoverRedirect = () => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userInfo);

	const query = useQuery();
	let auth_code = query.get("code");

	const [error, setError] = useState({
		isError: false,
		title: "An error has occured",
		msg: "",
	});
	const isLinkedinExtensionLogin = localStorage.getItem("login-from-linkedin-extension");
	const [LinkedinExtensionLogin, setLinkedinExtensionLogin] = useState(false);

	const { fetchAuthTokens, fetchAuthTokensLoading } = useRingoverOAuth();
	const { updateCompanyStatus } = useCompanyIntegration();

	const saveUser = usr => {
		if (isLinkedinExtensionLogin) {
			delete usr.user_id;
			delete usr.first_name;
			delete usr.last_name;
			delete usr.role;
			delete usr.email;
			delete usr.primary_email;
			delete usr.linkedin_url;
			delete usr.primary_phone_number;
			delete usr.timezone;
			delete usr.profile_picture;
			delete usr.is_call_iframe_fixed;
			delete usr.language;
			delete usr.company_name;
			delete usr.ringover_team_id;
			delete usr.phone_system;
			delete usr.mail_integration_type;
			localStorage.removeItem("login-from-linkedin-extension");
			// localStorage.setItem("login-from-linkedin-extension-tokens", JSON.stringify(usr));
			const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
			console.warn("---cookie being set---");
			console.warn(
				`login-from-linkedin-extension-tokens=${JSON.stringify({
					...usr,
					token_expires_at: Date.now() + (usr.ringover_tokens.expires_in - 300) * 1000,
				})}; expires=${expirationDate.toUTCString()}; path=/`
			);
			document.cookie = `login-from-linkedin-extension-tokens=${JSON.stringify({
				...usr,
				token_expires_at: Date.now() + (usr.ringover_tokens.expires_in - 300) * 1000,
			})}; expires=${expirationDate.toUTCString()}; path=/`;
			//document.cookie = `login-from-linkedin-extension-tokens=${JSON.stringify(usr)}`;
			return;
		}
		setUser({
			...usr,
			token_expires_at: Date.now() + (usr.ringover_tokens.expires_in - 300) * 1000,
		});
		if (!usr?.is_onboarding_complete) {
			window.location.href = "/crm/onboarding";
			return;
		}
		if (usr?.product_tour_status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
			window.location.href = usr?.product_tour_step?.url ?? "/crm/cadence";
			return;
		}
		if (
			usr?.company_status === "not_configured_after_integration_change" &&
			usr?.role === ROLES.SUPER_ADMIN
		) {
			if (
				[
					INTEGRATION_TYPE.GOOGLE_SHEETS,
					INTEGRATION_TYPE.EXCEL,
					INTEGRATION_TYPE.SHEETS,
				].includes(usr?.integration_type)
			) {
				updateCompanyStatus(
					{ status: "configured" },
					{
						onSuccess: () => {
							setUser(prev => ({ ...prev, company_status: "configured" }));
							window.location.href = "/crm";
						},
						onError: err =>
							setError(prev => ({
								...prev,
								isError: true,
								msg: err.response?.data?.msg,
							})),
					}
				);
			} else {
				window.location.href = "/crm/reconfigure";
			}
			return;
		}
		window.location.href =
			sessionStorage.getItem(SESSION_STORAGE_KEYS.REDIRECT_AFTER_RINGOVER_AUTH) || "/crm";
	};

	useEffect(() => {
		setLinkedinExtensionLogin(isLinkedinExtensionLogin);
		fetchAuthTokens(auth_code, {
			onSuccess: usr => saveUser(usr),
			onError: err => {
				localStorage.removeItem("login-from-linkedin-extension");
				if (err.response?.data?.msg === "CRM set-up not complete") {
					setError(prev => ({
						...prev,
						isError: true,
						title: "CRM set-up not complete",
						msg: "The new CRM set-up has not been completed by your super admin.\nUsers will be unable to log in till set-up is complete.\nPlease contact your organization super admin for the same",
					}));
					return;
				}
				if (err.response?.data?.msg?.message)
					setError(prev => ({
						...prev,
						isError: true,
						msg: err.response?.data?.msg?.message,
					}));
				else
					setError(prev => ({
						...prev,
						isError: true,
						msg: err.response?.data?.msg,
					}));
			},
		});
	}, []);

	return (
		<div style={{ height: "100%", width: "100%" }}>
			{error.isError ? (
				<PageContainer className={styles.loginContainer}>
					<div className={styles.container2}>
						<div className={styles.logo}>
							<CadenceLogo size="38px" />
							<div>
								<span>Cadence</span>
								<span>by Ringover</span>
							</div>
						</div>
						<div className={styles.content}>
							<div className={styles.errorcontainer}>
								<ErrorGradient />
								<div className={styles.errortitle}>{error?.title}</div>
							</div>
							<span className={styles.error}>{error?.msg}</span>
							<ThemedButton
								onClick={() =>
									navigate(SESSION_STORAGE_KEYS.REDIRECT_AFTER_RINGOVER_AUTH)
								}
								theme={ThemedButtonThemes.WHITE}
								className={styles.backbtn}
								height="54px"
								width="178px"
							>
								{COMMON_TRANSLATION.GO_BACK[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
						<div className={styles.bgLogo1}>
							<CadenceLogo size="180px" />
						</div>
						<div className={styles.bgLogo2}>
							<CadenceLogo size="170px" />
						</div>
						<div className={styles.bgLogo3}>
							<CadenceLogo size="400px" />
						</div>
					</div>
				</PageContainer>
			) : LinkedinExtensionLogin ? (
				fetchAuthTokensLoading ? (
					<PageContainer className={styles.loginContainer}>
						<div className={styles.container2}>
							<div className={styles.logo}>
								<CadenceLogo size="38px" />
								<div>
									<span>Cadence</span>
									<span>By Ringover</span>
								</div>
							</div>
							<div className={styles.content}>
								<p className={styles.msg}> Redirecting to Extension...</p>
								<div className={styles.spinnerdiv}>
									{fetchAuthTokensLoading && (
										<Spinner size="" className={styles.redirectSpinner} />
									)}
								</div>
							</div>
							<div className={styles.bgLogo1}>
								<CadenceLogo size="180px" />
							</div>
							<div className={styles.bgLogo2}>
								<CadenceLogo size="170px" />
							</div>
							<div className={styles.bgLogo3}>
								<CadenceLogo size="400px" />
							</div>
						</div>
					</PageContainer>
				) : (
					<PageContainer>
						<div className={styles.redirectPage}>
							<LinkedinExtensionSuccess user={user} />
						</div>
					</PageContainer>
				)
			) : (
				<PageContainer className={styles.loginContainer}>
					<div className={styles.container2}>
						<div className={styles.logo}>
							<CadenceLogo size="38px" />
							<div>
								<span>Cadence</span>
								<span>By Ringover</span>
							</div>
						</div>
						<div className={styles.content}>
							<p className={styles.msg}>Redirecting to Cadence...</p>
							<div className={styles.spinnerdiv}>
								{fetchAuthTokensLoading && (
									<Spinner size="" className={styles.redirectSpinner} />
								)}
							</div>
						</div>
						<div className={styles.bgLogo1}>
							<CadenceLogo size="180px" />
						</div>
						<div className={styles.bgLogo2}>
							<CadenceLogo size="170px" />
						</div>
						<div className={styles.bgLogo3}>
							<CadenceLogo size="400px" />
						</div>
					</div>
				</PageContainer>
			)}
		</div>
	);
};

export default RingoverRedirect;
