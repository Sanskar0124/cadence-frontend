/* eslint-disable no-console */
import { useContext, useEffect, useState } from "react";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	useAttachments,
	useCadenceSettings,
	useCustomVariables,
	useEmail,
	useEmailSignature,
	useUser,
} from "@cadence-frontend/data-access";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Colors,
	addUnSubscribeVariable,
	checkUnSubscribeIsPresent,
	clearAttachments,
	insertAttachments,
	processCustomVariables,
	removeUnprocessedVariables,
} from "@cadence-frontend/utils";
import { Editor, Input, Select, ThemedButton } from "@cadence-frontend/widgets";
import ChangeSignatureModal from "../../../../Editor/components/ChangeSignatureModal/ChangeSignatureModal";
import ImportTemplateModal from "../../../../Editor/components/ImportTemplateModal/ImportTemplateModal";

import { powerInfo, tourInfo, userInfo } from "@cadence-frontend/atoms";
import { Spinner } from "@cadence-frontend/components";
import {
	AVAILABLE_MAIL_ACTIONS,
	GLOBAL_MODAL_TYPES,
	INITIAL_TOUR_STEPS_ENUM,
	IS_CUSTOM_VARS_AVAILABLE,
	POWER_MODAL_TYPES,
	POWER_STATUS,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	People as PEOPLES_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilState, useRecoilValue } from "recoil";
import AddVideoModal from "../../../../Video/components/AddVideoModal/AddVideoModal";
import OpenTemplate from "../../../../Video/components/OpenTemplate/OpenTemplate";
import styles from "../../EmailIMC.module.scss";
import composeStyles from "./ComposeEmailIMC.module.scss";

export const EDITOR_ATTACHMENT_EVENTS_ENUM = {
	FILE_UPLOAD_BEGIN: "FILE_UPLOAD_BEGIN",
	FILE_UPLOAD_SUCCESS: "FILE_UPLOAD_SUCCESS",
};

const ComposeEmailIMC = ({
	setInnerModalState,
	//typeSpecificProps
	mailData,
	abTemplateId,
	lead,
	fieldMap,
	markTaskAsCompleteIfCurrent,
	validateTask = false,
	stopPower,
	//modalProps
	onClose: modalOnClose,
}) => {
	const cadenceSettingsDataAccess = useCadenceSettings({
		companySettings: true,
	});
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);
	const user = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);
	const [tour, setTour] = useRecoilState(tourInfo);

	const { addError, addSuccess } = useContext(MessageContext);

	const { emails, updateUser } = useUser({ emails: true });
	const { getAttachment } = useAttachments();
	const mailDataAccess = useEmail(false);
	const {
		sendEmail,
		sendLoading,
		sendError,
		mailInput,
		setMailInput,
		isTokenExpired,
		sendSuccess,
		setSendSuccess,
	} = mailDataAccess;
	const { signatures, signatureLoading } = useEmailSignature();
	const { companySettings } = cadenceSettingsDataAccess;
	const [files, setFiles] = useState([]);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [signature, setSignature] = useState(null);
	const [signatureModal, setSignatureModal] = useState(false);
	const [isCc, setIsCc] = useState(false);
	const [isBcc, setIsBcc] = useState(false);
	const [unsubPresent, setUnsubPresent] = useState(true);
	const [disableSend, setDisableSend] = useState(false);
	const [videoModal, setVideoModal] = useState(false);
	const [openTemplateModal, setOpenTemplateModal] = useState(false);
	const [editorReady, setEditorReady] = useState(false);
	const [attachmentLoaded, setAttachmentLoaded] = useState(false);

	const onClose = () => {
		if (typeof modalOnClose === "function") modalOnClose();
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

	useEffect(() => {
		if (mailData && signatures) {
			lead.allSignatures = signatures;
			lead.signature = signatures.find(item => item.is_primary === true);
			if (mailData?.from === undefined || mailData?.from === null) delete mailData.from;
			let mailBody = processCustomVariables(mailData.body, lead, {
				...lead.User,
				Company: fieldMap,
			});
			if (mailBody.includes("{{user_signature}}")) {
				mailBody = processCustomVariables(
					mailBody.replace("{{user_signature}}", signature?.signature ?? ""),
					lead,
					{ ...lead.User, Company: fieldMap }
				);
			} else {
				mailBody = processCustomVariables(
					mailBody + "<p>&nbsp;</p>" + (signature?.signature ?? ""),
					lead,
					{ ...lead.User, Company: fieldMap }
				);
			}
			if (IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type) && mailBody !== "") {
				replaceCustomVariables(mailBody, {
					onSuccess: data => {
						data.body = removeUnprocessedVariables(data?.body);
						setMailInput(prev => ({
							...prev,
							...mailData,
							body: data.body,
						}));
						if (
							tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
							tour?.currentStep === INITIAL_TOUR_STEPS_ENUM.CLICK_EMAIL_TASK_CTA
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
				if (
					tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
					tour?.currentStep === INITIAL_TOUR_STEPS_ENUM.CLICK_EMAIL_TASK_CTA
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
			}
			if (
				typeof mailData?.attachments?.[0] === "object" &&
				mailData?.attachments?.[0]?.attachment_id
			) {
				setFiles(mailData?.attachments);
				mailData?.attachments?.forEach(attachment => insertAttachments(attachment));
			} else if (typeof mailData?.attachments?.[0] !== "object") {
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

		if (mailData?.cc) setIsCc(true);
		if (mailData?.bcc) setIsBcc(true);

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
	}, [mailData, signatures]);

	useEffect(() => {
		if (validateTask) {
			if (mailInput.to?.length) setEditorReady(true);
			else setTimeout(() => setEditorReady(true), 1000);
		} else setTimeout(() => setEditorReady(true), 500);
	}, [mailInput]);

	//set template
	useEffect(() => {
		if (template) {
			clearAttachments();
			lead.allSignatures = signatures;
			lead.signature = signatures.find(item => item.is_primary === true);
			let mailBody;

			if (
				template.body.includes("{{user_signature}}") ||
				template.body.includes("{{user_signature_primary}}")
			) {
				mailBody = processCustomVariables(template.body, lead, {
					...lead.User,
					Company: fieldMap,
				});
			} else {
				mailBody = processCustomVariables(
					template.body + "<p>&nbsp;</p>" + "{{user_signature}}",
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
			setFiles(template?.Attachments);
			template?.Attachments?.forEach(attachment => insertAttachments(attachment));
		}
		setTemplate(null);
	}, [template]);

	const cb = async () => {
		if (validateTask) await markTaskAsCompleteIfCurrent();
		onClose();
	};

	const handleSend = () => {
		if (power.status === POWER_STATUS.BOOSTED && validateTask) {
			let mail = {
				...mailInput,
				isTask: true,
				semi_automated_mail: mailInput.cadence_id ? true : false,
				attachments: files,
				ab_template_id: abTemplateId,
			};
			if (!abTemplateId) delete mail.ab_template_id;
			if (!mail.timeStamp) delete mail.timeStamp;
			if (!mail.from_full_name) delete mail.from_full_name;
			markTaskAsCompleteIfCurrent({ mail });
			onClose();
		} else if (tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) {
			markTaskAsCompleteIfCurrent({
				isSampleTaskForTour: true,
				subject: mailInput.subject,
			});
			onClose();
		} else sendEmail(files, validateTask, abTemplateId, cb);
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
			if (signedBody.includes(signature.previous?.signature)) {
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
		if (emails?.length > 0) {
			setMailInput(prev => ({
				...prev,
				from: user.primary_email || emails[0].address,
			}));
		}
	}, [emails]);

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
		else if (validateTask && !unsubPresent) setDisableSend(true);
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

	useEffect(() => {
		if (isTokenExpired)
			setInnerModalState({
				type: GLOBAL_MODAL_TYPES.MAIL_INTEGRATION_EXPIRED,
				typeSpecificProps: {
					title: AVAILABLE_MAIL_ACTIONS.SEND.error,
				},
				modalProps: {
					isModal: true,
					onClose: () => {
						setInnerModalState(prev => ({
							...prev,
							modalProps: { ...prev.modalProps, isModal: false },
						}));
					},
				}, //on not sending onClose it creates its own
			});
	}, [isTokenExpired]);

	useEffect(() => {
		if (sendSuccess !== "") addSuccess("Mail sent");
		setSendSuccess("");
	}, [sendSuccess]);

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

	// video templates
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
		<div className={styles.composeEmailModal}>
			<div className={styles.header}>
				{COMMON_TRANSLATION.SEND_EMAIL[user?.language?.toUpperCase()]}
			</div>
			<div className={styles.from}>
				<span>{COMMON_TRANSLATION.FROM[user?.language?.toUpperCase()]}</span>
				{tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING ? (
					<Input
						value={`${user?.first_name} ${user?.last_name}`}
						setValue={() => null}
						theme={InputThemes.TRANSPARENT}
						className={styles.inputContainer}
					/>
				) : (
					<Select
						value={mailInput}
						setValue={setMailInput}
						name="from"
						width="97%"
						placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
						className={styles.inputContainer}
						border={false}
						options={emails?.map(email => ({
							label: email.address,
							value: email.address,
						}))}
					/>
				)}
			</div>
			<div className={styles.to}>
				<span>{COMMON_TRANSLATION.TO[user?.language?.toUpperCase()]}</span>
				<Input
					value={mailInput}
					setValue={setMailInput}
					theme={InputThemes.TRANSPARENT}
					className={styles.inputContainer}
					name="to"
				/>
				<div className={`${styles.cc} ${isCc && styles.ccActive}`} onClick={toggleCc}>
					Cc
				</div>
				<div className={`${styles.bcc} ${isBcc && styles.bccActive}`} onClick={toggleBcc}>
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
			<div className={styles.subject}>
				<span>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</span>
				<Input
					value={mailInput}
					theme={InputThemes.TRANSPARENT}
					className={styles.inputContainer}
					setValue={setMailInput}
					name="subject"
					isEmoji
				/>
			</div>
			<div className={styles.body}>
				{editorReady && attachmentLoaded && !replaceCustomVariablesLoading ? (
					<>
						<Editor
							height="calc(100vh - 400px)"
							width="100%"
							value={mailInput?.body}
							setValue={val =>
								setMailInput(prev => {
									return { ...prev, body: val };
								})
							}
							className={styles.editorContainer}
							setFiles={setFiles}
							files={files}
							lead={lead}
							fieldMap={fieldMap}
							theme="email"
							showCRMCustomVars
						/>

						<div className={styles.buttons}>
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={() => setVideoModal(true)}
							>
								Add video
							</ThemedButton>
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
								onClick={() => setTemplateModal({ type: "email" })}
								disabled={signatureLoading}
							>
								<div>
									{PEOPLES_TRANSLATION.LOAD_TEMPLATE[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						</div>
					</>
				) : (
					<div className={composeStyles.loaderWrapper}>
						<Spinner color={Colors.lightBlue} size="2rem" />{" "}
					</div>
				)}
			</div>
			<div className={styles.footer}>
				<span className={styles.error}>
					{editorReady && !unsubPresent && validateTask && (
						<>
							Unsubscribe link is mandatory for semi-automated mails.{" "}
							<span
								className={styles.addLink}
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
						boxShadow: " 1.2px 8.2px 24px rgba(54, 205, 207, 0.3)",
						borderRadius: "1.5em",
					}}
					id="send-mail-btn"
				>
					<div>
						{sendLoading
							? "Sending"
							: COMMON_TRANSLATION.SEND_EMAIL[user?.language?.toUpperCase()]}
					</div>
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
				mailInput={mailInput}
				setMailInput={setMailInput}
				signature={signature}
				user={user}
			/>
			<OpenTemplate
				videoModalClose={handleVideoModalClose}
				setMailInput={setMailInput}
				onClose={handleOpenTemplatesClose}
				isModal={openTemplateModal}
				user={user}
				mailInput={mailInput}
				signature={signature}
			/>
		</div>
	);
};

export default ComposeEmailIMC;
