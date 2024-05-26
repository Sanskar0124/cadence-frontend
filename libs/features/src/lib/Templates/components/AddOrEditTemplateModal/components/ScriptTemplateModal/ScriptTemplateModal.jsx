import { useRecoilValue } from "recoil";
import { useState, useEffect, useContext } from "react";
// components
import { Editor, Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

// constants
import { TEMPLATE_LEVELS, TEMPLATE_TYPES, characterLimits } from "../../../../constants";
import { cleanRequestBody } from "../../../../utils";

import styles from "./ScriptTemplateModal.module.scss";
import { ROLES } from "@cadence-frontend/constants";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import * as DOMPurify from "dompurify";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";

const ScriptTemplateModal = ({
	template,
	duplicate,
	handleClose,
	dataAccess,
	templateType,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const { createTemplate, updateTemplate, createLoading, updateLoading, refetchCount } =
		dataAccess;

	const [input, setInput] = useState(
		template || {
			script: "",
		}
	);

	useEffect(() => {
		if (duplicate && template) {
			setInput(template => ({ ...template, name: `${template.name}(copy)` }));
		} else if (template) setInput(template);
		// else setInput({ script: "" });
	}, [template]);

	const handleCreateTemplate = () => {
		const body = {
			script: input.script,
			name: input.name.trim(),
			type: TEMPLATE_TYPES.SCRIPT,
			level: input.level,
		};

		body.script = DOMPurify.sanitize(body.script);

		createTemplate(body, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("Template duplicated");
				refetchCount();
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
			type: TEMPLATE_TYPES.SCRIPT,
			level,
			sd_id: findGroupId(),
		};

		body.script = DOMPurify.sanitize(body.script);

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

	const handleSubmit = async () => {
		if (!input.name.trim() || !input.script || !input.level) {
			addError({ text: "Template name, level and script are required." });
			return;
		}

		if (template && duplicate) handleCreateTemplate();
		else if (template) handleUpdateTemplate();
		else handleCreateTemplate();
	};

	return (
		<div className={styles.scriptTemplateModal}>
			<h3>{TEMPLATES_TRANSLATION.SCRIPT_TEMPLATE[user?.language?.toUpperCase()]}</h3>
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
				<div className={`${styles.inputBox} ${styles.editor}`}>
					<Label required>
						{COMMON_TRANSLATION.SCRIPT[user?.language?.toUpperCase()]}
					</Label>
					<Editor
						value={input?.script}
						setValue={value => setInput(prev => ({ ...prev, script: value }))}
						theme="no_attachments"
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
						width="fit-content"
					>
						<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
					<ThemedButton
						loading={createLoading || updateLoading}
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.saveBtn}
						onClick={handleSubmit}
						width="fit-content"
						height="40px"
						disabled={
							parseEditorValues(input?.script)?.length > characterLimits(templateType)
						}
					>
						<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			</div>
		</div>
	);
};

export default ScriptTemplateModal;
