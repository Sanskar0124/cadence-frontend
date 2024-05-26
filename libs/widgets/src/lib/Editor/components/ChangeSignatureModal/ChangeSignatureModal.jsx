import React, { useEffect, useState } from "react";
import { Div, Modal } from "@cadence-frontend/components";
import styles from "./ChangeSignatureModal.module.scss";
import { useEmailSignature } from "@cadence-frontend/data-access";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const ChangeSignatureModal = ({ modal, setModal, setSignature }) => {
	const [selected, setSelected] = useState(null);
	const user = useRecoilValue(userInfo);

	const onClose = () => {
		setModal(false);
		setSelected(null);
	};

	const { signatures, signatureLoading } = useEmailSignature();

	useEffect(() => {
		if (modal) setSignature(signatures?.find(s => s.is_primary === true));
	}, [signatures]);

	const onSave = signature => {
		if (signature) {
			let signatureToSave = signature;
			setSignature(prev => ({ ...signatureToSave, previous: prev || null }));
		}
		onClose();
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.modal}
			showCloseButton
		>
			<h2 className={styles.title}>Choose signature</h2>
			{signatureLoading ? (
				<div className={styles.placeholder}>
					{[...Array(3).keys()].map(() => (
						<Div loading />
					))}
				</div>
			) : (
				<div className={styles.signatureBox}>
					{signatures?.length > 0 ? (
						signatures?.map(signature => (
							<div className={styles.signature}>
								<InputRadio
									size={24}
									className={styles.radio}
									checked={selected?.signature_id === signature.signature_id}
									value={signature}
									onChange={() => setSelected(signature)}
								/>
								<span className={styles.name}>{signature.name}</span>
							</div>
						))
					) : (
						<span className={styles.fallback}>
							{TEMPLATES_TRANSLATION.NO_TEMPLATES_PRESENT[user?.language?.toUpperCase()]}
						</span>
					)}
				</div>
			)}
			<ThemedButton
				disabled={!selected}
				className={styles.saveBtn}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => onSave(selected)}
			>
				{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
			</ThemedButton>
		</Modal>
	);
};

export default ChangeSignatureModal;
