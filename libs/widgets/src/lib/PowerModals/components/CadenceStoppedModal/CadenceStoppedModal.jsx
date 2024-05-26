// components
import { Modal } from "@cadence-frontend/components";
import { CadencesGradient } from "@cadence-frontend/icons";

import styles from "./CadenceStoppedModal.module.scss";

const CadenceStoppedModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);

	const isSingleCadence = () => modal?.cadences?.length === 1;

	return (
		<Modal isModal={Boolean(modal)} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<CadencesGradient />
				</span>
				<h3>{isSingleCadence() ? modal?.cadences?.[0] : "Cadences"} has stopped</h3>
				<p>
					{modal?.cadences?.map((cadence, index) =>
						index !== 0 ? `, ${cadence}` : cadence
					)}{" "}
					has been stopped so {modal?.tasks} tasks from{" "}
					{isSingleCadence() ? "this cadence" : "these cadences"} have been removed
				</p>
			</div>
		</Modal>
	);
};

export default CadenceStoppedModal;
