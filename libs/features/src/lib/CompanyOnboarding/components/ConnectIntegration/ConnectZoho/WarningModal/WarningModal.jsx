import { Zoho } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./WarningModal.module.scss";
import {
	Errors as ERRORS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const WarningModal = ({ modal, setModal, onConfirm }) => {
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={Boolean(modal)}
			onClose={() => setModal(false)}
			className={styles.warningModal}
			showCloseButton
		>
			<Zoho size="60px" />
			<div className={styles.title}>
				Are you sure you want to generate new API token in Zoho ?
			</div>
			<p className={styles.subtitle}>
				{/* {ERRORS_TRANSLATION.ON_GENERATING_A_NEW_API_TOKEN[user?.language?.toUpperCase()]} */}
				On generating a new API token, it is required that you change it in 'Custom
				Settings' in the organization's Zoho Setup
			</p>
			<br />
			<p className={styles.subtitle}>
				{
					ERRORS_TRANSLATION.THIS_CHANGE_IS_REQUIRED_IN_ORDER_FOR_THE_INTEGRATION[
						user?.language?.toUpperCase()
					]
				}
			</p>
			<ThemedButton
				className={styles.confirmBtn}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={onConfirm}
			>
				<div>{COMMON_TRANSLATION.CONFIRM[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default WarningModal;
