import { userInfo } from "@cadence-frontend/atoms";
import {
	ORIGINAL_TRIGGERS,
	validateWorkflow,
	TRIGGER_SPECIFIC_ACTIONS,
} from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useWorkflows } from "@cadence-frontend/data-access";
import { TRIGGER_NAMES } from "@cadence-frontend/utils";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./StandardWorkflowRules.module.scss";
import Trigger from "./components/Trigger/Trigger";

const StandardWorkflowRules = ({
	workflows,
	setWorkflows,
	setDeleteModal,
	newWorkflowAdded,
	setNewWorkflowAdded,
}) => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const phone_system = useRecoilValue(userInfo).phone_system;
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

	const [triggerNameOptions, setTriggerNameOptions] = useState(
		ORIGINAL_TRIGGERS(integration_type, phone_system)
	);
	const { addError, addSuccess } = useContext(MessageContext);
	const [availableActionNames, setAvailableActionNames] = useState([]);

	useEffect(() => {
		if (data) {
			let workflowData = data?.map((item, index) => {
				if (item?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
					if (item?.metadata) {
						const callDuration = item.metadata.trigger_call_duration;
						item.metadata = {
							value: callDuration
								? callDuration % 60 === 0
									? callDuration / 60
									: callDuration
								: 0,
							unit: callDuration
								? callDuration % 60 === 0
									? "min"
									: "second"
								: "second",
						};
					} else {
						item.metadata = {
							value: 0,
							unit: "second",
						};
					}
				}
				if (
					item?.trigger === TRIGGER_NAMES.WHEN_A_LEAD_INTEGRATION_CHANGE ||
					item?.trigger === TRIGGER_NAMES.WHEN_A_ACCOUNT_INTEGRATION_CHANGE
				) {
					if (item?.metadata) {
						const trigger_status = item?.metadata?.trigger_lead_status[0];
						item.metadata = {
							...(item?.metadata ?? []),
							lead_status: trigger_status,
						};
					}
				}

				return item;
			});

			setWorkflows(workflowData);
		}

		// return () => setWorkflows([]);
	}, [data]);

	useEffect(() => {
		const usedTriggerNames = workflows?.map(tr => tr?.trigger);
		setTriggerNameOptions(prev =>
			prev.map(ortr => {
				if (usedTriggerNames?.includes(ortr.value)) return { ...ortr, isDisabled: true };
				else return { ...ortr, isDisabled: false };
			})
		);
	}, [workflows]);
	// useEffect(() => {
	// 	const usedActionNames = workflows?.map(tr => Object.keys(tr?.actions));
	// 	const allowedOptions = workflows?.map(tr => {
	// 		if (tr?.trigger) {
	// 			return TRIGGER_SPECIFIC_ACTIONS(tr.trigger, integration_type);
	// 		}
	// 	});
	// 	console.log(allowedOptions, "options");
	// 	console.log(usedActionNames, "action names");
	// }, [workflows]);

	const onSave = wflow => {
		const validationErr = validateWorkflow(wflow);
		if (validationErr) return addError({ text: validationErr });

		delete wflow.save;
		if (!wflow.workflow_id) {
			//create if workflow id not present
			if (wflow?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
				wflow.metadata.trigger_call_duration =
					wflow?.metadata?.value * (wflow?.metadata?.unit === "min" ? 60 : 1);
				delete wflow?.metadata?.value;
				delete wflow?.metadata?.unit;
			}

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
			const { actions, trigger, allow_edit, metadata } = wflow;
			const updateBody = { actions, trigger, allow_edit };

			if (trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
				const modifiedMetaData = {
					trigger_call_duration: metadata?.value * (metadata?.unit === "min" ? 60 : 1),
				};
				updateBody.metadata = modifiedMetaData;
			}
			if (
				trigger === TRIGGER_NAMES.WHEN_A_LEAD_INTEGRATION_CHANGE ||
				trigger === TRIGGER_NAMES.WHEN_A_ACCOUNT_INTEGRATION_CHANGE ||
				trigger === TRIGGER_NAMES.WHEN_A_CONTACT_INTEGRATION_CHANGE
			) {
				updateBody.metadata = {
					trigger_lead_status: metadata.trigger_lead_status,
				};
			}

			updateWorkflow(
				{ id: wflow.workflow_id, body: updateBody },
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
				? workflows?.map((wflow, index) => {
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
										newFlow.save = true;
										return [...prev.slice(0, index), newFlow, ...prev.slice(index + 1)];
									});
								}}
								index={index}
								newWorkflowAdded={newWorkflowAdded}
								setNewWorkflowAdded={setNewWorkflowAdded}
								availableActionNames={availableActionNames}
								workflowData={data}
							/>
						);
				  })
				: null}
		</div>
	);
};

export default StandardWorkflowRules;
