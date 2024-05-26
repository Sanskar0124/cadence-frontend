import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { useSettings, useWebhook } from "@cadence-frontend/data-access";
import { Plus } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";
import styles from "./Webhooks.module.scss";
import Webhook from "./components/Webhook";
import { WEBHOOK_TYPES } from "./constants";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const Webhooks = () => {
	const lastWebhookRef = useRef(null);
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const [webhooksForm, setWebhooksForm] = useState([]);
	const [index, setIndex] = useState(null);
	const [availableStatus, setAvailableStatus] = useState([]);
	const [newWebhookAdded, setNewWebhookAdded] = useState(false);

	const {
		webhooks,
		webhooksLoading,
		createWebhook,
		updateWebhook,
		createWebhookLoading,
		deleteWebhook: deletingWebhook,
		updateWebhookLoading,
		deleteWebhookLoading,
	} = useWebhook();

	const { fetchSfMap } = useSettings({
		role: user.role,
		enabled: false,
	});

	const webhookValidation = webhook => {
		if (webhook.webhook_type === "") {
			addError({ text: "Please Select Webhook type." });
			return false;
		}

		if (webhook?.webhook_type === "custom" && !webhook.integration_status?.label) {
			addError({ text: "Please Select Integration status." });
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

		if (
			webhook.webhook_type !== WEBHOOK_TYPES.DISQUALIFY ||
			webhook.webhook_type !== WEBHOOK_TYPES.CONVERT
		)
			return true;

		return true;
	};

	// Deleting webhook locally
	const deleteWebhook = indx => {
		setWebhooksForm(prev => [...prev.slice(0, indx), ...prev.slice(indx + 1)]);
	};

	const addWebhook = () => {
		setWebhooksForm(prev => [
			...prev,
			{
				webhook_type: "custom",
				object_type: null,
				integration_status: {},
				url: "",
				auth_token: "",
				http_method: "post",
			},
		]);
		setNewWebhookAdded(true);
	};

	//Creating and updateing a webhook
	const onSave = webhook => {
		if (!webhookValidation(webhook)) return;

		if (
			webhook.webhook_type === WEBHOOK_TYPES.DISQUALIFY ||
			webhook.webhook_type === WEBHOOK_TYPES.CONVERT
		) {
			webhook.object_type = null;
			webhook.integration_status = null;
		}

		if (webhook.webhook_type === WEBHOOK_TYPES.CUSTOM) {
			webhook.integration_status = {
				label: webhook.integration_status.label,
				value: webhook.integration_status?.value?.slice(webhook.object_type.length + 1),
			};
		}

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
					body: webhook,
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

	const scrollToWebhookAndClick = () => {
		if (lastWebhookRef.current) {
			lastWebhookRef.current.click();
			setTimeout(() => {
				lastWebhookRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 100);
		}
	};

	useEffect(() => {
		if (!webhooks) return;
		fetchSfMap(null, {
			onSuccess: data => {
				setAvailableStatus([
					...(data?.lead_map?.integration_status?.picklist_values
						.map(st => ({
							label: st.label,
							value: `lead_${st.value}`,
							option_type: "lead",
							// isDisabled: Boolean(
							// 	webhooks.find(
							// 		whook =>
							// 			whook.object_type === "lead" &&
							// 			whook.integration_status?.value === st.value
							// 	)
							// ),
						}))
						.filter(st =>
							data?.lead_map?.integration_status?.custom_actions?.find(
								ca => `lead_${ca.value}` === st.value
							)
						) || []),
					...(data?.contact_map?.integration_status?.picklist_values
						.map(st => ({
							label: st.label,
							value: `contact_${st.value}`,
							option_type: "contact",
							// isDisabled: Boolean(
							// 	webhooks.find(
							// 		whook =>
							// 			whook.object_type === "contact" &&
							// 			whook.integration_status?.value === st.value
							// 	)
							// ),
						}))
						.filter(st =>
							data?.contact_map?.integration_status?.custom_actions?.find(
								ca => `contact_${ca.value}` === st.value
							)
						) || []),
					...(data?.account_map?.integration_status?.picklist_values
						.map(st => ({
							label: st.label,
							value: `account_${st.value}`,
							option_type: "account",
							// isDisabled: Boolean(
							// 	webhooks.find(
							// 		whook =>
							// 			whook.object_type === "account" &&
							// 			whook.integration_status?.value === st.value
							// 	)
							// ),
						}))
						.filter(st =>
							data?.account_map?.integration_status?.custom_actions?.find(
								ca => `account_${ca.value}` === st.value
							)
						) || []),

					...(data?.candidate_map?.integration_status?.picklist_values
						.map(st => ({
							label: st.label,
							value: `candidate_${st.value}`,
							option_type: "candidate",
							// isDisabled: Boolean(
							// 	webhooks.find(
							// 		whook =>
							// 			whook.object_type === "account" &&
							// 			whook.integration_status?.value === st.value
							// 	)
							// ),
						}))
						.filter(st =>
							data?.candidate_map?.integration_status?.custom_actions?.find(
								ca => `candidate_${ca.value}` === st.value
							)
						) || []),
				]);
			},
		});
	}, [webhooks]);

	useEffect(() => {
		if (newWebhookAdded) {
			scrollToWebhookAndClick();
			setNewWebhookAdded(false);
		}
	}, [newWebhookAdded]);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.WEBHOOK}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.WEBHOOK[user?.language?.toUpperCase()]}</h2>
				<p>
					{
						SETTINGS_TRANSLATION.SETUP_CUSTOM_WEBHOOKS_TO_DISQUALIFY[
							user?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.setting}>
					<h2>{SETTINGS_TRANSLATION.CUSTOM_WEBHOOKS[user?.language?.toUpperCase()]}</h2>
					<p>
						{
							SETTINGS_TRANSLATION.CONVERT_DISQUALIFIED_WEBHOOKS[
								user?.language?.toUpperCase()
							]
						}
					</p>
					<div className={styles.webhooks}>
						{!webhooksLoading && (
							<>
								<Webhook
									onDelete={onDelete}
									webhooks={webhooks}
									webhookData={webhooks?.find(
										whook => whook.webhook_type === WEBHOOK_TYPES.DISQUALIFY
									)}
									webhookType={WEBHOOK_TYPES.DISQUALIFY}
									onSave={onSave}
									deleteWebhookLoading={deleteWebhookLoading}
									availableStatus={availableStatus}
								/>
								<Webhook
									onDelete={onDelete}
									webhooks={webhooks}
									webhookData={webhooks?.find(
										whook => whook.webhook_type === WEBHOOK_TYPES.CONVERT
									)}
									webhookType={WEBHOOK_TYPES.CONVERT}
									onSave={onSave}
									deleteWebhookLoading={deleteWebhookLoading}
									availableStatus={availableStatus}
								/>
								{webhooks
									?.filter(
										whook =>
											![WEBHOOK_TYPES.DISQUALIFY, WEBHOOK_TYPES.CONVERT].includes(
												whook.webhook_type
											)
									)
									.map(whook => (
										<Webhook
											onDelete={onDelete}
											webhooks={webhooks}
											webhookData={whook}
											webhookType={whook.webhook_type}
											onSave={onSave}
											updateWebhookLoading={updateWebhookLoading}
											deleteWebhookLoading={deleteWebhookLoading}
											availableStatus={availableStatus}
											key={whook.webhook_id}
										/>
									))}
								{[...webhooksForm].reverse().map((whook, indx) => (
									<Webhook
										onDelete={() => deleteWebhook(indx)}
										onSave={onSave}
										webhookType={WEBHOOK_TYPES.CUSTOM}
										createWebhookLoading={createWebhookLoading}
										availableStatus={availableStatus}
										ref={indx === webhooksForm.length - 1 ? lastWebhookRef : null}
									/>
								))}
							</>
						)}
						{(user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
							user?.integration_type === INTEGRATION_TYPE.BULLHORN) && (
							<ThemedButton
								className={styles.addWebhookButton}
								theme="GREY"
								onClick={() => addWebhook()}
								width="fit-content"
							>
								<Plus size="13.3px" />{" "}
								<div>
									{SETTINGS_TRANSLATION.ADD_WEBHOOK[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Webhooks;
