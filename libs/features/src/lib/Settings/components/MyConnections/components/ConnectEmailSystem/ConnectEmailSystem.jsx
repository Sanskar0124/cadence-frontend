import { Google, Outlook, TickGradient } from "@cadence-frontend/icons";
import React, { useContext, useEffect, useState } from "react";
import styles from "./ConnectEmailSystem.module.scss";
import { ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useGoogle, useOutlook, useUser } from "@cadence-frontend/data-access";
import { useQueryClient } from "react-query";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const ConnectEmailSystem = ({ onlyButton = false, className = "", setIsConnected }) => {
	const { user } = useUser({ user: true });
	const { addError, addSuccess } = useContext(MessageContext);
	const { signIn: googleSignIn, signOut: googleSignOut } = useGoogle();
	const { signIn: outlookSignIn, signOut: outlookSignOut } = useOutlook();
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const onSignOut = () => {
		switch (user?.mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return googleSignOut(null, {
					onError: (err, _, context) => {
						addError({
							text: err.response?.data?.msg || "Error while disconnecting with google",
							desc: err?.response?.data?.error || "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
						queryClient.setQueryData("user", context.previousUser);
					},
					onSuccess: () => {
						addSuccess("Google disconnected");
					},
				});
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return outlookSignOut(null, {
					onError: (err, _, context) => {
						addError({
							text: err.response?.data?.msg || "Error while disconnecting with outlook",
							desc: err?.response?.data?.error || "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
						queryClient.setQueryData("user", context.previousUser);
					},
					onSuccess: () => {
						addSuccess("Outlook disconnected");
					},
				});
		}
	};

	useEffect(() => {
		if (user && setIsConnected) {
			switch (user?.mail_integration_type) {
				case MAIL_INTEGRATION_TYPES.OUTLOOK:
					if (!user?.is_outlook_token_expired) {
						setIsConnected(true);
					} else {
						setIsConnected(false);
					}
					break;
				case MAIL_INTEGRATION_TYPES.GOOGLE:
					if (!user?.is_google_token_expired) {
						setIsConnected(true);
					} else {
						setIsConnected(false);
					}
					break;
			}
		}
	}, [user]);

	const onSignIn = () => {
		setLoading(true);
		switch (user?.mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return googleSignIn();
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return outlookSignIn();
		}
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	};

	const renderMailIntegrationOptions = () => {
		switch (user?.mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return user?.is_google_token_expired ? (
					<ThemedButton
						onClick={onSignIn}
						loading={loading}
						loadingText={COMMON_TRANSLATION.CONNECTING[user?.language?.toUpperCase()]}
						theme={ThemedButtonThemes.GREY}
						width="250px"
					>
						<Google />
						<div>
							{COMMON_TRANSLATION.CONNECT_WITH_GOOGLE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				) : (
					<div className={`${styles.greyBox} ${styles.active} ${className}`}>
						<div>
							<Google />
							{PROFILE_TRANSLATION.CONNECTED_WITH_GOOGLE[user?.language?.toUpperCase()]}
						</div>
						<ThemedButton
							onClick={onSignOut}
							theme={ThemedButtonThemes.TRANSPARENT}
							width="fit-content"
						>
							<div>{COMMON_TRANSLATION.DISCONNECT[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					</div>
				);
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return user?.is_outlook_token_expired ? (
					<ThemedButton
						onClick={onSignIn}
						loading={loading}
						loadingText={COMMON_TRANSLATION.CONNECTING[user?.language?.toUpperCase()]}
						theme={ThemedButtonThemes.GREY}
						width="250px"
					>
						<Outlook size="2.4rem" />
						<div>
							{COMMON_TRANSLATION.CONNECT_WITH_OUTLOOK[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				) : (
					<div className={`${styles.greyBox} ${styles.active} ${className}`}>
						<div>
							<Outlook size="2.4rem" />
							{PROFILE_TRANSLATION.CONNECTED_WITH_OUTLOOK[user?.language?.toUpperCase()]}
						</div>
						<ThemedButton
							onClick={onSignOut}
							theme={ThemedButtonThemes.TRANSPARENT}
							width="fit-content"
						>
							<div>{COMMON_TRANSLATION.DISCONNECT[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					</div>
				);
		}
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CONNECT_ANOTHER_SOURCE}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{
							PROFILE_TRANSLATION.CONNECT_FROM_ANOTHER_SOURCE[
								user?.language?.toUpperCase()
							]
						}
					</h2>
				</div>
			)}

			<div className={styles.settings}>{renderMailIntegrationOptions()}</div>
		</div>
	);
};

export default ConnectEmailSystem;
