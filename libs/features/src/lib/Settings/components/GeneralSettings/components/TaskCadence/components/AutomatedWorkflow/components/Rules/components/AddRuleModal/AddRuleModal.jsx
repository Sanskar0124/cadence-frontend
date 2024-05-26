import { Modal } from "@cadence-frontend/components";
import React, { useEffect, useState, useContext } from "react";
import styles from "./AddRuleModal.module.scss";
import { Title, Div } from "@cadence-frontend/components";
import { v4 as uuidv4 } from "uuid";

import { Input, Select, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { PlusOutline, TriangleDown } from "@cadence-frontend/icons";
import { triggerOptions, THEN } from "../constants";

import { Colors } from "@cadence-frontend/utils";

import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import {
	useAdvanceWorkflow,
	useCadenceSettings,
	useSettings,
} from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import Queries from "./components/Queries/Queries";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useQueryClient } from "react-query";

const AddRuleModal = ({ onClose, isModal }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const queryClient = useQueryClient();
	const KEY = "advance-workflow";
	const {
		updateWorkflow,
		updateWorkflowLoading,
		createWorkflow,
		createWorkflowLoading,
		fetchOptions,
		fetchOptionsLoading,
	} = useAdvanceWorkflow();

	const user = useRecoilValue(userInfo);
	const { cadenceDropdown } = useCadenceSettings(
		{ cadenceDropdown: isModal?.update ? true : false },
		isModal?.workflow?.actions?.[0]?.cadence_id
	);

	const [body, setBody] = useState(
		isModal?.update
			? {
					rule_name: isModal?.workflow?.rule_name,
					trigger: isModal?.workflow?.trigger,
					actions: isModal?.workflow?.actions,
					is_enabled: isModal?.workflow?.is_enabled ?? false,
			  }
			: {
					rule_name: "",
					trigger: "",
					actions: [
						{
							type: "",
							cadence_id: "",
						},
						{
							type: "",
							status: "",
						},
					],
					is_enabled: false,
			  }
	);

	const [thenOption, setThenOption] = useState("add_to_cadence");
	const [isCadenceSelect, setIsCadenceSelect] = useState(false);
	const [cadenceId, setCadenceId] = useState(
		isModal?.update ? isModal?.workflow?.actions[0]?.cadence_id : ""
	);

	// My Local States for component rendring
	const [filter, setFilter] = useState(
		isModal?.update
			? isModal?.workflow?.filter
			: {
					id: uuidv4(),
					operation: "condition",
					condition: {
						integration_field: "",
						integration_label: "",
						integration_data_type: "",
						model_type: "",
						equator: "",
						value: "",
					},
			  }
	);
	const [options, setOptions] = useState([]);
	// Select then options
	useEffect(() => {
		if (thenOption) {
			setBody({
				...body,
				actions: [
					{
						type: thenOption,
						cadence_id: cadenceId.id + "",
					},
					{
						type: "update_status",
						status: "unkown",
					},
				],
			});
		}
	}, [cadenceId]);

	// When you close whole modal, the cadence select component wouild be downs
	useEffect(() => {
		if (!isModal) {
			setIsCadenceSelect(false);
		} else {
			setBody(
				isModal?.update
					? {
							rule_name: isModal?.workflow?.duplicate
								? isModal?.workflow?.rule_name + " (copy)"
								: isModal?.workflow?.rule_name,
							trigger: isModal?.workflow?.trigger,
							actions: isModal?.workflow?.actions,
							is_enabled: isModal?.workflow?.is_enabled ?? false,
					  }
					: {
							rule_name: "",
							trigger: "",
							actions: [
								{
									type: "",
									cadence_id: "",
								},
								{
									type: "",
									status: "",
								},
							],
							is_enabled: false,
					  }
			);
		}
	}, [isModal]);
	useEffect(() => {
		if (cadenceDropdown && isModal) {
			setCadenceId(
				isModal?.update
					? {
							id: cadenceDropdown?.filter(
								item =>
									item?.cadence_id === parseInt(isModal?.workflow?.actions[0]?.cadence_id)
							)?.[0]?.cadence_id,
							name: cadenceDropdown?.filter(
								item =>
									item?.cadence_id === parseInt(isModal?.workflow?.actions[0]?.cadence_id)
							)?.[0]?.name,
					  }
					: ""
			);
		}
	}, [cadenceDropdown, isModal]);
	useEffect(() => {
		if (options) {
			setFilter(
				isModal?.update
					? isModal?.workflow?.filter
					: {
							id: uuidv4(),
							operation: "condition",
							condition: {
								integration_field: "",
								integration_label: "",
								integration_data_type: "",
								model_type: "",
								equator: "",
								value: "",
							},
					  }
			);
		}
	}, [options]);
	useEffect(() => {
		body.trigger &&
			fetchOptions(
				{ trigger: body.trigger },
				{
					onSuccess: data => {
						setOptions(data);
					},
					onError: err => {
						return addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				}
			);
	}, [body.trigger]);
	const webhookValidation = workflow => {
		if (workflow.rule_name === "" || workflow.rule_name.trim() === "") {
			addError({ text: "Please enter rule name." });
			return false;
		}

		if (workflow.trigger === "") {
			addError({ text: "Please select trigger." });
			return false;
		}
		if (isError(filter)) {
			addError({ text: "None of the fields can be empty" });
			return false;
		}

		if (thenOption === "") {
			addError({ text: "Please select your action." });
			return false;
		}
		if (!cadenceId) {
			addError({ text: "Please select cadence." });
			return false;
		}
		return true;
	};

	const ruleHandler = () => {
		// First make sure that your entered data is compatible to response data
		// First operation will condition
		const { rule_name, actions, trigger, is_enabled } = body;

		if (!webhookValidation(body)) {
			return;
		}

		const obj = {
			rule_name: rule_name,
			trigger: trigger,
			actions: actions,
			is_enabled: is_enabled,
			filter: filter,
		};

		isModal?.workflow?.duplicate
			? createWorkflow(
					{ ...obj, is_enabled: true },
					{
						onSuccess: () => {
							addSuccess("Successfully created workflow.");
							handleClose();
						},
						onError: error => {
							addError({
								text: error?.response?.data?.msg,
								desc: error?.response?.data?.error,
								cId: error?.response?.data?.correlationId,
							});
						},
					}
			  )
			: isModal?.update
			? updateWorkflow(
					{ id: isModal?.workflow?.aw_id, body: obj },
					{
						onSuccess: () => {
							addSuccess("Successfully updated workflow.");
							handleClose();
						},
						onError: error => {
							addError({
								text: error?.response?.data?.msg,
								desc: error?.response?.data?.error,
								cId: error?.response?.data?.correlationId,
							});
						},
					}
			  )
			: createWorkflow(
					{ ...obj, is_enabled: true },
					{
						onSuccess: workflow => {
							addSuccess("Successfully created workflow.");
							handleClose();
						},
						onError: error => {
							addError({
								text: error?.response?.data?.msg,
								desc: error?.response?.data?.error,
								cId: error?.response?.data?.correlationId,
							});
						},
					}
			  );
	};
	const handleClose = () => {
		onClose();
		setBody({
			rule_name: "",
			trigger: "",
			actions: [
				{
					type: "",
					cadence_id: "",
				},
				{
					type: "",
					status: "",
				},
			],
		});
		setFilter({
			id: uuidv4(),
			operation: "condition",
			condition: {
				integration_field: "",
				integration_label: "",
				integration_data_type: "",
				model_type: "",
				equator: "",
				value: "",
			},
		});
		setCadenceId("");
	};
	const isError = node => {
		let extraNode = { ...node };
		return extraNode?.operation === "condition"
			? extraNode?.condition?.type === "" ||
			  extraNode?.condition?.equator === "" ||
			  extraNode?.condition?.value === ""
				? true
				: false
			: extraNode.children.some(item => isError(item))
			? true
			: false;
	};
	const onChangingOperation = (id, operation, node) => {
		let extraNode = { ...node };
		return extraNode?.id === id
			? { ...extraNode, operation }
			: extraNode.children
			? {
					...extraNode,
					children: extraNode.children.map(item =>
						onChangingOperation(id, operation, item)
					),
			  }
			: extraNode;
	};
	const onChangingCondition = (id, condition, node) => {
		let extraNode = { ...node };
		return extraNode?.id === id
			? { ...extraNode, condition: { ...extraNode.condition, ...condition } }
			: extraNode.children
			? {
					...extraNode,
					children: extraNode.children.map(item =>
						onChangingCondition(id, condition, item)
					),
			  }
			: extraNode;
	};
	const onDeletingNode = (parentId, id, node) => {
		let extraNode = { ...node };
		return extraNode?.id === parentId
			? extraNode.children.length === 2
				? extraNode.children.find(child => child.id !== id)
				: {
						...extraNode,
						children: extraNode.children.filter(child => child.id !== id),
				  }
			: extraNode.children
			? {
					...extraNode,
					children: extraNode.children.map(item => onDeletingNode(parentId, id, item)),
			  }
			: extraNode;
	};
	const onAddingNode = (id, node) => {
		let newNode = {
			id: uuidv4(),
			operation: "condition",
			condition: {
				integration_field: "",
				integration_label: "",
				integration_data_type: "",
				model_type: "",
				equator: "",
				value: "",
			},
		};
		let extraNode = { ...node };
		return extraNode?.id === id
			? extraNode.children
				? {
						...extraNode,
						children: [...extraNode.children, newNode],
				  }
				: {
						id: uuidv4(),
						operation: "and",
						children: [extraNode, newNode],
				  }
			: extraNode.children
			? { ...extraNode, children: extraNode.children.map(item => onAddingNode(id, item)) }
			: extraNode;
	};
	return (
		<Modal
			showCloseButton={true}
			disableOutsideClick={true}
			isModal={isModal}
			onClose={() => handleClose()}
			className={styles.addModal}
		>
			<div className={styles.header}>
				<Title className={styles.title} size="1.2rem">
					{isModal?.workflow?.duplicate
						? `${SETTINGS_TRANSLATION.NEW_WORKFLOW[user?.language.toUpperCase()]}`
						: isModal?.update
						? COMMON_TRANSLATION.WORKFLOW[user?.language.toUpperCase()]
						: SETTINGS_TRANSLATION.NEW_WORKFLOW[user?.language.toUpperCase()]}
				</Title>
			</div>

			<div className={styles.inputGroup}>
				<div className={styles.inptuGroupOneTwo}>
					<div className={styles.inputGroupOne}>
						<Title className={styles.title} size="1rem">
							{SETTINGS_TRANSLATION.WORKFLOW_NAME[user?.language.toUpperCase()]}
						</Title>
						<Input
							type={"text"}
							placeholder={
								SETTINGS_TRANSLATION.GIVE_RULE_NAME[user?.language.toUpperCase()]
							}
							className={styles.ruleName}
							value={body.rule_name}
							setValue={val => setBody({ ...body, rule_name: val })}
						/>
					</div>

					<div className={styles.inputGroupTwo}>
						<Title className={styles.title} size="1rem">
							{COMMON_TRANSLATION.WHEN[user?.language.toUpperCase()]}
						</Title>
						<Select
							options={triggerOptions(user?.integration_type)}
							setValue={val => {
								body.trigger !== val &&
									setFilter({
										id: uuidv4(),
										operation: "condition",
										condition: {
											integration_field: "",
											integration_label: "",
											integration_data_type: "",
											model_type: "",
											equator: "",
											value: "",
										},
									});
								setBody({ ...body, trigger: val });
							}}
							value={body.trigger}
						/>

						{body.trigger && (
							<Div className={styles.conditionGroup} loading={fetchOptionsLoading}>
								<Title className={styles.title} size=".95rem">
									{SETTINGS_TRANSLATION.IF_CONDITIONS[user?.language.toUpperCase()]}
								</Title>
								{/*--- Main Component----*/}
								<Queries
									originalFilter={filter}
									setFilter={setFilter}
									options={options}
									body={body}
									onAddingNode={onAddingNode}
									onDeletingNode={onDeletingNode}
									onChangingCondition={onChangingCondition}
									onChangingOperation={onChangingOperation}
								/>
								{!filter.children && (
									<div className={styles.nodeBtnWrapper}>
										<ThemedButton
											style={{ width: "fit-content" }}
											theme={ThemedButtonThemes.GREY}
											className={styles.btn}
											onClick={() => setFilter(onAddingNode(filter.id, filter))}
										>
											<PlusOutline />{" "}
											{SETTINGS_TRANSLATION.ADD_NODE[user?.language.toUpperCase()]}
										</ThemedButton>
									</div>
								)}
							</Div>
						)}
					</div>
				</div>

				<div className={styles.inputGroupThree}>
					<Title className={styles.title} size="1rem">
						{COMMON_TRANSLATION.THEN[user?.language.toUpperCase()]}
					</Title>
					<Select
						placeholder={
							SETTINGS_TRANSLATION.SELECT_YOUR_ACTIONS[user?.language.toUpperCase()]
						}
						disabled
						options={THEN}
						setValue={val => setThenOption(val)}
						value={thenOption}
					/>

					{thenOption === "add_to_cadence" ? (
						<div className={styles.selectCadenceGroup}>
							<Title className={styles.title} size="1rem">
								{CADENCE_TRANSLATION.SELECT_CADENCE[user?.language.toUpperCase()]}
							</Title>

							<div
								className={styles.selectCadenceWrapper}
								onClick={e => {
									setIsCadenceSelect(prev => !prev);
								}}
							>
								<p>
									{cadenceId?.name ??
										`${CADENCE_TRANSLATION.SELECT_CADENCE[user?.language.toUpperCase()]}`}
								</p>
								<span>
									<TriangleDown
										color={Colors.lightBlue}
										className={
											isCadenceSelect ? `${styles.arrowUp}` : `${styles.arrowDown}`
										}
									/>
								</span>
							</div>

							{isCadenceSelect && (
								<SelectCadence
									isOpen={isCadenceSelect}
									setCadenceSelected={setCadenceId}
									cadenceSelected={cadenceId}
									user={user}
									setIsCadenceSelect={setIsCadenceSelect}
								/>
							)}
						</div>
					) : (
						""
					)}
				</div>
			</div>

			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => ruleHandler()}
					loading={createWorkflowLoading || updateWorkflowLoading}
				>
					{isModal?.workflow?.duplicate
						? SETTINGS_TRANSLATION.ADD_NEW_RULE[user?.language.toUpperCase()]
						: isModal?.update
						? SETTINGS_TRANSLATION.UPDATE_RULE[user?.language.toUpperCase()]
						: SETTINGS_TRANSLATION.ADD_NEW_RULE[user?.language.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default AddRuleModal;
