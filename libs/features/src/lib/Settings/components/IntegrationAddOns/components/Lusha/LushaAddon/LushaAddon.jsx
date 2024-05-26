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
	Toggle,
} from "@cadence-frontend/widgets";
import {
	useEnrichmentsAccess,
	useEnrichmentsConfig,
} from "@cadence-frontend/data-access";
import { LushaLogo, TickGradient } from "@cadence-frontend/icons";
import {
	ThemedButtonThemes,
	TabNavThemes,
	TabNavBtnThemes,
} from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Addons as ADDONS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Title } from "@cadence-frontend/components";

import Placeholder from "../../IntegrationPlaceholder/Placeholder";
import UsersAccess from "../../UsersAccess/UsersAccess";

// constants
import { FIELD_LABEL_AND_VALUES, RESOURCE_TYPES } from "./constants";
import { USER_ACCESS_FIELDS, ENRICHMENT_ACTIONS_OPTIONS } from "../../../constants";
import { ENRICHMENT_SERVICES, INTEGRATION_TYPE } from "@cadence-frontend/constants";

// utils
import { capitalize, deepEqual, getLabelFromEnum } from "@cadence-frontend/utils";
import { getFilteredOptions } from "./utils";
import { cleanUpdateEnrichmentsConfigBody } from "../../../utils";

import styles from "./LushaAddon.module.scss";

const LushaAddon = ({
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
	const [phoneFields, setPhoneFields] = useState(() => {
		let obj = {};
		for (const leadType of leadTypeOptions) {
			obj[leadType] = {
				personal_field: "",
				work_field: "",
				other_field: "",
			};
		}
		return obj;
	});
	const [emailFields, setEmailFields] = useState(() => {
		let obj = {};
		for (const leadType of leadTypeOptions) {
			obj[leadType] = {
				personal_field: "",
				work_field: "",
				other_field: "",
			};
		}
		return obj;
	});
	const [entity, setEntity] = useState(defaultLeadType);
	const [checkedUserIds, setCheckedUserIds] = useState([]);
	const [uncheckedUserIds, setUncheckedUserIds] = useState([]);
	const [enabledSdIds, setEnabledSdIds] = useState([]);
	const [disabledSdIds, setDisabledSdIds] = useState([]);

	useEffect(() => {
		if (enrichmentsConfig) {
			setConfig(enrichmentsConfig);

			const emailFields = {};
			const phoneFields = {};
			for (const leadType of leadTypeOptions) {
				emailFields[leadType] = enrichmentsConfig.lusha_email[leadType];
				phoneFields[leadType] = enrichmentsConfig.lusha_phone[leadType];
			}
			setEmailFields(emailFields);
			setPhoneFields(phoneFields);
		}
	}, [enrichmentsConfig]);

	useEffect(() => {
		postDataRef.current = () => handleSave();
	}, [
		config,
		emailFields,
		phoneFields,
		checkedUserIds,
		uncheckedUserIds,
		enabledSdIds,
		disabledSdIds,
	]);

	useEffect(() => {
		if (
			typeof setIfUnsavedChanges === "function" &&
			enrichmentsConfig &&
			Object.keys(config).length
		)
			setIfUnsavedChanges(() => () => !!checkConfigOrAccessChanges());
	}, [
		enrichmentsConfig,
		config,
		phoneFields,
		emailFields,
		checkedUserIds,
		uncheckedUserIds,
		enabledSdIds,
		disabledSdIds,
	]);

	useEffect(() => {
		setSaveBtnLoading(updateEnrichmentsAccessLoading || updateEnrichmentsConfigLoading);
	}, [updateEnrichmentsConfigLoading, updateEnrichmentsAccessLoading]);

	const getSelectedOptions = resourceType => {
		let fieldState = {};

		switch (resourceType) {
			case RESOURCE_TYPES.PHONE:
				fieldState = phoneFields[entity];
				break;

			case RESOURCE_TYPES.EMAIL:
				fieldState = emailFields[entity];
				break;
		}
		const selectedOptions = [];

		for (const field of Object.keys(fieldState ?? {}))
			selectedOptions.push(fieldState[field]);

		return selectedOptions.filter(opt => opt); // remove null values
	};

	const handleActivate = () => {
		const body = {
			is_lusha_activated: true,
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
				addSuccess("Successfully activated Lusha.");
			},
		});
	};

	const handleDeactivate = () => {
		const body = {
			is_lusha_activated: false,
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
				addSuccess("Successfully deactivated Lusha.");
			},
		});
	};

	const checkConfigOrAccessChanges = useCallback(() => {
		const body = {
			...config,
			lusha_phone: phoneFields,
			lusha_email: emailFields,
		};

		const isConfigChanged = !deepEqual(body, enrichmentsConfig);
		const isAccessChanged =
			checkedUserIds.length ||
			uncheckedUserIds.length ||
			enabledSdIds.length ||
			disabledSdIds.length;

		return isConfigChanged || isAccessChanged;
	}, [
		config,
		enrichmentsConfig,
		phoneFields,
		emailFields,
		checkedUserIds,
		uncheckedUserIds,
		enabledSdIds,
		disabledSdIds,
	]);

	const handleSave = () => {
		const isAccessChanged =
			checkedUserIds.length ||
			uncheckedUserIds.length ||
			enabledSdIds.length ||
			disabledSdIds.length;

		const configBody = {
			...config,
			lusha_phone: phoneFields,
			lusha_email: emailFields,
		};

		const isConfigChanged = !deepEqual(configBody, enrichmentsConfig);

		configBody.integration_type = user.integration_type;

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
					addSuccess("Successfully updated Lusha configuration.");
				},
			});

		if (isAccessChanged) {
			const body = {
				type: ENRICHMENT_SERVICES.LUSHA,
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
					addSuccess("Successfully updated Lusha access permissions.");
					setCheckedUserIds([]);
					setUncheckedUserIds([]);
					setEnabledSdIds([]);
					setDisabledSdIds([]);
				},
			});
		}
	};

	const handlePhoneFieldChange = (value, field) => {
		setPhoneFields(prev => ({ ...prev, [entity]: { ...prev[entity], [field]: value } }));
	};

	const handleEmailFieldChange = (value, field) => {
		setEmailFields(prev => ({ ...prev, [entity]: { ...prev[entity], [field]: value } }));
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
						<LushaLogo />
						<h2 className={styles.title}>
							{ADDONS_TRANSLATION.LUSHA[user?.language?.toUpperCase()]}
						</h2>
					</div>
				</div>
				<div className={styles.right}>
					{config?.is_lusha_activated ? (
						<div>
							<div className={styles.activated}>
								<TickGradient size="20px" />
								<p>
									{" "}
									{
										ADDONS_TRANSLATION.LUSHA_INTEGRATION_IS_CURRENTLY_ACTIVE[
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
						<ThemedButton onClick={handleActivate} theme={ThemedButtonThemes.PRIMARY}>
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
							<p>Enter your Lusha API Key</p>
						</div>
						{enrichmentsConfigLoading ? (
							<Placeholder width="340px" />
						) : (
							<Input
								value={config}
								setValue={setConfig}
								name="lusha_api_key"
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
									name="lusha_action"
									width="340px"
								/>
							)}
						</div>
					</div>
					<div className={styles.divider} />
					<div className={styles.container}>
						<div className={styles.title}>
							<h2>{COMMON_TRANSLATION.DAILY_API_LIMIT[user?.language?.toUpperCase()]}</h2>
							<p>This is your organization's daily Lusha limit</p>
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
									name="lusha_api_limit"
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
									checked={config.lusha_linkedin_enabled}
									onChange={() =>
										setConfig(prev => ({
											...prev,
											lusha_linkedin_enabled: !prev.lusha_linkedin_enabled,
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
					<div className={styles.fieldsContainer}>
						<div className={styles.fields}>
							{Object.keys(FIELD_LABEL_AND_VALUES.lusha_phone).map(field => (
								<div className={styles.inputGroup} key={`lusha_phone_${entity}_${field}`}>
									<Label>{FIELD_LABEL_AND_VALUES.lusha_phone[field]}</Label>
									{enrichmentsConfigLoading ? (
										<Placeholder width="300px" />
									) : (
										<Select
											options={getFilteredOptions(
												config.phone_options?.[entity],
												getSelectedOptions(RESOURCE_TYPES.PHONE)
											)}
											value={phoneFields?.[entity]?.[field]}
											setValue={val => handlePhoneFieldChange(val, field)}
											width="240px"
										/>
									)}
								</div>
							))}
						</div>

						<div className={styles.fields}>
							{Object.keys(FIELD_LABEL_AND_VALUES.lusha_email).map(field => (
								<div className={styles.inputGroup} key={`lusha_email_${entity}_${field}`}>
									<Label>{FIELD_LABEL_AND_VALUES.lusha_email[field]}</Label>
									{enrichmentsConfigLoading ? (
										<Placeholder width="300px" />
									) : (
										<Select
											options={getFilteredOptions(
												config.email_options?.[entity],
												getSelectedOptions(RESOURCE_TYPES.EMAIL)
											)}
											value={emailFields?.[entity]?.[field]}
											setValue={val => handleEmailFieldChange(val, field)}
											width="240px"
										/>
									)}
								</div>
							))}
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
					userAccessField={USER_ACCESS_FIELDS[ENRICHMENT_SERVICES.LUSHA].userAccessField}
					sdNewUserAccessField={
						USER_ACCESS_FIELDS[ENRICHMENT_SERVICES.LUSHA].sdNewUsersAccessField
					}
				/>
			</div>
		</div>
	);
};

export default LushaAddon;
