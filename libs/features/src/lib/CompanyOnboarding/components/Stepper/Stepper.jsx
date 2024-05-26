import { Next } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ReactStepper, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import styles from "./Stepper.module.scss";

//components

//constants
import { getStepperSteps } from "../../constants";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const Stepper = ({ postDataRef, currentStep, setCurrentStep, disableNext, loading }) => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const user = useRecoilValue(userInfo);

	const {
		Component: StepperComponent,
		handleNext,
		handlePrev,
	} = ReactStepper({
		steps: getStepperSteps(integration_type),
		initialStep: sessionStorage.getItem(SESSION_STORAGE_KEYS.ONBOARDING_CS),
		currentStep,
		setCurrentStep,
	});

	const customHandlePrev = () => {
		if (currentStep === 0) setCurrentStep(-1);
		else handlePrev();
	};

	const customHandleNext = async () => {
		if (typeof postDataRef.current === "function")
			await postDataRef.current({
				cb: () => {
					handleNext();
				},
			});
		else handleNext();
	};

	return (
		<div className={styles.stepper}>
			<ThemedButton
				className={styles.stepperButton}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => {
					customHandlePrev();
				}}
				width="maxContent"
			>
				<div>
					{currentStep === 0
						? COMMON_TRANSLATION.EXIT_SETUP[user?.language?.toUpperCase()]
						: COMMON_TRANSLATION.PREVIOUS[user?.language?.toUpperCase()]}
				</div>
			</ThemedButton>
			<div className={styles.reactStepper}>
				<StepperComponent className={styles.childReactStepper} />
			</div>
			<ThemedButton
				className={styles.stepperButton}
				theme={ThemedButtonThemes.PRIMARY}
				disabled={disableNext}
				onClick={() => {
					customHandleNext();
				}}
				width="maxContent"
				loading={loading}
			>
				{currentStep !== getStepperSteps(integration_type)?.length - 1 ? (
					<div>
						{COMMON_TRANSLATION.NEXT[user?.language?.toUpperCase()]} &nbsp;
						<Next color={Colors.white} />
					</div>
				) : (
					<div>
						{COMMON_TRANSLATION.FINISH_SETUP[user?.language?.toUpperCase()]} &nbsp;
					</div>
				)}
			</ThemedButton>
		</div>
	);
};

export default Stepper;
