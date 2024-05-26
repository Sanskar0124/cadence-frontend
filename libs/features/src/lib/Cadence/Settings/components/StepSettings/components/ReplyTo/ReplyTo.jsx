/* eslint-disable no-console */
import { v4 as uuidv4 } from "uuid";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Editor,
	Label,
	Select,
	ThemedButton,
	Toggle,
	Input,
	DropDown,
} from "@cadence-frontend/widgets";
import { Button, ErrorBoundary } from "@cadence-frontend/components";
import React, { useEffect, useRef, useState, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { CadenceContext } from "../../../../Settings";
import {
	AttachmentToFile,
	clearAttachments,
	Colors,
	insertAttachments,
	checkIfFilesChanged,
	checkUnSubscribeIsPresent,
	addUnSubscribeVariable,
	addUnSubscribeVariableAll,
	compareTwoArrayOfObjects,
} from "@cadence-frontend/utils";
import ErrorModal from "../components/ErrorModal/ErrorModal";

import SaveTemplateModal from "../SaveTemplateModal/SaveTemplateModal";
import SendTestMailModal from "../../../../../../Templates/components/SendTestMailModal/SendTestMailModal";
import {
	MinusGradient,
	MinusOutline,
	Plus,
	Filter,
	AutomatedThunderIcon,
	Minimize,
	Maximize,
	Union as StarPen,
	Union,
} from "@cadence-frontend/icons";
import { ALPHABETS } from "./constants";
import styles from "./ReplyTo.module.scss";
import {
	INTEGRATION_TYPE,
	RINGOVER_COMPANIES_ID,
	STEP_NAME_MAP,
	TEMPLATE_TYPES,
	HOSTNAMES,
} from "@cadence-frontend/constants";
import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import * as DOMPurify from "dompurify";
import AiGenerationModal from "../AiGenerationModal/AiGenerationModal";

const ReplyTo = ({ node }) => {
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
	const queryClient = useQueryClient();
	const { addError, addConfirmMessage, removeConfirmMessage, setStepChangeable } =
		useContext(MessageContext);
	const dataRef = useRef(null);
	const filesRef = useRef(null);
	const templateRef = useRef(null);
	const aBRef = useRef(null);
	const mailNodeTypeRef = useRef(null);

	const [distributeEqually, setDistributeEqually] = useState(false);
	const [isUrgent, setIsUrgent] = useState(node.is_urgent);
	// const [mailNodeType, setMailNodeType] = useState(node?.type);
	const [allTemplates, setAllTemplates] = useState(
		node?.data?.aBTestEnabled
			? node?.data?.templates
			: [
					{
						ab_template_id: uuidv4(),
						attachments: node?.data?.attachments,
						body: node?.data?.body,
						percentage: 50,
						subject: node?.data?.subject,
					},
			  ]
	);
	const [input, setInput] = useState(
		node?.data?.aBTestEnabled
			? {
					replied_node_id: node?.data?.replied_node_id,
					subject: node?.data?.subject,
					body: node?.data?.templates?.[0]?.body,
			  }
			: {
					replied_node_id: node.data.replied_node_id,
					subject: node?.data?.subject,
					body: node?.data?.body,
			  }
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
	const [percent, setPercent] = useState(
		node?.data?.aBTestEnabled ? node?.data?.templates?.map(item => item.percentage) : [50]
	);
	const [body, setBody] = useState(
		node?.data?.aBTestEnabled
			? node?.data?.templates?.map(item => item.body)
			: [node?.data?.body]
	);
	const [stepChangeableBody, setStepChangeableBody] = useState(true);
	const [percentageError, setPercentageError] = useState(false);
	const [files, setFiles] = useState(
		node?.data?.aBTestEnabled
			? node?.data?.templates?.[0]?.attachments
			: node?.data?.attachments
	);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [saveTemplateModal, setSaveTemplateModal] = useState(false);
	const [testMailModal, setTestMailModal] = useState(false);
	const [aBTesting, setABTesting] = useState(
		node?.data.aBTestEnabled ? node?.data?.aBTestEnabled : false
	);
	const [temp, setTemp] = useState(0);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [deletedIndex, setDeletedIndex] = useState(null);
	const [selectedMail, setSelectedMail] = useState(0);
	const [currentMailOptions, setCurrentMailOptions] = useState([]);
	const [expandBody, setExpandBody] = useState(false);

	// AI Generation Mail
	const [isAiGenerated, setIsAiGenerated] = useState(null);

	const { cadence, updateNode, uploadAttachments, companySettings } =
		cadenceSettingsDataAccess;

	//sideeffects

	useEffect(() => {
		node?.data?.aBTestEnabled
			? node?.data?.templates?.[0]?.attachments?.forEach(file => insertAttachments(file))
			: node?.data?.attachments?.forEach(file => insertAttachments(file));
		let repliedNodeSubject;
		let repliedNode = cadence?.sequence?.find(
			step => step.node_id === input.replied_node_id
		);

		setInput(
			node?.data?.aBTestEnabled
				? {
						replied_node_id: node?.data?.replied_node_id,
						subject: `Re : ${repliedNodeSubject}`,
						body: node?.data?.templates?.[0]?.body,
				  }
				: {
						replied_node_id: node?.data?.replied_node_id,
						subject: `Re : ${repliedNodeSubject}`,
						body: node?.data?.body,
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
		mailNodeTypeRef.current = node?.type;
		setFiles(
			node?.data?.aBTestEnabled
				? node?.data?.templates?.[0]?.attachments
				: node?.data?.attachments
		);
		setCurrentMailOptions(
			cadence?.sequence
				?.slice(0, cadence?.sequence.indexOf(node))
				?.map((c, i) => {
					if (c.type === "mail" || c.type === "automated_mail") {
						return {
							label: `Step ${i + 1}. ${c.name} ${
								!c?.data?.aBTestEnabled ? `(${c?.data?.subject})` : ``
							}`,
							value: c.node_id,
						};
					}
					return null;
				})
				.filter(c => c)
		);
		setPercent(
			node?.data?.aBTestEnabled
				? node?.data?.templates?.map(item => item.percentage)
				: [50]
		);
		setSelectedMail(0);
		setAllTemplates(
			node?.data?.aBTestEnabled
				? node?.data?.templates
				: [
						{
							percentage: 50,
							body: node?.data?.body,
							attachments: node?.data?.attachments,
							ab_template_id: uuidv4(),
						},
				  ]
		);
		// setBody(prev => {
		// 	return node?.data?.aBTestEnabled
		// 		? node?.data?.templates?.map(item => item.body)
		// 		: prev[0] !== ""
		// 		? prev
		// 		: [node?.data?.body];
		// });
		setBody(
			node?.data?.aBTestEnabled
				? node?.data?.templates?.map(item => item.body)
				: [node?.data?.body]
		);
		setABTesting(node?.data?.aBTestEnabled ? node?.data?.aBTestEnabled : false);
		// if (
		// 	companySettings?.unsubscribe_link_madatory_for_semi_automated_mails &&
		// 	!checkUnSubscribeIsPresent(
		// 		node?.data?.aBTestEnabled ? node?.data?.templates?.[0]?.body : node.data.body
		// 	)
		// ) {
		// 	addUnSubscribeVariable(setInput, companySettings.default_unsubscribe_link_text);
		// }
		setTemplate(null);
		return () => {
			onSave();
			clearAttachments();
			setStepChangeable(true);
			setStepChangeableBody(true);
			removeConfirmMessage("unsubscribeError");
			removeConfirmMessage("lowPercent");
		};
	}, [node]);

	useEffect(() => {
		if (!stepChangeableBody) {
			setStepChangeable({
				type: "unsubscribeError",
				fun: () =>
					addUnSubscribeVariableAll(setAllTemplates, setInput, setBody, companySettings),
				errorText:
					COMMON_TRANSLATION?.UNSUBSCRIBE_LINK_MANDATORY?.[user?.language?.toUpperCase()],
			});
		} else if (!input?.replied_node_id) {
			setStepChangeable({
				type: "replyMailError",
				errorText: "Please, select mail step",
			});
		} else if (percentageError) {
			const sum = percent.reduce((total, p) => total + p, 0);
			if (sum < 100) {
				setStepChangeable({
					type: "lowPercent",
					fun: splitEqual,
					errorText:
						"Total % use for mails cannot be less than 100. \nSplit remaining % equally ?",
				});
			} else {
				setStepChangeable({
					type: "highPercent",
					errorText: "Total % cannot be more than 100.",
				});
			}
		} else if (files?.some(item => item?.loading === true)) {
			setStepChangeable(false);
		} else {
			setStepChangeable(true);
			removeConfirmMessage("unsubscribeError");
			removeConfirmMessage("lowPercent");
		}
	}, [percentageError, stepChangeableBody, files, input]);
	const checkBody = () => {
		for (let i = 0; i < body.length; i++) {
			if (
				companySettings?.unsubscribe_link_madatory_for_semi_automated_mails &&
				!checkUnSubscribeIsPresent(body[i])
			) {
				return false;
			}
		}
		return true;
	};
	const splitEqual = () => {
		let sum = 0,
			rsum = 0;
		percent.forEach(p => (sum = sum + p));
		rsum = 100 - sum;
		if (rsum > 0) {
			let arr = [];
			let len = allTemplates.length;
			for (let i = 0; i < len; i++) {
				arr.push(Math.floor(rsum / len));
			}
			for (let i = 0; i < rsum % len; i++) {
				arr[i] = arr[i] + 1;
			}
			setAllTemplates(prev =>
				prev.map((item, i) => ({
					...item,
					percentage: item.percentage + arr[i],
				}))
			);
			setPercent(prev => prev.map((item, i) => item + arr[i]));
			setPercentage(prev => {
				let obj = {};
				Object.values(prev).forEach(
					(item, i) => (obj[`percent${ALPHABETS[i]}`] = item + arr[i])
				);
				return obj;
			});
		}
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
	useEffect(() => {
		if (checkBody() === false) {
			setStepChangeableBody(false);
		} else {
			setStepChangeableBody(true);
		}
	}, [body]);
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
						msg: "Total % use for mails cannot be less than 100. \nSplit remaining % equally ?",
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
		let subject;
		let repliedNode = cadence?.sequence?.find(
			step => step.node_id === input.replied_node_id
		);
		subject = repliedNode?.data?.aBTestEnabled
			? `Re: ${` `}`
			: `Re: ${repliedNode?.data?.subject}`;
		setInput(prev => ({ ...prev, subject }));
	}, [input.replied_node_id]);

	useEffect(() => {
		dataRef.current = input;
		filesRef.current = files;

		if (template) setTemplate(null);

		setAllTemplates(prev =>
			prev.map((item, index) => {
				if (index === selectedMail) {
					return {
						percentage:
							percentage[`percent${ALPHABETS[index]}`] != null
								? percentage[`percent${ALPHABETS[index]}`] === ""
									? 0
									: percentage[`percent${ALPHABETS[index]}`]
								: 0,
						body: input?.body,
						attachments: files,
						ab_template_id: item.ab_template_id,
					};
				}
				return item;
			})
		);
	}, [input, files, percentage]);
	useEffect(() => {
		setInput(prev => ({
			...prev,
			body: allTemplates?.[selectedMail]?.body,
		}));
		clearAttachments();
		setFiles(allTemplates?.[selectedMail]?.attachments);
		allTemplates?.[selectedMail]?.attachments?.forEach(file => insertAttachments(file));
	}, [selectedMail, temp]);
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
			setInput(prev => ({
				...prev,
				body: template.body,
				et_id: template?.et_id,
			}));
			setFiles(template?.Attachments);
		}
	}, [template]);

	//functions
	useEffect(() => {
		setPercent(prev =>
			prev.map((item, index) => {
				if (index === selectedMail) {
					return percentage[`percent${ALPHABETS[index]}`] === ""
						? 0
						: percentage[`percent${ALPHABETS[index]}`];
				}
				return item;
			})
		);
	}, [percentage]);
	useEffect(() => {
		setBody(prev =>
			prev.map((item, index) => {
				if (index === selectedMail) {
					return input.body;
				}
				return item;
			})
		);
	}, [input.body]);
	const handleAdd = () => {
		if (allTemplates.length <= 1) {
			setAllTemplates(prev => [
				...prev,
				{
					percentage: 50,
					body: "",
					attachments: [],
					ab_template_id: uuidv4(),
				},
			]);

			setPercent(prev => [...prev, 50]);
			setPercentage(prev => ({
				...prev,
				[`percent${ALPHABETS[Object.keys(prev).length]}`]: 50,
			}));
			setBody(prev => [...prev, ""]);
			setDeletedIndex(null);
		} else if (allTemplates.length <= 3) {
			const len = allTemplates.length;
			setAllTemplates(prev => [
				...prev,
				{
					percentage: 0,
					body: "",
					attachments: [],
					ab_template_id: uuidv4(),
				},
			]);

			setPercent(prev => [...prev, 0]);
			setPercentage(prev => ({
				...prev,
				[`percent${ALPHABETS[Object.keys(prev).length]}`]: 0,
			}));
			setBody(prev => [...prev, ""]);

			setSelectedMail(len);
			setDeletedIndex(null);
		} else {
			addError({ text: "You can not add more than 4 templates" });
		}
	};
	const handleABTesting = () => {
		if (aBTesting) {
			if (allTemplates.length > 1) {
				// addConfirmMessage("You can have only one template if you want to OFF AB testing");
				setShowErrorModal({
					heading: `Only primary email will be left`,
					message: `If you turn off A/B test, you will lose all emails except your primary email (Mail A). Are you sure you want to turn off A/B test?`,
					btnName: `Turn off A/B testing `,
					fun: () => {
						setAllTemplates(prev =>
							prev.filter((_, i) => i === 0).map(item => ({ ...item, percentage: 50 }))
						);
						setSelectedMail(0);
						setPercent([50]);
						setPercentage({ percentA: 50 });
						setBody(prev => prev.filter((_, i) => i === 0));
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
			setBody(prev => prev.filter((_, i) => i !== index));
			setDeletedIndex(index);
		} else if (allTemplates.length === 2) {
			setShowErrorModal({
				heading: `A/B testing will be turned off`,
				message: `If you remove Mail variation ${
					index === 1 ? "B" : "A"
				} A/B testing will be turned off.Are you sure you want to remove Variation ${
					index === 1 ? "B" : "A"
				} ?`,
				btnName: `Remove Mail ${index === 1 ? "B" : "A"} `,
				fun: () => {
					const newInputData = {
						replied_node_id: input?.replied_node_id,
						subject: allTemplates[1 - index].subject,
						body: allTemplates[1 - index].body,
					};
					setInput(newInputData);
					setAllTemplates(prev =>
						prev.filter((_, i) => i !== index).map(item => ({ ...item, percentage: 50 }))
					);
					setPercent([50]);
					setPercentage({ percentA: 50 });
					setBody(prev => prev.filter((_, i) => i !== index));
					setDeletedIndex(index);
				},
			});
		} else {
			addError({ text: "You can not delete all templates" });
		}
	};
	// useEffect(() => {
	// 	if (aBTesting) {
	// 		const timer = setTimeout(() => {
	// 			let sum = 0;
	// 			allTemplates.forEach(item => (sum = sum + item.percentage));
	// 			if (sum !== 100) {
	// 				setShowError("Percentage of all mails should add to 100");
	// 			}
	// 		}, 2000);

	// 		return () => clearTimeout(timer);
	// 	}
	// }, [input.percentage]);
	useEffect(() => {
		if (aBTesting && deletedIndex != null) {
			if (deletedIndex === selectedMail) {
				setSelectedMail(0);
				setTemp(prev => prev + 1);
				// setSelectedMail(0);
			} else if (deletedIndex < selectedMail) {
				setSelectedMail(prev => {
					return prev > 0 ? prev - 1 : 0;
				});
			}
			if (allTemplates.length === 1) {
				setABTesting(false);
			}
			setDeletedIndex(null);
		}
	}, [allTemplates.length, deletedIndex]);

	const onSave = () => {
		let node_id = node.node_id;
		let body = { ...dataRef.current, body: DOMPurify.sanitize(dataRef.current.body) };
		let templates = templateRef.current;
		let aB = aBRef.current;
		let mailType = mailNodeTypeRef.current;
		let fileToUpload = filesRef?.current;

		// let attachmentsToStore = filesRef.current;
		// let attachmentIds = fileIdsRef.current.map(file => file.id);
		let copyTemplates = templates?.map(template => {
			let attachments = template?.attachments?.map(attachment => {
				let copyAttachment = structuredClone(attachment);
				if (copyAttachment?.deletable) delete copyAttachment.deletable;
				return copyAttachment;
			});
			return {
				...template,
				attachments,
			};
		});
		let sum = 0;
		templates.forEach(item => (sum = sum + item.percentage));
		if (aB && sum !== 100) {
			return;
		}
		let subject = body.subject;
		delete body.subject;
		if (
			aB &&
			(!compareTwoArrayOfObjects(node.data.templates, templates) ||
				node?.data?.replied_node_id !== body?.replied_node_id ||
				node?.type !== mailType)
		) {
			let dataToUpdate = {
				node_id,
				body: {
					data: {
						replied_node_id: body?.replied_node_id,
						subject: body?.subject,
						body: "",
						attachments: [],
						aBTestEnabled: true,
						templates: copyTemplates,
					},
					type: mailType,
				},
				dataToStore: {
					data: {
						replied_node_id: body?.replied_node_id,
						subject: body?.subject,
						body: "",
						attachments: [],
						aBTestEnabled: true,
						templates: copyTemplates,
					},
					type: mailType,
				},
				type: mailType,
			};
			updateNode(dataToUpdate, {
				onError: (err, updatedData, context) => {
					setActiveStep(updatedData?.node_id);
					setSaveVisible(true);
					addError({
						text: "Error updating Reply to mail, please try again",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
					onSaveRef.current.onclick = () => onSave();
				},
			});
		} else if (
			!aB &&
			(!compareTwoArrayOfObjects(
				[body],
				[
					{
						body: node.data.body,
						replied_node_id: node.data.replied_node_id,
					},
				]
			) ||
				!(
					fileToUpload.length === node.data?.attachments.length &&
					fileToUpload?.every(item =>
						node?.data?.attachments?.some(i => i?.attachment_id === item?.attachment_id)
					)
				) ||
				node?.type !== mailType)
		) {
			let dataToUpdate = {
				node_id,
				body: {
					data: {
						...body,
						subject,
						attachments: fileToUpload?.map(file => file?.attachment_id) ?? [],
						aBTestEnabled: false,
						templates: [],
					},
					type: mailType,
				},
				dataToStore: {
					data: {
						...body,
						subject,
						attachments: fileToUpload?.map(file => file?.attachment_id) ?? [],
						aBTestEnabled: false,
						templates: [],
					},
					type: mailType,
				},
				type: mailType,
			};
			updateNode(dataToUpdate, {
				onError: (err, updatedData, context) => {
					setActiveStep(updatedData?.node_id);
					setSaveVisible(true);
					addError({
						text: "Error updating Reply to mail, please try again",
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
		mailNodeTypeRef.current = e.target.checked ? "automated_reply_to" : "reply_to";
		let body = dataRef.current;
		let templates = templateRef.current;
		let fileToUpload = filesRef.current;
		let dataToUpdate = {
			node_id: node.node_id,
			body: {
				data: {
					...body,
					attachments: fileToUpload?.map(file => file.attachment_id),
					aBTestEnabled: aBTesting,
					templates: templates,
				},
				type: mailNodeTypeRef.current,
			},
			dataToStore: {
				data: {
					...body,
					attachments: fileToUpload?.map(file => file.attachment_id),
					aBTestEnabled: aBTesting,
					templates: templates,
				},
				type: mailNodeTypeRef.current,
			},
			type: mailNodeTypeRef.current,
		};
		updateNode(dataToUpdate, {
			onError: (err, updatedData, context) => {
				addError({
					text: "Error updating Reply to mail, please try again",
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
			// onError: (err, updatedData, context) => {
			// 	addError("Error updating Reply to, please try again");
			// 	queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			// },
		});
	};

	// const renderAiGeneratedBtn = () => {
	// 	if (HOSTNAMES.includes(window.location.hostname)) {
	// 		return (
	// 			<ThemedButton
	// 				width="fit-content"
	// 				theme={ThemedButtonThemes.TRANSPARENT}
	// 				onClick={() => {
	// 					setIsAiGenerated({ input, setInput, nodeType: node.type });
	// 				}}
	// 			>
	// 				<StarPen />
	// 				<div>{TEMPLATES_TRANSLATION.AI_GENERATION[user?.language?.toUpperCase()]}</div>
	// 			</ThemedButton>
	// 		);
	// 	} else {
	// 		return RINGOVER_COMPANIES_ID?.includes(user?.company_id) ? (
	// 			<ThemedButton
	// 				width="fit-content"
	// 				theme={ThemedButtonThemes.TRANSPARENT}
	// 				onClick={() => {
	// 					setIsAiGenerated({ input, setInput, nodeType: node.type });
	// 				}}
	// 			>
	// 				<StarPen />
	// 				<div>{TEMPLATES_TRANSLATION.AI_GENERATION[user?.language?.toUpperCase()]}</div>
	// 			</ThemedButton>
	// 		) : null;
	// 	}
	// };

	const renderAiGeneratedBtn = () =>
		HOSTNAMES?.includes(window.location.hostname)
			? true
			: RINGOVER_COMPANIES_ID?.includes(user?.company_id);
	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<div className={styles.mailType}>
						<h2 className={styles.title}>{STEP_NAME_MAP[mailNodeTypeRef.current]}</h2>
						{mailNodeTypeRef.current === "automated_reply_to" && (
							<AutomatedThunderIcon color={Colors.mainPurple} />
						)}
						{isUrgent && <div className={styles.urgentTag}>Urgent</div>}
					</div>

					<div>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() =>
								setTemplateModal({ type: TEMPLATE_TYPES.EMAIL, mailType: "semi" })
							}
						>
							<div>
								{TEMPLATES_TRANSLATION.IMPORT_TEMPLATE[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
						{renderAiGeneratedBtn() && (
							<ThemedButton
								width="fit-content"
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={() => {
									setIsAiGenerated({ input, setInput, nodeType: node.type });
								}}
								style={{ gap: "5px" }}
							>
								<StarPen color={"#5ea5e9"} />
								<div>
									{TEMPLATES_TRANSLATION.AI_GENERATION[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						)}

						<div className={`${styles.toggleBox}`}>
							<p>Automatic</p>
							<Toggle
								checked={mailNodeTypeRef.current === "automated_reply_to"}
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
				{!expandBody && (
					<>
						{aBTesting && (
							<div className={styles.testing}>
								<div className={styles.addBtnBox}>
									<div className={styles.btnBox}>
										{allTemplates?.map((item, index) => (
											<div>
												<ThemedButton
													width="142px"
													height="52px"
													className={`${selectedMail === index && styles.selected}`}
													onClick={() => {
														if (files?.some(item => item.loading === true))
															return addError({ text: "Wait until file is uploaded" });
														setSelectedMail(index);
													}}
												>
													<div
														className={styles.mailName}
													>{`Mail ${ALPHABETS[index]}`}</div>
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
												<div
													onClick={e => handleDelete(e, index)}
													className={styles.minus}
												>
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
						<div className={styles.inputBox}>
							<Label>
								{CADENCE_TRANSLATION.SELECT_MAIL_STEP?.[user?.language?.toUpperCase()]}
							</Label>
							<Select
								value={input}
								setValue={setInput}
								options={currentMailOptions}
								name="replied_node_id"
								placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
							/>
						</div>
					</>
				)}
				<div className={styles.inputBox}>
					<div className={styles.bodyLabel}>
						<Label>{COMMON_TRANSLATION.BODY[user?.language?.toUpperCase()]} </Label>
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() => setExpandBody(prev => !prev)}
							width="fit-content"
						>
							{expandBody ? (
								<>
									Collapse <Minimize color={Colors.darkBlue} />
								</>
							) : (
								<>
									Expand <Maximize color={Colors.darkBlue} />
								</>
							)}
						</ThemedButton>
					</div>
					<Editor
						files={files}
						setFiles={setFiles}
						value={input.body}
						setValue={body => setInput(prev => ({ ...prev, body }))}
						className={styles.editor}
						height={
							expandBody ? "max(100vh - 225px, 320px)" : "max(100vh - 400px, 320px)"
						}
						theme="email"
						showCRMCustomVars
					/>
				</div>
				<div className={styles.buttons}>
					<ThemedButton
						width="fit-content"
						onClick={() => setTestMailModal({ ...input, Attachments: files })}
						theme={ThemedButtonThemes.GREY}
						className={styles.sendMailBtn}
					>
						<div>
							{TEMPLATES_TRANSLATION.SEND_TEST_MAIL[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
					<ThemedButton
						width="fit-content"
						onClick={() =>
							setSaveTemplateModal({
								body: { ...input, attachments: files },
								type: "email",
							})
						}
						theme={ThemedButtonThemes.GREY}
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
						setFiles={setFiles}
						setTemplate={setTemplate}
					/>
				)}
				<SendTestMailModal
					modal={testMailModal}
					setModal={setTestMailModal}
					cadence_id={cadence_id}
				/>
				<ErrorModal
					modal={showErrorModal}
					onClose={() => {
						setShowErrorModal(false);
					}}
				/>

				<AiGenerationModal modal={isAiGenerated} setModal={setIsAiGenerated} />
			</ErrorBoundary>
		</div>
	);
};

export default ReplyTo;
