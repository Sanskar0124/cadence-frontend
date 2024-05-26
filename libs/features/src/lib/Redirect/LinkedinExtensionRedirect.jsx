/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useRingoverOAuth } from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useEffect, useState, useContext } from "react";
import styles from "./RedirectPage.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";

const LinkedinExtensionRedirect = () => {
	const [error, setError] = useState("");
	const { addError } = useContext(MessageContext);
	const { fetchRingoverURI, fetchRingoverURILoading } = useRingoverOAuth();
	const user = useRecoilValue(userInfo);

	const goTo = pathName => {
		console.log({ pathName });
		//window.location.href = pathName ?? "/crm/login";
		window.location.href = "/crm/settings";
	};

	useEffect(() => {
		// redirect(auth_code, {
		// 	onSuccess: data => {
		// 		console.log({ data });
		// 		if (data.msg === "Calendly authorization successful.") {
		// 			goTo(sessionStorage.getItem("redirectAfterGoogleAuth"));
		// 		}
		// 	},
		// 	onError: err => setError(err.response?.data?.msg),
		// });
		localStorage.setItem("login-from-linkedin-extension", true);
		fetchRingoverURI(null, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
		});
	}, []);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				{console.log(fetchRingoverURI)}
				<p>
					{COMMON_TRANSLATION.LINKEDIN_EXTENSION_LOGIN[user?.language?.toUpperCase()]}
				</p>
				<div>
					{fetchRingoverURILoading && (
						<Spinner size="" className={styles.redirectSpinner} />
					)}
				</div>
				{error && <span className={styles.error}>{error}</span>}
			</div>
		</PageContainer>
	);
};

export default LinkedinExtensionRedirect;
