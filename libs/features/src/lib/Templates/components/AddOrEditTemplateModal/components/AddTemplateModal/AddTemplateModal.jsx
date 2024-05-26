import { useRecoilValue } from "recoil";
import { useRef } from "react";
import { useState, useEffect, useContext, useCallback } from "react";
// components
import { Input, Label, ThemedButton, Editor, Select } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";

import { userInfo } from "@cadence-frontend/atoms";

import { useSubDepartments } from "@cadence-frontend/data-access";

// constants
import {
	TEMPLATE_LEVELS,
	TEMPLATE_TYPES,
	TEMPLATE_TYPES_OPTIONS,
	characterLimits,
} from "../../../../constants";
import { ROLES } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./AddTemplateModal.module.scss";
import { getCreateTemplateOptions } from "../../../../utils";
import { getTeamsOptions } from "../../../../../Cadence/components/CreateCadenceModal/utils";
import VideoTemplateModal from "../VideoTemplateModal/VideoTemplateModal";
import { Maximize, Minimize } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import * as DOMPurify from "dompurify";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";

const AddTemplateModal = ({
	templateType,
	templateLevel,
	handleClose,
	dataAccess,
	setIsEmailType,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const { subDepartments } = useSubDepartments(true);

	const { createTemplate, createLoading, updateLoading, queryClient, KEY, refetchCount } =
		dataAccess;

	const [input, setInput] = useState({ level: templateLevel });
	const [files, setFiles] = useState([]);
	const [type, setType] = useState({ type: templateType });
	const [expandBody, setExpandBody] = useState(false);

	useEffect(() => {
		switch (type.type) {
			case TEMPLATE_TYPES.EMAIL: {
				setInput(prevInput => ({ ...prevInput, body: "" }));
				setIsEmailType(true);
				break;
			}
			case TEMPLATE_TYPES.SMS:
			case TEMPLATE_TYPES.LINKEDIN:
			case TEMPLATE_TYPES.WHATSAPP: {
				setInput(prevInput => {
					const newInput = { ...prevInput, message: "" };
					delete newInput.body;
					delete newInput.script;
					return newInput;
				});
				setIsEmailType(true);
				break;
			}
			case TEMPLATE_TYPES.SCRIPT: {
				setInput(prevInput => {
					const newInput = { ...prevInput, script: "" };
					delete newInput.body;
					delete newInput.message;
					return newInput;
				});
				setIsEmailType(true);
				break;
			}
			case TEMPLATE_TYPES.VIDEO:
				setIsEmailType(false);
				break;

			default:
				return;
		}
	}, [type]);

	const setBodyValue = value => setInput(prev => ({ ...prev, body: value }));

	const setMessageValue = value => setInput(prev => ({ ...prev, message: value }));

	const handleCreateTemplate = () => {
		const findGroupId = () => {
			if (input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT) {
				if (user.role === ROLES.SALES_MANAGER) return user.sd_id;
				else if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN)
					return input.sd_id;
			} else return null;
		};

		// if (
		// 	input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT &&
		// 	user.role === ROLES.SALES_MANAGER
		// )
		// 	level = TEMPLATE_LEVELS.SUB_DEPARTMENT;
		if (type.type === TEMPLATE_TYPES.EMAIL) {
			// const formData = new FormData();
			// formData.append("name", input.name.trim());
			// formData.append("subject", input.subject);
			// formData.append("body", DOMPurify.sanitize(input.body));
			// formData.append("linkText", input.linkText);
			// formData.append("redirectUrl", input.redirectUrl);
			// formData.append("level", input.level);
			// formData.append("type", TEMPLATE_TYPES.EMAIL);
			// formData.append("sd_id", findGroupId());
			// formData.append(
			// 	"company_id",
			// 	input.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null
			// );

			// for (let i = 0; i < files.length; i++) {
			// 	console.log(files[i])
			// 	formData.append(`attachment_ids`, parseInt(files[i]?.attachment_id));
			// }

			let data = {
				name: input.name.trim(),
				subject: input.subject,
				body: DOMPurify.sanitize(input.body),
				linkText: input.linkText,
				level: input.level,
				type: TEMPLATE_TYPES.EMAIL,
				sd_id: findGroupId(),
				company_id: input.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null,
				attachment_ids: files?.map(attachment => parseInt(attachment?.attachment_id)),
			};

			createTemplate(data, {
				onError: (err, _, context) => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData(
						[KEY, { level: input.level, type: TEMPLATE_TYPES.EMAIL }],
						context.previousTemplates
					);
				},
				onSuccess: () => {
					addSuccess("Template created");
					refetchCount();
					handleClose();
				},
			});
		} else {
			const body = {
				...input,
				name: input.name.trim(),
				type: type.type,
				level: input.level,
			};

			if (type.type === TEMPLATE_TYPES.SCRIPT)
				body.script = DOMPurify.sanitize(body.script);
			body.sd_id = findGroupId();
			body.company_id = input.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null;

			createTemplate(body, {
				onError: (err, _, context) => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData(KEY, context.previousTemplates);
				},
				onSuccess: () => {
					addSuccess("Template created");
					refetchCount();
					handleClose();
				},
			});
		}
	};

	const showGroupsDropdown = useCallback(() => {
		return (
			(user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) &&
			input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT
		);
	}, [input, user]);

	const handleSubmit = async () => {
		if (
			type.type === TEMPLATE_TYPES.EMAIL &&
			(!input?.name?.trim() || !input.subject || !input.body || !input.level)
		) {
			addError({ text: "Template name, level, subject and body are required." });
			return;
		} else if (
			(type.type === TEMPLATE_TYPES.LINKEDIN || type.type === TEMPLATE_TYPES.SMS) &&
			(!input?.name?.trim() || !input.message || !input.level)
		) {
			addError({ text: "Template name, level and message are required." });
			return;
		} else if (
			type.type === TEMPLATE_TYPES.SCRIPT &&
			(!input?.name?.trim() || !input.script || !input.level)
		) {
			addError({ text: "Template name, level and script are required." });
			return;
		}
		handleCreateTemplate();
		setFiles([]);
	};

	const allowedLevels = getCreateTemplateOptions(user?.role, user);
	return type.type === TEMPLATE_TYPES.VIDEO ? (
		<VideoTemplateModal
			dataAccess={dataAccess}
			templateType={templateType}
			handleClose={handleClose}
			templateLevel={templateLevel}
			type={type}
			setType={setType}
		/>
	) : (
		<div className={styles.addTemplateModal}>
			<h3>{TEMPLATES_TRANSLATION.ADD_TEMPLATE[user?.language?.toUpperCase()]}</h3>

			<div className={styles.main}>
				{!expandBody && (
					<>
						<div className={styles.inputBox}>
							<Label>
								{TEMPLATES_TRANSLATION.TEMPLATE_TYPE[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={TEMPLATE_TYPES_OPTIONS.map(opt => ({
									label: opt.label[user?.language?.toUpperCase()],
									value: opt.value,
								}))}
								value={type}
								setValue={setType}
								name="type"
							/>
						</div>
						<div className={styles.inputBox}>
							<Label required>
								{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={input}
								setValue={setInput}
								name="name"
								theme={InputThemes.WHITE_BORDERED}
								placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language.toUpperCase()]}
							/>
						</div>
						<div className={styles.inputBox}>
							<Label required>
								{TEMPLATES_TRANSLATION.TEMPLATE_LEVEL[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={allowedLevels}
								value={input}
								setValue={setInput}
								name="level"
							/>
						</div>
						{showGroupsDropdown() && (
							<div className={styles.inputBox}>
								<Label required>
									{COMMON_TRANSLATION.SELECT_GROUP[user?.language?.toUpperCase()]}
								</Label>
								<Select
									options={getTeamsOptions(subDepartments)}
									value={input}
									setValue={setInput}
									name="sd_id"
									isSearchable={true}
								/>
							</div>
						)}
					</>
				)}
				{type.type === TEMPLATE_TYPES.EMAIL ? (
					<>
						{!expandBody && (
							<div className={styles.inputBox}>
								<Label required>
									{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}
								</Label>
								<Input
									value={input}
									setValue={setInput}
									name="subject"
									theme={InputThemes.WHITE_BORDERED}
									placeholder={
										TEMPLATES_TRANSLATION.ENTER_TEMPLATE_SUBJECT[
											user?.language?.toUpperCase()
										]
									}
									isEmoji
								/>
							</div>
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
											{TEMPLATES_TRANSLATION.COLLAPSE[user?.language.toUpperCase()]}{" "}
											<Minimize color={Colors.darkBlue} />
										</>
									) : (
										<>
											{TEMPLATES_TRANSLATION.EXPAND[user?.language.toUpperCase()]}{" "}
											<Maximize color={Colors.darkBlue} />
										</>
									)}
								</ThemedButton>
							</div>
							{"body" in input && (
								<Editor
									value={input.body}
									setValue={setBodyValue}
									files={files}
									setFiles={setFiles}
									theme="email"
								/>
							)}
						</div>
					</>
				) : type.type === TEMPLATE_TYPES.SCRIPT ? (
					<div className={`${styles.inputBox} ${styles.editor}`}>
						<Label required>
							{TEMPLATES_TRANSLATION.SCRIPT_TEMPLATE[user?.language?.toUpperCase()]}
						</Label>
						<Editor
							value={input.script}
							setValue={value => setInput(prev => ({ ...prev, script: value }))}
							className={styles.editor}
							theme="no_attachments"
							charLimit={characterLimits(type.type)}
						/>
					</div>
				) : (
					<div className={`${styles.inputBox} ${styles.editor}`}>
						<Label required>
							{COMMON_TRANSLATION.MESSAGE[user?.language?.toUpperCase()]}
						</Label>
						<Editor
							type={type.type}
							theme="message"
							value={input.message}
							setValue={setMessageValue}
							className={styles.editor}
							charLimit={characterLimits(type.type)}
						/>
					</div>
				)}
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.saveBtn}
				onClick={handleSubmit}
				loading={createLoading || updateLoading}
				height="50px"
				disabled={
					parseEditorValues(type.type === "script" ? input.script : input.message)
						?.length > characterLimits(type.type)
				}
			>
				{TEMPLATES_TRANSLATION.ADD_TEMPLATE[user?.language?.toUpperCase()]}
			</ThemedButton>
		</div>
	);
};

export default AddTemplateModal;
