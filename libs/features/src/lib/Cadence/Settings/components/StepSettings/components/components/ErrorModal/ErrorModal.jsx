import styles from "./ErrorModal.module.scss";

import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ErrorGradient } from "@cadence-frontend/icons";

const ErrorModal = ({ modal, onClose }) => {
	return (
		<Modal
			showCloseButton
			isModal={modal}
			onClose={onClose}
			className={styles.leadUrlModal}
		>
			<div className={styles.header}>
				<div className={styles.salesForce}>
					{" "}
					<ErrorGradient size={"39.55px"} />
				</div>
				<div className={styles.msg}>{modal.heading}</div>
				<p className={styles.headTo}>{modal.message}</p>
			</div>
			<div className={styles.btn}>
				<ThemedButton
					theme={ThemedButtonThemes.RED}
					width={"100%"}
					onClick={() => {
						modal.fun();
						onClose();
					}}
				>
					<span>{modal.btnName}</span>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default ErrorModal;
