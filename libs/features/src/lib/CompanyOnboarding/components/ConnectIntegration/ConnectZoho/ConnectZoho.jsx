import { useState, useEffect, useContext } from "react";
import { useSettings, useUser } from "@cadence-frontend/data-access";
import styles from "./ConnectZoho.module.scss";
//components
import { ErrorGradient, ZohoBox } from "@cadence-frontend/icons";
import { Select } from "@cadence-frontend/widgets";
import { IntegrationAuth, ConnectIntegration } from "@cadence-frontend/features";

import { MessageContext } from "@cadence-frontend/contexts";
import { Div, Skeleton } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	useIntegrationTranslations,
	Zoho as ZOHO_TRANSLATION,
} from "@cadence-frontend/languages";
import { DATA_CENTER_OPTIONS } from "./constatnts";

const ConnectZoho = ({ postDataRef, setDisableNext }) => {
	const user = useRecoilValue(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);
	const [isConnected, setIsConnected] = useState(false);
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const [isAdminFetched, setIsAdminFetched] = useState(false);
	const TRANSLATION = useIntegrationTranslations(user?.integration_type);
	const [dataCenter, setDataCenter] = useState("");
	const { user: userDetails } = useUser({ user: true });

	const {
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
		dataCenterLoading,
		updateDataCenter,
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
		if (userDetails?.Integration_Token?.data_center) {
			setDataCenter(userDetails?.Integration_Token?.data_center);
		}
	}, [userDetails]);

	useEffect(() => {
		if (postDataRef?.current) postDataRef.current = save;
	}, [isConnected]);

	useEffect(() => {
		//While onboarding if zoho is connected and there is no zAdminId then set SuperAdmin as default zAdmin
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

	const getUpdateDataCenter = e => {
		setDataCenter(e.value);
		updateDataCenter(
			{ dataCenter: e.value },
			{
				onSuccess: data => {
					addSuccess(data.msg);
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

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
			administrator?.Zoho_Token?.is_logged_out ||
			!administrator?.Zoho_Token?.instance_url
		)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{
						ZOHO_TRANSLATION.CRM_ADMIN_IS_NOT_CONNECTED_WITH_ZOHO[
							user?.language?.toUpperCase()
						]
					}
				</>
			);
		return (
			<>
				<ZohoBox />
				{administrator?.first_name} {administrator?.last_name}{" "}
				{ZOHO_TRANSLATION.IS_CONNECTED_WITH_ZOHO[user?.language?.toUpperCase()]}
			</>
		);
	};

	return (
		<div className={styles.connectZohoContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<ZohoBox size="45px" color={"#00A1E0"} />
					{COMMON_TRANSLATION.CONNECT_ZOHO[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_ZOHO[
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
						{ZOHO_TRANSLATION.DATA_CENTER[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{ZOHO_TRANSLATION.DATA_CENTER_DESCRIPTION[user?.language?.toUpperCase()]}
					</div>

					<Div loading={dataCenterLoading} className={styles.dataCenterPlaceholder}>
						<Select
							width="400px"
							options={Object.keys(DATA_CENTER_OPTIONS).map(center => ({
								label: center,
								value: DATA_CENTER_OPTIONS[center],
							}))}
							placeholder={"Select data center"}
							isSearchable
							value={dataCenter}
							setValue={val => setDataCenter(val)}
							disabled={!userDetails?.Integration_Token?.is_logged_out}
							onChange={e => getUpdateDataCenter(e)}
						/>
					</Div>
				</div>

				<div className={styles.inputBlock}>
					<div className={styles.heading}>
						{ZOHO_TRANSLATION.LOGIN_TO_ZOHO[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{ZOHO_TRANSLATION.TO_SIGN_IN_TO_ZOHO[user?.language?.toUpperCase()]}

						<br />
						{ZOHO_TRANSLATION.NOW_CLICK_ON_THE_LINK_BELOW[user?.language?.toUpperCase()]}
					</div>
					<ConnectIntegration
						className={styles.onboardingSFButton}
						setIsConnected={setIsConnected}
						onlyButton={true}
					/>
				</div>

				<div className={styles.zohoAdministrator}>
					<div className={styles.heading}>
						{ZOHO_TRANSLATION.ZOHO_ADMINISTRATOR[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{ZOHO_TRANSLATION.CREATE_ZOHO_ADMINISTRATOR[user?.language?.toUpperCase()]}
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

export default ConnectZoho;
