import { userInfo } from "@cadence-frontend/atoms";
import { Spinner, Title } from "@cadence-frontend/components";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useEmailSystem, useUser } from "@cadence-frontend/data-access";
import { SuccessTick } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styles from "./EmailSystem.module.scss";
import { MAIL_INTEGRATION_ICON_MAP, MAIL_INTEGRATION_NAME_MAP } from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const EmailSystem = () => {
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);

	const { updateOnboardingValue, updateOnboardingValueLoading } = useUser();

	const [user, setUser] = useRecoilState(userInfo);
	const [loading, setLoading] = useState(false);

	const { updateEmailSystem } = useEmailSystem();

	const finishOnboarding = () => {
		updateOnboardingValue(
			{ is_onboarding_complete: true },
			{
				onSuccess: () => navigate("/cadence"),
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	const onUpdateEmailSystem = emailSystem => {
		if (emailSystem === user?.mail_integration_type) return;
		setLoading(emailSystem);
		updateEmailSystem(
			{ mail_integration_type: emailSystem },
			{
				onSuccess: () =>
					setUser(prev => ({ ...prev, mail_integration_type: emailSystem })),
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
				onSettled: () => setLoading(false),
			}
		);
	};

	return (
		<div className={styles.emailSystem}>
			<div className={styles.title}>
				<Title size="2rem">
					{COMMON_TRANSLATION.SELECT_EMAIL_PROVIDER[user?.language?.toUpperCase()]}
				</Title>
				<p>
					{COMMON_TRANSLATION.SELECT_EMAIL_PROVIDER_DESC[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.providers}>
				{Object.values(MAIL_INTEGRATION_TYPES).map(provider => (
					<div
						className={user?.mail_integration_type === provider ? styles.selected : ""}
						onClick={() => onUpdateEmailSystem(provider)}
					>
						<div className={styles.left}>
							<div className={styles[provider]}>
								{MAIL_INTEGRATION_ICON_MAP[provider]}
							</div>
							<span>{MAIL_INTEGRATION_NAME_MAP[provider]}</span>
						</div>
						<div className={styles.status}>
							{user?.mail_integration_type === provider ? (
								<>
									<SuccessTick />{" "}
									{COMMON_TRANSLATION.SELECTED[user?.language?.toUpperCase()]}
								</>
							) : loading === provider ? (
								<Spinner color={Colors.lightBlue} size="2rem" />
							) : (
								<>
									<SuccessTick />{" "}
									{COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
								</>
							)}
						</div>
					</div>
				))}
			</div>
			<div className={styles.navigation}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => finishOnboarding()}
					loading={updateOnboardingValueLoading}
					disabled={!user?.mail_integration_type}
					width="103px"
				>
					<div>{COMMON_TRANSLATION.CONTINUE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</div>
	);
};
export default EmailSystem;
