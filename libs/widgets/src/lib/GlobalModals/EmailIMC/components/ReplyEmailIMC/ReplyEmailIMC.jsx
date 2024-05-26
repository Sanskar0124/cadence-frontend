import { useContext, useEffect, useState } from "react";

import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { Spinner } from "@cadence-frontend/components";
import {
	POWER_MODAL_TYPES,
	POWER_STATUS,
	TEMPLATE_TYPES,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useAttachments,
	useCadenceSettings,
	useCustomVariables,
	useEmail,
	useEmailSignature,
} from "@cadence-frontend/data-access";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Colors,
	addUnSubscribeVariable,
	checkUnSubscribeIsPresent,
	clearAttachments,
	getMailData,
	insertAttachments,
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";
import { Editor, Input, ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import ChangeSignatureModal from "../../../../Editor/components/ChangeSignatureModal/ChangeSignatureModal";
import ImportTemplateModal from "../../../../Editor/components/ImportTemplateModal/ImportTemplateModal";
import AddVideoModal from "../../../../Video/components/AddVideoModal/AddVideoModal";
import OpenTemplate from "../../../../Video/components/OpenTemplate/OpenTemplate";
import styles from "../../EmailIMC.module.scss";
import { REPLY_TYPES } from "../../constants";
import ShortEmailView from "../ShortEmailView/ShortEmailView";
import replyStyles from "./ReplyEmailIMC.module.scss";

export const EDITOR_ATTACHMENT_EVENTS_ENUM = {
	FILE_UPLOAD_BEGIN: "FILE_UPLOAD_BEGIN",
	FILE_UPLOAD_SUCCESS: "FILE_UPLOAD_SUCCESS",
};

const ReplyEmailIMC = ({
	//typeSpecificProps
	mailData,
	lead,
	fieldMap,
	replied_node_id,
	toReplyMail,
	markTaskAsCompleteIfCurrent,
	validateTask = true,
	incoming,
	stopPower,
	abTemplateId,
	//modalProps
	onClose,
	replyType,
}) => {
	const { addError } = useContext(MessageContext);
	const power = useRecoilValue(powerInfo);
	// const { user } = useUser({ user: true });
	const user = useRecoilValue(userInfo);
	const {
		sendReply,
		sendLoading,
		sendError,
		mailInput,
		setMailInput,
		getReplyMail,
		toReplyMailState,
		setToReplyMailState,
		toReplyLoading,
	} = useEmail(false);
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);
	const { signatures, signatureLoading } = useEmailSignature();
	const cadenceSettingsDataAccess = useCadenceSettings({ companySettings: true });
	const [files, setFiles] = useState([]);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [signature, setSignature] = useState(null);
	const [signatureModal, setSignatureModal] = useState(false);
	const [isCc, setIsCc] = useState(false);
	const [isBcc, setIsBcc] = useState(false);
	const [unsubPresent, setUnsubPresent] = useState(true);
	const [disableSend, setDisableSend] = useState(true);
	const [videoModal, setVideoModal] = useState(false);
	const [openTemplateModal, setOpenTemplateModal] = useState(false);
	const [editorReady, setEditorReady] = useState(false);
	const { getAttachment } = useAttachments();
	const { companySettings } = cadenceSettingsDataAccess;
	const [attachmentLoaded, setAttachmentLoaded] = useState(false);

	useEffect(() => {
		//process custom variables if lead is there ( because lead is not there in live feed activities )
		if (lead) {
			let mailBody = processCustomVariables(mailData.body, lead, {
				...lead?.User,
				Company: fieldMap,
			});
			if (mailBody.includes("{{user_signature}}")) {
				mailBody = processCustomVariables(
					mailBody.replace("{{user_signature}}", signature?.signature ?? ""),
					lead,
					{ ...lead?.User, Company: fieldMap }
				);
			} else {
				mailBody = processCustomVariables(
					mailBody + "<p>&nbsp;</p>" + (signature?.signature ?? ""),
					lead,
					{ ...lead?.User, Company: fieldMap }
				);
			}
			if (mailBody !== "") {
				replaceCustomVariables(mailBody, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setMailInput(prev => ({
							...prev,
							...mailData,
							body: data.body,
						}));
					},
					onError: err => {
						mailBody = removeUnprocessedVariables(mailBody);
						setMailInput(prev => ({
							...prev,
							...mailData,
							body: mailBody,
						}));
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				});
			} else {
				setMailInput(prev => ({
					...prev,
					...mailData,
					body: mailBody,
				}));
			}
		}

		if (mailData) {
			if (
				typeof mailData?.attachments?.[0] === "object" &&
				mailData?.attachments?.[0]?.attachment_id
			) {
				setFiles(mailData?.attachments);
				mailData?.attachments?.forEach(attachment => insertAttachments(attachment));
			}
			if (typeof mailData?.attachments?.[0] !== "object") {
				getAttachment(mailData?.attachments, {
					onSuccess: data => {
						setFiles(data?.data);
						data?.data.forEach(data => insertAttachments(data));
					},
				});
			} else {
				let ids = files.map(file => file.attachment_id);
				getAttachment(ids, {
					onSuccess: data => {
						setFiles(data?.data);
						data?.data.forEach(data => insertAttachments(data));
					},
				});
			}
			setAttachmentLoaded(true);
		}
		if (!toReplyMail)
			getReplyMail({ lead_id: mailData?.lead_id, node_id: replied_node_id });
		else setToReplyMailState(toReplyMail);

		return () => {
			setMailInput({
				subject: "",
				body: "",
				cc: "",
				bcc: "",
				to: "",
				from: "",
				cadence_id: 0,
				node_id: 0,
				lead_id: "",
			});
		};
	}, [mailData]);

	useEffect(() => {
		if (validateTask) {
			if (mailInput.to?.length) setEditorReady(true);
			else setTimeout(() => setEditorReady(true), 1000);
		} else setTimeout(() => setEditorReady(true), 500);
	}, [mailInput]);

	useEffect(() => {
		if (toReplyMailState && replyType !== REPLY_TYPES.REPLY) {
			let newData = {
				...mailInput,
				cc: toReplyMailState?.cc,
				bcc: toReplyMailState?.bcc,
			};
			setMailInput(newData);

			if (toReplyMailState?.cc) setIsCc(true);
			if (toReplyMailState?.bcc) setIsBcc(true);
		}
	}, [toReplyMailState]);

	//set template
	useEffect(() => {
		if (template) {
			let mailBody;
			if (
				template.body.includes("{{user_signature}}") ||
				template.body.includes("{{user_signature_primary}}")
			) {
				lead.allSignatures = signatures;
				lead.signature = signature;
				mailBody = processCustomVariables(template.body, lead, {
					...lead.User,
					Company: fieldMap,
				});
			} else {
				mailBody = processCustomVariables(
					template.body + "<p>&nbsp;</p>" + signature?.signature ?? "",
					lead,
					{ ...lead.User, Company: fieldMap }
				);
			}
			if (mailBody !== "") {
				replaceCustomVariables(mailBody, {
					onSuccess: data => {
						setMailInput(prev => ({
							...prev,
							subject: template.subject,
							body: removeUnprocessedVariables(data?.body),
							email_template_id: template.et_id,
						}));
					},
					onError: err => {
						setMailInput(prev => ({
							...prev,
							subject: template.subject,
							body: removeUnprocessedVariables(mailBody),
							email_template_id: template.et_id,
						}));
						addError({
							text: "Error while fetching template",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				});
			} else {
				setMailInput(prev => ({
					...prev,
					subject: template.subject,
					body: mailBody,
					email_template_id: template.et_id,
				}));
			}
			setFiles(template.Attachments);
			clearAttachments();
		}
		setTemplate(null);
	}, [template]);

	useEffect(() => {
		if (sendError) {
			addError({
				text: sendError?.msg,
				desc: sendError?.error,
				cId: sendError?.correlationId,
			});
			if (
				power.status === POWER_STATUS.BOOSTED &&
				sendError?.msg?.toLowerCase()?.includes("limit exceed")
			) {
				stopPower(POWER_MODAL_TYPES.MAILS_LIMIT_REACHED);
			}
		}
	}, [sendError]);

	const cb = async () => {
		if (validateTask) await markTaskAsCompleteIfCurrent();
		onClose();
	};

	const handleSend = () => {
		if (power.status === POWER_STATUS.BOOSTED && validateTask) {
			let mail = {
				isTask: true,
				semi_automated_mail: mailInput.cadence_id ? true : false,
				attachments: files,
				message: JSON.stringify(toReplyMailState),
				ab_template_id: abTemplateId,
				...mailInput,
			};
			if (!abTemplateId) delete mail.ab_template_id;
			if (!mail.timeStamp) delete mail.timeStamp;
			if (!mail.from_full_name) delete mail.from_full_name;
			markTaskAsCompleteIfCurrent({ mail }, onClose);
		} else
			sendReply({ files, cb, toReplyMailState, validateTask, templateId: abTemplateId });
	};

	const toggleCc = () => {
		if (isCc)
			setMailInput(prev => ({
				...prev,
				cc: "",
			}));
		setIsCc(prev => !prev);
	};

	const toggleBcc = () => {
		if (isBcc)
			setMailInput(prev => ({
				...prev,
				bcc: "",
			}));
		setIsBcc(prev => !prev);
	};
	//set signature
	useEffect(() => {
		if (signature) {
			lead.allSignatures = signatures;
			lead.signature = signature;
			let processedSignature = processCustomVariables(signature?.signature, lead, {
				...lead.User,
				Company: fieldMap,
			});
			let signedBody = mailInput.body;
			if (signature.previous) {
				signedBody = signedBody.replace(
					processCustomVariables(signature?.previous.signature, lead, {
						...lead.User,
						Company: fieldMap,
					}),
					processedSignature
				);
			} else {
				if (
					signedBody.includes("{{user_signature}}") ||
					signedBody.includes("{{user_signature_primary}}")
				) {
					signedBody = processCustomVariables(signedBody, lead, {
						...lead.User,
						Company: fieldMap,
					});
				} else {
					if (!signedBody.includes(processedSignature))
						signedBody = signedBody + "<p>&nbsp;</p><p>&nbsp;</p>" + processedSignature;
				}
			}
			if (signedBody !== "") {
				replaceCustomVariables(signedBody, {
					onSuccess: data => {
						setMailInput(prev => ({
							...prev,
							body: removeUnprocessedVariables(data?.body),
						}));
					},
					onError: err => {
						setMailInput(prev => ({
							...prev,
							body: removeUnprocessedVariables(signedBody),
						}));
						addError({
							text: "Error while fetching signature",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				});
			} else {
				setMailInput(prev => ({
					...prev,
					body: signedBody,
				}));
			}
		}
	}, [signature]);

	useEffect(() => {
		if (
			companySettings?.unsubscribe_link_madatory_for_semi_automated_mails &&
			!checkUnSubscribeIsPresent(mailInput.body)
		) {
			setUnsubPresent(false);
		} else {
			setUnsubPresent(true);
		}
	}, [mailInput.body]);

	//disable button

	useEffect(() => {
		if (unsubPresent && !sendLoading) setDisableSend(false);
		else if (!unsubPresent) setDisableSend(true);
		else if (sendLoading) setDisableSend(true);
	}, [sendLoading, unsubPresent]);

	useEffect(() => {
		window.addEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_BEGIN, () =>
			setDisableSend(true)
		);
		window.addEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_SUCCESS, () =>
			setDisableSend(false)
		);

		return () => {
			window.removeEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_BEGIN, () =>
				setDisableSend(true)
			);
			window.removeEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_SUCCESS, () =>
				setDisableSend(false)
			);
		};
	}, [files]);

	//video modal
	const handleVideoModalClose = () => {
		setVideoModal(false);
	};
	const openTemplatesClickHandler = () => {
		setOpenTemplateModal(true);
	};
	const handleOpenTemplatesClose = () => {
		setOpenTemplateModal(false);
	};

	return (
		<div className={styles.innerModalComponent}>
			<div className={styles.subjectHeader}>
				{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}{" "}
				<span>{toReplyMailState?.subject}</span>
			</div>
			<ShortEmailView
				replyToMailData={getMailData({
					subject: toReplyMailState?.subject,
					timeStamp: toReplyMailState?.createdAt,
					body: toReplyMailState?.textHtml,
					from: toReplyMailState?.from?.address,
					cc: toReplyMailState?.cc,
					bcc: toReplyMailState?.bcc,
					from_full_name:
						validateTask || !incoming
							? user?.first_name + " " + user?.last_name
							: mailData?.lead_full_name,
				})}
				loading={toReplyLoading}
				incoming={incoming && !validateTask}
			/>
			<div className={styles.body}>
				<div className={styles.to}>
					<span>To</span>
					<Input
						value={mailInput}
						disabled
						theme={InputThemes.TRANSPARENT}
						className={styles.inputContainer}
						name="to"
					/>
					<div className={`${styles.cc} ${isCc && styles.ccActive}`} onClick={toggleCc}>
						Cc
					</div>
					<div
						className={`${styles.bcc} ${isBcc && styles.bccActive}`}
						onClick={toggleBcc}
					>
						Bcc
					</div>
				</div>
				{/* cc */}
				{isCc && (
					<div className={styles.copyBox}>
						<span>Cc</span>
						<Input
							value={mailInput}
							setValue={setMailInput}
							name="cc"
							theme={InputThemes.TRANSPARENT}
							className={styles.inputContainer}
						/>
					</div>
				)}
				{/* bcc */}
				{isBcc && (
					<div className={styles.copyBox}>
						<span>Bcc</span>
						<Input
							value={mailInput}
							setValue={setMailInput}
							name="bcc"
							theme={InputThemes.TRANSPARENT}
							className={styles.inputContainer}
						/>
					</div>
				)}
				<div>
					{editorReady && attachmentLoaded && !replaceCustomVariablesLoading ? (
						<>
							<Editor
								height="44vh"
								value={mailInput?.body}
								setValue={val => setMailInput(prev => ({ ...prev, body: val }))}
								className={styles.editorContainer}
								setFiles={setFiles}
								files={files}
								theme="email"
								showCRMCustomVars
							/>
							<div className={replyStyles.buttons}>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => setSignatureModal(true)}
									disabled={signatureLoading}
								>
									Change signature
								</ThemedButton>
								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => setTemplateModal({ type: TEMPLATE_TYPES.EMAIL })}
									disabled={signatureLoading}
								>
									Load template
								</ThemedButton>

								<ThemedButton
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => setVideoModal(true)}
									disabled={replyType === "reply" ? true : false}
									className={styles.addVideoBtn}
								>
									Add video
								</ThemedButton>
							</div>
						</>
					) : (
						<div className={replyStyles.loaderWrapper}>
							<Spinner color={Colors.lightBlue} size="2rem" />{" "}
						</div>
					)}
				</div>
			</div>
			<div className={replyStyles.footer}>
				<span className={replyStyles.error}>
					{editorReady && !unsubPresent && (
						<>
							Unsubscribe link is mandatory for semi-automated mails.{" "}
							<span
								className={replyStyles.addLink}
								onClick={() => {
									addUnSubscribeVariable(
										setMailInput,
										companySettings.default_unsubscribe_link_text
									);
								}}
							>
								Add
							</span>{" "}
						</>
					)}
				</span>
				<ThemedButton
					loading={sendLoading}
					disabled={disableSend || replaceCustomVariablesLoading}
					onClick={() => {
						handleSend();
					}}
					theme={ThemedButtonThemes.GREEN}
					style={{
						width: "100%",
						boxShadow: "none",
						borderRadius: "1.5em",
					}}
				>
					<div>{sendLoading ? "Sending" : "Send reply"}</div>
				</ThemedButton>
			</div>
			<ImportTemplateModal
				modal={templateModal}
				setModal={setTemplateModal}
				setTemplate={setTemplate}
			/>
			<ChangeSignatureModal
				modal={signatureModal}
				setModal={setSignatureModal}
				setSignature={setSignature}
			/>
			<AddVideoModal
				isModal={videoModal}
				onClose={handleVideoModalClose}
				openTemplatesClickHandler={openTemplatesClickHandler}
				showOpenTemplatesOption={true}
				showGenerateLink={true}
				setMailInput={setMailInput}
				user={user}
				// timerInMinutes={3}
			/>
			<OpenTemplate
				setMailInput={setMailInput}
				videoModalClose={handleVideoModalClose}
				onClose={handleOpenTemplatesClose}
				isModal={openTemplateModal}
				user={user}
			/>
		</div>
	);
};

export default ReplyEmailIMC;
