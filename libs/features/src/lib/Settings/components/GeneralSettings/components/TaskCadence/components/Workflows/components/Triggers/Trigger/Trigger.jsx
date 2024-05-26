import { userInfo } from "@cadence-frontend/atoms";
import { Button, Title } from "@cadence-frontend/components";
import {
	MergeActionsIntoTrigger,
	TRIGGER_SPECIFIC_ACTIONS,
} from "@cadence-frontend/constants";
import { Plus } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { CollapseContainer, Select, ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Action from "../../Action/Action";
import styles from "./Trigger.module.scss";

const Trigger = ({
	triggerData,
	setTriggerData,
	triggerNameOptions,
	onSave,
	onDelete,
	loading,
	index: triggerIndex,
	newWorkflowAdded,
	setNewWorkflowAdded,
}) => {
	// const [isTypePersonal, setIsTypePersonal] = useState(triggerData?.allow_edit || false);
	const collapseRef = useRef(null);
	const [actions, setActions] = useState([]);
	const user = useRecoilValue(userInfo);
	const [availableActionNames, setAvailableActionNames] = useState([]);

	useEffect(() => {
		if (newWorkflowAdded === triggerIndex) {
			collapseRef.current?.click();
			collapseRef.current?.scrollIntoView({ behavior: "smooth" });
			setNewWorkflowAdded(false);
		}
	}, [newWorkflowAdded]);
	useEffect(() => {
		if (Object.keys(triggerData?.actions)?.length > 0) {
			setActions(
				Object.keys(triggerData.actions).map(actionName => {
					const action = {};
					action.name = actionName;
					action.data = triggerData.actions[actionName];
					if (typeof action.data === "string") return action;
					action.data = {};
					Object.keys(triggerData.actions[actionName]).forEach(key => {
						if (key !== "unix_time") {
							action.data[key] = triggerData.actions[actionName][key];
						} else if (key === "unix_time") {
							if (triggerData.actions[actionName][key] < 24 * 60 * 60) {
								action.data.unix_time = triggerData.actions[actionName][key] / 60;
								action.data.unix_mode = "min";
							} else {
								action.data.unix_time =
									triggerData.actions[actionName][key] / (24 * 60 * 60);
								action.data.unix_mode = "days";
							}
						}
					});
					return action;
				})
			);
		}
	}, [triggerData]);

	useEffect(() => {
		const usedOptions = actions?.map(ac => ac?.name);
		if (triggerData.trigger) {
			const allowedActions = TRIGGER_SPECIFIC_ACTIONS(triggerData.trigger);
			setAvailableActionNames(
				allowedActions?.map(ac => {
					if (usedOptions?.includes(ac?.value)) {
						ac.isDisabled = true;
					} else {
						ac.isDisabled = false;
					}
					return ac;
				})
			);
		}
	}, [actions]);

	const addAction = () => {
		setActions(prev => [...prev, { name: "", data: {} }]);
	};

	const onRemove = index => {
		//remove it locally if wflowid not present
		setActions(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
	};
	return (
		<CollapseContainer
			openByDefault={false}
			className={styles.collapsibleContainer}
			title={
				<div className={styles.header}>
					<Title className={styles.title} size="1.1rem">
						{/* {user?.integration_type === INTEGRATION_TYPE.SALESFORCE
							? "Standard Workflow "
							: SETTINGS_TRANSLATION.TRIGGER[user?.language?.toUpperCase()]} */}
						Standard Workflow {triggerIndex + 1}
					</Title>
					<div className={styles.btns}>
						{/* <div className={styles.typeToggle}>
							<span>Allow others to edit</span>
							<Toggle
								checked={isTypePersonal}
								onChange={() => setIsTypePersonal(prev => !prev)}
								className={styles.toggle}
								theme="PURPLE"
							/>
						</div> */}

						<Button
							// loading={loading}
							disabled={loading}
							className={styles.saveBtn}
							spinnerClassName={styles.spinner}
							onClick={e => {
								e.stopPropagation();
								onSave(MergeActionsIntoTrigger(actions, triggerData));
							}}
						>
							{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
						</Button>
						{triggerData?.trigger !== "when_a_owner_changes" && (
							<Button
								// loading={loading}
								disabled={loading}
								className={styles.deleteBtn}
								spinnerClassName={styles.spinner}
								onClick={e => {
									e.stopPropagation();
									onDelete();
								}}
							>
								{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
							</Button>
						)}
					</div>
				</div>
			}
			ref={collapseRef}
		>
			<div className={`${styles.TriggerSetting}`}>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						When
					</Title>
					<div>
						<Select
							width={"407px"}
							value={triggerData}
							name={"trigger"}
							setValue={setTriggerData}
							numberOfOptionsVisible={"3"}
							options={triggerNameOptions}
							disabled={triggerData?.trigger === "when_a_owner_changes"}
							isSearchable
						/>
					</div>
				</div>
				<div className={styles.setting}>
					{actions &&
						actions.map((ac, index) => {
							return (
								<Action
									actionIndex={index}
									actionData={ac}
									setActionData={fn => {
										//accpeting a fn which when passed original value returns modified value;
										//setTriggerData is called by child setTriggerData((prev)=>modifiedValue)
										//and we run this fn to get modified value just like other states
										setActions(prev => {
											const newAction = fn(prev[index]);
											return [
												...prev.slice(0, index),
												newAction,
												...prev.slice(index + 1),
											];
										});
									}}
									availableActionNames={availableActionNames}
									onRemove={() => onRemove(index)}
								/>
							);
						})}
				</div>
				{triggerData.trigger !== "when_a_owner_changes" && (
					<div>
						<ThemedButton
							className={styles.actionButton}
							theme="WHITE"
							onClick={() => addAction()}
							width="fit-content"
						>
							<Plus size="13.3px" /> Add action
						</ThemedButton>
					</div>
				)}
			</div>
		</CollapseContainer>
	);
};

export default Trigger;
