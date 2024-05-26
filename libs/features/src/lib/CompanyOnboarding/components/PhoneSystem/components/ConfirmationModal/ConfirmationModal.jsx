import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Bounced } from "@cadence-frontend/icons";

import styles from "./ConfirmationModal.module.scss";

const ConfirmationModal = ({ modal, setModal, onConfirm }) => {
	const handleClose = () => {
		setModal(false);
	};

	const handleConfirm = () => {
		onConfirm(modal);
		handleClose();
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={handleClose}
			className={styles.modal}
			showCloseButton
		>
			<div className={styles.icon}>
				<Bounced size="40px" />
			</div>
			<h3 className={styles.heading}>
				Are you sure you want to change your phone system?
			</h3>
			<ThemedButton
				theme={ThemedButtonThemes.RED}
				onClick={handleConfirm}
				className={styles.btn}
			>
				Yes
			</ThemedButton>
		</Modal>
	);
};

export default ConfirmationModal;
