import { useRecoilValue } from "recoil";
import { useState, useEffect, useContext } from "react";
// components
import { Input, Label, ThemedButton, Editor, Select } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { AttachmentToFile, Colors, insertAttachments } from "@cadence-frontend/utils";
import { userInfo } from "@cadence-frontend/atoms";

// constants
import { TEMPLATE_TYPES } from "../../../../constants";

import styles from "./EmailTemplateModal.module.scss";
import { getUpdateTemplateOptions } from "../../../../utils";
import {
	Common as COMMON_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
	Email as EMAIL_TRANSLATION,
} from "@cadence-frontend/languages";
import { Maximize, Minimize } from "@cadence-frontend/icons";
import * as DOMPurify from "dompurify";
import { useAttachments } from "@cadence-frontend/data-access";

const EmailTemplateModal = ({
	template,
	duplicate,

	handleClose,
	dataAccess,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const { getAttachment } = useAttachments();
	const user = useRecoilValue(userInfo);

	const { createTemplate, updateTemplate, createLoading, updateLoading } = dataAccess;

	const [input, setInput] = useState({});
	const [files, setFiles] = useState([]);
	const [expandBody, setExpandBody] = useState(false);
	const [attachmentLoaded, setAttachmentLoaded] = useState(false);

	useEffect(() => {
		if (duplicate && template) {
			setInput(template);
			setInput(prev => ({ ...prev, name: template.name + " (copy)" }));
			if (typeof template?.Attachments?.[0] !== "object") {
				getAttachment(template?.Attachments, {
					onSuccess: data => {
						setFiles(data?.data);
						data?.data.forEach(data => insertAttachments(data));
					},
				});
			} else {
				setFiles(template?.Attachments);
				insertAttachments(template?.Attachments);
			}
		} else if (template) {
			setInput(template);
			if (typeof template?.Attachments?.[0] !== "object") {
				getAttachment(template?.Attachments, {
					onSuccess: data => {
						setFiles(data?.data);
						data?.data.forEach(data => insertAttachments(data));
					},
				});
			} else {
				setFiles(template?.Attachments);
				insertAttachments(template?.Attachments);
			}
		} else setInput({ body: "" });
		setAttachmentLoaded(true);
	}, [template]);

	const setBodyValue = value => setInput(prev => ({ ...prev, body: value }));

	// const handleDeleteClick = () => {
	// 	setTemplate(template);
	// 	setDeleteModal(true);
	// };

	const handleCreateTemplate = () => {
		let data = {
			name: input.name.trim(),
			subject: input.subject,
			body: DOMPurify.sanitize(input.body) ?? "",
			linkText: input.linkText
				? input.linkText === "undefined"
					? ""
					: input.linkText
				: "",
			redirectUrl: input.redirectUrl
				? input.redirectUrl === "undefined"
					? ""
					: input.redirectUrl
				: "",
			level: input.level,
			type: TEMPLATE_TYPES.EMAIL,
			attachment_ids: files?.map(attachment => parseInt(attachment?.attachment_id)),
		};
		createTemplate(data, {
			onError: (err, _, context) => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Template duplicated");
				handleClose();
			},
		});
	};
	const handleUpdateTemplate = () => {
		let data = {
			et_id: input.et_id,
			name: input.name.trim(),
			subject: input.subject,
			body: DOMPurify.sanitize(input.body) ?? "",
			linkText: input.linkText
				? input.linkText === "undefined"
					? ""
					: input.linkText
				: "",
			redirectUrl: input.redirectUrl
				? input.redirectUrl === "undefined"
					? ""
					: input.redirectUrl
				: "",
			level: input.level,
			type: TEMPLATE_TYPES.EMAIL,
			attachment_ids: files?.map(attachment => parseInt(attachment?.attachment_id)),
		};
		updateTemplate(data, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("Template saved");
				handleClose();
			},
		});
	};

	const handleSubmit = async () => {
		if (!input.name.trim() || !input.subject || !input.body || !input.level) {
			addError({ text: "Template name, level subject and body are required." });
			return;
		}
		if (template && duplicate) handleCreateTemplate();
		else if (template) handleUpdateTemplate();
		else handleCreateTemplate();
		setFiles([]);
	};

	return (
		<div className={styles.emailTemplateModal}>
			<h3>{EMAIL_TRANSLATION.EMAIL_TEMPLATE[user?.language?.toUpperCase()]}</h3>
			<div className={styles.main}>
				{!expandBody && (
					<>
						<div className={styles.inputBox}>
							<Label required>
								{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={input}
								setValue={setInput}
								name="name"
								theme={InputThemes.WHITE_BORDERED}
							/>
						</div>
						<div className={styles.inputBox}>
							<Label required>
								{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={input}
								setValue={setInput}
								name="subject"
								theme={InputThemes.WHITE_BORDERED}
								isEmoji
							/>
						</div>
					</>
				)}
				<div className={`${styles.inputBox} ${styles.editor}`}>
					<div className={styles.bodyLabel}>
						<Label required>
							{COMMON_TRANSLATION.BODY[user?.language?.toUpperCase()]}{" "}
						</Label>
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() => setExpandBody(prev => !prev)}
							width="fit-content"
						>
							{expandBody ? (
								<>
									Collapse <Minimize color={Colors.darkBlue} />
								</>
							) : (
								<>
									Expand <Maximize color={Colors.darkBlue} />
								</>
							)}
						</ThemedButton>
					</div>
					{"body" in input && attachmentLoaded && (
						<Editor
							value={input.body}
							setValue={setBodyValue}
							files={files}
							setFiles={setFiles}
							className={styles.editor}
							theme={"email"}
							width="100%"
						/>
					)}
				</div>
			</div>
			<div className={styles.buttons}>
				<div className={styles.right}>
					<ThemedButton
						theme={ThemedButtonThemes.TRANSPARENT}
						className={styles.cancelBtn}
						onClick={handleClose}
						width="fit-content"
					>
						<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
					</ThemedButton>

					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.saveBtn}
						onClick={handleSubmit}
						loading={createLoading || updateLoading}
						width="fit-content"
						height="40px"
					>
						{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</div>
	);
};

export default EmailTemplateModal;
