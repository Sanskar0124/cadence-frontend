import { userInfo } from "@cadence-frontend/atoms";
import { Button, Title } from "@cadence-frontend/components";
import {
	CALLDURATION_TRIGGER_OPTIONS,
	INTEGRATION_TYPE,
	MergeActionsIntoTrigger,
	TRIGGER_SPECIFIC_ACTIONS,
} from "@cadence-frontend/constants";
import { Plus } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { InputThemes } from "@cadence-frontend/themes";
import { TRIGGER_NAMES } from "@cadence-frontend/utils";
import {
	CollapseContainer,
	Input,
	Label,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import Action from "../Action/Action";
import styles from "./Trigger.module.scss";
import { useCadenceSettings } from "@cadence-frontend/data-access";

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
	workflowsData,
}) => {
	const user = useRecoilValue(userInfo);
	// const [isTypePersonal, setIsTypePersonal] = useState(triggerData?.allow_edit || false);
	const { allowedStatuses } = useCadenceSettings({
		allowedStatuses:
			user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
			user?.integration_type === INTEGRATION_TYPE.BULLHORN,
	});
	const collapseRef = useRef(null);
	const [actions, setActions] = useState([]);

	const [availableActionNames, setAvailableActionNames] = useState([]);
	const [saveStateForRemoveAction, setSaveStateForRemoveAction] = useState(false);

	useEffect(() => {
		if (newWorkflowAdded === triggerIndex) {
			collapseRef.current?.scrollIntoView({ behavior: "smooth" });
			collapseRef.current?.click();
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
	}, [triggerData, workflowsData]);

	useEffect(() => {
		if (triggerData?.trigger) {
			const usedOptions1 = Object.keys(triggerData?.actions);
			const allowedActions = TRIGGER_SPECIFIC_ACTIONS(
				triggerData.trigger,
				user?.integration_type
			);

			setAvailableActionNames(
				allowedActions.map(ac => {
					if (usedOptions1?.includes(ac.value)) return { ...ac, isDisabled: false };
					else return { ...ac, isDisabled: false };
				})
			);
		}
	}, [triggerData, workflowsData]);

	const addAction = () => {
		setActions(prev => [...prev, { name: "", data: {}, save: true }]);
	};

	const onRemove = index => {
		//remove it locally if wflowid not present
		setActions(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
		setSaveStateForRemoveAction(true);
	};

	return (
		<CollapseContainer
			openByDefault={false}
			className={styles.collapsibleContainer}
			title={
				<div className={styles.header}>
					<Title className={styles.title} size="1.1rem">
						{SETTINGS_TRANSLATION.STANDARD_WORKFLOW[user?.language.toUpperCase()]}{" "}
						{triggerIndex + 1} : <span>{triggerData?.name}</span>
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
						{(triggerData?.save ||
							actions.some(item => item.save) ||
							saveStateForRemoveAction) && (
							<Button
								// loading={loading}
								disabled={loading}
								className={styles.saveBtn}
								spinnerClassName={styles.spinner}
								onClick={e => {
									e.stopPropagation();
									setSaveStateForRemoveAction(false);
									onSave(MergeActionsIntoTrigger(actions, triggerData));
								}}
							>
								{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
							</Button>
						)}

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
						{COMMON_TRANSLATION.WHEN[user?.language.toUpperCase()]}
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
					{triggerData?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN && (
						<div className={styles.callDurationSettingsBox}>
							<Input
								value={triggerData?.metadata?.value ?? ""}
								setValue={val =>
									setTriggerData(prev => {
										return {
											...prev,
											metadata: {
												...prev.metadata,
												value: val,
											},
										};
									})
								}
								type="number"
								theme={InputThemes.WHITE}
								width="60px"
								height="40x"
								placeholder="00"
							/>
							<Select
								height={"40px"}
								value={triggerData?.metadata?.unit ?? ""}
								setValue={val =>
									setTriggerData(prev => {
										return {
											...prev,
											metadata: {
												...prev.metadata,
												unit: val,
											},
										};
									})
								}
								className={styles.selectContainer}
								options={CALLDURATION_TRIGGER_OPTIONS()}
								isSearchable
								menuOnTop
								placeholder={"Select seconds/minutes"}
							/>
						</div>
					)}
				</div>
				{(user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
					user?.integration_type === INTEGRATION_TYPE.BULLHORN) && (
					// eslint-disable-next-line react/jsx-no-useless-fragment
					<>
						{triggerData.trigger === "when_a_lead_integration_status_is_updated" && (
							<div className={styles.leadsSettings}>
								<Label className={styles.label}>
									{SETTINGS_TRANSLATION.CHANGE_STATUS_LEAD[user?.language.toUpperCase()]}
								</Label>
								<div>
									<Select
										width={"407px"}
										value={
											triggerData?.metadata?.trigger_lead_status
												? triggerData?.metadata?.trigger_lead_status[0]
												: ""
										}
										setValue={val => {
											if (val) {
												setTriggerData(prev => {
													return {
														...prev,
														metadata: {
															...prev.metadata,
															trigger_lead_status: Array.isArray[val] ? val : [val],
														},
													};
												});
											}
										}}
										options={
											allowedStatuses?.lead_integration_status?.picklist_values ?? []
										}
										isSearchable
										menuOnTop
									/>
								</div>
							</div>
						)}
						{triggerData.trigger === "when_a_account_integration_status_is_updated" && (
							<div className={styles.leadsSettings}>
								<Label className={styles.label}>
									{
										SETTINGS_TRANSLATION.CHANGE_STATUS_ACCOUNT[
											user?.language.toUpperCase()
										]
									}
								</Label>
								<div>
									<Select
										width={"407px"}
										value={
											triggerData?.metadata?.trigger_lead_status
												? triggerData?.metadata?.trigger_lead_status[0]
												: ""
										}
										setValue={val => {
											if (val) {
												setTriggerData(prev => {
													return {
														...prev,
														metadata: {
															...prev.metadata,
															trigger_lead_status: Array.isArray[val] ? val : [val],
														},
													};
												});
											}
										}}
										options={
											allowedStatuses?.account_integration_status?.picklist_values ?? []
										}
										isSearchable
										menuOnTop
									/>
								</div>
							</div>
						)}
						{triggerData.trigger === "when_a_contact_integration_status_is_updated" && (
							<div className={styles.leadsSettings}>
								<Label className={styles.label}>
									{
										SETTINGS_TRANSLATION.CHANGE_STATUS_CONTACT[
											user?.language.toUpperCase()
										]
									}
								</Label>
								<div>
									<Select
										width={"407px"}
										value={
											triggerData?.metadata?.trigger_lead_status
												? triggerData?.metadata?.trigger_lead_status[0]
												: ""
										}
										setValue={val => {
											if (val) {
												setTriggerData(prev => {
													return {
														...prev,
														metadata: {
															...prev.metadata,
															trigger_lead_status: Array.isArray[val] ? val : [val],
														},
													};
												});
											}
										}}
										options={
											allowedStatuses?.contact_integration_status?.picklist_values ?? []
										}
										isSearchable
										menuOnTop
									/>
								</div>
							</div>
						)}

						{user?.integration_type === INTEGRATION_TYPE.BULLHORN &&
							triggerData.trigger ===
								"when_a_candidate_integration_status_is_updated" && (
								<div className={styles.leadsSettings}>
									<Label className={styles.label}>
										{
											SETTINGS_TRANSLATION.CHANGE_STATUS_CANDIDATE[
												user?.language.toUpperCase()
											]
										}
									</Label>
									<div>
										<Select
											width={"407px"}
											value={
												triggerData?.metadata?.trigger_lead_status
													? triggerData?.metadata?.trigger_lead_status[0]
													: ""
											}
											setValue={val => {
												if (val) {
													setTriggerData(prev => {
														return {
															...prev,
															metadata: {
																...prev.metadata,
																trigger_lead_status: Array.isArray[val] ? val : [val],
															},
														};
													});
												}
											}}
											options={
												allowedStatuses?.candidate_integration_status?.picklist_values ??
												[]
											}
											isSearchable
											menuOnTop
										/>
									</div>
								</div>
							)}
					</>
				)}
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
											newAction.save = true;
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
							<Plus size="13.3px" />{" "}
							{SETTINGS_TRANSLATION.ADD_ACTIONS[user?.language.toUpperCase()]}
						</ThemedButton>
					</div>
				)}
			</div>
		</CollapseContainer>
	);
};

export default Trigger;
