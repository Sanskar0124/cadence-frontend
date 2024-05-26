import { userInfo } from "@cadence-frontend/atoms";
import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCompanyIntegration } from "@cadence-frontend/data-access";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./SuccessModal.module.scss";

const SuccessModal = ({ modal, setModal }) => {
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);
	const { updateCompanyStatus, updateCompanyStatusLoading } = useCompanyIntegration();
	const [user, setUser] = useRecoilState(userInfo);

	const handleClose = () => {
		setModal(false);
	};

	const btnClickHandler = () => {
		updateCompanyStatus(
			{ status: "configured" },
			{
				onSuccess: () => {
					setUser(prev => ({ ...prev, company_status: "configured" }));
					handleClose();
					setTimeout(() => {
						navigate("/");
					}, 500);
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	return (
		<Modal
			isModal={modal}
			className={styles.successModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.popper}>
				<span role="img" aria-label="success-popper">
					🎉
				</span>
			</div>
			<div className={styles.successTitle}>
				{COMMON_TRANSLATION.CONGRATULATIONS[user?.language?.toUpperCase()]}
			</div>
			<div className={styles.descPara}>
				You have successfully completed the reconfigure process. You can change these
				settings anytime by heading over to your <span>Settings page</span>.
			</div>
			<div className={styles.helpLink}>
				<a
					href="https://ringovercadence.freshdesk.com/en/support/solutions"
					target="_blank"
					rel="noreferrer"
				>
					{COMMON_TRANSLATION.CHECK_OUR_HELP_CENTER[user?.language?.toUpperCase()]}
				</a>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.headToBtn}
				onClick={btnClickHandler}
				loading={updateCompanyStatusLoading}
			>
				<div>{COMMON_TRANSLATION.HEAD_TO_HOME_PAGE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default SuccessModal;
