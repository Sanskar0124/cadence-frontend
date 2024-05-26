import { useRecoilValue } from "recoil";
import { useState, useEffect, useContext } from "react";
// components
import { Editor, Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

// constants
import { TEMPLATE_LEVELS, TEMPLATE_TYPES, characterLimits } from "../../../../constants";
import { cleanRequestBody, getUpdateTemplateOptions } from "../../../../utils";

import styles from "./LinkedinTemplateModal.module.scss";
import { ROLES } from "@cadence-frontend/constants";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";

const LinkedinTemplateModal = ({
	template,
	duplicate,
	handleClose,
	dataAccess,
	templateType,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const { createTemplate, updateTemplate, createLoading, updateLoading } = dataAccess;

	const [input, setInput] = useState(template || {});

	useEffect(() => {
		if (duplicate && template) {
			setInput(template);
			setInput(prev => ({ ...prev, name: template.name + " (copy)" }));
		} else if (template) setInput(template);
		else setInput({});
	}, [template]);

	const handleCreateTemplate = () => {
		const body = {
			message: input.message,
			name: input.name.trim(),
			type: TEMPLATE_TYPES.LINKEDIN,
			level: input.level,
		};

		createTemplate(cleanRequestBody(body), {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("Template duplicated");
				handleClose();
			},
		});
	};

	const handleUpdateTemplate = () => {
		const findGroupId = () => {
			switch (input.level) {
				case TEMPLATE_LEVELS.USER:
				case TEMPLATE_LEVELS.COMPANY:
					return null;
				case TEMPLATE_LEVELS.SUB_DEPARTMENT: {
					switch (user.role) {
						case ROLES.SUPER_ADMIN:
						case ROLES.ADMIN:
							return template.sd_id;
					}
				}
			}
		};

		let level = input.level;
		const body = {
			...input,
			name: input.name.trim(),
			type: TEMPLATE_TYPES.LINKEDIN,
			level,
			sd_id: findGroupId(),
		};
		delete body.used;

		updateTemplate(cleanRequestBody(body), {
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

	const handleSubmit = () => {
		if (!input.name.trim() || !input.message || !input.level) {
			addError({ text: "Template name, level and message are required." });
			return;
		}

		if (template && duplicate) handleCreateTemplate();
		else if (template) handleUpdateTemplate();
		else handleCreateTemplate();
	};

	const setMessageValue = value => setInput(prev => ({ ...prev, message: value }));

	return (
		<div className={styles.linkedinTemplateModal}>
			<h3>{TEMPLATES_TRANSLATION.LinkedIn_Template[user?.language?.toUpperCase()]}</h3>
			<div className={styles.main}>
				<div className={styles.inputBox}>
					<Label required>Template name</Label>
					<Input
						value={input}
						setValue={setInput}
						name="name"
						theme={InputThemes.WHITE}
					/>
				</div>
				{/* <div className={styles.inputBox}>
					<Label>Template Level</Label>
					<Select
						options={getUpdateTemplateOptions(user?.role)}
						value={input}
						setValue={setInput}
						name="level"
					/>
				</div> */}
				<div className={`${styles.inputBox} ${styles.editor}`}>
					<Label required>Message</Label>
					<Editor
						theme="message"
						value={input.message}
						setValue={setMessageValue}
						charLimit={characterLimits(templateType)}
					/>
				</div>
			</div>
			<div className={styles.buttons}>
				<div className={styles.right}>
					<ThemedButton
						theme={ThemedButtonThemes.TRANSPARENT}
						className={styles.cancelBtn}
						onClick={handleClose}
					>
						<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
					<ThemedButton
						loading={createLoading || updateLoading}
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.saveBtn}
						onClick={handleSubmit}
						disabled={
							parseEditorValues(input.message)?.length > characterLimits(templateType)
						}
					>
						<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			</div>
		</div>
	);
};

export default LinkedinTemplateModal;
