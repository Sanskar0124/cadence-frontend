/* eslint-disable no-console */
import { Calendly } from "@cadence-frontend/icons";
import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./CalendlyAuth.module.scss";
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
import SuccessModal from "./Component/SuccessModal/SuccessModal";
import CalendyLink from "../CalendyLink/CalendyLink";
import CalendlyEvent from "../CalendlyEvent/CalendlyEvent";

const getCalendlyValidity = ({ user, user_info }) => {
	try {
		return user?.calendly_user_id ? true : false;
	} catch (err) {
		return false;
	}
};

const CalendlyAuth = ({ onlyButton = false, className = "", setIsConnected }) => {
	const { user } = useUser({ user: true });
	const user_info = useRecoilValue(userInfo);
	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user_info.integration_type);
	const { addError, addSuccess } = useContext(MessageContext);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [premium, setPremium] = useState(false);
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
					desc: err?.response?.data?.error ?? "",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("user", context.previousUser);
			},
			onSuccess: data => {
				addSuccess(`Disconnected with Calendly successfully`);
			},
		});
	};

	const onSignIn = () => {
		localStorage.setItem("calendlyAuth", JSON.stringify(true));
		setLoading(true);
		integrationSignIn();
		setTimeout(() => {
			setLoading(false);
		}, 7000);
	};

	const handleCheckboxChange = val => {
		setPremium(val);
	};
	return (
		<div className={styles.integration}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[user?.language?.toUpperCase()]}
					</h2>
					<p className={styles.calendlyDes}>
						{
							COMMON_TRANSLATION.CONNECT_YOUR_CALENDLY_ACCOUNT[
								user?.language?.toUpperCase()
							]
						}
					</p>
				</div>
			)}

			{/* <div className={styles.settings}>
				{console.log(getCalendlyValidity({ user, user_info }))}
				<div
					className={`${
						getCalendlyValidity({ user, user_info }) ? "" : styles.active
					} ${className}`}
					onClick={
						getCalendlyValidity({ user, user_info })
							? () => null
							: () => {
									onSignIn();
							  }
					}
				>
					{getCalendlyValidity({
						user,
						user_info,
					}) ? (
						<div className={styles.connect}>
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
								<div>{COMMON_TRANSLATION.DISCONNECT[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						</div>
					) : loading ? (
						<>
							<Calendly size="2.5rem" />
							Connecting
						</>
					) : (
						<>
							<Calendly size="2.5rem" />
							<span>{`Connect with Calendly`}</span>
						</>
					)}
				</div>
			</div> */}

			<div className={styles.options}>
				<h2 className={styles.subHeadings}>
					{PROFILE_TRANSLATION.PREMIUM_ACCOUNT[user?.language?.toUpperCase()]}
				</h2>

				<div className={styles.checkBoxParent}>
					<div
						onClick={() => {
							handleCheckboxChange(true);
						}}
						className={`${premium ? styles.active : ""} ${styles.newCheckbox}`}
					>
						<InputRadio
							className={styles.radio}
							size="24"
							checked={premium}
							disabled={true}
						/>
						<p>{COMMON_TRANSLATION.YES[user?.language?.toUpperCase()]}</p>
					</div>

					<div
						onClick={() => {
							if (getCalendlyValidity({ user, user_info })) return;
							handleCheckboxChange(false);
						}}
						className={`${!premium ? styles.active : ""} ${
							getCalendlyValidity({ user, user_info }) ? styles.disabled : ""
						} ${styles.newCheckbox}`}
					>
						<InputRadio
							className={styles.radio}
							size="24"
							checked={!premium}
							disabled={true}
						/>
						<p>{COMMON_TRANSLATION.NO[user?.language.toUpperCase()]}</p>
					</div>
				</div>
				{premium && (
					<div className={styles.premium}>
						<h2 className={styles.subHeadings}>
							{PROFILE_TRANSLATION.FOR_PREMIUM_ACCOUNT[user?.language?.toUpperCase()]}
						</h2>
						<p>
							{
								PROFILE_TRANSLATION.FOR_PREMIUM_ACCOUNT_DESCRIPTION[
									user?.language?.toUpperCase()
								]
							}
						</p>

						<div className={styles.settings}>
							<div
								className={`${
									getCalendlyValidity({ user, user_info }) ? "" : styles.active
								} ${className}`}
								onClick={
									getCalendlyValidity({ user, user_info })
										? () => null
										: () => {
												onSignIn();
										  }
								}
							>
								{getCalendlyValidity({
									user,
									user_info,
								}) ? (
									<div className={styles.connect}>
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
								) : loading ? (
									<>
										<Calendly size="2.5rem" />
										Connecting
									</>
								) : (
									<>
										<Calendly size="2.5rem" />
										<span className={styles.capitalize}>
											{
												PROFILE_TRANSLATION.CONNECT_TO_CALENDLY[
													user?.language.toUpperCase()
												]
											}
										</span>
									</>
								)}
							</div>
						</div>
					</div>
				)}
				{!premium && (
					<div className={styles.normal}>
						<h2 className={styles.subHeadings}>
							{PROFILE_TRANSLATION.FOR_FREE_ACCOUNT[user?.language?.toUpperCase()]}
						</h2>
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

				{getCalendlyValidity({
					user,
					user_info,
				}) && <CalendlyEvent />}
			</div>

			<SuccessModal showModal={showModal} setShowModal={setShowModal} />
		</div>
	);
};

export default CalendlyAuth;
