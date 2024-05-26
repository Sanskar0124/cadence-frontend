// components
import { Modal } from "@cadence-frontend/components";
import { Caution2 } from "@cadence-frontend/icons";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./StopPowerModal.module.scss";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const StopPowerModal = ({ modal, setModal, onStopPower }) => {
	const recoilUser = useRecoilValue(userInfo);
	const handleClose = () => setModal(null);

	const onClick = () => {
		onStopPower();
		handleClose();
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<Caution2 color={Colors.red} size="38px" />
				<h3>{TASKS_TRANSLATION.STOP_FOCUS[recoilUser?.language?.toUpperCase()]} ?</h3>
				<p>Stopping focus will reset all filters. Are you sure you want to stop focus?</p>
				<ThemedButton onClick={onClick} theme={ThemedButtonThemes.RED}>
					Yes, stop focus
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default StopPowerModal;
