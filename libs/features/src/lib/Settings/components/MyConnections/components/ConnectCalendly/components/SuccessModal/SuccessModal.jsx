/* eslint-disable no-console */
import styles from "./SuccessModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Caution2, SuccessTickGradient } from "@cadence-frontend/icons";

const SuccessModal = ({ showModal, setShowModal }) => {
	const onClose = () => {
		setShowModal(prev => !prev);
	};
	return (
		<Modal
			isModal={showModal}
			disableOutsideClick={false}
			onClose={() => onClose()}
			className={styles.successModal}
			showCloseButton={true}
		>
			<div className={styles.body}>
				<SuccessTickGradient />
				<h1>Authentication successful</h1>
				<p>
					You have successfully connected with Calendy. To use your calendy custom
					variable for booking demos please select the <span>event name</span>.
				</p>
			</div>
		</Modal>
	);
};

export default SuccessModal;
