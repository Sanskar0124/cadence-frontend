/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner } from "@cadence-frontend/components";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useIntegration } from "@cadence-frontend/data-access";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, getIntegrationIcon, useQuery } from "@cadence-frontend/utils";
import { CollapseContainer, ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./RedirectPage.module.scss";

const IntegrationRedirect = () => {
	const query = useQuery();
	let auth_code = query.get("code");
	let location = query.get("location");
	let accounts_server = query.get("accounts-server");
	const [error, setError] = useState(null);
	const { redirect, redirectLoading } = useIntegration();
	const user = useRecoilValue(userInfo);
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: user.integration_type,
	});

	const goTo = pathName => {
		window.location.href = pathName ?? "crm/settings";
	};
	const zoho_auth_body = {
		zoho_code: auth_code,
		location: location,
		accounts_server: accounts_server,
	};

	useEffect(() => {
		redirect(
			user?.integration_type === INTEGRATION_TYPE.ZOHO ? zoho_auth_body : auth_code,
			{
				onSuccess: () => goTo(sessionStorage.getItem("redirectAfterAuth")),
				onError: err => {
					if (err.response?.data?.msg?.message)
						setError({
							err: err.response?.data?.msg?.message,
							desc: err?.response?.data?.error,
						});
					else
						setError({ err: err.response?.data?.msg, desc: err?.response?.data?.error });
				},
			}
		);
	}, []);

	return (
		<PageContainer>
			<div className={styles.redirectPage}>
				{error ? (
					<>
						<span className={styles.error}>{error?.err}</span>
						<CollapseContainer
							className={styles.errorCollapse}
							openByDefault={false}
							title={<div className={styles.header}>Show more</div>}
						>
							<div className={styles.desc}>{error?.desc}</div>
						</CollapseContainer>
						<ThemedButton
							onClick={() => goTo(sessionStorage.getItem("redirectAfterAuth"))}
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
						>
							{COMMON_TRANSLATION.GO_BACK[user?.language?.toUpperCase()]}
						</ThemedButton>
					</>
				) : (
					<p>{COMMON_TRANSLATION.REDIRECTING_BACK[user?.language?.toUpperCase()]}</p>
				)}
				<div>
					{redirectLoading && <Spinner size="" className={styles.redirectSpinner} />}
				</div>
			</div>
		</PageContainer>
	);
};

export default IntegrationRedirect;
