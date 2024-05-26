import { useContext } from "react";

// components
import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { CadencesGradient } from "@cadence-frontend/icons";
import { useCadenceForLead, useTasks } from "@cadence-frontend/data-access";

import styles from "./StopCadenceModal.module.scss";

const StopCadenceModal = ({ modal, setModal, refetchLead }) => {
	const { addError, addSuccess } = useContext(MessageContext);

	const { stopCadenceForLead, stopLoading } = useCadenceForLead(
		{ cadenceId: modal?.cadence_id },
		false
	);

	const handleClose = () => {
		setModal(null);
	};

	const handleSubmit = () => {
		stopCadenceForLead(
			{ lead_id: modal?.lead_id, cadence_id: modal?.cadence_id },
			{
				onError: err =>
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: () => {
					addSuccess("Stopped cadence for lead successfully");
					refetchLead();
					handleClose();
				},
			}
		);
	};

	return (
		<Modal isModal={modal ? true : false} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<CadencesGradient />
				<h3>Are you sure you want to stop the cadence?</h3>
				<ThemedButton
					loading={stopLoading}
					onClick={handleSubmit}
					className={styles.btn}
					theme={ThemedButtonThemes.PRIMARY}
				>
					Confirm
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default StopCadenceModal;
