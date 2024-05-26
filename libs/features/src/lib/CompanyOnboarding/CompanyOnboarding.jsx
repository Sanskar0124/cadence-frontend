import { INTEGRATION_TYPE, SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useUser } from "@cadence-frontend/data-access";
import { RingoverLogoWithText } from "@cadence-frontend/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Stepper from "./components/Stepper/Stepper";
import styles from "./CompanyOnboarding.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { generateDocsLink, renderView } from "./constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

const Onboarding = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const postDataRef = useRef(null);
	const { integration_type } = user;
	const [currentStep, setCurrentStep] = useState(
		parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.ONBOARDING_CS) ?? -1)
	); //-1 refers homepage
	const [disableNext, setDisableNext] = useState(false);
	const { isOnboardingComplete } = useUser({ isOnboardingComplete: true });

	useEffect(() => {
		if (isOnboardingComplete && window.location.hostname !== "localhost")
			navigate("/home");
	}, [isOnboardingComplete]);

	useEffect(() => {
		if (currentStep === 5) postDataRef.current = null;
	}, [currentStep]);

	return (
		<div className={styles.onboardingContainer}>
			<div className={styles.ringoverLogo}>
				<RingoverLogoWithText />
			</div>
			{user?.integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS ||
			user?.integration_type === INTEGRATION_TYPE.EXCEL ||
			user?.integration_type === INTEGRATION_TYPE.SHEETS ? (
				<div className={styles.sideLink}>
					{[2, 3].includes(currentStep) && (
						<a
							href={generateDocsLink(integration_type, currentStep, user?.language)}
							target="_blank"
							rel="noreferrer"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
					)}
				</div>
			) : (
				<div className={styles.sideLink}>
					{currentStep !== -1 &&
						currentStep !== 0 &&
						currentStep !== 6 &&
						currentStep !== 2 &&
						!(
							integration_type === INTEGRATION_TYPE.SELLSY &&
							(currentStep === 1 || currentStep === 3)
						) &&
						!(
							integration_type === INTEGRATION_TYPE.DYNAMICS &&
							(currentStep === 1 || currentStep === 3)
						) && (
							<a
								href={generateDocsLink(integration_type, currentStep, user?.language)}
								target="_blank"
								rel="noreferrer"
							>
								{
									SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
										user?.language?.toUpperCase()
									]
								}
							</a>
						)}
				</div>
			)}
			{/* {renderDynamicHeader()} */}
			{currentStep === -1 ? (
				<Homepage setCurrentStep={setCurrentStep} />
			) : (
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
			)}
		</div>
	);
};

export default Onboarding;
