import { userInfo } from "@cadence-frontend/atoms";
import { Modal } from "@cadence-frontend/components";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./PhoneEmailAbsentModal.module.scss";
import { useRecoilValue } from "recoil";
import { CautionGradient } from "@cadence-frontend/icons";

const PhoneEmailAbsentModal = ({ modal, setModal }) => {
	const user = useRecoilValue(userInfo);
	const handleClose = () => {
		setModal(null);
	};
	return (
		<Modal isModal={modal?.isOpen} onClose={handleClose} showCloseButton>
			<div className={styles.sfeIMC}>
				<div className={styles.icon}>
					<CautionGradient
						color={"linear-gradient(135deg, #FFCF4F 0%, #FF9B4A 100%)"}
						size="48px"
					/>
				</div>
				<div>
					<h3 className={styles.title}>
						No {modal?.type === "phone" ? "number" : "email ID"} present
					</h3>
					<h4 className={styles.subTitle}>
						{modal?.type === "phone"
							? "SMS cannot be sent as no phone number is present. Please edit lead details to add a number."
							: "Email cannot be sent as no email ID is present. Please edit lead details to add an email ID."}
					</h4>
				</div>
			</div>
		</Modal>
	);
};

export default PhoneEmailAbsentModal;
