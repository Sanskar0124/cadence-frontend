import { useUser } from "@cadence-frontend/data-access";
import { GoogleBox } from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputRadio } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styles from "./ConnectGoogle.module.scss";
import EmailSignature from "./EmailSignature/EmailSignature";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	Email as EMAIL_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ConnectEmailSystem } from "@cadence-frontend/features";

const ConnectGoogle = ({ postDataRef }) => {
	const { addError } = useContext(MessageContext);
	const queryClient = useQueryClient();
	const setRecoilUser = useSetRecoilState(userInfo);

	const save = ({ cb }) => {
		if (typeof cb === "function") cb();
	};

	useEffect(() => {
		postDataRef.current = save;
	}, []);

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

	return (
		<div className={styles.connectGoogleContainer}>
			<div className={styles.GoogleIcon}>{/* <Google size="18rem" /> */}</div>
			<div className={styles.header}>
				<div className={styles.heading}>
					<GoogleBox size="1.8rem" color={"#00A1E0"} />{" "}
					{EMAIL_TRANSLATION.CONNECT_GOOGLE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						EMAIL_TRANSLATION.MERGE_YOUR_FIELDS_FROM_CRM_TO_RINGOVER[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.loginGoogle}>
					<div className={styles.heading}>
						{EMAIL_TRANSLATION.LOGIN_TO_GOOGLE[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{EMAIL_TRANSLATION.KINDLY_LOGIN_WITH_GOOGLE[user?.language?.toUpperCase()]}
					</div>
					<ConnectEmailSystem
						onlyButton={true}
						className={styles.onboardingGoogleButton}
						setIsConnected={setIsConnected}
					/>
				</div>
				<div className={styles.installPKG}>
					<div className={styles.heading}>
						{EMAIL_TRANSLATION.SETUP_GOOGLE_DOMAIN[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{EMAIL_TRANSLATION.CONNECT_YOUR_GOOGLE_ACCOUNT[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.helpLinks}>
						<a
							href="https://docs.google.com/document/d/1SOLQnMc71V3A7dE5m3jHKlEe8uxaQBzfq6moJsNaeSE/edit?usp=sharing"
							target="_blank"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
					</div>
				</div>
				<div className={styles.connectionsContainer}>
					<div className={styles.cHeading}>
						{EMAIL_TRANSLATION.EMAIL_SETTINGS[user?.language?.toUpperCase()]}
					</div>
					{!isConnected ? (
						<div className={styles.cTitle}>
							{
								COMMON_TRANSLATION.CONNECT_TO_GOOGLE_TO_SET_EMAIL[
									user?.language?.toUpperCase()
								]
							}
							.
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

export default ConnectGoogle;
