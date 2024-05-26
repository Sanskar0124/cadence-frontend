import { useEmailSignature } from "@cadence-frontend/data-access";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Editor, Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styles from "./AddEditSignatureModal.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import * as DOMPurify from "dompurify";

const AddEditSignatureModal = ({ modal, setModal }) => {
	const isEditModal = typeof modal === "object" ? true : false;
	const queryClient = useQueryClient();
	const user = useRecoilValue(userInfo);

	const [input, setInput] = useState({ name: "", signature: "" });

	const { addError, addSuccess } = useContext(MessageContext);
	const { updateSignature, createSignature } = useEmailSignature();

	const onClose = () => {
		setModal(false);
		setInput({ name: "", signature: "" });
	};

	const onUpdate = () => {
		if (!input.name || input.name.trim() === "") {
			return addError({ text: "Name cannot be empty" });
		}
		if (!input.signature) {
			return addError({ text: "Signature cannot be empty" });
		}
		updateSignature(
			{ ...input, signature: DOMPurify.sanitize(input.signature) },
			{
				onError: (err, _, context) => {
					addError({
						text: "Error updating signature.",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("signatures", context.previousSignatures);
				},
				onSuccess: () => addSuccess(`Email signature updated successfully.`),
			}
		);
		onClose();
	};

	const onCreate = () => {
		if (!input.name || input.name.trim() === "") {
			return addError({ text: "Name cannot be empty" });
		}
		if (!input.signature) {
			return addError({ text: "Signature cannot be empty" });
		}

		createSignature(
			{ ...input, signature: DOMPurify.sanitize(input.signature) },
			{
				onError: (err, _, context) => {
					addError({ text: "Error creating signature" });
					queryClient.setQueryData("signatures", context.previousSignatures);
				},
				onSuccess: () => addSuccess("Email signature created successfully"),
			}
		);
		onClose();
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
				<Input
					theme={InputThemes.WHITE_BORDERED}
					value={input}
					setValue={setInput}
					name="name"
				/>
			</div>
			<div className={styles.inputBox}>
				<Label>{COMMON_TRANSLATION.SIGNATURE[user?.language?.toUpperCase()]}</Label>
				<Editor
					className={styles.editor}
					value={input.signature}
					setValue={signature => setInput(prev => ({ ...prev, signature }))}
					type="textarea"
					height="200px"
				/>
			</div>
			<div className={styles.buttons}>
				<ThemedButton
					width="fit-content"
					onClick={onClose}
					theme={ThemedButtonThemes.TRANSPARENT}
				>
					<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
				<ThemedButton
					width="fit-content"
					height="40px"
					theme={ThemedButtonThemes.PRIMARY}
					onClick={isEditModal ? onUpdate : onCreate}
				>
					<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default AddEditSignatureModal;
