// components
import { Modal } from "@cadence-frontend/components";
import { InfoCircleGradient } from "@cadence-frontend/icons";

import styles from "./IntegrationChangedModal.module.scss";
import { useSetRecoilState } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	CHANGE_TYPES,
	INTEGRATION_CHANGE_EFFECTS,
	INTEGRATION_CHANGE_OPTIONS,
} from "./constants";

const CHANGE_MAP = {
	integration_change: {
		title: "CRM",
		desc: "A new CRM has been set-up for your organization. Please review the changes before proceeding with your work.",
	},
	email_change: {
		title: "Email service provider",
		desc: "A new email service provider has been set-up for your organization. Please sign in to your new integration and review the changes before proceeding with your work.",
	},
};

const IntegrationChangedModal = ({ modal, setModal }) => {
	const setUser = useSetRecoilState(userInfo);

	const handleClose = () => {
		setUser(prev => ({
			...prev,
			showModals: { ...prev?.showModals, Company_Histories: [] },
		}));
		setModal(null);
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<InfoCircleGradient size="40px" />
				</span>
				<h3>{CHANGE_MAP[modal?.change_type]?.title} has been changed</h3>
				<p>{CHANGE_MAP[modal?.change_type]?.desc}</p>
				<ol>
					{modal?.change_type === CHANGE_TYPES.INTEGRATION_CHANGE &&
						INTEGRATION_CHANGE_EFFECTS[modal?.change_option].map(effect => (
							<li key={effect}>{effect}</li>
						))}
				</ol>
			</div>
		</Modal>
	);
};

export default IntegrationChangedModal;
