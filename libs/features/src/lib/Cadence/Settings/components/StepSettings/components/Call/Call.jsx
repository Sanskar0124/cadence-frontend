import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";

import { MessageContext } from "@cadence-frontend/contexts";
import { Editor, Label, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { CadenceContext } from "../../../../Settings";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";

import styles from "./Call.module.scss";
import { INTEGRATION_TYPE, TEMPLATE_TYPES } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { ErrorBoundary } from "@cadence-frontend/components";
import * as DOMPurify from "dompurify";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";
import { Tooltip } from "@cadence-frontend/components";
import { Info } from "@cadence-frontend/icons";
import { characterLimits } from "../../constants";

const Call = ({ node }) => {
	const {
		activeStep,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
	} = useContext(CadenceContext);
	// const [node, setNode] = useState();
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const { addError } = useContext(MessageContext);
	const dataRef = useRef(null);
	const [input, setInput] = useState(node?.data);
	const [isUrgent, setIsUrgent] = useState(node?.is_urgent);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [saveTemplateModal, setSaveTemplateModal] = useState(false);
	const user = useRecoilValue(userInfo);

	const { updateNode } = cadenceSettingsDataAccess;

	// useEffect(() => {
	// 	activeStep && setNode(cadence?.sequence?.find(s => s.node_id === activeStep));
	// }, [cadence, activeStep]);
	useEffect(() => {
		setInput(node?.data);
		setIsUrgent(node?.is_urgent);
		setTemplate(null);
		return () => onSave();
	}, [node]);
	const onSave = () => {
		if (JSON.stringify(dataRef.current) === JSON.stringify(node?.data)) return;
		let data = {
			node_id: node?.node_id,
			body: {
				data: {
					...dataRef.current,
					script: DOMPurify.sanitize(dataRef?.current?.script),
				},
			},
		};

		updateNode(data, {
			onError: (err, updatedData, context) => {
				setActiveStep(node.node_id);
				setSaveVisible(true);
				addError({
					text: "Error updating Call, please try again",
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
			if (input.template_id && input?.script !== template?.script) {
				setInput(prev => ({ script: prev.script }));
				setTemplate(null);
			}
		} else {
			if (node?.data?.template_id && input?.script !== node?.data?.script)
				setInput(prev => ({ script: prev.script }));
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
					text: "Error updating Call, please try again",
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
				script: template.script,
				template_id: template.st_id,
				template_type: "script",
			});
	}, [template]);
	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<h2 className={styles.title}>Call</h2>
					<div>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() => setTemplateModal({ type: TEMPLATE_TYPES.SCRIPT })}
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
					<Label>{COMMON_TRANSLATION.SCRIPT[user?.language?.toUpperCase()]}</Label>
					<Editor
						value={input?.script}
						setValue={script => setInput(prev => ({ ...prev, script }))}
						className={styles.editor}
						height="max(100vh - 300px, 410px)"
						theme="no_attachments"
						showCRMCustomVars
					/>
				</div>
				<div className={styles.wordLimit}>
					<p>
						<span
							className={
								parseEditorValues(input.script)?.length > characterLimits(node?.type)
									? styles.red
									: ""
							}
						>
							{parseEditorValues(input.script)?.length}
						</span>{" "}
						/ <span>{characterLimits(node?.type)}</span>{" "}
					</p>
					<Tooltip text={"Character count includes html"} theme={"RIGHT"}>
						<Info size={"15px"} />
					</Tooltip>
				</div>
				<div className={styles.buttons}>
					<span className={styles.error}>
						{parseEditorValues(input.script)?.length > characterLimits(node?.type) &&
							`Message cannot be more than ${characterLimits(node?.type)} characters`}
					</span>
					<ThemedButton
						width="fit-content"
						onClick={() =>
							setSaveTemplateModal({ body: { script: input.script }, type: "script" })
						}
						theme={ThemedButtonThemes.GREY}
						disabled={
							parseEditorValues(input.script)?.length > characterLimits(node?.type)
						}
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

export default Call;
