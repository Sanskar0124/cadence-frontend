// components
import { Modal } from "@cadence-frontend/components";

import { WarningRed } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import ThemedButton from "../../../ThemedButton/ThemedButton";
import styles from "./TourErrorModal.module.scss";

const TourErrorModal = ({ modal, onRefresh }) => {
	return (
		<Modal isModal={modal} disableOutsideClick overlayClassName={styles.overlay}>
			<div className={styles.modal}>
				<span>
					<WarningRed />
				</span>
				<h3>Please refresh</h3>
				<p>An unexpected error occurred. Kindly refresh Cadence to resume the demo.</p>
				<ThemedButton
					theme={ThemedButtonThemes.RED}
					onClick={() => {
						onRefresh();
						window.location.reload();
					}}
				>
					Refresh Cadence
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default TourErrorModal;
