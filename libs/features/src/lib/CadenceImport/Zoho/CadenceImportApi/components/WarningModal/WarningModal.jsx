import styles from "./WarningModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Caution2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const WarningModal = ({ modal, setModal }) => {
	const onClose = () => {
		setModal(false);
	};
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			onClose={() => onClose()}
			isModal={modal}
			showCloseButton={true}
			disableOutsideClick={true}
			className={styles.warningModal}
		>
			<div className={styles.leaveWarningModal}>
				<div>
					<Caution2 size="40px" color={Colors.red} />
				</div>
				<div>
					<p>Unable to select</p>
					You cannot import leads and contacts together. Please deselect your current
					selection to select here.
				</div>
			</div>
		</Modal>
	);
};

export default WarningModal;
