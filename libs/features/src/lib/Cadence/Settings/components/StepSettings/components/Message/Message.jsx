import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { MessageContext } from "@cadence-frontend/contexts";
import {
	Checkbox,
	DropDown,
	Editor,
	Input,
	Label,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { CadenceContext } from "../../../../Settings";
import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";
import { Notifications as NOTIFICATIONS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./Message.module.scss";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import {
	CADENCE_NODE_TYPES,
	INTEGRATION_TYPE,
	RINGOVER_REGION_TYPES,
	STEP_NAME_MAP,
	TEMPLATE_TYPES,
} from "@cadence-frontend/constants";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import {
	AutomatedThunderIcon,
	Filter,
	Info,
	MinusGradient,
	Plus,
} from "@cadence-frontend/icons";
import { Colors, compareTwoArrayOfObjects } from "@cadence-frontend/utils";
import { Button, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { ALPHABETS } from "../Mail/constants";
import ErrorModal from "../components/ErrorModal/ErrorModal";
import { useUser } from "@cadence-frontend/data-access";
import { parseEditorValues } from "libs/widgets/src/lib/Editor/constants";
import { characterLimits } from "../../constants";

const Message = ({ node }) => {
	const {
		activeStep,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
	} = useContext(CadenceContext);
	const { id: cadence_id } = useParams();
	const user = useRecoilValue(userInfo);
	const { user: fetchedUser } = useUser({ user: true });

	const queryClient = useQueryClient();
	const { addError, addConfirmMessage, removeConfirmMessage, setStepChangeable } =
		useContext(MessageContext);
	const dataRef = useRef(null);
	const [aBTesting, setABTesting] = useState(
		node?.data?.aBTestEnabled ? node?.data?.aBTestEnabled : false
	);
	const [input, setInput] = useState(
		node?.data?.aBTestEnabled
			? {
					message: node?.data?.templates?.[0]?.message,
			  }
			: {
					message: node?.data?.message,
			  }
	);
	const [isUrgent, setIsUrgent] = useState(node.is_urgent);
	// const [messageNodeType, setMessageNodeType] = useState(node?.type);
	const [template, setTemplate] = useState(null);
	const messageNodeTypeRef = useRef(null);
	const [tcpaPolicyCheck, setTcpaPolicyCheck] = useState(null);
	const tcpaPolicyCheckRef = useRef(null);

	const [templateModal, setTemplateModal] = useState(false);
	const [saveTemplateModal, setSaveTemplateModal] = useState(false);
	const templateRef = useRef(null);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState(0);
	const [percent, setPercent] = useState(
		node?.data?.aBTestEnabled ? node?.data?.templates?.map(item => item.percentage) : [50]
	);
	const [percentage, setPercentage] = useState(
		node?.data?.aBTestEnabled
			? (() => {
					let obj = {};
					node?.data?.templates?.map(
						(item, i) => (obj[`percent${ALPHABETS[i]}`] = item.percentage)
					);
					return obj;
			  })()
			: { percentA: 50 }
	);
	const [percentageError, setPercentageError] = useState(false);

	const { updateNode } = cadenceSettingsDataAccess;
	const [allTemplates, setAllTemplates] = useState(
		node?.data?.aBTestEnabled
			? node?.data?.templates
			: [
					{
						ab_template_id: uuidv4(),
						percentage: 50,
						message: node?.data?.message,
					},
			  ]
	);
	const [distributeEqually, setDistributeEqually] = useState(false);
	const aBRef = useRef(null);
	const [stepChangeableBody, setStepChangeableBody] = useState(true);

	const splitEqual = () => {
		let sum = 0,
			rsum = 0;
		const newPercent = percent;

		newPercent.forEach(p => (sum = sum + p));
		rsum = 100 - sum;
		while (rsum > 0) {
			for (let i = 0; i < newPercent.length; i++) {
				if (rsum > 0) {
					newPercent[i] = newPercent[i] + 1;
					rsum--;
				}
			}
		}
		setAllTemplates(prev =>
			prev.map((item, i) => ({
				...item,
				percentage: newPercent[i],
			}))
		);
		setPercent(newPercent);
		setPercentage(prev => {
			let obj = {};
			Object.values(prev).forEach(
				(item, i) => (obj[`percent${ALPHABETS[i]}`] = newPercent[i])
			);
			return obj;
		});
	};

	const distributeEqual = () => {
		let arr = [];
		let len = allTemplates.length;
		for (let i = 0; i < len; i++) {
			arr.push(Math.floor(100 / len));
		}
		for (let i = 0; i < 100 % len; i++) {
			arr[i] = arr[i] + 1;
		}
		setAllTemplates(prev =>
			prev.map((item, i) => ({
				...item,
				percentage: arr[i],
			}))
		);
		setPercent(prev => prev.map((item, i) => arr[i]));
		setPercentage(prev => {
			let obj = {};
			Object.values(prev).forEach((item, i) => (obj[`percent${ALPHABETS[i]}`] = arr[i]));
			return obj;
		});
	};

	const handleAdd = () => {
		if (allTemplates.length <= 1) {
			setAllTemplates(prev => [
				...prev,
				{
					ab_template_id: uuidv4(),
					message: "",
					percentage: 50,
				},
			]);

			setPercent(prev => [...prev, 50]);
			setPercentage(prev => ({
				...prev,
				[`percent${ALPHABETS[Object.keys(prev).length]}`]: 50,
			}));
		} else if (allTemplates.length <= 3) {
			const len = allTemplates.length;
			setAllTemplates(prev => [
				...prev,
				{
					ab_template_id: uuidv4(),
					message: "",
					percentage: 0,
				},
			]);
			setPercent(prev => [...prev, 0]);
			setPercentage(prev => ({
				...prev,
				[`percent${ALPHABETS[Object.keys(prev).length]}`]: 0,
			}));
			setSelectedMessage(len);
		} else {
			addError({ text: "You can not add more than 4 templates" });
		}
	};

	const handleABTesting = () => {
		if (aBTesting) {
			if (allTemplates.length > 1) {
				// addConfirmMessage("You can have only one template if you want to OFF AB testing");
				setShowErrorModal({
					heading: `Only primary sms will be left`,
					message: `If you turn off A/B test, you will lose all sms except your primary sms (SMS A). Are you sure you want to turn off A/B test?`,
					btnName: `Turn off A/B testing `,
					fun: () => {
						setAllTemplates(prev =>
							prev.filter((_, i) => i === 0).map(item => ({ ...item, percentage: 50 }))
						);
						setSelectedMessage(0);
						setPercent([50]);
						setPercentage({ percentA: 50 });
						setABTesting(false);
					},
				});
				return;
			} else {
				setABTesting(false);
			}
		} else {
			setABTesting(true);
			handleAdd();
		}
	};

	const handleDelete = (e, index) => {
		e.stopPropagation();
		if (allTemplates.length > 2) {
			setAllTemplates(prev => prev.filter((_, i) => i !== index));
			setPercent(prev => prev.filter((_, i) => i !== index));
			setPercentage(prev => {
				let obj = {};
				Object.values(prev).forEach((item, i) => {
					if (i < index) {
						obj[`percent${ALPHABETS[i]}`] = item;
					} else if (i > index) {
						obj[`percent${ALPHABETS[i - 1]}`] = item;
					}
				});
				return obj;
			});

			selectNewMessage(index);
		} else if (allTemplates.length === 2) {
			setShowErrorModal({
				heading: `A/B testing will be turned off`,
				message: `If you remove Message variation ${
					index === 1 ? "B" : "A"
				} A/B testing will be turned off.Are you sure you want to remove Variation ${
					index === 1 ? "B" : "A"
				} ?`,
				btnName: `Remove Message ${index === 1 ? "B" : "A"} `,
				fun: () => {
					const newInputData = {
						message: allTemplates[1 - index].message,
					};
					setInput(newInputData);
					setAllTemplates(prev =>
						prev.filter((_, i) => i !== index).map(item => ({ ...item, percentage: 50 }))
					);
					setPercent([50]);
					setPercentage({ percentA: 50 });

					selectNewMessage(index);
					setABTesting(false);
				},
			});
		} else {
			addError({ text: "You can not delete all templates" });
		}
	};

	const onSave = () => {
		let node_id = node.node_id;
		let body = dataRef.current;
		let templates = templateRef.current;
		let aB = aBRef.current;
		let messageType = messageNodeTypeRef.current;
		let tcpaPolicyCheck = tcpaPolicyCheckRef.current;

		let sum = 0;
		templates.forEach(item => (sum = sum + item.percentage));
		if (aB && sum !== 100) {
			return;
		}
		delete body.percentage;
		// if (!tcpaPolicyCheck)
		// 	return addConfirmMessage({
		// 		msg: "Please check the box to confirm that you have read and agree to the TCPA Policy.",
		// 		fun: () => setTcpaPolicyCheck(true),
		// 		type: "tcpa_check",
		// 	});

		// console.log(node.data.templates, "NodeDataTemplates");
		// console.log(templates, "TemplatesFromSave");
		// console.log(compareTwoArrayOfObjects(node.data.templates, templates), "Boolean haan");
		if (
			aB &&
			(!compareTwoArrayOfObjects(node.data.templates, templates) ||
				node?.data?.tcpa_policy_check !== tcpaPolicyCheck ||
				node?.type !== messageType)
		) {
			let dataToUpdate = {
				node_id,
				body: {
					data: {
						message: "",
						aBTestEnabled: true,
						templates: templates,
						tcpa_policy_check: tcpaPolicyCheck,
					},
					type: messageType,
				},
				dataToStore: {
					data: {
						message: "",
						aBTestEnabled: true,
						templates: templates,
						tcpa_policy_check: tcpaPolicyCheck,
					},
					type: messageType,
				},
				type: messageType,
			};
			updateNode(dataToUpdate, {
				onSuccess: () => {
					console.log("1FromonSave");
				},
				onError: (err, updatedData, context) => {
					setActiveStep(updatedData?.node_id);
					setSaveVisible(true);
					addError({
						text: "Error updating  message, please try again",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
					onSaveRef.current.onclick = () => onSave();
				},
			});
		} else if (
			!aB &&
			(JSON.stringify(body) !==
				JSON.stringify({
					message: node?.data?.message,
				}) ||
				node?.type !== messageType ||
				node?.data?.tcpa_policy_check !== tcpaPolicyCheck)
		) {
			let dataToUpdate = {
				node_id,
				body: {
					data: {
						...body,
						aBTestEnabled: false,
						templates: [],
						tcpa_policy_check: tcpaPolicyCheck,
					},
					type: messageType,
				},
				dataToStore: {
					data: {
						...body,
						aBTestEnabled: false,
						templates: [],
						tcpa_policy_check: tcpaPolicyCheck,
					},
					type: messageType,
				},
				type: messageType,
			};
			updateNode(dataToUpdate, {
				onSuccess: () => {
					console.log("2FromonSave");
				},
				onError: (err, updatedData, context) => {
					setActiveStep(updatedData?.node_id);
					setSaveVisible(true);
					addError({
						text: "Error updating message, please try again",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
					onSaveRef.current.onclick = () => onSave();
				},
			});
		}
	};

	const handleisAutomatic = e => {
		messageNodeTypeRef.current = e.target.checked ? "automated_message" : "message";
		let body = dataRef.current;
		let templates = templateRef.current;
		let tcpaPolicyCheck = tcpaPolicyCheckRef.current;
		let dataToUpdate = {
			node_id: node.node_id,
			body: {
				data: {
					...body,
					aBTestEnabled: aBTesting,
					templates: templates,
					tcpa_policy_check: tcpaPolicyCheck,
				},
				type: messageNodeTypeRef.current,
			},
			dataToStore: {
				data: {
					...body,
					aBTestEnabled: aBTesting,
					templates: templates,
					tcpa_policy_check: tcpaPolicyCheck,
				},
				type: messageNodeTypeRef.current,
			},
			type: messageNodeTypeRef.current,
		};
		updateNode(dataToUpdate, {
			onError: (err, updatedData, context) => {
				addError({
					text: "Error updating message, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			},
		});
	};

	const handleisUrgent = e => {
		let dataToUpdate = {
			node_id: node.node_id,
			body: { is_urgent: e.target.checked },
		};
		setIsUrgent(e.target.checked);
		updateNode(dataToUpdate, {
			onError: (err, updatedData, context) => {
				addError({
					text: "Error updating mesasge, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			},
		});
	};

	useEffect(() => {
		setTcpaPolicyCheck(node?.data?.tcpa_policy_check ?? false);
		setInput(
			node?.data?.aBTestEnabled
				? {
						percentage: node?.data?.templates?.[0]?.percentage,
						message: node?.data?.templates?.[0]?.message,
				  }
				: {
						percentage: 50,
						message: node?.data?.message,
				  }
		);
		setPercentage(
			node?.data?.aBTestEnabled
				? (() => {
						let obj = {};
						node?.data?.templates?.map(
							(item, i) => (obj[`percent${ALPHABETS[i]}`] = item.percentage)
						);
						return obj;
				  })()
				: { percentA: 50 }
		);
		setIsUrgent(node.is_urgent);
		messageNodeTypeRef.current = node?.type;
		setPercent(
			node?.data?.aBTestEnabled
				? node?.data?.templates?.map(item => item.percentage)
				: [50]
		);
		setSelectedMessage(0);
		setAllTemplates(
			node?.data?.aBTestEnabled
				? node?.data?.templates
				: [
						{
							percentage: 50,
							ab_template_id: uuidv4(),
							message: node?.data?.message,
						},
				  ]
		);

		setABTesting(node?.data?.aBTestEnabled ? node?.data?.aBTestEnabled : false);
		setTemplate(null);
		return () => {
			onSave();
			setStepChangeable(true);
			setStepChangeableBody(true);
			removeConfirmMessage("lowPercent");
		};
	}, [node]);

	useEffect(() => {
		if (!stepChangeableBody) {
			return;
		} else if (percentageError) {
			const sum = percent.reduce((total, p) => total + p, 0);
			if (sum < 100) {
				setStepChangeable({
					type: "lowPercent",
					fun: splitEqual,
					errorText:
						"Total % use for sms cannot be less than 100. \nSplit remaining % equally ?",
				});
			} else {
				setStepChangeable({
					type: "highPercent",
					errorText: "Total % cannot be more than 100.",
				});
			}
		} else {
			setStepChangeable(true);
			removeConfirmMessage("lowPercent");
		}
	}, [percentageError, stepChangeableBody]);

	const selectNewMessage = deletedIndex => {
		if (deletedIndex === selectedMessage) {
			setSelectedMessage(0);
		} else if (deletedIndex < selectedMessage) {
			setSelectedMessage(prev => {
				return prev > 0 ? prev - 1 : 0;
			});
		}
	};

	useEffect(() => {
		if (aBTesting) {
			let sum = 0;
			let anyZero = false;
			percent.forEach(p => {
				sum = sum + p;
				if (p === 0) anyZero = true;
			});
			if (sum > 100 && !distributeEqually) {
				if (percentageError !== "greater") {
					removeConfirmMessage("lowPercent");
					addError({ text: "Total % cannot be more than 100." });
				}
				setPercentageError("greater");
			} else if (sum < 100 && !distributeEqually) {
				setPercentageError("lesser");
				const timer = setTimeout(() => {
					addConfirmMessage({
						msg: "Total % use for sms cannot be less than 100. \nSplit remaining % equally ?",
						fun: splitEqual,
						type: "lowPercent",
					});
				}, 4000);
				return () => clearTimeout(timer);
			} else if ((sum !== 100 || anyZero) && distributeEqually) {
				distributeEqual();
			} else {
				setPercentageError(false);
				removeConfirmMessage("lowPercent");
			}
		} else {
			setPercentageError(false);
			removeConfirmMessage();
		}
	}, [percent, aBTesting]);

	useEffect(() => {
		dataRef.current = input;

		if (template) setTemplate(null);

		setAllTemplates(prev =>
			prev.map((item, index) => {
				if (index === selectedMessage) {
					return {
						percentage:
							percentage[`percent${ALPHABETS[index]}`] != null
								? percentage[`percent${ALPHABETS[index]}`] === ""
									? 0
									: percentage[`percent${ALPHABETS[index]}`]
								: 0,
						ab_template_id: item.ab_template_id,
						message: input?.message,
					};
				}
				return item;
			})
		);
	}, [input, percentage]);

	useEffect(() => {
		tcpaPolicyCheckRef.current = tcpaPolicyCheck;
		if (tcpaPolicyCheck !== null && !tcpaPolicyCheck) {
			setStepChangeable(false);
			addConfirmMessage({
				msg: "Please check the box to confirm that you have read and agree to the TCPA Policy.",
				fun: () => setTcpaPolicyCheck(true),
				type: "tcpa_check",
			});
		} else {
			setStepChangeable(true);
			removeConfirmMessage("tcpa_check");
		}
	}, [tcpaPolicyCheck]);

	useEffect(() => {
		setInput({
			message: allTemplates?.[selectedMessage]?.message,
		});
	}, [selectedMessage]);

	useEffect(() => {
		aBRef.current = aBTesting;
	}, [aBTesting]);

	useEffect(() => {
		if (distributeEqually) distributeEqual();
	}, [distributeEqually]);

	useEffect(() => {
		templateRef.current = allTemplates;
	}, [allTemplates]);

	useEffect(() => {
		if (template) {
			setInput({
				message: template?.message,
				et_id: template?.et_id,
			});
		}
	}, [template]);

	useEffect(() => {
		setPercent(prev =>
			prev.map((item, index) => {
				if (index === selectedMessage) {
					return percentage[`percent${ALPHABETS[index]}`] === ""
						? 0
						: percentage[`percent${ALPHABETS[index]}`];
				}
				return item;
			})
		);
	}, [percentage]);

	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<div className={styles.messageType}>
						<h2 className={styles.title}>{STEP_NAME_MAP[messageNodeTypeRef.current]}</h2>
						{messageNodeTypeRef.current === CADENCE_NODE_TYPES.AUTOMATED_MESSAGE && (
							<AutomatedThunderIcon color={Colors.mainPurple} />
						)}
						{isUrgent && <div className={styles.urgentTag}>Urgent</div>}
					</div>
					<div>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() =>
								setTemplateModal({ type: TEMPLATE_TYPES.SMS, messageType: "semi" })
							}
						>
							<div>
								{TEMPLATES_TRANSLATION.IMPORT_TEMPLATE[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
						<div className={styles.toggleBox}>
							<p>Automatic</p>
							<Toggle
								checked={
									messageNodeTypeRef.current === CADENCE_NODE_TYPES.AUTOMATED_MESSAGE
								}
								onChange={handleisAutomatic}
								theme="PURPLE"
							/>
						</div>
						<DropDown
							btn={
								<Button className={styles.filter} btnwidth="1.7rem" btnheight="1.7rem">
									<Filter style={{ cursor: "pointer" }} />
								</Button>
							}
							tooltipText="options"
							top={"35px"}
							right={"0px"}
							customStyles={styles.dropDown}
							width={"200px"}
						>
							<div className={styles.toggleBox}>
								<span>A/B testing</span>
								<Toggle
									checked={aBTesting}
									onChange={() => {
										handleABTesting();
									}}
									theme={"PURPLE"}
								/>
							</div>
							<div className={styles.toggleBox}>
								<span>Urgent</span>
								<Toggle checked={isUrgent} onChange={handleisUrgent} theme="PURPLE" />
							</div>
						</DropDown>
					</div>
				</div>
				{aBTesting && (
					<div className={styles.testing}>
						<div className={styles.addBtnBox}>
							<div className={styles.btnBox}>
								{allTemplates?.map((item, index) => (
									<div>
										<ThemedButton
											width="142px"
											height="52px"
											className={`${selectedMessage === index && styles.selected}`}
											onClick={() => {
												setSelectedMessage(index);
											}}
										>
											<div
												className={styles.messageName}
											>{`SMS ${ALPHABETS[index]}`}</div>
											<div className={styles.percentageBox}>
												<Input
													type={"number"}
													width="52px"
													maxValue={100}
													minValue={0}
													placeholder="00"
													className={`${styles.per} ${
														percentageError === "greater" && styles.percentError
													}`}
													value={percentage}
													setValue={setPercentage}
													name={`percent${ALPHABETS[index]}`}
													disabled={distributeEqually}
												/>
												<div
													className={`${styles.percent} ${
														percentageError === "greater" && styles.percentErrorSign
													}`}
												>
													%
												</div>
											</div>
										</ThemedButton>
										<div onClick={e => handleDelete(e, index)} className={styles.minus}>
											<MinusGradient size="18.8px" />
										</div>
									</div>
								))}
							</div>
							{allTemplates.length < 4 && (
								<div className={styles.addBtn} onClick={() => handleAdd()}>
									<Plus size="0.762rem" color={Colors.veryLightBlue} />
									<div>Add</div>
								</div>
							)}
						</div>
						<div className={styles.toggleBox}>
							<span>Distribute equally</span>
							<Toggle
								checked={distributeEqually}
								onChange={() => setDistributeEqually(prev => !prev)}
								theme={"PURPLE"}
							/>
						</div>
					</div>
				)}
				<div className={`${styles.inputBox} ${styles.textareaBox}`}>
					<Label>
						{NOTIFICATIONS_TRANSLATION.MESSAGE[user?.language?.toUpperCase()]}
					</Label>
					<Editor
						theme="message"
						value={input.message}
						setValue={message => setInput(prev => ({ ...prev, message }))}
						height="max(100vh - 300px, 410px)"
						showCRMCustomVars
					/>
				</div>
				<div className={styles.wordLimit}>
					<p>
						<span
							className={
								parseEditorValues(input.message)?.length > characterLimits(node?.type)
									? styles.red
									: ""
							}
						>
							{parseEditorValues(input.message)?.length}
						</span>{" "}
						/ <span>{characterLimits(node?.type)}</span>{" "}
					</p>
					<Tooltip text={"Character count includes html"} theme={"RIGHT"}>
						<Info size={"15px"} />
					</Tooltip>
				</div>
				<div className={styles.buttons}>
					<span className={styles.error}>
						{input.message?.length > characterLimits(node?.type) &&
							`Message cannot be more than ${characterLimits(node?.type)} characters`}
					</span>
					<div className={styles.tcpaCheck}>
						{fetchedUser?.Ringover_Token?.region === RINGOVER_REGION_TYPES.US && (
							<>
								<Checkbox
									className={styles.checkBox}
									checked={tcpaPolicyCheck}
									onClick={() => {
										setTcpaPolicyCheck(prev => !prev);
									}}
								/>
								<div className={styles.tcpa}>
									I have captured the recepient's consent to receive my SMS, according to
									TCPA regulation. <span>*</span>
								</div>
							</>
						)}
					</div>
					<ThemedButton
						width="fit-content"
						onClick={() =>
							setSaveTemplateModal({
								body: { message: input.message },
								type: "sms",
							})
						}
						theme={ThemedButtonThemes.GREY}
						disabled={input.message?.length > characterLimits(node?.type)}
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
				<ErrorModal
					modal={showErrorModal}
					onClose={() => {
						setShowErrorModal(false);
					}}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default Message;
