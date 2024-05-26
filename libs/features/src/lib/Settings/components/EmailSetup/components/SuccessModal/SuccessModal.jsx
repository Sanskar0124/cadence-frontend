import React from "react";
import styles from "./SuccessModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { InfoCircleGradient } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const SuccessModal = ({ modal, setModal }) => {
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={modal}
			onClose={() => setModal(false)}
			className={styles.successModal}
			showCloseButton
		>
			<InfoCircleGradient size="3rem" />
			<div className={styles.title}>All users logged out</div>

			<p className={styles.subText}>
				Once scope is upgraded users have to log in again so that the changes can be
				implemented.
			</p>

			<p className={styles.subText}>
				Please ensure you have completed the domain verification before logging in again.
				If it is not completed you may face some error.
			</p>
		</Modal>
	);
};

export default SuccessModal;
