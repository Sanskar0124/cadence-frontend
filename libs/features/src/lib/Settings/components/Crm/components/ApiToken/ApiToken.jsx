import styles from "./ApiToken.module.scss";
import {
	Salesforce as SALESFORCE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Input } from "@cadence-frontend/widgets";
import { CopyBlank, Refresh2, View, ViewGradient } from "@cadence-frontend/icons";
import { useContext, useEffect, useState } from "react";
import { InputThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import WarningModal from "./WarningModal/WarningModal";
import { useApiToken } from "@cadence-frontend/data-access";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const ApiToken = () => {
	const { addSuccess, addError } = useContext(MessageContext);
	const { token, generateToken } = useApiToken(true);

	const user = useRecoilValue(userInfo);

	const INTEGRATION_TRANSLATION = useIntegrationTranslations(user.integration_type);

	const [hideToken, setHideToken] = useState(true);
	const [apiToken, setApiToken] = useState("");
	const [tokenWarning, setTokenWarning] = useState(false);

	const generateAPIToken = () => {
		setTokenWarning(false);
		generateToken(
			{},
			{
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Unable to generate token!",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: data => {
					setApiToken(data);
					addSuccess("Token generated successfully");
				},
			}
		);
	};

	useEffect(() => {
		setApiToken(token);
	}, [token]);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.API_TOKEN}>
			<div className={styles.title}>
				<h2>{INTEGRATION_TRANSLATION.API_TOKEN[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.API_TOKEN_DESC[user?.language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.token}>
					<Input
						value={apiToken}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
						className={styles.input}
						disabled
						style={{ "-webkit-text-security": hideToken ? "disc" : "none" }}
					/>
					<div>
						{hideToken ? (
							<View
								size={18}
								color={Colors.lightBlue}
								onClick={() => setHideToken(curr => !curr)}
							/>
						) : (
							<ViewGradient size={18} onClick={() => setHideToken(curr => !curr)} />
						)}
						<CopyBlank
							size={18}
							color={Colors.lightBlue}
							onClick={() => {
								addSuccess("Copy Successful");
								navigator.clipboard.writeText(apiToken);
							}}
						/>
						<Refresh2
							size={13}
							color={Colors.lightBlue}
							onClick={() => setTokenWarning(true)}
						/>
					</div>
				</div>
				<div className={styles.helpLinks}>
					<a
						href={
							user?.language === "english"
								? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000046028-ringover-cadence-api-token-generation-and-setup"
								: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000046028-g%C3%A9n%C3%A9ration-et-configuration-des-tokens-de-l-api-cadence"
						}
						target="_blank"
						rel="noreferrer"
					>
						{
							SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
								user?.language?.toUpperCase()
							]
						}
					</a>
					{/* <a
							href="https://www.loom.com/share/e8ee4d947d7d45f98fc5e97c2475f7e6"
							target="_blank"
						>
							{COMMON_TRANSLATION.WATCH_VIDEO[user?.language?.toUpperCase()]}
						</a> */}
				</div>
			</div>
			<WarningModal
				modal={tokenWarning}
				setModal={setTokenWarning}
				onConfirm={generateAPIToken}
			/>
		</div>
	);
};

export default ApiToken;
