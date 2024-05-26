import React from "react";
import styles from "./WarningModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Caution2 } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const WarningModal = ({ modal, setModal, onConfirm, emailScopeLoading }) => {
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={modal}
			onClose={() => setModal(false)}
			className={styles.warningModal}
			showCloseButton
		>
			<Caution2 color="#f77272" size="3rem" />
			<div className={styles.title}>Remove advanced scope</div>

			<p className={styles.subText}>
				Once to remove advanced scope your team will be unable to view, read and reply to
				mails in Cadence. Are you sure you want to downgrade ?
			</p>
			<ThemedButton
				className={styles.confirmBtn}
				theme={ThemedButtonThemes.RED}
				onClick={onConfirm}
				loading={emailScopeLoading}
			>
				<div>Yes, remove advanced scope</div>
			</ThemedButton>
		</Modal>
	);
};

export default WarningModal;
