import { Plus } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useWorkflows } from "@cadence-frontend/data-access";

import { useContext, useEffect, useState } from "react";
import Trigger from "./Trigger/Trigger";
import styles from "./Triggers.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { ORIGINAL_TRIGGERS, validateWorkflow } from "@cadence-frontend/constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Triggers = ({ setDeleteModal }) => {
	const user = useRecoilValue(userInfo);
	const {
		workflows: data,
		workflowsLoading,
		createWorkflow,
		createWorkflowLoading,
		updateWorkflow,
		updateWorkflowLoading,
		deleteWorkflow,
		deleteWorkflowLoading,
	} = useWorkflows();
	const [workflows, setWorkflows] = useState([]);
	const [newWorkflowAdded, setNewWorkflowAdded] = useState(false);
	const [triggerNameOptions, setTriggerNameOptions] = useState(
		ORIGINAL_TRIGGERS(user?.integration_type, user?.phone_system)
	);
	const { addError, addSuccess } = useContext(MessageContext);

	useEffect(() => {
		setWorkflows(data ?? []);
		// return () => setWorkflows([]);
	}, [data]);

	useEffect(() => {
		const usedTriggerNames = workflows.map(tr => tr.trigger);
		setTriggerNameOptions(prev =>
			prev.map(ortr => {
				if (usedTriggerNames.includes(ortr.value)) return { ...ortr, isDisabled: true };
				else return { ...ortr, isDisabled: false };
			})
		);
	}, [workflows]);

	const addTrigger = () => {
		let newTriggerIndex;
		setWorkflows(prev => {
			newTriggerIndex = prev.length;
			return [
				...prev,
				{
					trigger: "",
					actions: {},
					allow_edit: false,
				},
			];
		});
		setNewWorkflowAdded(newTriggerIndex);
	};

	const onSave = wflow => {
		const validationErr = validateWorkflow(wflow);
		if (validationErr) return addError({ text: validationErr });

		if (!wflow.workflow_id) {
			//create if workflow id not present
			createWorkflow(wflow, {
				onSuccess: () => {
					addSuccess("Successfully created new workflow.");
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		} else {
			//update if workflowid present
			const { actions, trigger, allow_edit } = wflow;
			updateWorkflow(
				{ id: wflow.workflow_id, body: { actions, trigger, allow_edit } },
				{
					onSuccess: () => {
						addSuccess("Successfully updated workflow.");
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				}
			);
		}
	};

	const onDelete = index => {
		const wflow = workflows[index];
		if (wflow?.workflow_id) {
			//delete request if wflowid present
			deleteWorkflow(wflow.workflow_id, {
				onSuccess: () => {
					addSuccess("Successfully deleted workflow.");
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		} else {
			//remove it locally if wflowid not present
			setWorkflows(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
		}
	};

	return (
		<div className={styles.triggers}>
			{!workflowsLoading
				? workflows.map((wflow, index) => {
						return (
							<Trigger
								triggerData={wflow}
								onSave={onSave}
								onDelete={() =>
									setDeleteModal({
										onDelete: () => onDelete(index),
										item: `Standard Workflow ${index + 1}`,
										itemType: "workflow",
									})
								}
								loading={
									createWorkflowLoading || updateWorkflowLoading || deleteWorkflowLoading
								}
								triggerNameOptions={triggerNameOptions}
								setTriggerData={fn => {
									//accpeting a fn which when passed original value returns modified value;
									//setTriggerData is called by child setTriggerData((prev)=>modifiedValue)
									//and we run this fn to get modified value just like other states
									setWorkflows(prev => {
										const newFlow = fn(prev[index]);
										return [...prev.slice(0, index), newFlow, ...prev.slice(index + 1)];
									});
								}}
								index={index}
								newWorkflowAdded={newWorkflowAdded}
								setNewWorkflowAdded={setNewWorkflowAdded}
							/>
						);
				  })
				: null}
			<ThemedButton
				className={styles.addTriggerButton}
				theme="GREY"
				onClick={() => addTrigger()}
				width="fit-content"
			>
				<Plus size="13.3px" />{" "}
				<div>{SETTINGS_TRANSLATION.ADD_TRIGGER[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</div>
	);
};

export default Triggers;
