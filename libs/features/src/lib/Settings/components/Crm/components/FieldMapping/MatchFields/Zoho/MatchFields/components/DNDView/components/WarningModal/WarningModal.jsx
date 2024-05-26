import { useState, useEffect } from "react";
import styles from "./WarningModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { ConnectionGradient } from "@cadence-frontend/icons";
import { DEFAULT_SF_FIELDS_STRUCT, VIEWS } from "../../../../constants";

//components

//constants

const WarningModal = ({ modal, setModal }) => {
	const onClose = () => {
		setModal(DEFAULT_SF_FIELDS_STRUCT);
	};
	return (
		<Modal
			onClose={() => onClose()}
			isModal={
				[...modal[VIEWS.LEAD], ...modal[VIEWS.CONTACT], ...modal[VIEWS.ACCOUNT]]
					.length !== 0
			}
			showCloseButton={true}
			disableOutsideClick={true}
			className={styles.warningModal}
		>
			<div className={styles.header}>
				<div>
					<ConnectionGradient size="2.7rem" />
				</div>
				<div className={styles.title}>Required Fields empty</div>
			</div>
			<div className={styles.body}>
				Some fields require a match before proceeding <br></br> to the next step.
				Following are the required fields :
			</div>
			<div className={styles.footer}>
				{modal[VIEWS.LEAD].length !== 0 && (
					<div>
						<div className={styles.warningType}>Lead</div>
						<div className={styles.fields}>
							{modal[VIEWS.LEAD].map(item => (
								<div className={styles.field}>{item}</div>
							))}
						</div>
					</div>
				)}
				{[...modal[VIEWS.CONTACT], ...modal[VIEWS.ACCOUNT]].length !== 0 && (
					<div>
						<div className={styles.warningType}>Accounts {"&"} Contacts</div>
						<div className={styles.fields}>
							{[...modal[VIEWS.CONTACT], ...modal[VIEWS.ACCOUNT]].map(item => (
								<div className={styles.field}>{item}</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default WarningModal;
