import React, { useEffect, useRef, useState, useContext } from "react";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { CadenceContext } from "../../../../../Settings";
import { AttachmentToFile, checkIfFilesChanged } from "@cadence-frontend/utils";
import { Editor, Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import styles from "../AutoMail.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "@cadence-frontend/components";

const Inputs = ({ active, node, setNode }) => {
	const { activeStep, setSaveVisible, cadenceSettingsDataAccess, onSaveRef, onSuccess } =
		useContext(CadenceContext);
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const { addError } = useContext(MessageContext);
	const dataRef = useRef({});
	const filesRef = useRef([]);
	const [input, setInput] = useState({ subject: "", body: "" });
	const [files, setFiles] = useState([]);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		let data = node.find(n => n.id === active);
		setInput({ subject: data.subject, body: data.body });
		setFiles(data.attachments.map(att => (att.name ? att : AttachmentToFile(att))));
	}, [active]);

	const { updateNode, uploadAttachments } = cadenceSettingsDataAccess;

	useEffect(() => {
		return () => onSave();
	}, [active]);

	const onSave = () => {
		let node_id = activeStep;
		let body = dataRef.current;
		let fileToUpload = filesRef.current;
		let nodeData = node.find(n => n.id === active);

		if (
			checkIfFilesChanged(
				nodeData.attachments.map(att => AttachmentToFile(att)),
				fileToUpload
			)
		) {
			if (fileToUpload.length > 0) {
				const formData = new FormData();
				for (let i = 0; i < fileToUpload.length; i++) {
					formData.append(`attachments`, fileToUpload[i]);
				}
				uploadAttachments(formData, {
					onSuccess: data => {
						body.attachments = data.data.map(att => att.attachment_id);
						let dataToUpdate = node.map(mail => {
							if (mail.id === active) return { ...mail, ...body };
							return {
								...mail,
								attachments: mail.attachments.map(att => att.attachment_id),
							};
						});
						let dataToStore = node.map(mail => {
							if (mail.id === active) return { ...mail, ...body, attachments: data.data };
							return mail;
						});
						setNode(dataToStore);
						updateNode(
							{
								node_id,
								body: { data: dataToUpdate },
								dataToStore: { data: dataToStore },
								type: "automated_mail",
							},
							{
								onError: (err, updatedData, context) => {
									// setActiveStep({ ...node, data: updatedData.body.data });
									setSaveVisible(true);
									addError({
										text: "Error updating step, please try again",
										desc: err?.response?.data?.error ?? "Please contact support",
										cId: err?.response?.data?.correlationId,
									});
									queryClient.setQueryData(
										["cadence", cadence_id],
										context.previousCadence
									);
									onSaveRef.current.onclick = () => onSave();
								},
								onSuccess,
							}
						);
					},
				});
			} else {
				body.attachments = [];
				let dataToUpdate = node.map(mail => {
					if (mail.id === active) return { ...mail, ...body };
					return {
						...mail,
						attachments: mail.attachments.map(att => att.attachment_id),
					};
				});
				let dataToStore = node.map(mail => {
					if (mail.id === active) return { ...mail, ...body };
					return mail;
				});
				setNode(dataToUpdate);
				updateNode(
					{
						node_id,
						body: { data: dataToUpdate },
						dataToStore: { data: dataToStore },
						type: "automated_mail",
					},
					{
						onError: (err, updatedData, context) => {
							// setActiveStep({ ...node, data: updatedData.body.data });
							setSaveVisible(true);
							addError({
								text: "Error updating step, please try again",
								desc: err?.response?.data?.error ?? "Please contact support",
								cId: err?.response?.data?.correlationId,
							});
							queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
							onSaveRef.current.onclick = () => onSave();
						},
						onSuccess,
					}
				);
			}
		} else {
			if (
				JSON.stringify(body) ===
				JSON.stringify({ subject: nodeData.subject, body: nodeData.body })
			)
				return;
			body.attachments = nodeData.attachments.map(att => att.attachment_id);
			let dataToUpdate = node.map(mail => {
				if (mail.id === active) return { ...mail, ...body };
				return {
					...mail,
					attachments: mail.attachments.map(att => att.attachment_id),
				};
			});
			let dataToStore = node.map(mail => {
				if (mail.id === active)
					return { ...mail, ...body, attachments: nodeData.attachments };
				return mail;
			});
			setNode(dataToStore);
			updateNode(
				{
					node_id,
					body: { data: dataToUpdate },
					dataToStore: { data: dataToStore },
					type: "automated_mail",
				},
				{
					onError: (err, updatedData, context) => {
						// setActiveStep({ ...node, data: updatedData.body.data });
						setSaveVisible(true);
						addError({
							text: "Error updating step, please try again",
							desc: err?.response?.data?.error ?? "Please contact support",
							cId: err?.response?.data?.correlationId,
						});
						queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
						onSaveRef.current.onclick = () => onSave();
					},
					onSuccess,
				}
			);
		}
	};
	useEffect(() => {
		dataRef.current = input;
		filesRef.current = files;
	}, [input, files]);

	return (
		<ErrorBoundary>
			<>
				<div className={styles.inputBox}>
					<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
					<Input
						name="subject"
						value={input}
						setValue={setInput}
						theme={InputThemes.WHITE}
						className={styles.editor}
					/>
				</div>
				<div className={styles.inputBox}>
					<Label>{COMMON_TRANSLATION.BODY[user?.language?.toUpperCase()]}</Label>
					<Editor
						value={input.body}
						setValue={value => setInput(prev => ({ ...prev, body: value }))}
						className={styles.editor}
						files={files}
						setFiles={setFiles}
						height="320px"
					/>
				</div>
				<div className={styles.buttons}>
					{/* <ThemedButton theme={ThemedButtonThemes.GREY}>Send test mail</ThemedButton> */}
					{/* <ThemedButton theme={ThemedButtonThemes.GREY}>Save as template</ThemedButton> */}
				</div>
			</>
		</ErrorBoundary>
	);
};

export default Inputs;
