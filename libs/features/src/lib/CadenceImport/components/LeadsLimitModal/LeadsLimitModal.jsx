// components
import { Modal } from "@cadence-frontend/components";
import { Caution2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import styles from "./LeadsLimitModal.module.scss";

const LeadsLimitModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<Caution2 size="2.28rem" color={Colors.red} />
				</span>
				<h3>Limit exceeded</h3>
				<p>You cannot select more than a 1000 leads to import to Cadence</p>
			</div>
		</Modal>
	);
};

export default LeadsLimitModal;
