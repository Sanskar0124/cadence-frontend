/* eslint-disable no-console */
import { useState, useEffect, useContext } from "react";
import { Select, Input } from "@cadence-frontend/widgets";
import { Div } from "@cadence-frontend/components";
import { ThemedButton, Label, Editor } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	usePhoneNumber,
	useMessage,
	useCustomVariables,
	useUser,
} from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import styles from "./MessageIMC.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import {
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";
import ImportTemplateModal from "../../Editor/components/ImportTemplateModal/ImportTemplateModal";
import {
	Notifications as NOTIFICATIONS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { People as PEOPLE_TRANSLATION } from "@cadence-frontend/languages";
import {
	INITIAL_TOUR_STEPS_ENUM,
	IS_CUSTOM_VARS_AVAILABLE,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { Spinner } from "@cadence-frontend/components";

const MessageIMC = ({
	markTaskAsCompleteIfCurrent,
	lead,
	fieldMap,
	cadence,
	data: activityData,
	node,
	preview,
	validateTask = false,
	aBTemplateId,
	newMessage,
	//modalProps
	onClose: onModalClose,
}) => {
	const primary_phone_number = useRecoilValue(userInfo).primary_phone_number;
	const { addError, addSuccess } = useContext(MessageContext);
	const { phoneNumbers, phoneNumbersLoading } = usePhoneNumber(true);
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);
	const { sendMessage } = useMessage();
	const { updateUser } = useUser();

	const user = useRecoilValue(userInfo);
	const [tour, setTour] = useRecoilState(tourInfo);

	const [leadPhoneNumbers, setLeadPhoneNumbers] = useState([]);
	const [content, setContent] = useState("");
	const [userNumber, setUserNumber] = useState("");
	const [leadNumber, setLeadNumber] = useState("");
	const [sending, setSending] = useState(false);
	const [canSend, setCanSend] = useState(false);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);

	useEffect(() => {
		if (phoneNumbers) {
			setUserNumber(primary_phone_number || phoneNumbers?.[0].value);
		}

		if (lead) {
			setLeadNumber(
				lead.Lead_phone_numbers?.filter(phoneNumber => phoneNumber.is_primary)[0]
					?.phone_number
			);

			let phoneNumbersArray = lead.Lead_phone_numbers?.filter(pn => pn.phone_number)?.map(
				phoneNumber => ({
					label: phoneNumber?.formatted_phone_number,
					value: phoneNumber?.phone_number,
				})
			);
			if (lead?.Account?.phone_number)
				phoneNumbersArray.push({
					label: `${lead.Account.phone_number}`,
					value: lead.Account.phone_number,
				});
			setLeadPhoneNumbers(phoneNumbersArray);
		}

		if (preview && activityData) {
			setContent(activityData.status);
		}

		if (newMessage ?? node?.data?.message) {
			let msgContent = processCustomVariables(newMessage ?? node?.data.message, lead, {
				...lead.User,
				Company: fieldMap,
			});
			if (
				IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type) &&
				msgContent !== ""
			) {
				replaceCustomVariables(msgContent, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setContent(data.body);
						if (
							tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
							tour?.currentStep === INITIAL_TOUR_STEPS_ENUM.CLICK_SMS_TASK_CTA
						) {
							let NEW_STEP =
								tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
							updateUser(
								{
									product_tour_step: {
										step: NEW_STEP,
										url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
									},
								},
								{
									onSuccess: () => {
										setTour(prev => ({
											...prev,
											currentStep: NEW_STEP,
											currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
											currentStepCompleted: false,
										}));
									},
									onError: err => {
										addError({
											text: err?.response?.data?.msg,
											desc: err?.response?.data?.error,
											cId: err?.response?.data?.correlationId,
										});
										setTour(prev => ({
											...prev,
											currentStepCompleted: false,
											isError: true,
										}));
									},
								}
							);
						}
					},
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						msgContent = removeUnprocessedVariables(msgContent);
						setContent(msgContent);
					},
				});
			} else {
				if (
					tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
					tour?.currentStep === INITIAL_TOUR_STEPS_ENUM.CLICK_SMS_TASK_CTA
				) {
					let NEW_STEP =
						tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
					updateUser(
						{
							product_tour_step: {
								step: NEW_STEP,
								url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
							},
						},
						{
							onSuccess: () => {
								setTour(prev => ({
									...prev,
									currentStep: NEW_STEP,
									currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
									currentStepCompleted: false,
								}));
							},
							onError: err => {
								addError({
									text: err?.response?.data?.msg,
									desc: err?.response?.data?.error,
									cId: err?.response?.data?.correlationId,
								});
								setTour(prev => ({
									...prev,
									currentStepCompleted: false,
									isError: true,
								}));
							},
						}
					);
				}
				setContent(msgContent);
			}
		}
	}, [lead, phoneNumbers, activityData, node?.data]);

	useEffect(() => {
		setCanSend(!!(content && userNumber && leadNumber));
	}, [content, leadNumber, userNumber]);

	const handleSendMessage = async () => {
		if (!userNumber) {
			console.log("Please select a number.");
			return;
		}
		if (!leadNumber) {
			console.log("Please select a recepient number.");
			return;
		}
		if (!content) {
			console.log("Message body cannot be empty.");
			return;
		}

		try {
			setSending(true);
			if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
				markTaskAsCompleteIfCurrent({
					isSampleTaskForTour: true,
					from_number: userNumber,
					to_number: leadNumber,
				});
				setSending(false);
				handleClose();
			} else {
				const body = {
					lead_id: lead.lead_id,
					content,
					from_phone_number: userNumber,
					to_phone_number: leadNumber,
					node_id: node?.node_id,
					cadence_id: cadence?.cadence_id,
					ab_template_id: aBTemplateId,
					mt_id: template?.mt_id,
				};

				await sendMessage(body, {
					onError: err => {
						addError({
							text: err.response?.data?.msg,
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: data => {
						if (data.data?.error) addError({ text: data.data.error });
						else addSuccess("SMS sent");
					},
				});
				if (validateTask) await markTaskAsCompleteIfCurrent();
				setSending(false);
				handleClose();
			}
		} catch (err) {
			setSending(false);
			console.log(err);
		}
	};

	const handleClose = () => {
		setContent("");
		onModalClose();
	};

	useEffect(() => {
		if (template) {
			let msgContent = processCustomVariables(template.message, lead, {
				...lead.User,
				Company: fieldMap,
			});
			if (msgContent !== "") {
				replaceCustomVariables(msgContent, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setContent(data.body);
					},
					onError: err => {
						addError({
							text: "Error while fetching template",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						msgContent = removeUnprocessedVariables(msgContent);
						setContent(msgContent);
					},
				});
			} else {
				setContent(msgContent);
			}
		}
	}, [template]);

	return (
		<div className={styles.messageIMC}>
			{preview ? (
				<h2 className={styles.heading}>
					{NOTIFICATIONS_TRANSLATION.MESSAGE[user?.language?.toUpperCase()]}
				</h2>
			) : (
				<div>
					<p className={styles.topHead}>
						{COMMON_TRANSLATION.SEND_SMS[user?.language?.toUpperCase()]}
					</p>
					<div className={styles.header} style={{ marginTop: "2em" }}>
						<Div
							style={{
								width: "100%",
							}}
							className={styles.inputGroup}
							loading={phoneNumbersLoading}
						>
							<Label>From</Label>
							{phoneNumbers?.length > 0 ? (
								<Select
									value={userNumber}
									setValue={setUserNumber}
									className={styles.select}
									width={"100%"}
									options={
										tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING
											? phoneNumbers
											: phoneNumbers.filter(number => number.is_sms)
									}
									border={false}
									isSearchable
								/>
							) : (
								<span className={styles.fallback}>No numbers present</span>
							)}
						</Div>
						<Div
							style={{
								width: "100%",
								marginTop: "0.75em",
							}}
							className={styles.inputGroup}
							loading={phoneNumbersLoading}
						>
							<Label>To</Label>
							<Select
								value={leadNumber}
								setValue={setLeadNumber}
								className={styles.select}
								width={"100%"}
								options={leadPhoneNumbers}
								border={false}
								isSearchable
							/>
						</Div>
					</div>
				</div>
			)}
			<div className={styles.body}>
				{!phoneNumbersLoading && !replaceCustomVariablesLoading ? (
					<Editor
						value={content}
						setValue={setContent}
						theme="message"
						height="calc(100vh - 400px)"
						className={styles.editor}
						disabled={preview}
						lead={lead}
						fieldMap={fieldMap}
						showCRMCustomVars
					/>
				) : (
					<div className={styles.loaderWrapper}>
						<Spinner className={styles.loader} />
					</div>
				)}
			</div>
			{!preview && (
				<div className={styles.buttons}>
					<ThemedButton
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setTemplateModal({ type: "sms" })}
					>
						<div>{PEOPLE_TRANSLATION.LOAD_TEMPLATE[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			)}
			<div className={styles.footer}>
				{!preview && (
					<ThemedButton
						theme={ThemedButtonThemes.GREEN}
						style={{
							width: "100%",
							boxShadow: " 1.2px 8.2px 24px rgba(54, 205, 207, 0.3)",
							borderRadius: "1.5em",
						}}
						onClick={handleSendMessage}
						loading={sending && canSend}
						disabled={!canSend || replaceCustomVariablesLoading}
						id="send-message-btn"
					>
						<div>{COMMON_TRANSLATION.SEND_SMS[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				)}
			</div>

			<ImportTemplateModal
				modal={templateModal}
				setModal={setTemplateModal}
				setTemplate={setTemplate}
			/>
		</div>
	);
};

export default MessageIMC;
