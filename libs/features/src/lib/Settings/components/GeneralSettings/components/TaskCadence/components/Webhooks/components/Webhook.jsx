import React, { useState, useEffect, useContext, useRef, forwardRef } from "react";
import styles from "./Webhook.module.scss";
import { Caution2, Company, Info, User, User2 } from "@cadence-frontend/icons";
import { Button, DeleteModal, Title } from "@cadence-frontend/components";
import { CollapseContainer, Select, Input } from "@cadence-frontend/widgets";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useWebhook } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { WEBHOOK_TYPES, getWebhookImage } from "../constants";
import { Colors, capitalize } from "@cadence-frontend/utils";

const Webhook = (
	{
		webhooks,
		onDelete,
		onSave,
		webhookData,
		webhookType,
		deleteWebhookLoading,
		availableStatus,
	},
	ref
) => {
	const user = useRecoilValue(userInfo);
	const [collapse, setCollapse] = useState(false);
	const [resposeStatus, showResponseStatus] = useState(false);
	const [infoIcon, setInfoIcon] = useState(false);
	const [warningModel, setWarningModal] = useState(false);

	const [updatedWebhook, setUpdatedWebhook] = useState({
		webhook_type: webhookType,
		object_type: null,
		integration_status: {},
		http_method: "post",
		url: "",
		auth_token: "",
	});

	const isWebhookAvailable = () =>
		webhooks?.find(whook => whook.webhook_type === webhookType);

	// Checking collapse component is open or not
	const collapaseIsOpen = isOpen => {
		setInfoIcon(isOpen);
		if (!isOpen) showResponseStatus(false);
	};

	const webhookDelete = e => {
		e.stopPropagation();
		setWarningModal(true);
	};

	const onConfirmDeleteWebhook = () => {
		// setWarningModal(false);
		onDelete(webhookData?.webhook_id);
	};

	const webhookUpdate = e => {
		e.stopPropagation();
		onSave(updatedWebhook);
	};

	useEffect(() => {
		if (collapse && webhookData && availableStatus) {
			setUpdatedWebhook(prev => ({
				...prev,
				webhook_id: webhookData?.webhook_id,
				webhook_type: webhookData?.webhook_type,
				object_type: webhookData?.object_type,
				integration_status: {
					label: webhookData?.integration_status?.label,
					value: `${webhookData?.object_type}_${webhookData?.integration_status?.value}`,
				},
				auth_token: webhookData?.auth_token,
				url: webhookData?.url,
				http_method: webhookData?.http_method,
			}));
		}
	}, [collapse, webhookData, availableStatus]);

	return (
		<CollapseContainer
			openByDefault={false}
			className={styles.collapsibleContainer}
			collapse={collapse}
			setCollapse={setCollapse}
			title={
				<div className={styles.header}>
					<Title className={styles.title} size="1.1rem">
						<div>
							Webhook -
							{capitalize(
								webhookType === WEBHOOK_TYPES.DISQUALIFY
									? COMMON_TRANSLATION.DISQUALIFY[user?.language?.toUpperCase()]
									: webhookType === WEBHOOK_TYPES.CONVERT
									? COMMON_TRANSLATION.CONVERT[user?.language?.toUpperCase()]
									: " Custom"
							)}
						</div>

						<div className={styles.iconWrapper}>
							{webhookType && infoIcon && (
								<Info
									size="1.1rem"
									color={"#567191"}
									onClick={e => e.stopPropagation()}
									onMouseEnter={() => showResponseStatus(true)}
									onMouseLeave={() => showResponseStatus(false)}
								/>
							)}
							{resposeStatus && (
								<img
									src={getWebhookImage(webhookType, user)}
									className={styles.resposeImage}
									alt=""
								/>
							)}
						</div>
					</Title>
					{!isWebhookAvailable() &&
					[WEBHOOK_TYPES.DISQUALIFY, WEBHOOK_TYPES.CONVERT].includes(webhookType) &&
					!collapse ? (
						<div className={styles.warning}>
							<Caution2 /> Please set up webhook
						</div>
					) : (
						<div className={styles.btns}>
							{collapse && (
								<Button className={styles.saveBtn} onClick={e => webhookUpdate(e)}>
									{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
								</Button>
							)}

							{![WEBHOOK_TYPES.DISQUALIFY, WEBHOOK_TYPES.CONVERT].includes(
								webhookType
							) && (
								<Button className={styles.deleteBtn} onClick={e => webhookDelete(e)}>
									{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
								</Button>
							)}
						</div>
					)}
				</div>
			}
			onCollapse={collapaseIsOpen}
			ref={ref}
		>
			<div className={`${styles.WebhookSetting}`}>
				{[WEBHOOK_TYPES.DISQUALIFY, WEBHOOK_TYPES.CONVERT].includes(webhookType) ? (
					<div className={styles.setting}>
						<Title className={styles.title} size="1.1rem">
							Type
						</Title>
						<div>
							<Input
								type={"text"}
								width={"407px"}
								value={capitalize(webhookType)}
								disabled
							/>
						</div>
					</div>
				) : (
					<div className={styles.setting}>
						<Title className={styles.title} size="1.1rem">
							Integration status
						</Title>
						<div>
							<Select
								width={"407px"}
								placeholder={"Select status"}
								value={updatedWebhook.integration_status?.value}
								setValue={val =>
									setUpdatedWebhook(prev => ({
										...prev,
										integration_status: {
											label: availableStatus.find(st => st.value === val)?.label,
											value: availableStatus.find(st => st.value === val)?.value,
										},
										object_type: availableStatus.find(st => st.value === val)
											?.option_type,
									}))
								}
								options={availableStatus}
								getOptionLabel={opt =>
									GenerateLabel(opt, webhookData?.integration_status)
								}
							/>
						</div>
					</div>
				)}

				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						HTTP method
					</Title>
					<div>
						<Select
							width={"407px"}
							name={"Webhook"}
							placeholder={"POST"}
							value={"POST"}
							disabled={true}
							setValue={val =>
								setUpdatedWebhook(prev => ({ ...prev, webhook_type: "post" }))
							}
							hideArrow
						/>
					</div>
				</div>

				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						Enter webhook URL
					</Title>
					<div>
						<Input
							placeholder={"Type here"}
							type={"text"}
							width={"407px"}
							value={updatedWebhook.url}
							setValue={val => setUpdatedWebhook(prev => ({ ...prev, url: val }))}
						/>
					</div>
				</div>

				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						Enter auth token
					</Title>
					<div>
						<Input
							placeholder={"Type here"}
							type={"text"}
							width={"407px"}
							value={updatedWebhook.auth_token}
							setValue={val => setUpdatedWebhook(prev => ({ ...prev, auth_token: val }))}
						/>
					</div>
				</div>
			</div>
			<DeleteModal
				modal={warningModel}
				setModal={setWarningModal}
				item={`webhook`}
				onDelete={onConfirmDeleteWebhook}
				loading={deleteWebhookLoading}
			/>
		</CollapseContainer>
	);
};

function GenerateLabel(opt, selectedOpt) {
	const color = opt.value === selectedOpt ? Colors.white : Colors.lightBlue;
	return (
		<div className={styles.optionLabel}>
			<div className={styles.label} title={opt.label}>
				{opt.label}
			</div>
			<div
				className={`${styles.tag} ${
					opt.value === selectedOpt ? styles.selected : styles.notSelected
				}`}
			>
				{capitalize(opt?.option_type)}
				{opt?.option_type === "lead" ? <User color={color} /> : <Company color={color} />}
			</div>
		</div>
	);
}

export default forwardRef(Webhook);
