import { userInfo } from "@cadence-frontend/atoms";
import { Button, Title } from "@cadence-frontend/components";
import {
	CALLDURATION_TRIGGER_OPTIONS,
	MergeActionsIntoTrigger,
	TRIGGER_SPECIFIC_ACTIONS,
	INTEGRATION_TYPE,
	ACTIONS,
} from "@cadence-frontend/constants";
import { Plus } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { TRIGGER_NAMES } from "@cadence-frontend/utils";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Action from "../Action/Action";
import styles from "../AddWorkflow/AddWorkflow.module.scss";
import { useCadenceSettings } from "@cadence-frontend/data-access";
import { isActionPermitted } from "libs/features/src/lib/Cadence/utils";

const Trigger = ({
	triggerData,
	setTriggerData,
	triggerNameOptions,
	onSave,
	onDelete,
	loading,
	index: triggerIndex,
	viewMode,
	setViewMode,
	cadenceWorkflows,
	setCadenceWorkflows,
	cadence,
}) => {
	// const [isTypePersonal, setIsTypePersonal] = useState(triggerData?.allow_edit || false);
	const user = useRecoilValue(userInfo);
	const { allowedStatuses } = useCadenceSettings({
		allowedStatuses:
			user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
			user?.integration_type === INTEGRATION_TYPE.BULLHORN,
	});
	const [actions, setActions] = useState([]);

	const [availableActionNames, setAvailableActionNames] = useState([]);
	// console.log(cadenceWorkflows[cadenceWorkflows?.length-1])
	const currentObj = cadenceWorkflows?.find(obj => obj?.id === triggerData?.id);

	useEffect(() => {
		if (triggerData) {
			if (Object.keys(triggerData?.actions)?.length > 0) {
				setActions(
					Object?.keys(triggerData?.actions)?.map(actionName => {
						const action = {};

						action.name = actionName;
						action.data = triggerData?.actions[actionName];
						if (typeof action.data === "string") return action;
						action.data = {};
						Object?.keys(triggerData?.actions[actionName])?.forEach(key => {
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
			} else {
				setActions([]);
			}
		}
	}, [triggerData?.actions]);
	// console.log(actions);

	useEffect(() => {
		const usedOptions = actions.map(ac => ac.name);
		if (triggerData?.trigger) {
			const allowedActions = TRIGGER_SPECIFIC_ACTIONS(
				triggerData?.trigger,
				user.integration_type
			);
			const allowedAction = allowedActions?.map(ac => {
				if (usedOptions.includes(ac.value)) {
					ac.isDisabled = true;
				} else {
					ac.isDisabled = false;
				}
				return ac;
			});
			setAvailableActionNames(allowedAction);
		} else {
			setAvailableActionNames([]);
		}
	}, [actions, triggerData?.trigger]);

	const addAction = () => {
		setActions(prev => [...prev, { name: "", data: {} }]);
	};

	const onRemove = index => {
		//remove it locally if wflowid not present
		setActions(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
	};

	return (
		<>
			<div className={styles.header}>
				<div className={styles.workflowheader}>
					<div className={styles.workflowName}>
						{COMMON_TRANSLATION.WORKFLOW[user?.language?.toUpperCase()]}{" "}
						{currentObj?.index} - {triggerData?.name}
					</div>
					{isActionPermitted(
						ACTIONS.UPDATE,
						cadence?.type,
						user?.role,
						user?.user_id === cadence?.user_id
					) && (
						<div className={styles.btns}>
							<Button
								className={styles.saveBtn}
								disabled={loading}
								spinnerClassName={styles.spinner}
								onClick={e => {
									e.stopPropagation();
									onSave(MergeActionsIntoTrigger(actions, triggerData));
								}}
							>
								{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
							</Button>

							<Button
								className={styles.deleteBtn}
								disabled={loading}
								spinnerClassName={styles.spinner}
								onClick={e => {
									e.stopPropagation();
									onDelete();
								}}
							>
								{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
							</Button>
						</div>
					)}
				</div>
			</div>

			<div className={`${styles.TriggerSetting}`}>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.TITLE[user?.language?.toUpperCase()]}
					</Title>
					<div>
						<Input
							placeholder={"Type here"}
							width={"407px"}
							value={triggerData}
							setValue={setTriggerData}
							name={"name"}
							disabled={
								!isActionPermitted(
									ACTIONS.UPDATE,
									cadence?.type,
									user?.role,
									user?.user_id === cadence?.user_id
								)
							}
							style={
								!isActionPermitted(
									ACTIONS.UPDATE,
									cadence?.type,
									user?.role,
									user?.user_id === cadence?.user_id
								)
									? { backgroundColor: "#fafafa" }
									: {}
							}
						/>
					</div>
				</div>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.WHEN[user?.language?.toUpperCase()]}
					</Title>
					<div>
						<Select
							width={"407px"}
							value={triggerData}
							name={"trigger"}
							setValue={setTriggerData}
							numberOfOptionsVisible={"6"}
							options={triggerNameOptions}
							// disabled={triggerData?.trigger === "when_a_owner_changes"}
							isSearchable
							placeholder={"Select here"}
							disabled={
								!isActionPermitted(
									ACTIONS.UPDATE,
									cadence?.type,
									user?.role,
									user?.user_id === cadence?.user_id
								)
							}
						/>
					</div>
					{triggerData?.trigger === TRIGGER_NAMES.WHEN_CALL_DURATION_IS_GREATER_THAN && (
						<div className={styles.callDurationSettingsBox}>
							<Input
								value={triggerData?.metadata?.value ?? ""}
								setValue={val =>
									setTriggerData(prev => ({
										...prev,
										metadata: {
											...prev.metadata,
											value: val,
										},
									}))
								}
								type="number"
								theme={InputThemes.WHITE}
								width="60px"
								height="40x"
								placeholder="00"
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
								style={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
										? { backgroundColor: "#fafafa" }
										: {}
								}
							/>
							<Select
								height={"40px"}
								value={triggerData?.metadata?.unit ?? ""}
								setValue={val =>
									setTriggerData(prev => ({
										...prev,
										metadata: {
											...prev.metadata,
											unit: val,
										},
									}))
								}
								className={styles.selectContainer}
								options={CALLDURATION_TRIGGER_OPTIONS()}
								isSearchable
								menuOnTop
								placeholder={"Select seconds/minutes"}
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
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
						actions?.map((ac, index) => {
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
									isDisabled={
										!isActionPermitted(
											ACTIONS.UPDATE,
											cadence?.type,
											user?.role,
											user?.user_id === cadence?.user_id
										)
									}
								/>
							);
						})}
				</div>

				{isActionPermitted(
					ACTIONS.UPDATE,
					cadence?.type,
					user?.role,
					user?.user_id === cadence?.user_id
				) && (
					<div>
						<ThemedButton
							className={styles.actionButton}
							theme={ThemedButtonThemes.GREY}
							onClick={() => addAction()}
							width="fit-content"
						>
							<Plus size="13.3px" />{" "}
							<div> {COMMON_TRANSLATION.ADD_ACTION[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					</div>
				)}
			</div>
		</>
	);
};

export default Trigger;
