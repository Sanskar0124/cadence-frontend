import { useEmailSignature } from "@cadence-frontend/data-access";
import { Plus } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import React, { useContext, useEffect, useState } from "react";
import styles from "./EmailSignature.module.scss";
import { DeleteModal } from "@cadence-frontend/components";
import AddEditSignatureModal from "./AddEditSignatureModal/AddEditSignatureModal";
import { useQueryClient } from "react-query";
import Placeholder from "../Placeholder/Placeholder";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { SEARCH_OPTIONS } from "../../../Search/constants";

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
					text: err.response?.data?.msg || "Error deleting signature",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("signatures", context.previousSignatures);
			},
			onSuccess: () => {
				addSuccess("Signature deleted", true);
			},
		});
	};

	const onUpdatePrimary = id => {
		updatePrimarySignature(id, {
			onError: (err, _, context) => {
				addError({
					text: err.response?.data?.msg || "Error updating primary signature",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData("signatures", context.previousSignatures);
			},
			onSuccess: () => {
				addSuccess("Primary signature updated");
			},
		});
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.EMAIL_SIGNATURES}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.EMAIL_SIGNATURE[user?.language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.EMAIL_SIGNATURES[user?.language?.toUpperCase()]}</p>
				<ThemedButton
					onClick={() => setAddEditModal(true)}
					theme={ThemedButtonThemes.GREY}
					width="fit-content"
					height="40px"
				>
					<Plus />
					<div>{COMMON_TRANSLATION.ADD_NEW[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
			<div className={styles.settings}>
				{signatureLoading ? (
					<Placeholder rows={3} />
				) : !signatures?.length ? (
					<div className={`${styles.greyBox} ${styles.fallback}`}>
						<div>
							<span />
							{COMMON_TRANSLATION.NO_SIGNATURES_ADDED[user?.language?.toUpperCase()]}
						</div>
					</div>
				) : (
					signatures?.map(sign => (
						<div
							key={sign.signature_id}
							className={`${styles.greyBox} ${sign.is_primary ? styles.active : ""}`}
						>
							<div>
								<InputRadio
									size={24}
									checked={sign.is_primary}
									value={sign.signature_id}
									onChange={() => onUpdatePrimary(sign.signature_id)}
								/>
								<span className={styles.name} title={sign.name}>
									{sign.name}
								</span>
							</div>
							<div className={styles.buttons}>
								<ThemedButton
									onClick={() => setAddEditModal(sign)}
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
								>
									<div>{COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
								<ThemedButton
									onClick={() => setDeleteModal(sign)}
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
								>
									<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							</div>
						</div>
					))
				)}
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
