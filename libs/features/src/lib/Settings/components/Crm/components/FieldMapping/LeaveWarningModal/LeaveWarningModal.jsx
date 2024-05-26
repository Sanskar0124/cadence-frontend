import styles from "./LeaveWarningModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { Caution2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components

//constants

const LeaveWarningModal = ({ modal, setModal }) => {
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
					<p>
						{SETTINGS_TRANSLATION.CHANGES_WONT_BE_SAVED[user?.language?.toUpperCase()]}
					</p>
					{
						SETTINGS_TRANSLATION.ARE_YOU_SURE_YOU_WANT_TO_LEAVE[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.RED}
				className={styles.leaveButton}
				onClick={() => {
					modal?.cb();
					onClose();
				}}
			>
				<div>{SETTINGS_TRANSLATION.Leave[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default LeaveWarningModal;
