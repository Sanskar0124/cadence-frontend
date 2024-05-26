import styles from "./AddWorkflow.module.scss";
import { useEffect, useState, useContext, useRef } from "react";
import Trigger from "../Trigger/Trigger";
import { useCadenceWorkflows } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { DeleteModal } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	INTEGRATION_TYPE,
	ORIGINAL_TRIGGERS,
	validateWorkflow,
} from "@cadence-frontend/constants";
import { TRIGGER_NAMES } from "@cadence-frontend/utils";
import Workflows from "libs/features/src/lib/Settings/components/GeneralSettings/components/TaskCadence/components/Workflows/Workflows";

const AddWorkflow = ({
	workflow,
	setWorkflow,
	index,
	viewMode,
	setViewMode,
	cadenceWorkflows,
	setCadenceWorkflows,
	activeWorkflow,
	setActiveWorkflow,
	cadence,
}) => {
	const user = useRecoilValue(userInfo);
	const [triggerNameOptions, setTriggerNameOptions] = useState(
		ORIGINAL_TRIGGERS(user?.integration_type, user?.phone_system)
	);
	const {
		createWorkflow,
		createWorkflowLoading,
		updateWorkflow,
		updateWorkflowLoading,
		deleteWorkflow,
		deleteWorkflowLoading,
	} = useCadenceWorkflows({ cadence_id: workflow?.cadence_id });
	const { addError, addSuccess } = useContext(MessageContext);
	const [deleteModal, setDeleteModal] = useState(false);

	useEffect(() => {
		const usedTriggerNames = cadenceWorkflows
			?.filter(tr => tr?.workflow_id !== workflow?.workflow_id)
			.map(tr => tr?.trigger);

		if (workflow?.trigger !== "") {
			setTriggerNameOptions(prev =>
				prev.map(ortr => {
					if (usedTriggerNames.includes(ortr.value)) {
						return { ...ortr, isDisabled: true };
					} else return { ...ortr, isDisabled: false };
				})
			);
		}
	}, [workflow]);

	useEffect(() => {
		const usedTriggerNames = cadenceWorkflows?.map(tr => tr.trigger);
		setTriggerNameOptions(prev =>
			prev
				.map(ortr => {
					if (usedTriggerNames?.includes(ortr?.value)) {
						return { ...ortr, isDisabled: true };
					} else return { ...ortr, isDisabled: false };
				})
				.filter(trg => {
					if (user.integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS) return true;
					else if (trg.value === "when_a_owner_changes") return false;
					return true;
				})
		);
	}, [cadenceWorkflows]);

	const onSave = wflow => {
		const validationErr = validateWorkflow(wflow);
		if (validationErr) return addError({ text: validationErr });

		if (!wflow.workflow_id) {
			if (wflow?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
				wflow.metadata.trigger_call_duration =
					wflow?.metadata?.value * (wflow?.metadata?.unit === "min" ? 60 : 1);
				delete wflow?.metadata?.value;
				delete wflow?.metadata?.unit;
			}

			//create if workflow id not present
			createWorkflow(wflow, {
				onSuccess: () => {
					addSuccess("Successfully created new workflow.");
					setViewMode(null);
					setActiveWorkflow("");
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
			const { name, actions, trigger, allow_edit, metadata } = wflow;

			const updateBody = { actions, trigger, allow_edit, name };
			if (trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN) {
				const modifiedMetaData = {
					trigger_call_duration: metadata?.value * (metadata?.unit === "min" ? 60 : 1),
				};
				updateBody.metadata = modifiedMetaData;
			}
			if (
				trigger === TRIGGER_NAMES.WHEN_A_LEAD_INTEGRATION_CHANGE ||
				trigger === TRIGGER_NAMES.WHEN_A_ACCOUNT_INTEGRATION_CHANGE ||
				trigger === TRIGGER_NAMES.WHEN_A_CONTACT_INTEGRATION_CHANGE ||
				trigger === TRIGGER_NAMES.WHEN_A_CANDIDATE_INTEGRATION_CHANGE
			) {
				updateBody.metadata = {
					trigger_lead_status: metadata.trigger_lead_status,
				};
			}

			updateWorkflow(
				{
					id: wflow.workflow_id,
					body: updateBody,
				},
				{
					onSuccess: () => {
						addSuccess("Successfully updated workflow.");
						setViewMode(null);
						setActiveWorkflow("");
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

	const onDelete = () => {
		const wflow = workflow;
		if (wflow?.workflow_id) {
			//delete request if wflowid present
			deleteWorkflow(wflow.workflow_id, {
				onSuccess: () => {
					addSuccess("Successfully deleted workflow.");
					setViewMode(null);
					setActiveWorkflow("");
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
			setCadenceWorkflows(cadenceWorkflows?.filter(item => item?.id !== workflow?.id));
			setViewMode(null);
			setActiveWorkflow("");
		}
	};

	return (
		<div className={styles.addWorkflow}>
			<Trigger
				triggerData={workflow ?? {}}
				onSave={onSave}
				viewMode={viewMode}
				setViewMode={setViewMode}
				cadenceWorkflows={cadenceWorkflows}
				setCadenceWorkflows={setCadenceWorkflows}
				onDelete={() =>
					setDeleteModal({
						onDelete: () => onDelete(),
						item: `Workflow ${index ?? workflow?.index} - ${workflow?.name}`,
						itemType: "workflow",
					})
				}
				loading={createWorkflowLoading || updateWorkflowLoading || deleteWorkflowLoading}
				triggerNameOptions={triggerNameOptions}
				setTriggerData={setWorkflow}
				index={index}
				cadence={cadence}
			/>
			<DeleteModal
				modal={deleteModal}
				setModal={setDeleteModal}
				onDelete={deleteModal?.onDelete}
				itemType={deleteModal?.itemType}
				item={deleteModal?.item}
			/>
		</div>
	);
};

export default AddWorkflow;
