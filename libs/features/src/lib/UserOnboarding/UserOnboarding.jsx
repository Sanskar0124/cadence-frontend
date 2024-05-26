import { useState, useEffect, useRef } from "react";
import Homepage from "./components/Homepage/Homepage";
import Stepper from "./components/Stepper/Stepper";
import styles from "./UserOnboarding.module.scss";
import { RingoverLogoWithText } from "@cadence-frontend/icons";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useUser } from "@cadence-frontend/data-access";
import { useNavigate } from "react-router-dom";
import { renderView } from "./constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const UserOnboarding = () => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const postDataRef = useRef(null);
	const [currentStep, setCurrentStep] = useState(
		parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_ONBOARDING_CS) ?? -1)
	); //-1 refers homepage
	const [disableNext, setDisableNext] = useState(false);
	const { isOnboardingComplete } = useUser({ isOnboardingComplete: true });

	const navigate = useNavigate();

	useEffect(() => {
		if (isOnboardingComplete && window.location.hostname !== "localhost")
			navigate("/home");
	}, [isOnboardingComplete]);

	return (
		<div className={styles.userOnboardingContainer}>
			<div className={styles.ringoverLogo}>
				<RingoverLogoWithText />
			</div>
			{currentStep === -1 ? (
				<Homepage setCurrentStep={setCurrentStep} />
			) : (
				<div className={styles.onboarding}>
					<div className={styles.onboardingForm}>
						{renderView(currentStep, { postDataRef, setDisableNext }, integration_type)}
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
			)}
		</div>
	);
};

export default UserOnboarding;
