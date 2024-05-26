import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MessageContext } from "@cadence-frontend/contexts";
import { Modal, Skeleton } from "@cadence-frontend/components";
import { Checkbox, Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { getDuplicateType, getTextByRole, cleanRequestBody } from "./utils";

import styles from "./DuplicateCadenceModal.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { CADENCE_TYPES } from "@cadence-frontend/constants";

const DuplicateCadenceModal = ({ modal, setModal, dataAccess }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const {
		duplicateCadence,
		duplicateCadenceLoading,
		getWorkflowsCountLoading,
		getWorkflowsCount,
		workflowsCount,
	} = dataAccess;
	const [input, setInput] = useState({ description: "" });

	useEffect(() => {
		if (modal) {
			setInput({
				...modal,
				name: `${modal.name} (copy)`,
				is_workflow: false,
			});
			getWorkflowsCount(modal.cadence_id);
		}
	}, [modal]);

	const handleClose = () => {
		setModal(null);
	};

	const handleSubmit = () => {
		if (!input.name.trim()) return addError({ text: "Missing required Fields" });
		// if (!input.description?.trim()) return addError("Missing required Fields");

		if (input.description?.trim() && input.description?.trim().length > 100) {
			return addError({ text: "Please Enter description below 100 characters." });
		}

		const body = {
			...input,
			type: getDuplicateType(input, user),
			description: input.description?.trim(),
			user_id: user.user_id,
			sd_id:
				getDuplicateType(input, user) === CADENCE_TYPES.PERSONAL ||
				getDuplicateType(input, user) === CADENCE_TYPES.COMPANY
					? null
					: user?.sd_id,
			company_id:
				getDuplicateType(input, user) === CADENCE_TYPES.COMPANY ? user.company_id : null,
			is_workflow: input.isWorkflow ?? false,
		};

		duplicateCadence(cleanRequestBody(body), {
			onSuccess: data => {
				navigate(`/cadence/edit/${data?.cadence_id}`);
				handleClose();
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	useEffect(() => {
		if (input.description?.trim().length >= 101) {
			return addError({ text: "Please Enter description below 100 characters." });
		}
	}, [input.description]);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3>{CADENCE_TRANSLATION.DUPLICATE_CADENCE[user?.language?.toUpperCase()]}</h3>
				</div>
				<p className={styles.text}>{getTextByRole(user?.role)}</p>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}
						</Label>
						<Input
							value={input}
							setValue={setInput}
							name="name"
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
					</div>

					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.CADENCE_DESCRIPTION[user?.language?.toUpperCase()]}
						</Label>

						<Input
							type="textarea"
							placeholder={
								CADENCE_TRANSLATION.ADD_A_QUICK_NOTE[user?.language?.toUpperCase()]
							}
							className={styles.inputDescription}
							value={input.description}
							setValue={val => setInput(prev => ({ ...prev, description: val }))}
						/>
						{input.description?.trim() && (
							<div className={styles.wordCounter}>
								<span
									style={
										input.description.length <= 100
											? { color: "#567191" }
											: { color: "#f77272" }
									}
								>
									{input.description?.trim().length}
								</span>
								/100
							</div>
						)}
					</div>
					{getWorkflowsCountLoading ? (
						<Skeleton />
					) : workflowsCount?.workFlowCount > 0 ? (
						<div className={styles.shareWorkflowPrompt}>
							<Checkbox
								checked={input.isWorkflow}
								onChange={() =>
									setInput(prev => ({
										...prev,
										isWorkflow: !input?.isWorkflow,
									}))
								}
							/>
							<span>Share Workflows with Cadence</span>
						</div>
					) : null}
				</div>
				<div className={styles.footer}>
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.PRIMARY}
						loading={duplicateCadenceLoading}
						onClick={handleSubmit}
					>
						{CADENCE_TRANSLATION.DUPLICATE_CADENCE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

export default DuplicateCadenceModal;
