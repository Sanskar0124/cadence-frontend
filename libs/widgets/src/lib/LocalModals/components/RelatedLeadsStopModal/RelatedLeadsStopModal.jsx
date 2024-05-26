// components
import { useContext } from "react";
import { Modal } from "@cadence-frontend/components";
import { CautionTriangleGradient } from "@cadence-frontend/icons";
import { useRelatedLeads } from "@cadence-frontend/data-access";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./RelatedLeadsStopModal.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { LOCAL_MODAL_TYPES } from "../../constants";

const RelatedLeadsStopModal = ({ modal, setModal }) => {
	const { lead, data, relatedLeadLoading, leadsSelected } = modal;
	const handleClose = () => {
		setModal({
			modalType: LOCAL_MODAL_TYPES.RELATED_LEAD,
			lead,
			data,
			leadsSelected,
			relatedLeadLoading,
		});
	};

	const { stopAllCadences, stopAllCadencesLoading } = useRelatedLeads({ lead });
	const { addError, addWarning } = useContext(MessageContext);

	const onClick = () => {
		stopAllCadences(
			{
				lead_ids: leadsSelected,
			},
			{
				onSuccess: () => {
					addWarning("Processing has been started! Please check after sometime.");
					setModal(false);
				},
				onError: err => {
					return addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	const getDescription = () => {
		if (
			modal?.isCurrentLead &&
			modal?.leadsSelected?.length === 1 &&
			modal?.leadsSelected.includes(modal.lead.lead_id)
		) {
			return "Current lead will be stopped in all the cadences they are a part of.";
		} else if (modal?.isCurrentLead && modal?.leadsSelected?.length > 0) {
			return "Selected leads and current lead will be stopped in all the cadences they are a part of.";
		} else if (!modal?.isCurrentLead && modal?.leadsSelected?.length > 0) {
			return "All Selected leads will be stopped in all the cadences they are a part of.";
		}
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<CautionTriangleGradient color={Colors.red} size="48px" />
				<div className={styles.heading}>Stop for all related leads</div>
				<div className={styles.text}>{getDescription()}</div>
				<div className={styles.text}>
					Also note that workflows for the cadences will not be triggered for these leads.
					Please confirm to continue.
				</div>
				<ThemedButton
					onClick={onClick}
					theme={ThemedButtonThemes.RED}
					className={styles.btn}
					loading={stopAllCadencesLoading}
				>
					Confirm action
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default RelatedLeadsStopModal;
