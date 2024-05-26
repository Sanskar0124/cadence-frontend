// components
import { Modal } from "@cadence-frontend/components";
import { TickGradient } from "@cadence-frontend/icons";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./ImportSuccessModal.module.scss";
import { useNavigate } from "react-router-dom";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const ImportSuccessModal = ({ modal, setModal, cadenceSelected }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const handleClose = () => setModal(null);

	return (
		<Modal
			isModal={Boolean((modal?.add && modal?.link) || modal?.show)}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.modal}>
				<span>
					<TickGradient size="2.5rem" />
				</span>
				<h3>Import complete</h3>
				<p>Import process has been completed.</p>
				<div>
					<span className={styles.success}>{modal?.successCount || 0}</span> leads have
					been imported successfully.
				</div>
				<div>
					<span className={styles.error}>{modal?.errorCount || 0}</span> leads have failed
					to import.
				</div>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => {
						user?.integration_type === INTEGRATION_TYPE.SELLSY && sessionStorage.clear();
						navigate(
							`${
								cadenceSelected?.id
									? `/cadence/${cadenceSelected?.id}?view=list`
									: "/home"
							}`
						);
					}}
				>
					Back to {cadenceSelected?.id ? "cadence" : "home"}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default ImportSuccessModal;
