import { useSettings } from "@cadence-frontend/data-access";
import { useContext, useEffect, useState } from "react";
import styles from "./ConnectPipedrive.module.scss";

//components
import { userInfo } from "@cadence-frontend/atoms";
import { ErrorGradient, Pipedrive } from "@cadence-frontend/icons";
import { Div, Skeleton } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Select } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";
import {
	Pipedrive as PIPEDRIVE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Salesforce as SALESFORCE_TRANSLATION,
} from "@cadence-frontend/languages";

const ConnectPipedrive = ({ postDataRef, setDisableNext }) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const {
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
	} = useSettings({ enabled: false });

	const [isConnected, setIsConnected] = useState(false);
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const [isAdminFetched, setIsAdminFetched] = useState(false);

	const save = ({ cb }) => {
		if (isConnected) {
			if (typeof cb === "function") cb();
		}
	};

	const getAdminStatus = admin => {
		if (!admin)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{COMMON_TRANSLATION.CRM_ADMIN_IS_NOT_SELECTED[user?.language?.toUpperCase()]}
				</>
			);
		if (
			administrator?.Pipedrive_Token?.is_logged_out ||
			!administrator?.Pipedrive_Token?.instance_url
		)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{
						PIPEDRIVE_TRANSLATION.CRM_ADMIN_IS_NOT_CONNECTED_WITH_PIPEDRIVE[
							user?.language?.toUpperCase()
						]
					}
				</>
			);
		return (
			<>
				<Pipedrive />
				{administrator?.first_name} {administrator?.last_name}{" "}
				{PIPEDRIVE_TRANSLATION.IS_CONNECTED_WITH_PIPEDRIVE[user?.language?.toUpperCase()]}
			</>
		);
	};

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
		//While onboarding if pipedrive is connected and there is no sfAdminId then set SuperAdmin as default sfAdmin
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

	return (
		<div className={styles.connectSalesforceContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Pipedrive size="30px" />{" "}
					{COMMON_TRANSLATION.CONNECT_PIPEDRIVE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_PIPEDRIVE[
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
						{PIPEDRIVE_TRANSLATION.LOGIN_TO_PIPEDRIVE[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{PIPEDRIVE_TRANSLATION.TO_SIGN_IN_TO_PIPEDRIVE[user?.language?.toUpperCase()]}
						<br />
						{
							SALESFORCE_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
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
				<div className={styles.salesforceAdministrator}>
					<div className={styles.heading}>
						{PIPEDRIVE_TRANSLATION.PIPEDRIVE_ADMINISTRATOR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							PIPEDRIVE_TRANSLATION.CREATE_PIPEDRIVE_ADMINISTRATOR[
								user?.language?.toUpperCase()
							]
						}
					</div>
					{window.location.href.includes("onboarding") ? (
						<Select width="400px" placeholder={"Super Admin (you)"} disabled />
					) : (
						<Div
							loading={
								updateUserWithActiveSFTokenLoading || fetchUserWithActiveSFTokenLoading
							}
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

export default ConnectPipedrive;
