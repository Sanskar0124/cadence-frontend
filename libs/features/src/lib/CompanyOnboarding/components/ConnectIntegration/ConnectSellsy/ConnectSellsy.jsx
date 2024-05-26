import { useState, useEffect, useContext } from "react";
import { useSettings } from "@cadence-frontend/data-access";
import styles from "./ConnectSellsy.module.scss";

//components
import { ErrorGradient, Sellsy } from "@cadence-frontend/icons";
import { Select } from "@cadence-frontend/widgets";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";
import { MessageContext } from "@cadence-frontend/contexts";
import { Div, Skeleton } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Sellsy as SELLSY_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

//constants

const ConnectSellsy = ({ postDataRef, setDisableNext, setLoading }) => {
	const user = useRecoilValue(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);
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
		//While onboardiSellsy is connected and there is no hsAdminId then set SuperAdmin as default hsAdmin
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
		<div className={styles.connectSellsyContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<Sellsy size="1.8rem" />
					{COMMON_TRANSLATION.CONNECT_SELLSY[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_SELLSY[
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
						{SELLSY_TRANSLATION.LOGIN_TO_SELLSY[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{SELLSY_TRANSLATION.TO_SIGN_IN_TO_SELLSY[user?.language?.toUpperCase()]}
						<br />
						{
							SELLSY_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[
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
				<div className={styles.sellsyAdministrator}>
					<div className={styles.heading}>
						{SELLSY_TRANSLATION.SELLSY_ADMINISTRATOR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							SELLSY_TRANSLATION.CREATE_SELLSY_ADMINISTRATOR[
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
							{administrator ? (
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
							) : (
								<Select width="400px" placeholder={"Super Admin (you)"} disabled />
							)}
						</Div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConnectSellsy;
