/* eslint-disable no-console */
import styles from "./CalendlyErrorModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { ErrorGradient } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

const CalendlyErrorModal = ({ showModal, setShowModal, modalMessage }) => {
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
				<ErrorGradient size="2rem" />
				<h1>{modalMessage?.top}</h1>
				<p>{modalMessage?.bottom}</p>
				<ThemedButton
					className={styles.fetchButton}
					// loading={fetchTestFieldsLoading}
					theme={ThemedButtonThemes.RED}
					onClick={() => (window.location.href = "/crm/settings")}
					// disabled={!url.length}
				>
					{modalMessage?.button}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default CalendlyErrorModal;
