import { useState, useEffect, useContext } from "react";
import { useSettings, useUser } from "@cadence-frontend/data-access";
import styles from "./ConnectDynamics.module.scss";

//components
import { ErrorGradient, Dynamics } from "@cadence-frontend/icons";
import { Select } from "@cadence-frontend/widgets";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";
import { MessageContext } from "@cadence-frontend/contexts";
import { Div, Skeleton } from "@cadence-frontend/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Label } from "@cadence-frontend/widgets";
import {
	Dynamics as DYNAMICS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import InputWithButton from "libs/features/src/lib/Settings/components/InputWithButton/InputWithButton";

//constants

const ConnectDynamics = ({ postDataRef, setDisableNext, setLoading }) => {
	const [user, setRecoilUser] = useRecoilState(userInfo);
	const { updateInstanceUrl, updateInstanceUrlLoading } = useUser();

	const { addSuccess, addError } = useContext(MessageContext);
	const {
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
	} = useSettings({ enabled: false });

	const [isConnected, setIsConnected] = useState(false);
	const [instanceUrl, setInstanceUrl] = useState();
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const [isAdminFetched, setIsAdminFetched] = useState(false);

	const save = ({ cb }) => {
		if (isConnected) {
			if (typeof cb === "function") cb();
		}
	};
	const handleSave = () => {
		if (!instanceUrl) {
			addError({ text: "Please enter the instance url." });
			return;
		}
		if (!instanceUrl.startsWith("https://") || !instanceUrl.endsWith("dynamics.com")) {
			return addError({ text: "Enter the correct instance URL." });
		}
		const body = { instance_url: instanceUrl };
		updateInstanceUrl(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg ?? "Failed to update instance URL.",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Instance URL updated.");
				setRecoilUser(prev => ({ ...prev, instance_url: instanceUrl }));
			},
		});
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
		setInstanceUrl(user?.instance_url);
	}, []);

	useEffect(() => {
		if (postDataRef?.current) postDataRef.current = save;
	}, [isConnected]);

	useEffect(() => {
		//While onboardiDynamics is connected and there is no hsAdminId then set SuperAdmin as default hsAdmin
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
		<div className={styles.connectDynamicsContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Dynamics size="1.8rem" />
					{COMMON_TRANSLATION.CONNECT_DYNAMICS[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_DYNAMICS[
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
					<Label className={styles.headingInstanceUrl} required>
						{DYNAMICS_TRANSLATION.ENTER_INSTANCE_URL[user?.language?.toUpperCase()]}
					</Label>
					<div className={styles.subheading}>
						{DYNAMICS_TRANSLATION.INSTANCE_URL_MSG[user?.language?.toUpperCase()]}
					</div>
					<InputWithButton
						btnText={COMMON_TRANSLATION.UPDATE[user?.language?.toUpperCase()]}
						inputProps={{
							value: instanceUrl,
							setValue: setInstanceUrl,
							placeholder:
								DYNAMICS_TRANSLATION.SAMPLE_INSTANCE_URL[user?.language?.toUpperCase()],
						}}
						btnProps={{
							onClick: handleSave,
							loading: updateInstanceUrlLoading,
						}}
						width="60%"
					/>
				</div>
				<div className={styles.inputBlock}>
					<div className={styles.heading}>
						{DYNAMICS_TRANSLATION.LOGIN_TO_DYNAMICS[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{DYNAMICS_TRANSLATION.TO_SIGN_IN_TO_DYNAMICS[user?.language?.toUpperCase()]}
						<br />
						{
							DYNAMICS_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<ConnectIntegration
						onlyButton={true}
						instanceUrl={instanceUrl}
						className={styles.onboardingSFButton}
						setIsConnected={setIsConnected}
					/>
				</div>
				<div className={styles.dynamicsAdministrator}>
					<div className={styles.heading}>
						{DYNAMICS_TRANSLATION.DYNAMICS_ADMINISTRATOR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							DYNAMICS_TRANSLATION.CREATE_DYNAMICS_ADMINISTRATOR[
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

export default ConnectDynamics;
