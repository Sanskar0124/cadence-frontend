import { userInfo } from "@cadence-frontend/atoms";
import { ROLES, SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { RingoverLogoWithText } from "@cadence-frontend/icons";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./ReconfigureIntegration.module.scss";
import Stepper from "./components/Stepper/Stepper";
import { renderView } from "./constants";
import { useNavigate } from "react-router-dom";

const ReconfigureIntegration = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const postDataRef = useRef(null);
	const [currentStep, setCurrentStep] = useState(
		parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.RECONFIGURE_CS) ?? 0)
	);
	const [disableNext, setDisableNext] = useState(false);

	useEffect(() => {
		if (
			user?.company_status !== "not_configured_after_integration_change" ||
			user?.role !== ROLES.SUPER_ADMIN
		)
			return navigate("/home");
	}, []);

	return (
		<div className={styles.onboardingContainer}>
			<div className={styles.ringoverLogo}>
				<RingoverLogoWithText />
			</div>
			<div className={styles.onboarding}>
				<div className={styles.onboardingForm}>
					{renderView(
						currentStep,
						{
							postDataRef,
							setDisableNext,
							setIfUnsavedChanges: () => null,
							setSaveBtnLoading: () => null,
						},
						user
					)}
				</div>
				<div className={styles.onboardingStepper}>
					<Stepper
						postDataRef={postDataRef}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
						disableNext={disableNext}
						currentStep_Parent
					/>
				</div>
			</div>
		</div>
	);
};

export default ReconfigureIntegration;
