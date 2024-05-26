import { CadencesGradient } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import Modal from "../Modal/Modal";
import styles from "./ActionModal.module.scss";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const ActionModal = ({
	modal,
	setModal,
	message,
	handleClose,
	icon,
	buttonText,
	onAction,
	description,
}) => {
	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
		else handleClose();
	};
	const user = useRecoilValue(userInfo);
	const onButtonClick = () => {
		onClose();
		onAction();
	};

	return (
		<Modal
			isModal={Boolean(modal)}
			onClose={handleClose}
			className={styles.actionModal}
			showCloseButton
		>
			<div className={styles.icon}>{icon ?? <CadencesGradient />}</div>
			<div className={styles.details}>
				<div className={`${styles.name} ${description ? styles.bold : ""}`}>
					{CADENCE_TRANSLATION.ARE_YOU_SURE[user?.language?.toUpperCase()]} {message}
				</div>
				<div className={styles.description}>{description ? description : ""}</div>
			</div>

			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				onClick={onButtonClick}
				className={styles.actionBtn}
			>
				{buttonText}
			</ThemedButton>
		</Modal>
	);
};

export default ActionModal;
