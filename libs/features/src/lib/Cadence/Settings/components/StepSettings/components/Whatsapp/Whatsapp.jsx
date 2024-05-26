import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { CadenceContext } from "../../../../Settings";
import { MessageContext } from "@cadence-frontend/contexts";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./Whatsapp.module.scss";
import { Toggle, Label, Editor, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import {
	Tasks as TASKS_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
	Notifications as NOTIFICATIONS_TRANSLATION,
} from "@cadence-frontend/languages";
import { TEMPLATE_TYPES } from "@cadence-frontend/constants";

import { ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";
import { Info } from "@cadence-frontend/icons";
import { characterLimits } from "../../constants";

const Whatsapp = ({ node }) => {
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
	const { addError } = useContext(MessageContext);
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

	const onSave = () => {
		if (JSON.stringify({ ...dataRef.current }) === JSON.stringify({ ...node.data }))
			return;
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
					text: "Error updating Whatsapp message, please try again",
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
		// if (template) {
		// 	if (input.template_id && input.message !== template?.message) {
		// 		setInput(prev => ({ message: prev.message }));
		// 		setTemplate(null);
		// 	}
		// }
		// // else {
		// // 	if (node.data?.template_id && input.message !== node?.data?.message)
		// // 		setInput(prev => ({ message: prev.message }));
		// // }
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
					text: "Error updating Whatsapp message, please try again",
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
				template_id: template.wt_id,
				template_type: "whatsapp",
			});
	}, [template]);

	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<h2 className={styles.title}>Whatsapp</h2>
					<div>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() => setTemplateModal({ type: TEMPLATE_TYPES.WHATSAPP })}
						>
							<div>
								{TEMPLATES_TRANSLATION.IMPORT_TEMPLATE[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
						<div className={styles.toggleBox}>
							<p>{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}</p>
							<Toggle checked={isUrgent} onChange={handleisUrgent} theme="PURPLE" />
						</div>
					</div>
				</div>
				<div className={styles.inputBox}>
					<Label>
						{NOTIFICATIONS_TRANSLATION.MESSAGE[user?.language?.toUpperCase()]}
					</Label>
					<Editor
						value={input.message}
						setValue={message => setInput(prev => ({ ...prev, message }))}
						theme="message"
						height="max(100vh - 300px, 410px)"
						showAllMiscVars={false}
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
							setSaveTemplateModal({ body: { message: input.message }, type: "whatsapp" })
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
			</ErrorBoundary>
		</div>
	);
};

export default Whatsapp;
