import styles from "./SuccessModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "@cadence-frontend/contexts";
import { useContext } from "react";
import { useUser } from "@cadence-frontend/data-access";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";

const SuccessModal = ({ modal, setModal }) => {
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);
	const { updateOnboardingValue, updateOnboardingValueLoading } = useUser();
	const user = useRecoilValue(userInfo);

	const handleClose = () => {
		setModal(false);
	};

	const btnClickHandler = () => {
		updateOnboardingValue(
			{ is_onboarding_complete: true },
			{
				onSuccess: () => {
					localStorage.setItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET, false);
					handleClose();
					setTimeout(() => {
						navigate("/");
					}, 500);
				},
				onError: () => addError({ text: "Something went wrong, please try again later" }),
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
				{
					COMMON_TRANSLATION.YOU_HAVE_SUCCESSFULLY_COMPLETED_THE_SETUP[
						user?.language?.toUpperCase()
					]
				}{" "}
				<span>{COMMON_TRANSLATION.PROFILE_PAGE[user?.language?.toUpperCase()]}</span>.
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
				loading={updateOnboardingValueLoading}
			>
				<div>{COMMON_TRANSLATION.HEAD_TO_HOME_PAGE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default SuccessModal;
