import { Modal, Title } from "@cadence-frontend/components";
import styles from "./ViewInsightsModal.module.scss";

const ViewInsightsModal = ({ modal, setModal }) => {
	const onClose = () => {
		setModal(false);
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.modal}
			showCloseButton
		>
			<Title size="1.3rem">{modal.title}</Title>
			<div className={styles.insights}>
				{modal && modal.data?.map(insight => <span>{insight}</span>)}
			</div>
		</Modal>
	);
};

export default ViewInsightsModal;
