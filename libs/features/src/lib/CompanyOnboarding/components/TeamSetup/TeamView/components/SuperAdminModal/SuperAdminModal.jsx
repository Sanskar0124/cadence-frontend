import styles from "./SuperAdminModal.module.scss";
import { InstanceUrl } from "@cadence-frontend/icons";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ROLES } from "@cadence-frontend/constants";

const SuperAdminModal = ({ modal, setModal, setInput }) => {
	const onClose = () => {
		setInput(prev => ({ ...prev, role: ROLES.ADMIN }));
		setModal(false);
	};

	const handleSave = () => {
		setInput(prev => ({ ...prev, role: ROLES.SUPER_ADMIN }));
		setModal(false);
	};

	return (
		<Modal
			showCloseButton
			isModal={modal}
			onClose={onClose}
			className={styles.superAdminModal}
		>
			<div className={styles.header}>
				<div className={styles.infoIcon}>
					<InstanceUrl />
				</div>
				<div className={styles.msg}>Change super admin</div>
				<p className={styles.headTo}>
					Once you change the super admin you will loose all your rights and access as the
					current super admin. Are you sure wou want to continue ?
				</p>
			</div>
			<div className={styles.btn}>
				<ThemedButton
					height="50px"
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleSave}
				>
					Yes, change super admin
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default SuperAdminModal;
