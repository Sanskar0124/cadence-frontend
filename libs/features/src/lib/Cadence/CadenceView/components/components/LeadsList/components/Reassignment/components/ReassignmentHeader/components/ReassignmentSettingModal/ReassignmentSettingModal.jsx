import { useRecoilValue } from "recoil";

import { Modal } from "@cadence-frontend/components";
import { Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";

import styles from "./ReassignmentSettingModal.module.scss";
import { companyContactReassignmentOptions } from "../../../../constants";

const ReassignmentSettingModal = ({
	modal,
	setModal,
	reassignmentSetting,
	setReassignmentSetting,
	reassignLeadsLoading,
	handleReassignment,
}) => {
	const user = useRecoilValue(userInfo);
	return (
		<Modal
			isModal={modal}
			className={styles.reassignmentSettingModal}
			onClose={() => setModal(false)}
			showCloseButton
		>
			<div className={styles.heading}>Reassignment setting</div>
			<div className={styles.body}>
				<div className={styles.selectOption}>
					<div className={styles.option}>
						<Label required>Select an option</Label>
						<Select
							options={companyContactReassignmentOptions({
								integration_type: user?.integration_type,
							})}
							value={reassignmentSetting}
							setValue={setReassignmentSetting}
							placeholder={COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]}
							borderColor={"#DADCE0"}
							borderRadius={15}
							numberOfOptionsVisible={"2"}
						/>
					</div>
					<div className={styles.note}>*Applicable for contacts only</div>
				</div>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleReassignment}
					className={styles.reassignmentBtn}
					loading={reassignLeadsLoading}
				>
					<div>Complete reassignment</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};
export default ReassignmentSettingModal;
