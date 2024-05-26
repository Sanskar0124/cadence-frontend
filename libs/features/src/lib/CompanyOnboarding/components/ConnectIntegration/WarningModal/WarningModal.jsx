import { Salesforce, SalesforceBox } from "@cadence-frontend/icons";
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
			<SalesforceBox color="#00A1E0" size="3rem" />
			<div className={styles.title}>
				{
					ERRORS_TRANSLATION.ARE_YOU_SURE_YOU_WANT_TO_GENERATE_NEW_API[
						user?.language?.toUpperCase()
					]
				}
			</div>
			<p className={styles.subtitle}>
				{ERRORS_TRANSLATION.ON_GENERATING_A_NEW_API_TOKEN[user?.language?.toUpperCase()]}
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
