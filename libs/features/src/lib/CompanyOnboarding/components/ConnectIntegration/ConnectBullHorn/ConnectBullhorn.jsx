import React, { useState, useEffect, useContext } from "react";
import styles from "./ConnectBullhorn.module.scss";
import { useSettings } from "@cadence-frontend/data-access";
import { ErrorGradient, Bullhorn } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	useIntegrationTranslations,
	Bullhorn as BULLHORN_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { Div, Skeleton } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

const ConnectBullhorn = ({ postDataRef, setDisableNext }) => {
	const user = useRecoilValue(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);
	const [isConnected, setIsConnected] = useState(false);
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const [isAdminFetched, setIsAdminFetched] = useState(false);
	const TRANSLATION = useIntegrationTranslations(user?.integration_type);

	const {
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
	} = useSettings({ enabled: false });

	useEffect(() => {
		setDisableNext(true);
		fetchAdminSuperAdmins(null, {
			onSuccess: sadmins => {
				fetchUserWithActiveSFToken(null, {
					onSuccess: activeSadmin => {
						setAdministratorOptions(
							sadmins.map(ad => ({
								label: ad?.first_name + " " + ad.last_name,
								value: ad.user_id,
							}))
						);
						if (activeSadmin.Company?.Company_Setting?.User?.user_id)
							setAdministrator(activeSadmin.Company?.Company_Setting?.User);
						setIsAdminFetched(true);
					},
					onError: err => {
						addError({
							text: err?.response?.data?.message,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				});
			},
			onError: err => {
				addError({
					text: err?.response?.data?.message,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	}, []);

	useEffect(() => {
		if (postDataRef?.current) postDataRef.current = save;
	}, [isConnected]);

	useEffect(() => {
		//While onboarding if bullhorn is connected and there is no zAdminId then set SuperAdmin as default zAdmin
		if (isConnected && isAdminFetched && !administrator) {
			updateUserWithActiveSFToken(
				{ user_id: user.user_id },
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						}),
				}
			);
		}
	}, [isConnected, administrator, isAdminFetched]);

	useEffect(() => {
		if (isConnected) {
			setDisableNext(false);
		} else setDisableNext(true);
	}, [isConnected]);

	const getAdminStatus = admin => {
		if (!admin)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{COMMON_TRANSLATION.CRM_ADMIN_IS_NOT_SELECTED[user?.language?.toUpperCase()]}
				</>
			);
		if (
			administrator?.Bullhorn_Token?.is_logged_out ||
			!administrator?.Bullhorn_Token?.instance_url
		)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{
						BULLHORN_TRANSLATION.CRM_ADMIN_IS_NOT_CONNECTED_WITH_BULLHORN[
							user?.language?.toUpperCase()
						]
					}
				</>
			);
		return (
			<>
				<Bullhorn />
				{administrator?.first_name} {administrator?.last_name}{" "}
				{BULLHORN_TRANSLATION.IS_CONNECTED_WITH_BULLHORN[user?.language?.toUpperCase()]}
			</>
		);
	};

	const save = ({ cb }) => {
		if (isConnected) {
			if (typeof cb === "function") cb();
		}
	};

	return (
		<div className={styles.connectBullhornContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Bullhorn size="45px" color={"#00A1E0"} />
					{COMMON_TRANSLATION.CONNECT_BULLHORN[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_BULLHORN[
							user?.language?.toUpperCase()
						]
					}

					<br />
					<br />
					{
						COMMON_TRANSLATION.THE_AIM_IS_TO_CONNECT_YOUR_DATABASE[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>

			<div className={styles.body}>
				<div className={styles.inputBlock}>
					<div className={styles.heading}>
						{BULLHORN_TRANSLATION.LOGIN_TO_BULLHORN[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{BULLHORN_TRANSLATION.TO_SIGN_IN_TO_BULLHORN[user?.language?.toUpperCase()]}

						<br />
						{
							BULLHORN_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<ConnectIntegration
						onlyButton={true}
						className={styles.onboardingSFButton}
						setIsConnected={setIsConnected}
					/>
				</div>

				<div className={styles.bullhornAdministrator}>
					<div className={styles.heading}>
						{BULLHORN_TRANSLATION.BULLHORN_ADMINISTRATOR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							BULLHORN_TRANSLATION.CREATE_BULLHORN_ADMINISTRATOR[
								user?.language?.toUpperCase()
							]
						}
					</div>
					{window.location.href.includes("onboarding") ? (
						<Select
							width="400px"
							options={[]}
							placeholder={"Super Admin (you)"}
							disabled={true}
						/>
					) : (
						<Div
							loading={
								updateUserWithActiveSFTokenLoading || fetchUserWithActiveSFTokenLoading
							}
							className={styles.adminPlaceholder}
						>
							<Select
								width="400px"
								options={administratorOptions}
								value={administrator?.user_id}
								setValue={val => {
									updateUserWithActiveSFToken(
										{ user_id: val },
										{
											onSuccess: () => window.location.reload(),
											onError: err =>
												addError({
													text: err?.response?.data?.msg,
													desc: err?.response?.data?.error,
													cId: err?.response?.data?.correlationId,
												}),
										}
									);
								}}
								disabled={updateUserWithActiveSFTokenLoading}
								menuOnTop
							/>
						</Div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConnectBullhorn;
