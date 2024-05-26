import { useQueryClient } from "react-query";
import { Modal } from "@cadence-frontend/components";
import { Editor, Input, Label } from "@cadence-frontend/widgets";
import React, { useContext, useEffect, useState } from "react";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./AddEditSignatureModal.module.scss";
import { useEmailSignature } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import * as DOMPurify from "dompurify";

const AddEditSignatureModal = ({ modal, setModal }) => {
	const isEditModal = typeof modal === "object" ? true : false;

	const [input, setInput] = useState({ name: "", signature: "" });

	const { addError, addSuccess } = useContext(MessageContext);
	const { updateSignature, createSignature, createUpdateSignatureLoading } =
		useEmailSignature();

	const queryClient = useQueryClient();
	const onClose = () => {
		setModal(false);
		setInput({ name: "", signature: "" });
	};
	const user = useRecoilValue(userInfo);

	const onUpdate = () => {
		if (!input.name.trim().length) {
			return addError({ text: "Name cannot be empty" });
		}
		if (!input.signature.trim().length) {
			return addError({ text: "Signature cannot be empty" });
		}
		updateSignature(
			{ ...input, signature: DOMPurify.sanitize(input.signature) },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating signature",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("signatures", context.previousSignatures);
				},
				onSuccess: () => {
					addSuccess("Signature updated");
					onClose();
				},
			}
		);
	};
	const onCreate = () => {
		if (!input.name.trim().length) {
			return addError({ text: "Name cannot be empty" });
		}
		if (!input.signature.trim().length) {
			return addError({ text: "Signature cannot be empty" });
		}
		createSignature(
			{ ...input, signature: DOMPurify.sanitize(input.signature) },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error creating signature",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("signatures", context.previousSignatures);
				},
				onSuccess: () => {
					addSuccess("Signature created", false);
					onClose();
				},
			}
		);
	};

	useEffect(() => {
		if (modal && isEditModal) {
			setInput(modal);
		}
	}, [modal]);

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.modal}
			disableOutsideClick
		>
			<span className={styles.title}>
				{COMMON_TRANSLATION.EMAIL_SIGNATURE[user?.language?.toUpperCase()]}
			</span>
			<div className={styles.inputBox}>
				<Label>{COMMON_TRANSLATION.SIGNATURE_NAME[user?.language?.toUpperCase()]}</Label>
				<Input theme={InputThemes.WHITE} value={input} setValue={setInput} name="name" />
			</div>
			<div className={styles.inputBox}>
				<Label>{COMMON_TRANSLATION.SIGNATURE[user?.language?.toUpperCase()]}</Label>
				<Editor
					className={styles.editor}
					value={input.signature}
					setValue={signature => setInput(prev => ({ ...prev, signature }))}
					type="textarea"
					height="350px"
				/>
			</div>
			<div className={styles.buttons}>
				<ThemedButton
					onClick={onClose}
					theme={ThemedButtonThemes.TRANSPARENT}
					width="fit-content"
				>
					<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
				<ThemedButton
					loading={createUpdateSignatureLoading}
					theme={ThemedButtonThemes.PRIMARY}
					onClick={isEditModal ? onUpdate : onCreate}
					height="40px"
					width="fit-content"
				>
					{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default AddEditSignatureModal;
