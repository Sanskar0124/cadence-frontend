import { useUser } from "@cadence-frontend/data-access";
import { User } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Title } from "@cadence-frontend/components";
import { InputRadio } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import styles from "./EmailSetup.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import { userInfo } from "@cadence-frontend/atoms";
import { useSetRecoilState } from "recoil";
import EmailSignature from "./components/EmailSignature/EmailSignature";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Email as EMAIL_TRANSLATION } from "@cadence-frontend/languages";
import { MAIL_INTEGRATION_TYPES, ROLES } from "@cadence-frontend/constants";
import { ConnectEmailSystem } from "@cadence-frontend/features";

//components

//constants

const EmailSetup = ({ postDataRef }) => {
	const { addError } = useContext(MessageContext);
	const queryClient = useQueryClient();
	const setRecoilUser = useSetRecoilState(userInfo);

	const { emails, emailsLoading, updateUser, user } = useUser({
		user: true,
		emails: true,
	});

	const [isConnected, setIsConnected] = useState(false);

	const onUpdatePrimary = email => {
		updateUser(
			{ primary_email: email },
			{
				onError: (err, _, context) => {
					addError({
						text: "Error updating primary email",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => setRecoilUser(prev => ({ ...prev, email })),
			}
		);
	};

	const getMailServiceName = () => {
		switch (user?.mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return "Gmail ";
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return "Outlook ";
		}
	};

	return (
		<div className={styles.connectAccountsContainer}>
			<div className={styles.header}>
				<div className={styles.title}>
					<span>
						<User color={Colors.white} size="1.2rem" />
					</span>{" "}
					<Title size="1.5rem" className={styles.emailTitle}>
						{COMMON_TRANSLATION.EMAILS_SET_UP[user?.language?.toUpperCase()]}
					</Title>
				</div>
				<div className={styles.subtitle}>
					{
						COMMON_TRANSLATION.MOVE_TO_NEXT_STEP_OF_ONBOARDING[
							user?.language?.toUpperCase()
						]
					}{" "}
					{getMailServiceName()}
					{COMMON_TRANSLATION.ACCOUNT_TO_CADENCE_TOOL[user?.language?.toUpperCase()]}
				</div>
			</div>
			<div className={styles.body}>
				{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
					user?.role === ROLES.SUPER_ADMIN && (
						<div className={styles.connectionsContainer}>
							<div className={styles.cHeading}>
								{SETTINGS_TRANSLATION.SETUP_GOOGLE_DOMAIN[user?.language?.toUpperCase()]}{" "}
								<div className={styles.importantTag}>
									{COMMON_TRANSLATION.IMPORTANT[user?.language?.toUpperCase()]}
								</div>
							</div>
							<div className={styles.cSubtitle}>
								{
									SETTINGS_TRANSLATION.VALIDATE_RINGOVER_WITH_GOOGLE_WORKSPACE[
										user?.language?.toUpperCase()
									]
								}
							</div>
							<div className={styles.helpLinks}>
								<a
									href="https://docs.google.com/document/d/1SOLQnMc71V3A7dE5m3jHKlEe8uxaQBzfq6moJsNaeSE/edit"
									target="_blank"
									rel="noreferrer"
								>
									{
										SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
											user?.language?.toUpperCase()
										]
									}
								</a>
							</div>
						</div>
					)}
				<div className={styles.connectionsContainer}>
					<div className={styles.cHeading}>
						{COMMON_TRANSLATION.EMAIL[user?.language?.toUpperCase()]}{" "}
						{COMMON_TRANSLATION.AND[user?.language?.toUpperCase()]}{" "}
						{COMMON_TRANSLATION.CALENDAR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.cSubtitle}>
						{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
							COMMON_TRANSLATION.CONNECT_GMAIL_TO_CADENCE[user?.language?.toUpperCase()]}
						{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK &&
							COMMON_TRANSLATION.CONNECT_OUTLOOK_TO_CADENCE[
								user?.language?.toUpperCase()
							]}
					</div>
					<div className={styles.cTitle1}>
						{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
							COMMON_TRANSLATION.CONNECT_YOUR_GOOGLE_ACCOUNT[
								user?.language?.toUpperCase()
							]}
						{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK &&
							COMMON_TRANSLATION.CONNECT_YOUR_OUTLOOK_ACCOUNT[
								user?.language?.toUpperCase()
							]}
					</div>
					<div className={styles.cButton}>
						<ConnectEmailSystem
							onlyButton={true}
							className={`${styles.googleBtn} ${isConnected ? styles.connected : ""}`}
							setIsConnected={setIsConnected}
						/>
					</div>
				</div>
				<div className={styles.connectionsContainer}>
					<div className={styles.cHeading}>
						{EMAIL_TRANSLATION.EMAIL_SETTINGS[user?.language?.toUpperCase()]}
					</div>
					{!isConnected ? (
						<div className={styles.cTitle}>
							{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
								COMMON_TRANSLATION.CONNECT_TO_GOOGLE_TO_SET_EMAIL[
									user?.language?.toUpperCase()
								]}
							{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK &&
								COMMON_TRANSLATION.CONNECT_TO_OUTLOOK_TO_SET_EMAIL[
									user?.language?.toUpperCase()
								]}
						</div>
					) : (
						<div className={styles.emailSetup}>
							<div className={styles.emailConfigure}>
								<div className={styles.cTitle}>
									{EMAIL_TRANSLATION.PRIMARY_EMAIL[user?.language?.toUpperCase()]}
								</div>
								<div className={styles.cSubtitle}>
									{
										EMAIL_TRANSLATION.SELECT_YOUR_PRIMARY_EMAIL[
											user?.language?.toUpperCase()
										]
									}
								</div>
								<div className={styles.emails}>
									{emails?.map(email => (
										<div
											key={email.address}
											className={`${
												email.address === user?.primary_email ? styles.active : ""
											}`}
										>
											<div className={styles.input}>
												<InputRadio
													size={40}
													checked={email.address === user?.primary_email}
													value={email.address}
													onChange={() => onUpdatePrimary(email.address)}
												/>
												<span className={styles.name}>{email.address}</span>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className={styles.emailSignatureConfigure}>
								<div className={styles.cTitle}>
									{EMAIL_TRANSLATION.EMAIL_SIGNATURES[user?.language?.toUpperCase()]}
								</div>
								<div className={styles.emailSignatures}>
									<EmailSignature />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EmailSetup;
