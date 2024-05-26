import { DropDown, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import React, { useState, useEffect, useContext } from "react";
import styles from "./AutomatedWorkflowRules.module.scss";
import { Plus } from "@cadence-frontend/icons";
import AddRuleModal from "./components/AddRuleModal/AddRuleModal";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useAdvanceWorkflow } from "@cadence-frontend/data-access";
import { Button } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import StandardWorkflowRules from "../StandardWorkflowRules/StandardWorkflowRules";
import { Colors } from "@cadence-frontend/utils";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const AutomatedWorkflowRules = ({ setDeleteModal }) => {
	const [addRuleModal, setAddRuleModal] = useState(false);
	const [advanceWorkflow, setAdvanceWorkflow] = useState([]);
	const [newWorkflowAdded, setNewWorkflowAdded] = useState(false);
	const [standardWorkflow, setStandardWorkflow] = useState([]);
	const { workflows, workflowsLoading } = useAdvanceWorkflow();
	const user = useRecoilValue(userInfo);

	const duplicateWorkflow = workflow => {
		setAddRuleModal({
			update: true,
			workflow: { ...workflow, duplicate: true },
		});
	};

	useEffect(() => {
		setAdvanceWorkflow(workflows ?? []);
	}, [workflows]);

	const addTrigger = () => {
		let newTriggerIndex;
		setStandardWorkflow(prev => {
			newTriggerIndex = prev.length;
			return [
				...prev,
				{
					trigger: "",
					save: true,
					actions: {},
					metadata: {},
					allow_edit: false,
				},
			];
		});
		setNewWorkflowAdded(newTriggerIndex);
	};

	// Open add rule modal
	const addRule = () => {
		setAddRuleModal({
			update: false,
		});
	};

	// Close add rule modal
	const onClose = () => {
		setAddRuleModal(false);
	};

	return (
		<div className={styles.rules}>
			<AddRuleModal onClose={onClose} isModal={addRuleModal} />
			<StandardWorkflowRules
				workflows={standardWorkflow}
				setWorkflows={setStandardWorkflow}
				setDeleteModal={setDeleteModal}
				newWorkflowAdded={newWorkflowAdded}
				setNewWorkflowAdded={setNewWorkflowAdded}
			/>
			{advanceWorkflow?.length
				? advanceWorkflow?.map((wf, i, array) => {
						return (
							<AdvanceWorkflowRow
								styles={styles}
								workflow={wf}
								index={i}
								onClick={() => {
									setAddRuleModal({
										update: true,
										workflow: wf,
									});
								}}
								setDeleteModal={setDeleteModal}
								duplicateWorkflow={duplicateWorkflow}
								advanceWorkflow={advanceWorkflow}
								array={array}
							/>
						);
				  })
				: null}

			<div className={styles.ruleBtnWrapper}>
				<DropDown
					width="200px"
					tooltipText
					bottom="4rem"
					btn={
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							className={styles.addRuleButton}
						>
							<Plus size="14px" color={Colors.lightBlue} />{" "}
							<div>{`${
								COMMON_TRANSLATION.ADD[user?.language.toUpperCase()]
							} workflow`}</div>
						</ThemedButton>
					}
					left="0rem"
				>
					<button
						onClick={e => {
							addTrigger();
						}}
					>
						{SETTINGS_TRANSLATION.STANDARD_WORKFLOW[user?.language.toUpperCase()]}
					</button>

					<button onClick={() => addRule()}>
						{SETTINGS_TRANSLATION.ADVANCED_WORKFLOW[user?.language.toUpperCase()]}
					</button>
				</DropDown>
			</div>
		</div>
	);
};

export default AutomatedWorkflowRules;

const AdvanceWorkflowRow = ({
	workflow,
	styles,
	index,
	onClick,
	setDeleteModal,
	duplicateWorkflow,
	array,
}) => {
	const { deleteWorkflow, deleteWorkflowLoading } = useAdvanceWorkflow();
	const { addError, addSuccess } = useContext(MessageContext);
	const [toggle, setToggle] = useState(null);

	const { updateWorkflow, updateWorkflowLoading } = useAdvanceWorkflow();
	const user = useRecoilValue(userInfo);
	const onDeleteWorkflowHandler = workflow => {
		deleteWorkflow(workflow.aw_id, {
			onSuccess: () => {
				addSuccess("Successfully deleted workflow.");
			},

			onError: error => {
				addError({
					text: error.response.data.msg,
					desc: error?.response?.data?.error ?? "Please contact support",
					cId: error?.response?.data?.correlationId,
				});
			},
		});
	};

	useEffect(() => {
		setToggle(workflow?.is_enabled);
	}, [workflow?.is_enabled]);

	const handleIsEnabled = e => {
		setToggle(e.target.checked);
		updateWorkflow(
			{
				id: workflow?.aw_id,
				body: {
					actions: workflow?.actions,
					filter: workflow?.filter,
					rule_name: workflow?.rule_name,
					trigger: workflow?.trigger,
					is_enabled: e.target.checked,
				},
			},
			{
				onSuccess: () => {
					addSuccess("Successfully updated workflow.");
				},
				onError: err => {
					setToggle(!e.target.checked);
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	return (
		<div className={styles.workflows} onClick={onClick}>
			<p className={styles.workflowRuleName}>
				<span className={styles.boldText}>
					{SETTINGS_TRANSLATION.ADVANCED_WORKFLOW[user?.language.toUpperCase()]}{" "}
					{index + 1} :
				</span>{" "}
				{workflow.rule_name}
			</p>{" "}
			<div className={styles.btns}>
				<Button
					className={styles.duplicateBtn}
					onClick={e => {
						e.stopPropagation();
						duplicateWorkflow(workflow);
					}}
				>
					{COMMON_TRANSLATION.DUPLICATE[user?.language.toUpperCase()]}
				</Button>

				{!workflow?.duplicate && (
					<Button
						className={styles.deleteBtn}
						loading={deleteWorkflowLoading}
						onClick={e => {
							e.stopPropagation();
							setDeleteModal({
								onDelete: () => {
									onDeleteWorkflowHandler(workflow);
								},
								item: workflow.rule_name,
								itemType: "workflow",
							});
						}}
					>
						{COMMON_TRANSLATION.DELETE[user?.language.toUpperCase()]}
					</Button>
				)}
				<Toggle
					checked={toggle}
					disabled={updateWorkflowLoading}
					onClick={e => e.stopPropagation()}
					onChange={e => {
						handleIsEnabled(e);
					}}
					theme="PURPLE"
				/>
			</div>
		</div>
	);
};
