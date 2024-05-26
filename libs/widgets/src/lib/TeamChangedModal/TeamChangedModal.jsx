// components
import { Modal } from "@cadence-frontend/components";
import { InfoCircleGradient } from "@cadence-frontend/icons";

import styles from "./TeamChangedModal.module.scss";
import { useSetRecoilState } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { TEAM_CHANGE_DESCRIPTIONS } from "./constants";

const TeamChangedModal = ({ modal, setModal }) => {
	const setUser = useSetRecoilState(userInfo);

	const handleClose = () => {
		setUser(prev => ({
			...prev,
			showModals: { ...prev?.showModals, Tracking: {} },
		}));
		setModal(null);
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<InfoCircleGradient size="40px" />
				</span>
				<div className={styles.heading}>User group has been changed</div>
				<div className={styles.desc}>
					Your user group was changed by the super admin from{" "}
					<strong>{modal?.metadata?.old_sd_name}</strong> to{" "}
					<strong>{modal?.metadata?.new_sd_name}</strong>.
				</div>
				<div className={styles.desc}>
					{TEAM_CHANGE_DESCRIPTIONS[modal?.metadata?.lead_option]}
				</div>
			</div>
		</Modal>
	);
};

export default TeamChangedModal;
