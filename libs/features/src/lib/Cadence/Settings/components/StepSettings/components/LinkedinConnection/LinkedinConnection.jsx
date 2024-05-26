import { useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { MessageContext } from "@cadence-frontend/contexts";
import { Editor, Label, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { INTEGRATION_TYPE, TEMPLATE_TYPES } from "@cadence-frontend/constants";

import { CadenceContext } from "../../../../Settings";

import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";

import styles from "./LinkedinConnection.module.scss";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";
import { Tooltip } from "@cadence-frontend/components";
import { Info } from "@cadence-frontend/icons";
import { characterLimits } from "../../constants";

const LinkedinConnection = ({ node }) => {
	const {
		activeStep,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
	} = useContext(CadenceContext);
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const { addError, setStepChangeable } = useContext(MessageContext);
	const dataRef = useRef(null);
	const [input, setInput] = useState(node.data);
	const [isUrgent, setIsUrgent] = useState(node.is_urgent);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [saveTemplateModal, setSaveTemplateModal] = useState(false);
	const user = useRecoilValue(userInfo);

	const { updateNode } = cadenceSettingsDataAccess;

	useEffect(() => {
		setInput(node.data);
		setIsUrgent(node.is_urgent);
		setTemplate(null);
		return () => onSave();
	}, [node]);

	useEffect(() => {
		if (input.message.length > 300) {
			setStepChangeable(false);
		} else {
			setStepChangeable(true);
		}
	}, [input]);

	const onSave = () => {
		if (JSON.stringify(dataRef.current) === JSON.stringify(node.data)) return;
		if (dataRef.current.message.length > 300) return;
		let data = {
			node_id: node.node_id,
			body: {
				data: {
					...dataRef.current,
					message: dataRef.current.message,
				},
			},
		};

		updateNode(data, {
			onError: (err, updatedData, context) => {
				setActiveStep(updatedData?.node_id);
				setSaveVisible(true);
				addError({
					text: "Error updating Linkedin connection, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
				onSaveRef.current.onclick = () => onSave();
			},
			onSuccess,
		});
	};

	useEffect(() => {
		if (template) {
			if (input.template_id && input.message !== template?.message) {
				setInput(prev => ({ message: prev.message }));
				setTemplate(null);
			}
		} else {
			if (node.data?.template_id && input.message !== node.data?.message)
				setInput(prev => ({ message: prev.message }));
		}
		dataRef.current = input;
	}, [input]);

	const handleisUrgent = e => {
		let dataToUpdate = {
			node_id: node.node_id,
			body: { is_urgent: e.target.checked },
		};
		setIsUrgent(e.target.checked);
		updateNode(dataToUpdate, {
			onError: (err, updatedData, context) => {
				addError({
					text: "Error updating Linkedin connection, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			},
		});
	};

	useEffect(() => {
		if (template)
			setInput({
				message: template.message,
				template_id: template.lt_id,
				template_type: "linkedin",
			});
	}, [template]);

	return (
		<div>
			<div className={styles.header}>
				<h2 className={styles.title}>Linkedin</h2>
				<div>
					<ThemedButton
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setTemplateModal({ type: TEMPLATE_TYPES.LINKEDIN })}
					>
						<div>
							{TEMPLATES_TRANSLATION.IMPORT_TEMPLATE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
					<div className={styles.toggleBox}>
						<p>Urgent</p>
						<Toggle checked={isUrgent} onChange={handleisUrgent} theme="PURPLE" />
					</div>
				</div>
			</div>
			<div className={styles.inputBox}>
				<Label>
					{
						TEMPLATES_TRANSLATION.CONNECTION_REQUEST_MESSAGE[
							user?.language?.toUpperCase()
						]
					}
				</Label>
				<Editor
					value={input.message}
					setValue={message => setInput(prev => ({ ...prev, message }))}
					theme="message"
					height="max(100vh - 320px, 270px)"
					showCRMCustomVars
				/>
			</div>
			<div className={styles.wordLimit}>
				<p>
					<span
						className={
							parseEditorValues(input.message)?.length > characterLimits(node?.type)
								? styles.red
								: ""
						}
					>
						{parseEditorValues(input.message)?.length}
					</span>{" "}
					/ <span>{characterLimits(node?.type)}</span>{" "}
				</p>
				<Tooltip text={"Character count includes html"} theme={"RIGHT"}>
					<Info size={"15px"} />
				</Tooltip>
			</div>
			<div className={styles.buttons}>
				<span className={styles.error}>
					{input.message?.length > characterLimits(node?.type) &&
						`Message cannot be more than ${characterLimits(node?.type)} characters`}
				</span>
				<ThemedButton
					width="fit-content"
					onClick={() =>
						setSaveTemplateModal({ body: { message: input.message }, type: "linkedin" })
					}
					theme={ThemedButtonThemes.GREY}
					disabled={input.message?.length > characterLimits(node?.type)}
				>
					<div>
						{TEMPLATES_TRANSLATION.SAVE_AS_TEMPLATE[user?.language?.toUpperCase()]}
					</div>
				</ThemedButton>
			</div>
			{templateModal && (
				<ImportTemplate
					modal={templateModal}
					setModal={setTemplateModal}
					setTemplate={setTemplate}
				/>
			)}
			{saveTemplateModal && (
				<SaveTemplateModal
					modal={saveTemplateModal}
					setModal={setSaveTemplateModal}
					setInput={setInput}
					setTemplate={setTemplate}
				/>
			)}
		</div>
	);
};

export default LinkedinConnection;
