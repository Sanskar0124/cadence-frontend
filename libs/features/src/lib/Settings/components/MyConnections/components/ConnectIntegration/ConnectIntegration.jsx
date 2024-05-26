/* eslint-disable no-console */
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE, ROLES } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useIntegration, useUser } from "@cadence-frontend/data-access";
import { CopyBlank } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { capitalize, Colors, getIntegrationIcon } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import styles from "./ConnectIntegration.module.scss";
import { CONNECTION_NOT_AVAILABLE } from "./constants";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import { Tooltip } from "@cadence-frontend/components";

const getIntegrationSpecificTokenValidity = ({ user, user_info }) => {
	try {
		switch (user_info.integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
			case INTEGRATION_TYPE.PIPEDRIVE:
			case INTEGRATION_TYPE.HUBSPOT:
			case INTEGRATION_TYPE.SELLSY:
			case INTEGRATION_TYPE.DYNAMICS:
			case INTEGRATION_TYPE.ZOHO:
			case INTEGRATION_TYPE.BULLHORN:
				return !user?.Integration_Token?.is_logged_out;
			default:
				return false;
		}
	} catch (err) {
		console.log("Error while retrieving token validity", err);
		return false;
	}
};

const ConnectIntegration = ({
	instanceUrl,
	onlyButton = false,
	className = "",
	setIsConnected,
}) => {
	const { user } = useUser({ user: true });
	const user_info = useRecoilValue(userInfo);
	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user_info.integration_type);
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: user_info.integration_type,
	});

	const { addError, addSuccess } = useContext(MessageContext);
	const {
		signIn: integrationSignIn,
		signOut: integrationSignOut,
		signInLoading: integrationSignInLoading,
	} = useIntegration();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (typeof setIsConnected === "function") {
			if (user && !user?.Integration_Token?.is_logged_out) {
				setIsConnected(true);
			} else {
				setIsConnected(false);
			}
		}
	}, [user]);

	const onIntegrationSignOut = () => {
		integrationSignOut(null, {
			onError: (err, _, context) => {
				addError({
					text:
						err.response?.data?.msg ||
						`Error while disconnecting with ${capitalize(user_info.integration_type)}`,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("user", context.previousUser);
			},
			onSuccess: () => {
				addSuccess(
					`Disconnected with ${capitalize(user_info.integration_type)} successfully`
				);
			},
		});
	};

	const getIntegrationTextForId = () => {
		switch (user_info?.integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "SF";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return "PD";
			case INTEGRATION_TYPE.HUBSPOT:
				return "HS";
			case INTEGRATION_TYPE.ZOHO:
				return "Zoho";
			case INTEGRATION_TYPE.BULLHORN:
				return "Bullhorn";
			default:
				return "integration";
		}
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CONNECT_INTEGRATION}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{
							PROFILE_TRANSLATION.CONNECT_TO_INTEGRATION[
								user_info.language?.toUpperCase()
							]
						}
					</h2>
					{!CONNECTION_NOT_AVAILABLE.includes(user_info?.integration_type) &&
						user?.integration_id && (
							<div className={styles.integrationIdContainer}>
								<span>
									{user?.language.toUpperCase() === "ENGLISH"
										? `${
												COMMON_TRANSLATION.YOUR[user?.language.toUpperCase()]
										  } ${getIntegrationTextForId()} ID`
										: `${
												COMMON_TRANSLATION.YOUR[user?.language.toUpperCase()]
										  } ID ${getIntegrationTextForId()} `}
								</span>
								<span className={styles.integrationId}>
									<span>{user?.integration_id}</span>
									<CopyBlank
										onClick={() => {
											navigator.clipboard.writeText(user?.integration_id);
											addSuccess("Successfully copied to clipboard.");
										}}
									/>
								</span>
							</div>
						)}
				</div>
			)}
			{!CONNECTION_NOT_AVAILABLE.includes(user_info?.integration_type) ? (
				<div className={styles.settings}>
					{!getIntegrationSpecificTokenValidity({
						user,
						user_info,
					}) ? (
						<Tooltip
							text={
								user_info?.integration_type === INTEGRATION_TYPE.DYNAMICS &&
								!instanceUrl &&
								(user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.ADMIN) &&
								`Please enter instance URL`
							}
							className={styles.integrationBtnTip}
						>
							<ThemedButton
								onClick={integrationSignIn}
								loading={integrationSignInLoading}
								loadingText={
									COMMON_TRANSLATION.CONNECTING[user_info.language?.toUpperCase()]
								}
								theme={ThemedButtonThemes.GREY}
								width="250px"
								disabled={
									(user_info?.integration_type === INTEGRATION_TYPE.DYNAMICS &&
										!instanceUrl &&
										(user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.ADMIN)) ||
									(user_info?.integration_type === INTEGRATION_TYPE.ZOHO &&
										user?.role === ROLES.SUPER_ADMIN &&
										!user?.Integration_Token?.data_center)
								}
							>
								<INTEGRATION_ICON size="2.5rem" color={Colors.salesforce} />
								<div>{`Connect with ${capitalize(user_info.integration_type)}`}</div>
							</ThemedButton>
						</Tooltip>
					) : (
						<div className={`${styles.greyBox} ${styles.active} ${className}`}>
							<div>
								<INTEGRATION_ICON size="2.5rem" color={Colors.salesforce} />
								{
									INTEGRATION_TRANSLATIONS.CONNECTED_WITH_INTEGRATION[
										user_info.language?.toUpperCase()
									]
								}
							</div>
							<ThemedButton
								onClick={onIntegrationSignOut}
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
							>
								<div>
									{COMMON_TRANSLATION.DISCONNECT[user_info.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						</div>
					)}
				</div>
			) : (
				<div className={styles.settings}>
					<div className={styles.greyBox}>
						<div>
							<INTEGRATION_ICON size="1.5rem" /> {user?.integration_id}
						</div>
						<CopyBlank
							size={18}
							color={Colors.lightBlue}
							style={{ cursor: "pointer" }}
							onClick={() => {
								addSuccess("Copied to clipboard!");
								navigator.clipboard.writeText(user?.integration_id);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ConnectIntegration;
