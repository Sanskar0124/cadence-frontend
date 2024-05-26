import React, { useEffect, useRef, useState, useContext } from "react";
import { Trash } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Button, ErrorBoundary } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { CadenceContext } from "../../../../Settings";
import styles from "./AutoMail.module.scss";
import Inputs from "./Inputs/Inputs";

import ImportTemplate from "../ImportTemplateModal/ImportTemplate";
import { TEMPLATE_TYPES } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

const AutoMail = () => {
	const {
		activeStep: node,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
	} = useContext(CadenceContext);
	const [mails, setMails] = useState(node.data);
	const [active, setActive] = useState(null);
	const [template, setTemplate] = useState(null);
	const [templateModal, setTemplateModal] = useState(false);
	const [templateAdded, setTemplateAdded] = useState(false);
	const user = useRecoilValue(userInfo);

	const { updateNode } = cadenceSettingsDataAccess;

	useEffect(() => {
		setMails(node.data);
		setActive(null);
	}, [node]);

	const onDelete = id => {
		if (active === id) setActive(null);
		let dataToUpdate = mails.filter(m => m.id !== id);
		setMails(prev => prev.filter(m => m.id !== id));
		updateNode(
			{ node_id: node.node_id, body: { data: dataToUpdate } },
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
	};

	useEffect(() => {
		if (template) {
			let newMails = template.map(mail => ({
				id: Math.floor(Math.random() * 100 + 1),
				name: mail.name,
				subject: mail.subject,
				body: mail.body,
				attachments: mail.Attachments,
			}));
			setMails(prev => [...prev, ...newMails]);
			setTemplateAdded(true);
		}
	}, [template]);

	useEffect(() => {
		if (templateAdded) {
			onSave();
			setTemplateAdded(false);
		}
	}, [templateAdded]);

	const onSave = () => {
		let dataToUpdate = mails.map(mail => {
			return { ...mail, attachments: mail.attachments.map(att => att.attachment_id) };
		});
		updateNode(
			{
				node_id: node.node_id,
				body: { data: dataToUpdate },
				dataToStore: { data: mails },
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
	};

	return (
		<ErrorBoundary>
			<div className={styles.autoMail}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						{COMMON_TRANSLATION.AUTOMATED_MAIL[user?.language?.toUpperCase()]}
					</h2>
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
				</div>
				<div className={styles.tabs}>
					{mails.map(mail => (
						<div
							onClick={() => setActive(mail.id)}
							key={mail.id}
							className={active === mail.id ? styles.active : ""}
						>
							{mail.name}
							<Button
								btnwidth="fit-content"
								onClick={e => {
									e.stopPropagation();
									onDelete(mail.id);
								}}
							>
								<Trash size="1rem" />
							</Button>
						</div>
					))}
				</div>
				{active && <Inputs active={active} node={mails} setNode={setMails} />}
				{templateModal && (
					<ImportTemplate
						modal={templateModal}
						setModal={setTemplateModal}
						setTemplate={setTemplate}
					/>
				)}
			</div>
		</ErrorBoundary>
	);
};

export default AutoMail;
