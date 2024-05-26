import { useEmailSignature } from "@cadence-frontend/data-access";
import { Plus, PlusOutline } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { DeleteModal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import AddEditSignatureModal from "./AddEditSignatureModal/AddEditSignatureModal";
import styles from "./EmailSignature.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const EmailSignature = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const queryClient = useQueryClient();
	const [addEditModal, setAddEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const user = useRecoilValue(userInfo);

	const { signatures, signatureLoading, updatePrimarySignature, deleteSignature } =
		useEmailSignature();

	//mutate functions
	const onDelete = () => {
		deleteSignature(deleteModal.signature_id, {
			onError: (err, _, context) => {
				addError({
					text: "Error deleting signature",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("signatures", context.previousSignatures);
			},
			onSuccess: () => {
				addSuccess(`Signature deleted successfully`);
			},
		});
	};

	const onUpdatePrimary = id => {
		updatePrimarySignature(id, {
			onError: (err, _, context) => {
				addError({
					text: "Error updating primary signature",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("signatures", context.previousSignatures);
			},
			onSuccess: () => {
				addSuccess("Primary email updated successfully");
			},
		});
	};

	return (
		<div className={styles.emailSignature}>
			<div className={styles.title}>
				<ThemedButton
					onClick={() => setAddEditModal(true)}
					theme={ThemedButtonThemes.GREY}
					width="auto"
				>
					<PlusOutline />
					<div className={styles.btnText}>
						{COMMON_TRANSLATION.ADD_NEW[user?.language?.toUpperCase()]}
					</div>
				</ThemedButton>
			</div>
			<div className={styles.settings}>
				<div className={styles.info}>
					<p>
						{COMMON_TRANSLATION.TO_SAVE_TIME_AT_THIS_POINT[user?.language?.toUpperCase()]}
					</p>
				</div>
				<div className={styles.signatures}>
					{signatures?.map(sign => (
						<div
							key={sign.signature_id}
							className={`${sign.is_primary ? styles.active : ""}`}
						>
							<div className={styles.input}>
								<InputRadio
									size={40}
									checked={sign.is_primary}
									value={sign.signature_id}
									onChange={() => onUpdatePrimary(sign.signature_id)}
								/>
								<span className={styles.name}>{sign.name}</span>
							</div>
							<div className={styles.buttons}>
								<ThemedButton
									width="fit-content"
									onClick={() => setAddEditModal(sign)}
									theme={ThemedButtonThemes.TRANSPARENT}
								>
									<div>{COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
								<ThemedButton
									width="fit-content"
									onClick={() => setDeleteModal(sign)}
									theme={ThemedButtonThemes.TRANSPARENT}
								>
									<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							</div>
						</div>
					))}
				</div>
			</div>
			<DeleteModal
				modal={deleteModal}
				setModal={setDeleteModal}
				onDelete={onDelete}
				item={deleteModal.name}
			/>
			<AddEditSignatureModal modal={addEditModal} setModal={setAddEditModal} />
		</div>
	);
};

export default EmailSignature;
