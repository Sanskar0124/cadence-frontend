/* eslint-disable no-console */
import { useContext, useState } from "react";
import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./ReplaceCadenceModal.module.scss";
import SelectCadence from "./SelectCadence/SelectCadence";

const ReplaceCadenceModal = ({ modal, setModal, dataAccess, user }) => {
	const { addError, addWarning } = useContext(MessageContext);

	const { stopAndReassignCadence, stopAndReassignLoading } = dataAccess;
	const selectCadenceOpen = Boolean(modal);

	const [cadenceId, setCadenceId] = useState("");

	const handleClose = () => setModal(null);
	const handleSubmit = () => {
		if (!cadenceId) {
			addError({ text: "Please select a cadence first." });
			return;
		}
		const { lead_ids, cadence_id, option } = modal;

		const body = {
			lead_ids,
			cadence_to_stop: cadence_id,
			cadence_to_start: cadenceId.id,
			option: option,
		};
		stopAndReassignCadence(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: res => {
				addWarning("Cadence reassignment is in progress ! Please check after sometime.");
				handleClose();
			},
		});
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.replaceCadenceModal}>
				<div className={styles.heading}>
					<h3>
						{
							CADENCE_TRANSLATION?.MOVE_TO_ANOTHER_CADENCE?.[
								user?.language?.toUpperCase()
							]
						}
					</h3>
				</div>
				<p className={styles.subTitle}>
					{CADENCE_TRANSLATION.REPLACING_THE_CADENCE[user?.language?.toUpperCase()]}
				</p>
				<div className={styles.main}>
					{/* <Select
						options={cadenceOptions}
						value={cadenceId}
						setValue={setCadenceId}
						isSearchable
					/> */}
					<SelectCadence
						isOpen={selectCadenceOpen}
						setCadenceSelected={setCadenceId}
						cadenceSelected={cadenceId}
						user={user}
					/>
				</div>
				<ThemedButton
					className={styles.replaceBtn}
					theme={ThemedButtonThemes.PRIMARY}
					loading={stopAndReassignLoading}
					onClick={handleSubmit}
				>
					{CADENCE_TRANSLATION?.MOVE_TO_ANOTHER_CADENCE?.[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default ReplaceCadenceModal;
