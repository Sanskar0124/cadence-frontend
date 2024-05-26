import { useGoogle, useOutlook } from "@cadence-frontend/data-access";
import { Google, Outlook } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import ThemedButton from "../ThemedButton/ThemedButton";

import { userInfo } from "@cadence-frontend/atoms";
import { Modal } from "@cadence-frontend/components";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { capitalize } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import styles from "./MailIntegrationExpiredModal.module.scss";
import { useNavigate } from "react-router-dom";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const MailIntegrationExpiredModal = ({ modal, setModal }) => {
	const user = useRecoilValue(userInfo);
	const navigate = useNavigate();

	const getSignInFunction = mail_integration_type => {
		navigate("/settings?view=my_connections");
		onClose();
	};

	const renderIcon = () => {
		switch (user?.mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return <Google size="3rem" />;
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return <Outlook size="3rem" />;
			default:
				break;
		}
	};

	const onClose = () => {
		localStorage.setItem("mail-token-expired-modal", true);
		setModal(null);
	};

	return (
		<Modal isModal={modal} onClose={onClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.icon}>{renderIcon()}</div>
				<h3 className={styles.title}>
					{COMMON_TRANSLATION.YOU_ARE_NOT_CONNECTED[user?.language?.toUpperCase()]}
				</h3>
				<h4 className={styles.subTitle}>
					{COMMON_TRANSLATION.YOU_ARE_NOT_CONNECTED_DESC[
						user?.language?.toUpperCase()
					].replace("{{mail_integration_type}}", capitalize(user.mail_integration_type))}
				</h4>
				<ThemedButton
					className={styles.btn}
					onClick={() => getSignInFunction(user.mail_integration_type)}
					theme={ThemedButtonThemes.PRIMARY}
				>
					{
						COMMON_TRANSLATION[
							`CONNECT_WITH_${user.mail_integration_type?.toUpperCase()}`
						]?.[user?.language?.toUpperCase()]
					}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default MailIntegrationExpiredModal;
