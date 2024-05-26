/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCalendlyAuth } from "@cadence-frontend/data-access";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useEffect, useState } from "react";
import styles from "./RedirectPage.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const CalendlyRedirect = () => {
	const query = useQuery();
	let auth_code = query.get("code");
	const [error, setError] = useState("");
	const { redirect, redirectLoading } = useCalendlyAuth(false);
	const user = useRecoilValue(userInfo);

	const goTo = pathName => {
		console.log({ pathName });
		//window.location.href = pathName ?? "/crm/login";
		window.location.href = "/crm/settings";
	};

	useEffect(() => {
		redirect(auth_code, {
			onSuccess: data => {
				console.log({ data });
				if (data.msg === "Calendly authorization successful.") {
					goTo(sessionStorage.getItem("redirectAfterGoogleAuth"));
				}
			},
			onError: err => setError(err.response?.data?.msg),
		});
	}, []);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				<p>{COMMON_TRANSLATION.REDIRECTING_BACK[user?.language?.toUpperCase()]}</p>
				<div>
					{redirectLoading && <Spinner size="" className={styles.redirectSpinner} />}
				</div>
				{error && (
					<>
						<span className={styles.error}>{error}</span>
						<ThemedButton
							onClick={() => goTo(sessionStorage.getItem("redirectAfterAuth"))}
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

export default CalendlyRedirect;
