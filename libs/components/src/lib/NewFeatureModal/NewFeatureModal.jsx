import React from "react";
import { useNavigate } from "react-router-dom";

import { ThemedButton } from "@cadence-frontend/widgets";
import { Modal } from "@cadence-frontend/components";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { LinkedinBoxed } from "@cadence-frontend/icons";

import styles from "./NewFeatureModal.module.scss";

const NewFeatureModal = ({ modal, setModal, onClick }) => {
	const navigate = useNavigate();

	const handleClose = () => {
		localStorage.setItem("new-feature-modal-4", false);
		setModal(false);
	};

	const onFeatureClick = () => {
		if (onClick && typeof onClick === "function") {
			onClick();
			handleClose();
		} else {
			window.open(
				"https://chrome.google.com/webstore/detail/ringover-cadence/occmhhljphpdnjhpllcdamgcamnlbhoe?hl=fr",
				"_blank",
				"noreferrer"
			);
			handleClose();
		}
	};

	return (
		<Modal
			disableOutsideClick
			isModal={modal}
			onClose={handleClose}
			className={styles.modal}
			showCloseButton
		>
			<div className={styles.icon}>
				<LinkedinBoxed />
			</div>

			<h2>LinkedIn extension update</h2>
			<p>We have updated the LinkedIn extension with some bug fixes.</p>
			{/* <ul>
				<li>Bug fixes</li>
			</ul> */}
			<ThemedButton
				className={styles.btn}
				onClick={onFeatureClick}
				theme={ThemedButtonThemes.PRIMARY}
			>
				Update extension
			</ThemedButton>
		</Modal>
	);
};

export default NewFeatureModal;
