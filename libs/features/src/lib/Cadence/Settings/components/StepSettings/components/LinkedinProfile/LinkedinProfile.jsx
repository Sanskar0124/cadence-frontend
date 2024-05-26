import { Editor, Input, Label, ThemedButton, Toggle } from "@cadence-frontend/widgets";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { CadenceContext } from "../../../../Settings";
import styles from "./LinkedinProfile.module.scss";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { ErrorBoundary } from "@cadence-frontend/components";
import * as DOMPurify from "dompurify";

const LinkedinProfile = ({ node }) => {
	const {
		activeStep,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
	} = useContext(CadenceContext);
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const { addError } = useContext(MessageContext);
	const dataRef = useRef(null);
	const isUrgentRef = useRef(null);
	const [message, setMessage] = useState(node.data.message);
	const [isUrgent, setIsUrgent] = useState(node.is_urgent);
	const { updateNode } = cadenceSettingsDataAccess;
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		setMessage(node.data.message);
		setIsUrgent(node.is_urgent);
		return () => onSave();
	}, [node]);

	const onSave = () => {
		if (
			JSON.stringify({ message: dataRef.current }) ===
			JSON.stringify({ message: node.data.message })
		)
			return;
		let data = {
			node_id: node.node_id,
			body: {
				data: {
					message: DOMPurify.sanitize(dataRef.current),
				},
			},
		};

		updateNode(data, {
			onError: (err, updatedData, context) => {
				setActiveStep(updateNode?.node_id);
				setSaveVisible(true);
				addError({
					text: "Error updating Linkedin view profile, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
				onSaveRef.current.onclick = () => onSave();
			},
			onSuccess,
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
					text: "Error updating Linkedin view profile, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
			},
		});
	};

	useEffect(() => {
		dataRef.current = message;
	}, [message]);

	return (
		<div>
			<ErrorBoundary>
				<div className={styles.header}>
					<h2 className={styles.title}>Linkedin</h2>
					<div>
						<div className={styles.toggleBox}>
							<p>{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}</p>
							<Toggle checked={isUrgent} onChange={handleisUrgent} theme="PURPLE" />
						</div>
					</div>
				</div>

				<div className={styles.inputBox}>
					<Label>{CADENCE_TRANSLATION.VIEW_PROFILE[user?.language?.toUpperCase()]}</Label>
					<Editor
						value={message}
						setValue={setMessage}
						height="max(100vh - 240px, 470px)"
						theme="no_attachments"
						showCRMCustomVars
					/>
				</div>
			</ErrorBoundary>
		</div>
	);
};

export default LinkedinProfile;
