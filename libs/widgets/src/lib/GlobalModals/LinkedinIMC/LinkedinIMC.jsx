import ReactHtmlParser from "html-react-parser";
import { useCallback, useContext, useEffect, useState } from "react";

import { Spinner } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCustomVariables, useLead, useLinkedin } from "@cadence-frontend/data-access";
import { Bounced, CopyBlank } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Editor, ThemedButton } from "@cadence-frontend/widgets";

// utils
import {
	getValidLink,
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";

import {
	GLOBAL_MODAL_TYPES,
	INITIAL_TOUR_STEPS_ENUM,
	IS_CUSTOM_VARS_AVAILABLE,
	PRODUCT_TOUR_STATUS,
	STEP_TYPES,
} from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./LinkedinIMC.module.scss";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";

const LinkedinIMC = ({
	//typeSpecificProps
	lead,
	fieldMap,
	node,
	validateTask = false,
	preview,
	data, // activity
	markTaskAsCompleteIfCurrent,
	setInnerModalState,
	innerModalState,
	//modalProps
	onClose: modalOnClose,
	activeTaskId,
}) => {
	const { addError, addSuccess, addWarning } = useContext(MessageContext);
	const tour = useRecoilValue(tourInfo);

	const [message, setMessage] = useState("");
	const {
		sendConnectionRequest,
		sendConnRequestLoading,
		sendMessage,
		sendMessageLoading,
		viewProfile,
		viewProfileLoading,
	} = useLinkedin();
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);

	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (node?.data?.message && node?.data?.message !== "") {
			let linkedinMsg = processCustomVariables(node?.data?.message, lead, {
				...lead?.User,
				Company: fieldMap,
			});
			if (IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type))
				replaceCustomVariables(linkedinMsg, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setMessage(data.body);
					},
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						linkedinMsg = removeUnprocessedVariables(linkedinMsg);
						setMessage(linkedinMsg);
					},
				});
			else setMessage(linkedinMsg);
		}
	}, [node?.data, node?.data?.message, lead, lead?.User]);

	const onClose = () => {
		setCopied(false);
		setError("");
		modalOnClose();
	};

	const handleRedirection = async () => {
		const url = getValidLink(lead?.linkedin_url) || "https://www.linkedin.com";
		window.open(url, "_blank");
		if (validateTask) await markTaskAsCompleteIfCurrent();
		onClose();
	};

	const renderText = () => {
		if (preview) return ReactHtmlParser(data.status);

		switch (node?.type) {
			case STEP_TYPES.linkedin_connection:
			case STEP_TYPES.linkedin_message:
				return (
					<Editor
						value={message}
						setValue={setMessage}
						theme="message"
						lead={lead}
						fieldMap={fieldMap}
						showCRMCustomVars
						style={{ border: "none" }}
						placeholder="Type your message here..."
					/>
				);
			case STEP_TYPES.linkedin_interact:
			case STEP_TYPES.linkedin_profile:
				return ReactHtmlParser(message);
			default:
				return processCustomVariables(message, lead, {
					...lead?.User,
					Company: fieldMap,
				});
		}
	};

	const checkLinkedinCopyTask =
		node?.type === STEP_TYPES.linkedin_connection ||
		node?.type === STEP_TYPES.linkedin_message ||
		node?.type === STEP_TYPES.linkedin_profile ||
		node?.type === STEP_TYPES.linkedin_interact;

	const getButtonText = useCallback(() => {
		switch (node.type) {
			case STEP_TYPES.linkedin_connection:
				return TASKS_TRANSLATION.SEND_CONNECTION_REQUEST[user?.language?.toUpperCase()];

			case STEP_TYPES.linkedin_message:
				return COMMON_TRANSLATION?.SEND_MESSAGE?.[user?.language?.toUpperCase()];

			case STEP_TYPES.linkedin_profile:
				return TASKS_TRANSLATION.VIEW_LINKEDIN_PROFILE[user?.language?.toUpperCase()];

			case STEP_TYPES.linkedin_interact:
				return TASKS_TRANSLATION.VISIT_PROFILE[user?.language?.toUpperCase()];
		}
	}, [node]);

	const handleSubmit = () => {
		setError("");
		if (!lead.linkedin_url)
			return addError({
				text: "This lead does not have a Linkedin url. Please add it first.",
			});

		const body = {
			lead_id: lead?.lead_id,
			message: message ?? "",
		};

		if (node.type === STEP_TYPES.linkedin_message) body.task_id = activeTaskId;

		if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
			markTaskAsCompleteIfCurrent({
				isSampleTaskForTour: true,
				currentStep: INITIAL_TOUR_STEPS_ENUM.CLICK_SEND_LINKEDIN_CONNECTION,
				message: body.message,
			});
			onClose();
			return;
		}

		if (node.type === STEP_TYPES.linkedin_connection) {
			if (body.message.length > 300) {
				addError({
					text: "Message for connection request cannot exceed 300 characters.",
				});
				return;
			}
			sendConnectionRequest(body, {
				onError: err => {
					if (err?.response?.data?.msg.includes("session cookie")) {
						setInnerModalState({
							...innerModalState,
							type: GLOBAL_MODAL_TYPES.LINKEDIN_COOKIE_ERROR,
						});
						setError(err?.response?.data?.msg);
					} else {
						setError("Cookie expired. Please update your cookie and try again.");
					}
				},
				onSuccess: () => {
					addSuccess("Successfully sent connection request.");
					markTaskAsCompleteIfCurrent({ linkedin_message: body.message });
					onClose();
				},
			});
		} else if (node.type === STEP_TYPES.linkedin_message) {
			if (!body.message) return addError({ text: "Message cannot be empty." });
			sendMessage(body, {
				onError: err => {
					if (
						err?.response?.data?.msg ===
						"Cookie expired. Please update your cookie and try again."
					) {
						setError(err?.response?.data?.msg);

						setInnerModalState({
							...innerModalState,
							type: GLOBAL_MODAL_TYPES.LINKEDIN_COOKIE_ERROR,
						});
					} else {
						onClose();
						addWarning(err?.response?.data?.msg);
					}
				},
				onSuccess: () => {
					addSuccess("Successfully sent message.");
					markTaskAsCompleteIfCurrent({ linkedin_message: body.message });
					onClose();
				},
			});
		} else if (node.type === STEP_TYPES.linkedin_profile) {
			viewProfile(body.lead_id, {
				onError: err => {
					if (err?.response?.data?.msg.includes("session cookie")) {
						setError(err?.response?.data?.msg);
						setInnerModalState({
							...innerModalState,
							type: GLOBAL_MODAL_TYPES.LINKEDIN_COOKIE_ERROR,
						});
					} else {
						setError("Cookie expired. Please update your cookie and try again.");
					}
				},
				onSuccess: () => {
					addSuccess("Successfully viewed profile.");
					markTaskAsCompleteIfCurrent();
					onClose();
				},
			});
		} else if (node.type === STEP_TYPES.linkedin_interact) {
			handleRedirection();
		}
	};

	const extractContent = html => {
		return new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
	};

	return (
		<div className={styles.linkedinIMC}>
			{checkLinkedinCopyTask && (
				<div className={styles.header}>
					<p
						className={`${styles.copy} ${copied ? styles.copied : ""}`}
						onClick={() => {
							if (!replaceCustomVariablesLoading) {
								navigator.clipboard.writeText(extractContent(message));
								setCopied(true);
							}
						}}
					>
						<CopyBlank size="1rem" />
						<span>
							{!copied
								? COMMON_TRANSLATION.COPY_MESSAGE[user?.language?.toUpperCase()]
								: COMMON_TRANSLATION.COPIED[user?.language?.toUpperCase()]}
						</span>
					</p>
				</div>
			)}
			<div className={styles.body}>
				{!replaceCustomVariablesLoading ? (
					renderText()
				) : (
					<div className={styles.loaderWrapper}>
						<Spinner className={styles.loader} />
					</div>
				)}
			</div>

			{error && (
				<div className={styles.error}>
					<Bounced size="20px" />
					<p>{error}</p>
				</div>
			)}

			{!preview && (
				<div className={styles.footer}>
					{/*
              If there's an error(other than cookie error)
              then show a CTA to visit lead's linkedin page
					 */}
					{error ? (
						<ThemedButton
							theme={ThemedButtonThemes.GREEN}
							onClick={() => {
								markTaskAsCompleteIfCurrent();
								window.open(lead.linkedin_url, "_blank");
							}}
							className={styles.linkedinBtns}
						>
							Go to Linkedin
						</ThemedButton>
					) : (
						<ThemedButton
							theme={ThemedButtonThemes.GREEN}
							onClick={handleSubmit}
							loading={sendConnRequestLoading || sendMessageLoading || viewProfileLoading}
							disabled={replaceCustomVariablesLoading}
							className={styles.linkedinBtns}
							id="complete-linkedin-task-btn"
						>
							{getButtonText()}
						</ThemedButton>
					)}
				</div>
			)}
		</div>
	);
};

export default LinkedinIMC;
