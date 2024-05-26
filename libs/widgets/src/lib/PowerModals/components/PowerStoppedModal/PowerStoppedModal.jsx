// components
import { Modal } from "@cadence-frontend/components";
import { POWER_MODAL_TYPES } from "@cadence-frontend/constants";
import { Stop } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

import styles from "./PowerStoppedModal.module.scss";

const REASON_MAP = {
	[POWER_MODAL_TYPES.ALL_CADENCES_STOPPED]:
		"Focus has stopped as Cadence(s) are stopped. No tasks are available.",
	[POWER_MODAL_TYPES.MAILS_LIMIT_REACHED]:
		"You have hit your daily limit for the sending mails for the day. Focus has been automatically stopped as more email tasks cannot be performed",
};

const PowerStoppedModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);

	return (
		<Modal isModal={Boolean(modal)} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<Stop color={Colors.red} size="2.71rem" />
				</span>
				<h3>Focus has stopped</h3>
				<p>{REASON_MAP[modal?.modalType]}</p>
			</div>
		</Modal>
	);
};

export default PowerStoppedModal;
