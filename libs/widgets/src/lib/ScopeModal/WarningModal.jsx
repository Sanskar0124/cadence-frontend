import React from "react";
import styles from "./WarningModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Caution2 } from "@cadence-frontend/icons";

const WarningModal = ({ modal, setModal }) => {
	return (
		<Modal
			isModal={modal}
			onClose={() => setModal(false)}
			className={styles.warningModal}
			showCloseButton
		>
			<Caution2 color="#f77272" size="3rem" />
			<div className={styles.title}>Upgrade to advance scope</div>

			<p className={styles.subText}>
				You are unable to view this mail. To view this mail in Cadence request your
				company admin to upgrade to advanced scope.
			</p>
		</Modal>
	);
};

export default WarningModal;
