import Modal from "../Modal/Modal";

import { userInfo } from "@cadence-frontend/atoms";
import { ErrorGradient } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import styles from "./DeleteModal.module.scss";

const DeleteModal = ({
	modal,
	setModal,
	handleClose,
	item,
	itemType,
	onDelete,
	loading,
}) => {
	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
		else handleClose();
	};

	const onDeleteClick = () => {
		onDelete();
		onClose();
	};

	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.deleteModal}
			showCloseButton
		>
			{/* <div className={styles.icon}>!</div> */}
			<ErrorGradient size={"45px"} />
			<div className={styles.warning}>
				{COMMON_TRANSLATION.DELETE_CONFIRM[user?.language?.toUpperCase()]}{" "}
				{itemType && itemType}{" "}
				<span className={styles.name} title={item}>
					{item}
				</span>
				?
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.RED}
				onClick={onDeleteClick}
				className={styles.deleteBtn}
				loading={loading}
			>
				<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default DeleteModal;
