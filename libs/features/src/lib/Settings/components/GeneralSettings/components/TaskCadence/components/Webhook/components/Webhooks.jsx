import React, { useContext, useEffect, useState } from "react";
import styles from "./Webhooks.module.scss";
import { Plus } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import AddWebhook from "./AddWebhook/AddWebhook";
import { WEBHOOK_TYPE } from "./constants";
import { useWebhook } from "@cadence-frontend/data-access";
import CreatedWebhook from "./CreatedWebhook/CreatedWebhook";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Webhooks = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const [webhooksForm, setWebhooksForm] = useState([]);
	const [webhookTypeOptions, setWebhookTypeOptions] = useState(WEBHOOK_TYPE);
	const [index, setIndex] = useState(null);
	const user = useRecoilValue(userInfo);

	const {
		webhook,
		webhookLoading,
		createWebhook,
		updateWebhook,
		createWebhookLoading,
		deleteWebhook: deletingWebhook,
		updateWebhookLoading,
		deleteWebhookLoading,
	} = useWebhook();

	const webhookValidation = webhook => {
		if (webhook.webhook_type === "") {
			addError({ text: "Please Select Webhook type." });
			return false;
		}

		if (webhook.url === "" || webhook.url?.trim() === "") {
			addError({ text: "Please Enter a valid URL." });
			return false;
		}

		if (webhook.auth_token === "" || webhook.auth_token?.trim() === "") {
			addError({ text: "Please Enter a valid Token." });
			return false;
		}

		return true;
	};

	// Deleting webhook locally
	const deleteWebhook = indx => {
		setWebhooksForm(prev => [...prev.slice(0, indx), ...prev.slice(indx + 1)]);
	};

	const addWebhook = () => {
		setWebhooksForm(prev => [...prev, {}]);
	};

	//Creating and updateing a webhook
	const onSave = webhook => {
		if (!webhookValidation(webhook)) return;

		if (!webhook.webhook_id) {
			createWebhook(webhook, {
				onSuccess: () => {
					addSuccess("Successfully created webhook.");
					deleteWebhook(index);
				},
				onError: error => {
					addError({
						text: error?.response?.data?.msg,
						desc: error?.response?.data?.error,
						cId: error?.response?.data?.correlationId,
					});
				},
			});
		} else {
			updateWebhook(
				{
					id: webhook.webhook_id,
					body: {
						webhook_type: webhook.webhook_type,
						url: webhook.url,
						auth_token: webhook.auth_token,
						http_method: webhook.http_method,
					},
				},
				{
					onSuccess: () => {
						addSuccess("Successfully updated webhook.");
					},

					onError: error => {
						addError({
							text: error?.response?.data?.msg,
							desc: error?.response?.data?.error,
							cId: error?.response?.data?.correlationId,
						});
					},
				}
			);
		}
	};

	// Deleting webhook
	const onDelete = webhookId => {
		deletingWebhook(webhookId, {
			onSuccess: () => {
				addSuccess("Successfully deleted webhook.");
			},

			onError: error => {
				addError({
					text: error?.response?.data?.msg,
					desc: error?.response?.data?.error,
					cId: error?.response?.data?.correlationId,
				});
			},
		});
	};

	return (
		<div className={styles.webhooks}>
			{webhook?.map(whook => (
				<CreatedWebhook
					onDelete={onDelete}
					webhookData={whook}
					webhookTypeOptions={webhookTypeOptions}
					onSave={onSave}
					updateWebhookLoading={updateWebhookLoading}
					deleteWebhookLoading={deleteWebhookLoading}
				/>
			))}

			{webhooksForm.reverse().map((whook, indx) => {
				return (
					<AddWebhook
						onDelete={() => deleteWebhook(indx)}
						webhookTypeOptions={webhookTypeOptions}
						onSave={onSave}
						index={indx}
						createWebhookLoading={createWebhookLoading}
						setIndex={setIndex}
					/>
				);
			})}

			{webhook?.length === 2 ||
			(webhook?.length === 1 &&
				webhooksForm?.length === 1) ? null : webhooksForm?.length === 2 ? null : (
				<ThemedButton
					className={styles.addWebhookButton}
					theme="GREY"
					onClick={() => addWebhook()}
					width="fit-content"
				>
					<Plus size="13.3px" />{" "}
					<div>{SETTINGS_TRANSLATION.ADD_WEBHOOK[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			)}
		</div>
	);
};

export default Webhooks;
