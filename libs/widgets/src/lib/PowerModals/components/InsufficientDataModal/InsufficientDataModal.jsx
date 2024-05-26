// components
import { Modal } from "@cadence-frontend/components";
import { QuestionMarkGradient } from "@cadence-frontend/icons";

import styles from "./InsufficientDataModal.module.scss";

const InsufficientDataModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<QuestionMarkGradient />
				</span>
				<h3>{modal?.tasks} tasks with insufficient data found</h3>
				<p>
					<span>{modal?.tasks} tasks</span> have been removed from Focus. We did not find
					the key information to perform them.
				</p>
			</div>
		</Modal>
	);
};

export default InsufficientDataModal;
