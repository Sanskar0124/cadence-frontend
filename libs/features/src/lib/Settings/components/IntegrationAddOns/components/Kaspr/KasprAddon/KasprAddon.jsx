import { useEffect, useState, useContext, useCallback } from "react";
import { useRecoilValue } from "recoil";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	BackButton,
	Input,
	Label,
	Select,
	ThemedButton,
	TabNavSlider,
	Checkbox,
	Toggle,
} from "@cadence-frontend/widgets";
import {
	useEnrichmentsAccess,
	useEnrichmentsConfig,
} from "@cadence-frontend/data-access";
import { TickGradient } from "@cadence-frontend/icons";
import {
	ThemedButtonThemes,
	TabNavThemes,
	TabNavBtnThemes,
} from "@cadence-frontend/themes";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Addons as ADDONS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";

import Placeholder from "../../IntegrationPlaceholder/Placeholder";
import UsersAccess from "../../UsersAccess/UsersAccess";

// constants
import { RESOURCE_TYPES } from "./constants";
import { USER_ACCESS_FIELDS, ENRICHMENT_ACTIONS_OPTIONS } from "../../../constants";
import { ENRICHMENT_SERVICES, INTEGRATION_TYPE } from "@cadence-frontend/constants";

// utils
import { capitalize, deepEqual, getLabelFromEnum } from "@cadence-frontend/utils";
import { cleanUpdateEnrichmentsConfigBody } from "../../../utils";

import styles from "./KasprAddon.module.scss";

const KasprAddon = ({
	goBack,
	defaultLeadType,
	leadTypeOptions,
	postDataRef,
	setIfUnsavedChanges,
	setSaveBtnLoading,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const {
		enrichmentsConfig,
		fetchEnrichmentsConfig,
		enrichmentsConfigLoading,
		updateEnrichmentsConfig,
		updateEnrichmentsConfigLoading,
	} = useEnrichmentsConfig();

	const {
		subDepartments,
		enrichmentsAccessLoading,
		updateEnrichmentsAccess,
		updateEnrichmentsAccessLoading,
	} = useEnrichmentsAccess();

	const [config, setConfig] = useState({});
	const [entity, setEntity] = useState(defaultLeadType);
	const [checkedUserIds, setCheckedUserIds] = useState([]);
	const [uncheckedUserIds, setUncheckedUserIds] = useState([]);
	const [enabledSdIds, setEnabledSdIds] = useState([]);
	const [disabledSdIds, setDisabledSdIds] = useState([]);

	useEffect(() => {
		if (enrichmentsConfig) setConfig(enrichmentsConfig);
	}, [enrichmentsConfig]);

	useEffect(() => {
		postDataRef.current = () => handleSave();
	}, [config, checkedUserIds, uncheckedUserIds, enabledSdIds, disabledSdIds]);

	useEffect(() => {
		if (
			typeof setIfUnsavedChanges === "function" &&
			enrichmentsConfig &&
			Object.keys(config).length
		)
			setIfUnsavedChanges(() => () => !!checkConfigOrAccessChanges());
	}, [config, checkedUserIds, uncheckedUserIds, enabledSdIds, disabledSdIds]);

	useEffect(() => {
		setSaveBtnLoading(updateEnrichmentsAccessLoading || updateEnrichmentsConfigLoading);
	}, [updateEnrichmentsConfigLoading, updateEnrichmentsAccessLoading]);

	const handleActivate = () => {
		const body = {
			is_kaspr_activated: true,
			enr_id: config.enr_id,
		};
		updateEnrichmentsConfig(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				fetchEnrichmentsConfig();
				addSuccess("Successfully activated Kaspr.");
			},
		});
	};

	const handleDeactivate = () => {
		const body = {
			is_kaspr_activated: false,
			enr_id: config.enr_id,
		};
		updateEnrichmentsConfig(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				fetchEnrichmentsConfig();
				addSuccess("Successfully deactivated Kaspr.");
			},
		});
	};

	const checkConfigOrAccessChanges = useCallback(() => {
		const isConfigChanged = !deepEqual(config, enrichmentsConfig);
		const isAccessChanged =
			checkedUserIds.length ||
			uncheckedUserIds.length ||
			enabledSdIds.length ||
			disabledSdIds.length;

		return isConfigChanged || isAccessChanged;
	}, [
		config,
		enrichmentsConfig,
		checkedUserIds,
		uncheckedUserIds,
		enabledSdIds,
		disabledSdIds,
	]);

	const handleSave = () => {
		const isConfigChanged = !deepEqual(config, enrichmentsConfig);
		const isAccessChanged =
			checkedUserIds.length ||
			uncheckedUserIds.length ||
			enabledSdIds.length ||
			disabledSdIds.length;

		const configBody = {
			...config,
			integration_type: user.integration_type,
		};

		if (isConfigChanged)
			updateEnrichmentsConfig(cleanUpdateEnrichmentsConfigBody(configBody), {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					fetchEnrichmentsConfig();
					addSuccess("Successfully updated Kaspr configuration.");
				},
			});

		if (isAccessChanged) {
			const body = {
				type: ENRICHMENT_SERVICES.KASPR,
				checkedUserIds,
				uncheckedUserIds,
				enabledSdIds,
				disabledSdIds,
			};
			updateEnrichmentsAccess(body, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Successfully updated Kaspr access permissions.");
					setCheckedUserIds([]);
					setUncheckedUserIds([]);
				},
			});
		}
	};

	const handleOptionSwitch = (resourceType, option) => {
		if (config[resourceType]?.[entity]?.fields?.includes(option))
			setConfig(prev => ({
				...prev,
				[resourceType]: {
					...prev[resourceType],
					[entity]: {
						...prev[resourceType][entity],
						fields: prev[resourceType]?.[entity]?.fields.filter(opt => opt !== option),
					},
				},
			}));
		else
			setConfig(prev => ({
				...prev,
				[resourceType]: {
					...prev[resourceType],
					[entity]: {
						...prev[resourceType][entity],
						fields: [...prev[resourceType]?.[entity]?.fields, option],
					},
				},
			}));
	};

	const handleGoBack = () => {
		setIfUnsavedChanges(null);
		postDataRef.current = null;
		goBack();
	};

	return (
		<div className={styles.addon}>
			<div className={styles.header}>
				<div className={styles.left}>
					<BackButton
						text={capitalize(COMMON_TRANSLATION.ADDONS[user?.language?.toUpperCase()])}
						onClick={handleGoBack}
					/>
					<div className={styles.titleContainer}>
						<img src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/kaspr_logo.png" />
						<h2 className={styles.title}>
							{ADDONS_TRANSLATION.KASPR[user?.language?.toUpperCase()]}
						</h2>
					</div>
				</div>
				<div className={styles.right}>
					{enrichmentsConfigLoading ? (
						<Placeholder width="" />
					) : config?.is_kaspr_activated ? (
						<div>
							<div className={styles.activated}>
								<TickGradient size="20px" />
								<p>
									{
										ADDONS_TRANSLATION.KASPR_INTEGRATION_IS_CURRENTLY_ACTIVE[
											user?.language?.toUpperCase()
										]
									}
								</p>
								<ThemedButton
									className={styles.deactivateBtn}
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={handleDeactivate}
								>
									<div>
										{ADDONS_TRANSLATION.DEACTIVATE[user?.language?.toUpperCase()]}
									</div>
								</ThemedButton>
							</div>
						</div>
					) : (
						<ThemedButton
							onClick={handleActivate}
							loading={updateEnrichmentsConfigLoading}
							theme={ThemedButtonThemes.PRIMARY}
						>
							<div>
								{COMMON_TRANSLATION.ACTIVATE_INTEGRATION[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
					)}
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.integrationSettings}>
					<Title size="1.1rem">
						{COMMON_TRANSLATION.SETTINGS[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.divider} />
					<div className={styles.container}>
						<div className={styles.title}>
							<h2>{COMMON_TRANSLATION.API_KEY[user?.language?.toUpperCase()]}</h2>
							<p>Enter your Kaspr API Key</p>
						</div>
						{enrichmentsConfigLoading ? (
							<Placeholder width="340px" />
						) : (
							<Input
								value={config}
								setValue={setConfig}
								name="kaspr_api_key"
								width="340px"
							/>
						)}
					</div>
					<div className={styles.divider} />
					<div className={styles.container}>
						<div className={styles.title}>
							<h2>{COMMON_TRANSLATION.DATA_ENRICHMENT[user?.language?.toUpperCase()]}</h2>
							<p>Select how you want your data to be enriched</p>
						</div>
						<div className={styles.settings}>
							{enrichmentsConfigLoading ? (
								<Placeholder width="340px" />
							) : (
								<Select
									options={ENRICHMENT_ACTIONS_OPTIONS}
									value={config}
									setValue={setConfig}
									name="kaspr_action"
									width="340px"
								/>
							)}
						</div>
					</div>
					<div className={styles.divider} />
					<div className={styles.container}>
						<div className={styles.title}>
							<h2>{COMMON_TRANSLATION.DAILY_API_LIMIT[user?.language?.toUpperCase()]}</h2>
							<p>This is your organization's daily Kaspr limit</p>
						</div>
						<div className={styles.settings}>
							{enrichmentsConfigLoading ? (
								<Placeholder width="340px" />
							) : (
								<Input
									type="number"
									maxValue={100000000}
									value={config}
									setValue={setConfig}
									name="kaspr_api_limit"
									width="340px"
								/>
							)}
						</div>
					</div>
					<div className={styles.divider} />
					<div className={styles.container}>
						<div className={styles.title}>
							<h2>
								{COMMON_TRANSLATION.LINKEDIN_EXTENSION[user?.language?.toUpperCase()]}
							</h2>
							<p>Allow the linkedin extension to use this add-on</p>
						</div>
						<div className={styles.settings}>
							{enrichmentsConfigLoading ? (
								<Placeholder width="340px" />
							) : (
								<Toggle
									checked={config.kaspr_linkedin_enabled}
									onChange={() =>
										setConfig(prev => ({
											...prev,
											kaspr_linkedin_enabled: !prev.kaspr_linkedin_enabled,
										}))
									}
									theme="PURPLE"
								/>
							)}
						</div>
					</div>
				</div>
				<div className={styles.fieldSettings}>
					<Title size="1.1rem">
						{COMMON_TRANSLATION.FIELD_VALUES[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.divider} />
					{leadTypeOptions.length > 1 && (
						<TabNavSlider
							theme={TabNavThemes.SLIDER}
							buttons={leadTypeOptions.map(leadType => ({
								label: getLabelFromEnum(leadType.toLowerCase()),
								value: leadType,
							}))}
							value={entity}
							setValue={setEntity}
							width={
								user?.integration_type === INTEGRATION_TYPE.BULLHORN ? "420px" : "270px"
							}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
							noAnimation
						/>
					)}
					<div className={`${styles.fieldsContainer} ${styles[user?.language]}`}>
						<div>
							<Label>
								{
									COMMON_TRANSLATION.CADENCE_PHONE_FIELD_VALUE[
										user?.language?.toUpperCase()
									]
								}
							</Label>
							<div className={styles.fields}>
								{enrichmentsConfigLoading && (
									<Placeholder number={3} width="230px" height="25px" />
								)}
								{!!config &&
									config.phone_options?.[entity]?.map(option => {
										return (
											<div
												className={styles.inputGroup}
												key={`kaspr_phone_${entity}_${option}`}
											>
												<Checkbox
													checked={config?.[RESOURCE_TYPES.PHONE]?.[
														entity
													]?.fields?.includes(option)}
													onChange={() =>
														handleOptionSwitch(RESOURCE_TYPES.PHONE, option)
													}
												/>
												<p>{option}</p>
											</div>
										);
									})}
							</div>
						</div>

						<div>
							<Label>
								{
									CADENCE_TRANSLATION.CADENCE_EMAIL_FIELD_VALUE[
										user?.language?.toUpperCase()
									]
								}
							</Label>
							<div className={styles.fields}>
								{enrichmentsConfigLoading && (
									<Placeholder number={3} width="250px" height="25px" />
								)}
								{!!config &&
									config.email_options?.[entity]?.map(option => {
										return (
											<div
												className={styles.inputGroup}
												key={`kaspr_email_${entity}_${option}`}
											>
												<Checkbox
													checked={config?.[RESOURCE_TYPES.EMAIL]?.[
														entity
													]?.fields?.includes(option)}
													onChange={() =>
														handleOptionSwitch(RESOURCE_TYPES.EMAIL, option)
													}
												/>
												<p>{option}</p>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>

				<UsersAccess
					accessLoading={enrichmentsAccessLoading}
					subDepartments={subDepartments}
					checkedUserIds={checkedUserIds}
					setCheckedUserIds={setCheckedUserIds}
					uncheckedUserIds={uncheckedUserIds}
					setUncheckedUserIds={setUncheckedUserIds}
					enabledSdIds={enabledSdIds}
					setEnabledSdIds={setEnabledSdIds}
					disabledSdIds={disabledSdIds}
					setDisabledSdIds={setDisabledSdIds}
					userAccessField={USER_ACCESS_FIELDS[ENRICHMENT_SERVICES.KASPR].userAccessField}
					sdNewUserAccessField={
						USER_ACCESS_FIELDS[ENRICHMENT_SERVICES.KASPR].sdNewUsersAccessField
					}
				/>
			</div>
		</div>
	);
};

export default KasprAddon;
