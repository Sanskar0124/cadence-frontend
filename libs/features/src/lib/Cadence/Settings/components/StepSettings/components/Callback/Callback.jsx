import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Editor,
	Input,
	Label,
	ThemedButton,
	Toggle,
	Select,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { CadenceContext } from "../../../../Settings";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";

import styles from "./Callback.module.scss";
import { INTEGRATION_TYPE, TEMPLATE_TYPES } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { getInput, NO_OF_RETRIES, TIME_UNITS_OPTIONS } from "./constants";
import * as DOMPurify from "dompurify";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";
import { Info } from "@cadence-frontend/icons";
import { characterLimits } from "../../constants";

const Callback = ({ node }) => {
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
	const { addError, addConfirmMessage, removeConfirmMessage, setStepChangeable } =
		useContext(MessageContext);
	const dataRef = useRef(null);
	const [input, setInput] = useState(getInput(node));
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
		setInput(getInput(node));
		// setIsUrgent(node?.is_urgent);
		setTemplate(null);
		return () => onSave();
	}, [node]);

	const onSave = () => {
		const newNodeData = {
			duration:
				dataRef?.current?.duration_time_unit === "minutes"
					? dataRef?.current?.duration * 60
					: dataRef?.current?.duration,
			retries: dataRef?.current?.retries,
			retry_after:
				dataRef?.current?.retry_after_time_unit === "hours"
					? dataRef?.current?.retry_after * 60 * 60
					: dataRef?.current?.retry_after_time_unit === "minutes"
					? dataRef?.current?.retry_after * 60
					: dataRef?.current?.retry_after,
			script: dataRef?.current?.script,
			template_id: dataRef?.current?.template_id,
			template_type: dataRef?.current?.template_type,
		};
		if (!newNodeData?.template_id) delete newNodeData.template_id;
		if (!newNodeData?.template_type) delete newNodeData.template_type;

		if (JSON.stringify(newNodeData) === JSON.stringify(node?.data)) return;

		let data = {
			node_id: node?.node_id,
			body: {
				data: { ...newNodeData, script: DOMPurify.sanitize(newNodeData.script) },
			},
		};

		updateNode(data, {
			onError: (err, updatedData, context) => {
				setActiveStep(node.node_id);
				setSaveVisible(true);
				addError({
					text: "Error updating Callback, please try again",
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
		if (
			(input?.duration_time_unit === "minutes" ? input?.duration * 60 : input?.duration) >
			300
		) {
			addConfirmMessage({
				type: "callback_duration",
				fun: () => {
					setInput(prev => ({
						...prev,
						duration: 5,
						duration_time_unit: TIME_UNITS_OPTIONS[1].value,
					}));
				},
				msg: "Callback duration cannot be more than 5 minutes. \nDo you want to change it to maximum. ?",
			});
			setStepChangeable(false);
			return;
		} else {
			setStepChangeable(true);
			removeConfirmMessage("callback_duration");
		}

		// if (template) {
		// 	if (input.template_id && input?.script !== template?.script) {
		// 		setInput(prev => ({ ...prev, script: prev.script }));
		// 		setTemplate(null);
		// 	}
		// } else {
		// 	if (node?.data?.template_id && input?.script !== node?.data?.script)
		// 		setInput(prev => ({ ...prev, script: prev.script }));
		// }
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
			setInput(prev => ({
				...prev,
				script: template.script,
				template_id: template.st_id,
				template_type: "script",
			}));
	}, [template]);

	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<h2 className={styles.title}>Callback</h2>
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
							<Toggle
								checked={isUrgent}
								onChange={e => handleisUrgent(e)}
								theme="PURPLE"
							/>
						</div>
					</div>
				</div>
				<div className={styles.inputBoxInline}>
					<div>
						<Label>Duration of callback</Label>
						<div>
							<Input
								type="number"
								placeholder="00"
								className={styles.inputNumber}
								value={input}
								name="duration"
								setValue={setInput}
								width="60px"
							/>
							<Select
								options={[TIME_UNITS_OPTIONS[0], TIME_UNITS_OPTIONS[1]]}
								className={styles.inputSelect}
								value={input}
								name="duration_time_unit"
								setValue={setInput}
								width="140px"
							/>
						</div>
					</div>
					<div>
						<Label>Retry after</Label>
						<div>
							<Input
								type="number"
								placeholder="00"
								className={styles.inputNumber}
								value={input}
								name="retry_after"
								setValue={setInput}
								width="60px"
							/>
							<Select
								options={TIME_UNITS_OPTIONS}
								className={styles.inputSelect}
								value={input}
								name="retry_after_time_unit"
								setValue={setInput}
								width="140px"
							/>
						</div>
					</div>
					<div>
						<Label>No. of retries</Label>
						<Select
							options={NO_OF_RETRIES}
							placeholder="Select a number"
							className={styles.inputSelect}
							value={input}
							name="retries"
							setValue={setInput}
							width="220px"
						/>
					</div>
				</div>
				<div className={styles.inputBox}>
					<Label>{COMMON_TRANSLATION.SCRIPT[user?.language?.toUpperCase()]}</Label>
					<Editor
						value={input?.script}
						setValue={script => setInput(prev => ({ ...prev, script }))}
						className={styles.editor}
						height="max(100vh - 400px, 310px)"
						theme="no_attachments"
						showCRMCustomVars={user?.integration_type === INTEGRATION_TYPE.SALESFORCE}
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

export default Callback;
