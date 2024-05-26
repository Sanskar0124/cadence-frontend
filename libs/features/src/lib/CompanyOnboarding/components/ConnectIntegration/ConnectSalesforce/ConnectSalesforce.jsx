import { useState, useEffect, useContext } from "react";
import { useApiToken, useSettings } from "@cadence-frontend/data-access";
import styles from "./ConnectSalesforce.module.scss";

//components
import {
	CopyBlank,
	ErrorGradient,
	Refresh2,
	SalesforceBox,
	Salesforce,
	View,
	ViewGradient,
} from "@cadence-frontend/icons";
import { InputThemes } from "@cadence-frontend/themes";
import { Input, Select } from "@cadence-frontend/widgets";
import { ConnectIntegration, IntegrationAuth } from "@cadence-frontend/features";
import { Colors } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import WarningModal from "./WarningModal/WarningModal";
import { Div, Skeleton } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Salesforce as SALESFORCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";

//constants

const SF_PACKAGE_LINK = "packaging/installPackage.apexp?p0=04t7Q000000IKxW";

const ConnectSalesforce = ({ postDataRef, setDisableNext }) => {
	const user = useRecoilValue(userInfo);
	const { token, generateToken } = useApiToken(true);
	const { addSuccess, addError } = useContext(MessageContext);
	const {
		fetchUserWithActiveSFToken,
		fetchUserWithActiveSFTokenLoading,
		fetchAdminSuperAdmins,
		updateUserWithActiveSFToken,
		updateUserWithActiveSFTokenLoading,
	} = useSettings({ enabled: false });

	const [isConnected, setIsConnected] = useState(false);
	const [apiToken, setApiToken] = useState("");
	const [tokenWarning, setTokenWarning] = useState(false);
	const [hideToken, setHideToken] = useState(true);
	const [administrator, setAdministrator] = useState(null);
	const [administratorOptions, setAdministratorOptions] = useState([]);
	const [isAdminFetched, setIsAdminFetched] = useState(false);
	const TRANSLATION = useIntegrationTranslations(user?.integration_type);

	const generateAPIToken = () => {
		setTokenWarning(false);
		generateToken(
			{},
			{
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: data => {
					setApiToken(data);
					addSuccess("Token generated successfully");
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
			administrator?.Salesforce_Token?.is_logged_out ||
			!administrator?.Salesforce_Token?.instance_url
		)
			return (
				<>
					<ErrorGradient size="1.6rem" />
					{
						SALESFORCE_TRANSLATION.CRM_ADMIN_IS_NOT_CONNECTED_WITH_SALESFORCE[
							user?.language?.toUpperCase()
						]
					}
				</>
			);
		return (
			<>
				<Salesforce />
				{administrator?.first_name} {administrator?.last_name}{" "}
				{
					SALESFORCE_TRANSLATION.IS_CONNECTED_WITH_SALESFORCE[
						user?.language?.toUpperCase()
					]
				}
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
		setApiToken(token);
	}, [token]);

	useEffect(() => {
		if (postDataRef?.current) postDataRef.current = save;
	}, [isConnected]);

	useEffect(() => {
		//While onboarding if salesforce is connected and there is no sfAdminId then set SuperAdmin as default sfAdmin
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
		if (isConnected && apiToken !== "" && apiToken) {
			setDisableNext(false);
		} else setDisableNext(true);
	}, [apiToken, isConnected]);

	return (
		<div className={styles.connectSalesforceContainer}>
			<div className={styles.header}>
				<div className={styles.heading}>
					<SalesforceBox size="1.8rem" color={"#00A1E0"} />
					{COMMON_TRANSLATION.CONNECT_SALESFORCE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						COMMON_TRANSLATION.FIRST_STEP_OF_ONBOARDING_SALESFORCE[
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
						{SALESFORCE_TRANSLATION.LOGIN_TO_SALESFORCE[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							SALESFORCE_TRANSLATION.TO_SIGN_IN_TO_SALESFORCE[
								user?.language?.toUpperCase()
							]
						}
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
				<div className={styles.inputBlock}>
					<div className={styles.heading}>
						{
							SALESFORCE_TRANSLATION.INSTALL_SALESFORCE_PACKAGE[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<div className={styles.subheading}>
						{
							SALESFORCE_TRANSLATION.EMPLOYEES_CAN_USE_THIS_INSTALLATION[
								user?.language?.toUpperCase()
							]
						}
						<br />
						<br />
						{TRANSLATION.TO_START_THE_INSTALLATION[user?.language?.toUpperCase()]}
						<br />
					</div>
					<div className={styles.inputBox}>
						<Input
							value={`https://login.salesforce.com/${SF_PACKAGE_LINK}`}
							theme={InputThemes.WHITE_WITH_GREY_BORDER}
							className={styles.input}
							style={{ textDecoration: "underline" }}
							disabled
						/>
						<div>
							<CopyBlank
								size={18}
								color={Colors.lightBlue}
								onClick={() => {
									addSuccess("Copy Successful");
									navigator.clipboard.writeText(SF_PACKAGE_LINK);
								}}
							/>
						</div>
					</div>
					<div className={styles.helpLinks}>
						<a
							href={
								user?.language === "english"
									? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000046450-steps-for-ringover-cadence-package-installation-and-setup"
									: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000046450-%C3%89tapes-d-installation-et-de-configuration-du-package-cadence-salesfocre-"
							}
							target="_blank"
							rel="noreferrer"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
						{/* <a
							href="https://www.loom.com/share/0c1b217500184ca99eccc28b49851094"
							target="_blank"
							rel="noreferrer"
						>
							{COMMON_TRANSLATION.WATCH_VIDEO[user?.language?.toUpperCase()]}
						</a> */}
					</div>
				</div>
				<div className={styles.inputBlock}>
					<div className={styles.heading}>
						{SALESFORCE_TRANSLATION.API_TOKEN[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.subheading}>
						{
							SALESFORCE_TRANSLATION.KINDLY_GENERATE_AN_API_TOKEN[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<div className={styles.inputBox}>
						<Input
							type={hideToken ? "password" : "text"}
							value={apiToken}
							theme={InputThemes.WHITE_WITH_GREY_BORDER}
							className={styles.input}
							disabled
						/>
						<div>
							{hideToken ? (
								<View
									size={18}
									color={Colors.lightBlue}
									onClick={() => setHideToken(curr => !curr)}
								/>
							) : (
								<ViewGradient size={18} onClick={() => setHideToken(curr => !curr)} />
							)}
							<CopyBlank
								size={18}
								color={Colors.lightBlue}
								onClick={() => {
									addSuccess("Copy Successful");
									navigator.clipboard.writeText(apiToken);
								}}
							/>
							<Refresh2
								size={13}
								color={Colors.lightBlue}
								onClick={() => setTokenWarning(true)}
							/>
						</div>
					</div>
					<div className={styles.helpLinks}>
						<a
							href={
								user?.language === "english"
									? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000046028-ringover-cadence-api-token-generation-and-setup"
									: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000046028-g%C3%A9n%C3%A9ration-et-configuration-des-tokens-de-l-api-cadence"
							}
							target="_blank"
							rel="noreferrer"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
						{/* <a
							href="https://www.loom.com/share/e8ee4d947d7d45f98fc5e97c2475f7e6"
							target="_blank"
						>
							{COMMON_TRANSLATION.WATCH_VIDEO[user?.language?.toUpperCase()]}
						</a> */}
					</div>
				</div>
				<div className={styles.salesforceAdministrator}>
					<div className={styles.heading}>
						{
							SALESFORCE_TRANSLATION.SALESFORCE_ADMINISTRATOR[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<div className={styles.subheading}>
						{
							SALESFORCE_TRANSLATION.CREATE_SALESFORCE_ADMINISTRATOR[
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
			<WarningModal
				modal={tokenWarning}
				setModal={setTokenWarning}
				onConfirm={generateAPIToken}
			/>
		</div>
	);
};

export default ConnectSalesforce;
