import React, { useContext } from "react";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./ErrorModal.module.scss";
import { ErrorGradient } from "@cadence-frontend/icons";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Modal } from "@cadence-frontend/components";
import { ERROR_TYPES } from "./constants";

const ErrorModal = ({ modal, setModal, handleClose }) => {
	//modal contains the error message
	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
		else handleClose();
	};
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.errorModal}
			showCloseButton
		>
			<ErrorGradient size={"32px"} />
			<div className={styles.warning}>
				<div className={styles.name}>
					{modal?.type === ERROR_TYPES.CADENCE_ACCESS &&
						COMMON_TRANSLATION.USER_DOES_NOT_HAVE_ACCESS[user?.language?.toUpperCase()]}
					{modal?.type === ERROR_TYPES.DEFAULT &&
						COMMON_TRANSLATION.ERROR[user?.language?.toUpperCase()]}
				</div>
				<div
					className={styles.errorMsg}
					dangerouslySetInnerHTML={{ __html: modal?.msg }}
				/>
				<div className={styles.advice}>
					{modal?.type === ERROR_TYPES.CADENCE_ACCESS &&
						COMMON_TRANSLATION.PLEASE_CHOOSE_ANOTHER_CADENCE[
							user?.language?.toUpperCase()
						]}
				</div>
			</div>
		</Modal>
	);
};

export default ErrorModal;
