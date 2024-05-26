/* eslint-disable react/jsx-no-useless-fragment */
import {
	ArrowLeft,
	Close,
	Plus,
	TimerGradient,
	Trash,
	TrashGradient,
} from "@cadence-frontend/icons";
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { Button, DeleteModal, Div, ErrorBoundary } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import StepSetup from "./components/StepSetup/StepSetup";
import StepName from "./components/StepName/StepName";
import WaitTime from "./components/WaitTime/WaitTime";
import {
	ADD_STEP_TYPES,
	STEP_DATA,
	STEP_ICONS,
	STEP_NAME_MAP,
	PHONE_INTEGRATIONS,
	INTEGRATION_TYPE,
	MAIL_INTEGRATION_TYPES,
} from "@cadence-frontend/constants";
import { CadenceContext } from "../../Settings";
import styles from "./Steps.module.scss";
import Urgent from "./components/Urgent/Urgent";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import {
	ADD_LINKEDIN_STEP_TYPES,
	ELONGATED_STEP_NAME_MAP,
	STEP_ICONS_GRADIENT,
	CADENCE_NODE_TYPES,
	EMAIL_SCOPE_TYPES,
} from "@cadence-frontend/constants";
import { capitalize, Colors } from "@cadence-frontend/utils";

const Steps = () => {
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const { addError, addConfirmMessage, stepChangeable } = useContext(MessageContext);
	const { activeStep, setActiveStep, cadenceSettingsDataAccess } =
		useContext(CadenceContext);

	//states
	const [isAdd, setIsAdd] = useState(false);
	const [names, setNames] = useState({});
	const [waitTime, setWaitTime] = useState({});
	const [urgent, setUrgent] = useState({});
	const [loading, setLoading] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const user = useRecoilValue(userInfo);

	const {
		cadence,
		addNode,
		updateNode,
		deleteNode,
		updateLoading,
		cadenceLoading,
		deleteLoading,
		addLoading,
	} = cadenceSettingsDataAccess;

	const checkLinkedin = type => type === "linkedin";

	// useEffect(() => {
	// 	if (cadence && cadence?.sequence.length > 0) {
	// 		!updateLoading &&
	// 			(stepChangeable === true
	// 				? true
	// 				: (() => {
	// 						if (stepChangeable.type === "unsubscribeError") {
	// 							addConfirmMessage({
	// 								msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
	// 									user?.language?.toUpperCase()
	// 								],
	// 								fun: stepChangeable.fun,
	// 								type: stepChangeable.type,
	// 							});
	// 						} else if (stepChangeable.type === "lowPercent") {
	// 							addConfirmMessage({
	// 								msg: stepChangeable.errorText,
	// 								fun: stepChangeable.fun,
	// 								type: stepChangeable.type,
	// 							});
	// 						} else if (stepChangeable.type === "highPercent") {
	// 							addError(stepChangeable.errorText);
	// 						} else if (stepChangeable.type === "replyMailError") {
	// 							addConfirmMessage({
	// 								type: stepChangeable.type,
	// 								msg: "Please, select mail step",
	// 							});
	// 						}
	// 						return false;
	// 				  })()) &&
	// 			setActiveStep(cadence?.sequence[0]?.node_id);
	// 	}
	// }, [cadence]);

	const addStep = (step, nodeIndex = null) => {
		setLoading(nodeIndex);
		if (deleteLoading || updateLoading) return;
		let stepToAdd = {
			previous_node_id: cadence?.sequence[nodeIndex]?.node_id ?? null,
			node: {
				name: STEP_NAME_MAP[step],
				type: step,
				data: STEP_DATA[step],
				wait_time: 1440,
				cadence_id,
			},
		};
		addNode(
			{ stepToAdd, nodeIndex },
			{
				onError: (err, _, context) => {
					addError({ text: "Error while adding step" });
					queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
				},
				onSuccess: data => {
					queryClient.setQueryData(["cadence", cadence_id], prev => {
						let newArr = [...prev.sequence];
						newArr.splice(nodeIndex + 1, 0, data.data);
						return {
							...prev,
							sequence: newArr,
						};
					});

					setActiveStep(data?.data?.node_id);
				},
			}
		);
		setIsAdd(false);
	};

	const deleteStep = node_id => {
		if (deleteLoading || updateLoading) return;
		deleteNode(node_id, {
			onError: (err, _, context) => {
				addError({
					text: err?.response?.data?.msg ?? "Error while deleting step",
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			},
		});
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			cadence?.sequence?.forEach(step => {
				if (
					waitTime[step.node_id] !== null &&
					waitTime[step.node_id] !== undefined &&
					waitTime[step.node_id] !== step.wait_time
				) {
					updateNode({
						node_id: step.node_id,
						body: { wait_time: waitTime[step.node_id] },
					});
				}
			});
		}, 200);

		return () => clearTimeout(timer);
	}, [waitTime]);

	// useEffect(() => {
	// 	const timer = setTimeout(() => {
	// 		cadence?.sequence?.forEach(step => {
	// 			if (names[step.node_id] && names[step.node_id] !== step.name) {
	// 				updateNode({
	// 					node_id: step.node_id,
	// 					body: { name: names[step.node_id] },
	// 				});
	// 			}
	// 		});
	// 	}, 1000);

	// 	return () => clearTimeout(timer);
	// }, [names]);

	useEffect(() => {
		cadence?.sequence?.forEach(step => {
			if (urgent[step.node_id] !== undefined && urgent[step.node_id] !== step.is_urgent) {
				updateNode({
					node_id: step.node_id,
					body: { is_urgent: urgent[step.node_id] },
				});
			}
		});
	}, [urgent]);

	//remove delete cadence if it is the last step and length is
	useEffect(() => {
		if (
			cadence?.sequence?.length === 1 &&
			cadence?.sequence[cadence?.sequence.length - 1]?.type === "end"
		) {
			deleteStep(cadence?.sequence[cadence?.sequence.length - 1]?.node_id);
		}
	}, [cadence?.sequence]);

	return (
		<ErrorBoundary>
			<div className={styles.steps}>
				{cadenceLoading ? (
					[...Array(3).keys()].map(d => (
						<div className={styles.placeholder}>
							<Div loading />
							<Div loading />
						</div>
					))
				) : cadence?.sequence?.length === 0 ? (
					<StepSetup addStep={addStep} checkLinkedin={checkLinkedin} />
				) : (
					<>
						<AddStepButton
							loading={loading}
							addLoading={addLoading}
							isAdd={isAdd}
							setIsAdd={setIsAdd}
							steps={cadence?.sequence}
							index={cadence?.sequence?.length > 0 ? -1 : null}
							checkLinkedin={checkLinkedin}
							addStep={addStep}
							theme="beforeFirst"
							disabled={cadence?.sequence?.length < 1}
							onClick={() => {
								(stepChangeable === true
									? true
									: (() => {
											if (stepChangeable.type === "unsubscribeError") {
												addConfirmMessage({
													msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
														user?.language?.toUpperCase()
													],
													fun: stepChangeable.fun,
													type: stepChangeable.type,
												});
											} else if (stepChangeable.type === "replyMailError") {
												addConfirmMessage({
													type: stepChangeable.type,
													msg: "Please, select mail step",
												});
											}
											return false;
									  })()) && setIsAdd(-1);
							}}
						/>
						{cadence?.sequence?.map((step, index) => (
							<>
								{index !== 0 && (
									<div className={styles.waitTime}>
										<TimerGradient />
										<span>
											{CADENCE_TRANSLATION.WAIT_FOR[user?.language?.toUpperCase()]}
										</span>
										<WaitTime
											key={step.node_id}
											mins={step.wait_time}
											name={step.node_id}
											setValue={setWaitTime}
										/>
									</div>
								)}
								<div
									key={step.node_id}
									onClick={() =>
										!updateLoading &&
										(stepChangeable === true
											? true
											: (() => {
													if (stepChangeable.type === "unsubscribeError") {
														addConfirmMessage({
															msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
																user?.language?.toUpperCase()
															],
															fun: stepChangeable.fun,
															type: stepChangeable.type,
														});
													} else if (stepChangeable.type === "lowPercent") {
														addConfirmMessage({
															msg: stepChangeable.errorText,
															fun: stepChangeable.fun,
															type: stepChangeable.type,
														});
													} else if (stepChangeable.type === "highPercent") {
														addError({ text: stepChangeable.errorText });
													} else if (stepChangeable.type === "replyMailError") {
														addConfirmMessage({
															type: stepChangeable.type,
															msg: "Please, select mail step",
														});
													}
													return false;
											  })()) &&
										setActiveStep(step?.node_id)
									}
									className={`${styles.step} ${
										activeStep === step.node_id && step?.type === "end"
											? styles.activeEnd
											: activeStep === step.node_id
											? styles.active
											: ""
									}`}
								>
									<div className={styles.header}>
										<div>
											{activeStep === step.node_id
												? STEP_ICONS[step.type]
												: STEP_ICONS_GRADIENT[step.type]}

											<span>{`${capitalize(
												COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]
											)} ${index + 1} : ${capitalize(
												ELONGATED_STEP_NAME_MAP[step.type][user?.language?.toUpperCase()]
											)}`}</span>
										</div>
										<div>
											{step.type !== "end" && (
												<Urgent
													setValue={setUrgent}
													activeStep={activeStep}
													step={step}
												/>
											)}
											<Button
												btnwidth="fit-content"
												onClick={e => {
													e.stopPropagation();

													if (stepChangeable?.type === "unsubscribeError") {
														(stepChangeable === true
															? true
															: (() => {
																	if (stepChangeable.type === "unsubscribeError") {
																		addConfirmMessage({
																			msg: COMMON_TRANSLATION
																				?.UNSUBSCRIBE_LINK_MANDATORY?.[
																				user?.language?.toUpperCase()
																			],
																			fun: stepChangeable.fun,
																			type: stepChangeable.type,
																		});
																	} else if (stepChangeable.type === "replyMailError") {
																		addConfirmMessage({
																			type: stepChangeable.type,
																			msg: "Please, select mail step",
																		});
																	}
																	return false;
															  })()) && setIsAdd(-1);
													} else {
														if (activeStep === step.node_id) setActiveStep(false);
														setDeleteModal({
															node_id: step.node_id,
															// name: step.name,
															name: ELONGATED_STEP_NAME_MAP[step.type][
																user?.language?.toUpperCase()
															],
														});
													}
												}}
											>
												{activeStep === step.node_id ? (
													<Trash color={Colors.white} />
												) : (
													<TrashGradient />
												)}
											</Button>
										</div>
									</div>
									{step?.type !== "end" && (
										<div className={styles.input}>
											<StepName
												step={step}
												cadence={cadence}
												// name={step.node_id}
												// setValue={setNames}
												// disabled={
												// 	step.type === "end" || activeStep.node_id !== step.node_id
												// }
											/>
										</div>
									)}
								</div>
								{index !== cadence?.sequence?.length - 1 && (
									<AddStepButton
										loading={loading}
										addLoading={addLoading}
										isAdd={isAdd}
										setIsAdd={setIsAdd}
										steps={cadence?.sequence}
										index={index}
										checkLinkedin={checkLinkedin}
										addStep={addStep}
										theme="middle"
										onClick={() => {
											(stepChangeable === true
												? true
												: (() => {
														if (stepChangeable.type === "unsubscribeError") {
															addConfirmMessage({
																msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
																	user?.language?.toUpperCase()
																],
																fun: stepChangeable.fun,
																type: stepChangeable.type,
															});
														} else if (stepChangeable.type === "replyMailError") {
															addConfirmMessage({
																type: stepChangeable.type,
																msg: "Please, select mail step",
															});
														}
														return false;
												  })()) && setIsAdd(index);
										}}
									/>
								)}
							</>
						))}
						{!cadence?.sequence?.find(node => node.type === "end") && (
							<AddStepButton
								loading={loading}
								addLoading={addLoading}
								isAdd={isAdd}
								setIsAdd={setIsAdd}
								steps={cadence?.sequence}
								index={cadence?.sequence?.length - 1}
								checkLinkedin={checkLinkedin}
								addStep={addStep}
								theme={"last"}
								onClick={() => {
									(stepChangeable === true
										? true
										: (() => {
												if (stepChangeable.type === "unsubscribeError") {
													addConfirmMessage({
														msg: COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[
															user?.language?.toUpperCase()
														],
														fun: stepChangeable.fun,
														type: stepChangeable.type,
													});
												} else if (stepChangeable.type === "replyMailError") {
													addConfirmMessage({
														type: stepChangeable.type,
														msg: "Please, select mail step",
													});
												}
												return false;
										  })()) && setIsAdd(cadence?.sequence?.length - 1);
								}}
							/>
						)}
					</>
				)}
				<DeleteModal
					modal={deleteModal}
					setModal={setDeleteModal}
					itemType="step"
					item={deleteModal.name}
					onDelete={() => deleteStep(deleteModal.node_id)}
				/>
			</div>
		</ErrorBoundary>
	);
};

export default Steps;

const AddStepButton = ({
	loading,
	addLoading,
	isAdd,
	setIsAdd,
	steps,
	index,
	checkLinkedin,
	addStep,
	theme,
	onClick,
	disabled = false,
}) => {
	const user = useRecoilValue(userInfo);
	const [isLinkedin, setIsLinkedin] = useState(false);

	const checkEndCadenceStep = (stepToAdd, node_index) => {
		if (stepToAdd !== "end") return true;
		if (steps.length < 1) return false;
		if (steps.find(node => node.type === "end") !== undefined) return false;
		if (node_index !== steps.length - 1) return false;
		return true;
	};

	const callAndSmsSteps = ["call", "callback", "message", "automated_message"];
	const isCallAndSmsDisabled = step =>
		user?.phone_system === PHONE_INTEGRATIONS.NONE && callAndSmsSteps.includes(step);
	const isPhoneSystemRingover = user?.phone_system === PHONE_INTEGRATIONS.RINGOVER;

	return (
		<div className={styles.addStep}>
			{loading === index && addLoading && (
				<>
					<div className={styles.stepPlaceholder}>
						{index !== -1 && <Div loading />}
						<Div loading />
					</div>
				</>
			)}
			<Button
				btnwidth=""
				onClick={
					isLinkedin
						? () => setIsLinkedin(false)
						: isAdd === index
						? () => setIsAdd(false)
						: onClick
				}
				className={`${styles.addStepBtn} ${styles[theme]} ${
					isAdd === index ? styles.active : ""
				}`}
				disabled={disabled}
			>
				<span>
					{isAdd === index ? (
						<>{isLinkedin ? <ArrowLeft /> : <Close />}</>
					) : (
						<>
							<i>
								<Plus />
							</i>
							<span>
								{steps?.length > 0
									? CADENCE_TRANSLATION?.ADD_STEP?.[user?.language?.toUpperCase()]
									: CADENCE_TRANSLATION?.ADD_FIRST_STEP?.[user?.language?.toUpperCase()]}
							</span>
						</>
					)}
				</span>
			</Button>
			{isAdd === index && (
				<div className={styles.stepToAddBtns}>
					{isLinkedin ? (
						<>
							{ADD_LINKEDIN_STEP_TYPES.map(step => (
								<Button
									btnwidth="30px"
									tooltip={STEP_NAME_MAP[step]}
									key={step}
									onClick={() => addStep(step, index)}
								>
									{STEP_ICONS[step]}
								</Button>
							))}
						</>
					) : (
						<>
							{ADD_STEP_TYPES.map(step => {
								if (isCallAndSmsDisabled(step)) return "";
								if (!isPhoneSystemRingover && step === CADENCE_NODE_TYPES.CALLBACK)
									return "";
								if (
									user?.integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS &&
									step === CADENCE_NODE_TYPES.END
								)
									return "";
								return (
									<>
										{!(step === CADENCE_NODE_TYPES.REPLY_TO && isAdd === -1) &&
											checkEndCadenceStep(step, index) && (
												<Button
													btnwidth="30px"
													tooltip={
														user?.mail_integration_type ===
															MAIL_INTEGRATION_TYPES.GOOGLE &&
														step === CADENCE_NODE_TYPES.REPLY_TO &&
														user?.email_scope_level === EMAIL_SCOPE_TYPES.STANDARD
															? "Only allowed in advanced scopes"
															: STEP_NAME_MAP[step]
													}
													key={step}
													onClick={
														checkLinkedin(step)
															? () => setIsLinkedin(true)
															: () => {
																	addStep(step, index);
															  }
													}
													disabled={
														(step === CADENCE_NODE_TYPES.REPLY_TO &&
															!steps?.some(
																step =>
																	step.type === CADENCE_NODE_TYPES.MAIL ||
																	step.type === CADENCE_NODE_TYPES.AUTOMATED_MAIL
															)) ||
														(user?.mail_integration_type ===
															MAIL_INTEGRATION_TYPES.GOOGLE &&
															step === CADENCE_NODE_TYPES.REPLY_TO &&
															user?.email_scope_level === EMAIL_SCOPE_TYPES.STANDARD)
													}
												>
													{STEP_ICONS[step]}
												</Button>
											)}
									</>
								);
							})}
						</>
					)}
				</div>
			)}
		</div>
	);
};
