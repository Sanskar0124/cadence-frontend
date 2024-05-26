import React, { useState, useContext } from "react";
import styles from "./InstanceUrlModal.module.scss";

import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { InstanceUrl } from "@cadence-frontend/icons";
const InstanceUrlModal = ({ modal, setModal, userDataAccess, setRecoilUser }) => {
	const { updateInstanceUrl, updateInstanceUrlLoading } = userDataAccess;
	const { addError, addSuccess } = useContext(MessageContext);

	const onClose = () => {
		setModal(false);
	};
	const handleSave = () => {
		const body = { instance_url: modal };
		updateInstanceUrl(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg ?? "Failed to update instance URL.",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				onClose();
			},
			onSuccess: () => {
				addSuccess("Instance URL updated.");
				setRecoilUser(prev => ({ ...prev, instance_url: modal }));
				onClose();
			},
		});
	};

	return (
		<Modal
			showCloseButton
			isModal={modal}
			onClose={onClose}
			className={styles.instanceUrlModal}
		>
			<div className={styles.header}>
				<div className={styles.instanceUrl}>
					{" "}
					<InstanceUrl />
				</div>
				<div className={styles.msg}>Update instance URL</div>
				<p className={styles.headTo}>
					Updating the instance URL will cause all users to be logged out from Cadence.
					Are you sure you want to update the URL ?
				</p>
			</div>
			<div className={styles.btn}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					height="50px"
					onClick={handleSave}
					loading={updateInstanceUrlLoading}
				>
					Yes, update instance URL
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default InstanceUrlModal;
