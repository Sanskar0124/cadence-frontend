// components
import { powerInfo } from "@cadence-frontend/atoms";
import { Modal } from "@cadence-frontend/components";
import { POWER_STATUS } from "@cadence-frontend/constants";
import { PauseGradient } from "@cadence-frontend/icons";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useSetRecoilState } from "recoil";
import styles from "./PowerPausedModal.module.scss";

const PowerPausedModal = ({ modal, setModal }) => {
	const setPower = useSetRecoilState(powerInfo);
	const handleClose = () => setModal(null);

	const onResumePower = () => {
		setPower(prev => ({ ...prev, status: POWER_STATUS.BOOSTED }));
		handleClose();
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<PauseGradient size="4rem" />
				<h3>Resume Focus?</h3>
				<p>Focus has been paused automatically</p>
				<ThemedButton onClick={onResumePower} theme={ThemedButtonThemes.PRIMARY}>
					Yes, resume focus
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default PowerPausedModal;
