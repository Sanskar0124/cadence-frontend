/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
import { useState, useEffect, useContext } from "react";
import styles from "./AccountProgressModal.module.scss";

//components
import { Modal } from "@cadence-frontend/components";

import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	POWER_STATUS,
} from "@cadence-frontend/constants";
import Reasons from "./components/Reasons";
import { useLead } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { getBullhornUrl, getHubspotUrl, getSalesforceUrl } from "@cadence-frontend/utils";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
//constants

const filterAccountStatusForRingover = (status, RecordTypeId) => {
	try {
		let ALLOWED_STATUSES_FOR_RINGOVER;
		if (!RecordTypeId || RecordTypeId === "0122p000000d3PiAAI") {
			//Prospect
			ALLOWED_STATUSES_FOR_RINGOVER = [
				"to be qualified",
				"working",
				"follow up",
				"open opportunity",
			];
		} else if (RecordTypeId === "0122p000000d3PdAAI") {
			//Customer
			ALLOWED_STATUSES_FOR_RINGOVER = [
				"validation",
				"onboarding",
				"activated",
				"activated - open opportunity",
			];
		} else if (RecordTypeId === "0122p000000d4MuAAI") {
			// Partner
			ALLOWED_STATUSES_FOR_RINGOVER = [
				"qualification",
				"interested",
				"partner contract signed",
			];
		}
		if (ALLOWED_STATUSES_FOR_RINGOVER?.includes(status?.label?.toLowerCase()))
			return true;
		return false;
	} catch (err) {
		return true;
	}
};

const ACCOUNT_TABNAV_BUTTONS = [
	{ label: "Contact", value: "contact" },
	{ label: "Account", value: "account" },
];

const getAccountTabnavButtons = (user, lead) => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return ACCOUNT_TABNAV_BUTTONS;

		case INTEGRATION_TYPE.BULLHORN:
			return lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
				? [
						{ label: "Lead", value: "lead" },
						{ label: "Account", value: "account" },
				  ]
				: ACCOUNT_TABNAV_BUTTONS;

		default:
			return ACCOUNT_TABNAV_BUTTONS;
	}
};

const FIELD_NAME_MAP = {
	lead: "lead_map",
	contact: "contact_map",
	account: "account_map",
	candidate: "candidate_map",
};

const AccountProgressModal = ({
	className,
	isOpen,
	onClose,
	integrationStatus,
	setIntegrationStatus,
	lead,
	fieldMap,
	integrationStatusPicklist,
	updateSalesforceQualifications,
	// isSalesforceAccount working as isBullhornAccount
	isSalesforceAccount,
	integrationStatusMap,
	onSidebarClose = () => null,
	changeToNextPowerTask,
}) => {
	const user = useRecoilValue(userInfo);
	const instance_url = useRecoilValue(userInfo).instance_url;
	const power = useRecoilValue(powerInfo);
	const [currStep, setCurrStep] = useState();
	const { addError, addSuccess } = useContext(MessageContext);
	const [updatingLoader, setUpdatingLoader] = useState(false);

	const [showReasons, setShowReasons] = useState(false);
	const [picklistValue, setPicklistValue] = useState([]);
	const { updateConvertLead, updateDisqalifyLead, customWebhook, updateLeadStatus } =
		useLead();

	const [leadType, setLeadType] = useState("");
	const [reasons, setReasons] = useState("");
	const [tab, setTab] = useState("");

	const handleAccountStatus = step => {
		setShowReasons(false);
		setPicklistValue([]);
		if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
			if (fieldMap?.Company_Setting?.Webhooks?.length === 0) {
				if (
					[
						integrationStatusMap[tab].converted?.value,
						integrationStatusMap[tab].disqualified?.value,
						...integrationStatusMap[tab].custom_actions.map(act => act.value),
					].includes(step.value)
				)
					window.open(getSalesforceUrl(lead, instance_url));
				else setCurrStep(step.value);
			} else {
				const isWebhookConvert = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "convert"
				);
				const isWebhookDisqualify = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "disqualify"
				);
				const isWebhookCustom = fieldMap?.Company_Setting?.Webhooks?.filter(
					whook => whook.webhook_type === "custom"
				);
				if (
					isWebhookConvert &&
					step.value === integrationStatusMap[tab].converted?.value
				) {
					setCurrStep(step.value);
					setLeadType("convert");
				} else if (
					isWebhookDisqualify &&
					step.value === integrationStatusMap[tab].disqualified?.value
				) {
					setCurrStep(step.value);
					setPicklistValue(
						fieldMap?.Company_Setting?.Integration_Field_Map?.[FIELD_NAME_MAP[tab]]
							?.disqualification_reason?.picklist_values
					);

					setShowReasons(true);
					setLeadType("disqualify");
				} else if (
					isWebhookCustom.find(
						whook =>
							whook.integration_status.value === step.value &&
							whook.integration_status.label === step.label &&
							whook.object_type === tab
					) &&
					integrationStatusMap[tab].custom_actions.find(act => act.value === step.value)
				) {
					setCurrStep(step.value);
					if (
						integrationStatusMap[tab].custom_actions.find(act => act.value === step.value)
							.reasons?.length
					) {
						setPicklistValue(
							integrationStatusMap[tab].custom_actions.find(
								act => act.value === step.value
							).reasons
						);
						setShowReasons(true);
					}
					setLeadType("custom");
				} else if (
					[
						integrationStatusMap[tab].converted?.value,
						integrationStatusMap[tab].disqualified?.value,
						...(integrationStatusMap[tab].custom_actions?.map(act => act.value) || []),
					].includes(step.value)
				) {
					window.open(getSalesforceUrl(lead, instance_url));
				} else {
					setCurrStep(step.value);
					setLeadType("");
				}
			}
		} else if (user.integration_type === INTEGRATION_TYPE.HUBSPOT) {
			if (fieldMap?.Company_Setting?.Webhooks?.length === 0) {
				if (
					step.value === integrationStatusMap[tab].converted?.value ||
					step.value === integrationStatusMap[tab].disqualified?.value
				)
					window.open(getHubspotUrl(lead?.integration_id, user.company_integration_id));
				else setCurrStep(step.value);
			} else {
				const isWebhookConvert = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "convert"
				);
				const isWebhookDisqualify = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "disqualify"
				);

				if (
					isWebhookConvert &&
					step.value === integrationStatusMap[tab].converted?.value
				) {
					setCurrStep(step.value);
					setLeadType("convert");
				} else if (
					isWebhookDisqualify &&
					step.value === integrationStatusMap[tab].disqualified?.value
				) {
					setCurrStep(step.value);
					setPicklistValue(
						fieldMap?.Company_Setting?.Integration_Field_Map?.contact_map
							?.disqualification_reason?.picklist_values
					);
					setShowReasons(true);
					setLeadType("disqualify");
				} else if (
					step.value === integrationStatusMap[tab].converted?.value ||
					step.value === integrationStatusMap[tab].disqualified?.value
				) {
					window.open(getHubspotUrl(lead?.integration_id, user.company_integration_id));
				} else {
					setCurrStep(step.value);
					setLeadType("");
				}
			}
		} else if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
			if (fieldMap?.Company_Setting?.Webhooks?.length === 0) {
				if (
					[
						integrationStatusMap[tab].converted?.value,
						integrationStatusMap[tab].disqualified?.value,
						...integrationStatusMap[tab].custom_actions.map(act => act.value),
					].includes(step.value)
				)
					window.open(getBullhornUrl(lead, instance_url));
				else setCurrStep(step.value);
			} else {
				const isWebhookConvert = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "convert"
				);
				const isWebhookDisqualify = fieldMap?.Company_Setting?.Webhooks?.find(
					type => type.webhook_type === "disqualify"
				);
				const isWebhookCustom = fieldMap?.Company_Setting?.Webhooks?.filter(
					whook => whook.webhook_type === "custom"
				);

				if (
					isWebhookConvert &&
					step.value === integrationStatusMap[tab].converted?.value
				) {
					setCurrStep(step.value);
					setLeadType("convert");
				} else if (
					isWebhookDisqualify &&
					step.value === integrationStatusMap[tab].disqualified?.value
				) {
					setCurrStep(step.value);
					setPicklistValue(
						fieldMap?.Company_Setting?.Integration_Field_Map?.[FIELD_NAME_MAP[tab]]
							?.disqualification_reason?.picklist_values
					);

					setShowReasons(true);
					setLeadType("disqualify");
				} else if (
					isWebhookCustom.find(
						whook =>
							whook.integration_status.value === step.value &&
							whook.integration_status.label === step.label &&
							whook.object_type === tab
					) &&
					integrationStatusMap[tab].custom_actions.find(act => act.value === step.value)
				) {
					setCurrStep(step.value);
					if (
						integrationStatusMap[tab].custom_actions.find(act => act.value === step.value)
							.reasons?.length
					) {
						setPicklistValue(
							integrationStatusMap[tab].custom_actions.find(
								act => act.value === step.value
							).reasons
						);
						setShowReasons(true);
					}
					setLeadType("custom");
				} else if (
					[
						integrationStatusMap[tab].converted?.value,
						integrationStatusMap[tab].disqualified?.value,
						...(integrationStatusMap[tab].custom_actions?.map(act => act.value) || []),
					].includes(step.value)
				) {
					window.open(getBullhornUrl(lead, instance_url));
				} else {
					setCurrStep(step.value);
					setLeadType("");
				}
			}
		}

		setReasons("");
	};

	useEffect(() => {
		if (integrationStatus) setCurrStep(integrationStatus[tab]);
	}, [integrationStatus, isOpen, tab]);

	useEffect(() => {
		setTab(getFieldByIntegration());
	}, [isOpen]);

	useEffect(() => {
		setShowReasons(false);
		if (fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status) {
			if (user?.integration_type === INTEGRATION_TYPE.BULLHORN) {
				// isSalesforceAccount working as isBullhornAccount
				setTab(
					isSalesforceAccount
						? lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
							? fieldMap?.Company_Setting?.Integration_Field_Map
									?.default_integration_status?.lead
							: fieldMap?.Company_Setting?.Integration_Field_Map
									?.default_integration_status?.contact
						: "candidate"
				);
			} else {
				setTab(
					isSalesforceAccount
						? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
						: "lead"
				);
			}
		}
	}, [isOpen]);

	useEffect(() => {
		setShowReasons(false);
		setPicklistValue([]);
	}, [tab]);

	const handleSave = async () => {
		setUpdatingLoader(true);

		const body = isSalesforceAccount
			? {
					[fieldMap?.Company_Setting?.Integration_Field_Map?.[FIELD_NAME_MAP[tab]]
						?.integration_status?.name]: currStep,
			  }
			: { Status: currStep };

		if (leadType === "convert") {
			updateConvertLead(
				{ integration_id: lead?.integration_id, status: currStep, model_type: tab },
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg || "Failed to update status",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: () => {
						addSuccess("Successfully converted lead");
						if (power.status === POWER_STATUS.BOOSTED) changeToNextPowerTask();
						onClose();
					},
					onSettled: () => setUpdatingLoader(false),
				}
			);
		} else if (leadType === "disqualify") {
			updateDisqalifyLead(
				{
					integration_id: lead?.integration_id,
					status: currStep,
					disqualification_reason: reasons?.label,
					model_type: tab,
				},
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg || "Failed to update status",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: () => {
						addSuccess("Successfully disqualified lead");
						if (power.status === POWER_STATUS.BOOSTED) changeToNextPowerTask();
						setShowReasons(false);
						onClose();
					},
					onSettled: () => setUpdatingLoader(false),
				}
			);
		} else if (leadType === "custom") {
			let status = integrationStatusMap[tab].custom_actions.find(
				act => act.value === currStep
			);
			customWebhook(
				{
					lead_id: lead?.lead_id?.toString(),
					model_type: tab,
					integration_status: { label: status.label, value: status.value },
					reason: reasons?.label,
				},
				{
					onError: err =>
						addError({
							text: err?.response?.data?.msg || "Failed to update status",
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						}),
					onSuccess: () => {
						addSuccess("Status updated");
						setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
						setShowReasons(false);
						onClose();
					},
					onSettled: () => setUpdatingLoader(false),
				}
			);
		} else {
			if (user.integration_type === INTEGRATION_TYPE.SALESFORCE) {
				if (tab === "contact")
					await updateLeadStatus(
						{
							lead_id: lead?.lead_id,
							status: currStep,
						},
						{
							onError: err =>
								addError({
									text: err?.response?.data?.msg || "Failed to update status",
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								}),
							onSuccess: () => {
								addSuccess("Status updated");
								setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
								onClose();
							},
							onSettled: () => setUpdatingLoader(false),
						}
					);
				else
					await updateSalesforceQualifications(
						{
							integration_id: lead?.integration_id,
							integration_type: lead?.integration_type,
							account_integration_id: lead?.Account?.integration_id,
							body: body,
						},
						{
							onError: err =>
								addError({
									text: err?.response?.data?.msg || "Failed to update status",
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								}),
							onSuccess: () => {
								addSuccess("Status updated");
								setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
								onClose();
							},
							onSettled: () => setUpdatingLoader(false),
						}
					);
			} else if (user.integration_type === INTEGRATION_TYPE.HUBSPOT) {
				await updateLeadStatus(
					{
						lead_id: lead?.lead_id,
						status: currStep,
					},
					{
						onError: err =>
							addError({
								text: err?.response?.data?.msg || "Failed to update status",
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							}),
						onSuccess: () => {
							addSuccess("Status updated");
							setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
							onClose();
						},
						onSettled: () => setUpdatingLoader(false),
					}
				);
			} else if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
				if (tab === "lead" || tab === "contact" || tab === "candidate") {
					await updateLeadStatus(
						{
							lead_id: lead?.lead_id,
							status: currStep,
							tab,
						},
						{
							onError: err =>
								addError({
									text: err?.response?.data?.msg || "Failed to update status",
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								}),
							onSuccess: () => {
								addSuccess("Status updated");
								setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
								onClose();
							},
							onSettled: () => setUpdatingLoader(false),
						}
					);
				} else {
					await updateLeadStatus(
						{
							account_id: lead?.account_id,
							status: currStep,
							tab,
						},
						{
							onError: err =>
								addError({
									text: err?.response?.data?.msg || "Failed to update status",
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								}),
							onSuccess: () => {
								addSuccess("Status updated");
								setIntegrationStatus(prev => ({ ...prev, [tab]: currStep }));
								onClose();
							},
							onSettled: () => setUpdatingLoader(false),
						}
					);
				}
			}
		}
	};

	const getFieldByIntegration = () => {
		if (user?.integration_type === INTEGRATION_TYPE.HUBSPOT) return "contact";
		if (user?.integration_type === INTEGRATION_TYPE.SALESFORCE)
			return isSalesforceAccount
				? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
				: "lead";

		if (user?.integration_type === INTEGRATION_TYPE.BULLHORN)
			return isSalesforceAccount
				? lead.integration_type === LEAD_INTEGRATION_TYPES.BULLHORN_LEAD
					? fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.lead
					: fieldMap?.Company_Setting?.Integration_Field_Map?.default_integration_status
							?.contact
				: "candidate";
	};

	return (
		<Modal
			isModal={isOpen}
			onClose={onClose}
			showCloseButton
			disableCloseHover
			closeColor="white"
			className={`${styles.accountProgressModal} ${className ?? ""}`}
		>
			<div className={styles.header}>
				{isSalesforceAccount ? (
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={getAccountTabnavButtons(user, lead)}
						value={tab}
						setValue={setTab}
						className={styles.tabs}
						btnClassName={styles.tabBtns}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
						width="270px"
					/>
				) : (
					`Change ${getFieldByIntegration()} status`
				)}
			</div>
			<div className={styles.body}>
				{integrationStatusPicklist[tab]?.map((step, index) => (
					<AccountStatusButton
						key={step.value}
						isSelected={step.value === currStep}
						children={step.label}
						onClick={() => handleAccountStatus(step)}
						picklistValue={picklistValue}
						reasons={reasons}
						setReasons={setReasons}
						showReasons={showReasons}
						setShowReasons={setShowReasons}
						lead={lead}
						setPicklistValue={setPicklistValue}
					/>
				))}
			</div>
			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					className={styles.btnSave}
					onClick={handleSave}
					loading={updatingLoader}
					loadingText="Saving"
				>
					<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

const AccountStatusButton = ({
	children,
	onClick,
	isSelected,
	picklistValue,
	showReasons,
	setReasons,
	reasons,
}) => {
	const handleClick = () => {
		onClick();
	};

	return (
		<>
			<ThemedButton
				theme={isSelected ? ThemedButtonThemes.PINK : ThemedButtonThemes.GREY}
				className={`${styles.btn} 
			${isSelected && showReasons && picklistValue?.length > 0 ? styles.disqualified : ""}
			 ${isSelected ? styles.selected : ""} ${
					picklistValue?.length === 0 ? styles.normal : ""
				}`}
				onClick={handleClick}
			>
				{children}
			</ThemedButton>
			{isSelected && showReasons && picklistValue?.length > 0 && (
				<Reasons
					picklistValue={picklistValue}
					showReasons={showReasons}
					setReasons={setReasons}
					reasons={reasons}
					isSelected={isSelected}
				/>
			)}
		</>
	);
};

export default AccountProgressModal;
