/* eslint-disable no-console */
import { Calendly } from "@cadence-frontend/icons";
import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./ConnectCalendly.module.scss";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useUser, useCalendlyAuth } from "@cadence-frontend/data-access";
import { useQueryClient } from "react-query";
import {
	Profile as PROFILE_TRANSLATION,
	useIntegrationTranslations,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import SuccessModal from "./components/SuccessModal/SuccessModal";
import CalendyLink from "./components/CalendyLink/CalendyLink";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const getCalendlyValidity = ({ user, user_info }) => {
	try {
		return user?.calendly_user_id ? true : false;
	} catch (err) {
		return false;
	}
};

const ConnectCalendly = ({ onlyButton = false, className = "", setIsConnected }) => {
	const { user } = useUser({ user: true });
	const user_info = useRecoilValue(userInfo);
	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user_info.integration_type);
	const { addError, addSuccess } = useContext(MessageContext);
	const [showModal, setShowModal] = useState(false);
	const [premium, setPremium] = useState(true);
	const {
		signIn: integrationSignIn,
		signOut: integrationSignOut,
		signInLoading: integrationSignInLoading,
	} = useCalendlyAuth(false);
	const queryClient = useQueryClient();

	//Show success modal 1 time if user is redirected to profile page after calendly auth
	useEffect(() => {
		if (!user) {
			return;
		}
		const calendlyAuth = JSON.parse(localStorage.getItem("calendlyAuth"));
		if (calendlyAuth && getCalendlyValidity({ user, user_info })) {
			setShowModal(prev => !prev);
		}
		localStorage.setItem("calendlyAuth", JSON.stringify(false));
		setYesOrNo(user);
	}, [user]);

	const setYesOrNo = user => {
		if (user?.calendly_url?.length > 0 && !user?.calendly_user_id) setPremium(false);
	};

	const onIntegrationSignOut = () => {
		integrationSignOut(null, {
			onError: (err, _, context) => {
				addError({
					text: err.response?.data?.msg || `Error while disconnecting with Calendly`,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("user", context.previousUser);
			},
			onSuccess: data => {
				addSuccess(`Disconnected with Calendly successfully`);
			},
		});
	};

	const handleCheckboxChange = val => {
		setPremium(val);
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CONNECT_CALENDLY}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[user?.language?.toUpperCase()]}
					</h2>
				</div>
			)}

			<div className={styles.settings}>
				<h2>{PROFILE_TRANSLATION.PREMIUM_ACCOUNT[user?.language?.toUpperCase()]}</h2>
				<div className={styles.checkBoxParent}>
					<div className={`${styles.greyBox} ${premium ? styles.active : ""}`}>
						<div>
							<InputRadio
								className={styles.radio}
								size="24"
								checked={premium}
								disabled={getCalendlyValidity({ user, user_info })}
								onChange={() => handleCheckboxChange(prev => !prev)}
							/>
							{COMMON_TRANSLATION.YES[user?.language.toUpperCase()]}
						</div>
					</div>
					<div className={`${styles.greyBox} ${!premium ? styles.active : ""}`}>
						<div>
							<InputRadio
								className={styles.radio}
								size="24"
								checked={!premium}
								disabled={getCalendlyValidity({ user, user_info })}
								onChange={() => handleCheckboxChange(prev => !prev)}
							/>
							{COMMON_TRANSLATION.NO[user?.language.toUpperCase()]}
						</div>
					</div>
				</div>
				{premium && (
					<div className={styles.premium}>
						<h2>
							{PROFILE_TRANSLATION.FOR_PREMIUM_ACCOUNT[user?.language?.toUpperCase()]}
						</h2>
						<p>
							{
								PROFILE_TRANSLATION.FOR_PREMIUM_ACCOUNT_DESCRIPTION[
									user?.language?.toUpperCase()
								]
							}
						</p>

						{!getCalendlyValidity({
							user,
							user_info,
						}) ? (
							<ThemedButton
								onClick={integrationSignIn}
								loading={integrationSignInLoading}
								loadingText={COMMON_TRANSLATION.CONNECTING[user?.language?.toUpperCase()]}
								theme={ThemedButtonThemes.GREY}
								width="250px"
							>
								<Calendly size="2.5rem" />
								<div>
									{PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						) : (
							<div className={`${styles.greyBox} ${styles.active} ${className}`}>
								<div>
									<Calendly size="2.5rem" />
									{
										INTEGRATION_TRANSLATIONS.CONNECTED_WITH_CALENDLY[
											user?.language?.toUpperCase()
										]
									}
								</div>
								<ThemedButton
									onClick={onIntegrationSignOut}
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
								>
									<div>
										{COMMON_TRANSLATION.DISCONNECT[user?.language?.toUpperCase()]}
									</div>
								</ThemedButton>
							</div>
						)}
					</div>
				)}
				{!premium && (
					<div className={styles.normal}>
						<h2>{PROFILE_TRANSLATION.FOR_FREE_ACCOUNT[user?.language?.toUpperCase()]}</h2>
						<p>
							{
								PROFILE_TRANSLATION.FOR_FREE_ACCOUNT_DESCRIPTION[
									user?.language?.toUpperCase()
								]
							}
						</p>
						<div className={styles.calendlyLink}>
							<CalendyLink />
						</div>
					</div>
				)}
			</div>
			<SuccessModal showModal={showModal} setShowModal={setShowModal} />
		</div>
	);
};

export default ConnectCalendly;
