import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { Tasks } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

import styles from "./SplitTaskModal.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

const SplitTaskModal = ({ modal, setModal, handleSave, setActiveException, loading }) => {
	const handleClose = () => {
		setModal(null);
		if (setActiveException && typeof setActiveException === "function")
			setActiveException(null);
	};
	const user = useRecoilValue(userInfo);

	const handleSubmit = () => {
		const { body, cb } = modal;
		handleSave({ body, cb });
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.icon}>
					<Tasks size="35px" />
				</div>
				<h3 className={styles.text}>
					There are <span>{modal?.remainingTasks} tasks</span> remaining for allotment.
				</h3>
				<h3 className={styles.text}>
					{
						TASKS_TRANSLATION.SPLIT_EQUALLY_AMONG_TASK_TYPES[
							user?.language?.toUpperCase()
						]
					}
				</h3>
				<p>
					<span>*</span>
					{
						TASKS_TRANSLATION.HIGHEST_TASK_COUNT_WILL_NOT_BE_AFFECTED[
							user?.language?.toUpperCase()
						]
					}
				</p>
				<ThemedButton
					className={styles.btn}
					onClick={handleSubmit}
					loading={loading}
					theme={ThemedButtonThemes.PRIMARY}
				>
					<div>{TASKS_TRANSLATION.SPLIT_EQUALLY[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default SplitTaskModal;
