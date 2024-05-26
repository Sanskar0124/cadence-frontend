import { Tick } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./ReactStepper.module.scss";

//components

//constants

const ReactStepper = ({ steps: STEPS, currentStep, setCurrentStep, initialStep = 0 }) => {
	//currentSTep stores index of that step
	const user = useRecoilValue(userInfo);
	const handleNext = () => {
		if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
	};

	const handlePrev = () => {
		if (currentStep > 0) setCurrentStep(prev => prev - 1);
	};

	const Component = ({ className }) => {
		return (
			<div className={`${styles.stepsContainer} ${className}`}>
				<div className={styles.singleStepProgress}>
					{STEPS &&
						STEPS.map((s, i) => (
							<div
								className={`${styles.stepWrapper} ${
									currentStep >= i ? styles.visitedStep : ""
								}`}
							>
								<div className={styles.stepCircle}>{currentStep >= i && i + 1}</div>
								{i !== 0 && (
									<div className={styles.stepLine}>
										<div className={`${styles.stepLineInside}`}></div>
									</div>
								)}
							</div>
						))}
				</div>
				<div className={styles.singleStepLabel}>
					{STEPS &&
						STEPS.map((s, i) => (
							<div
								className={`${styles.labelText} ${
									currentStep > i ? styles.visited : ""
								} ${currentStep === i ? styles.current : ""}`}
							>
								{s?.label[user?.language?.toUpperCase()]}
							</div>
						))}
				</div>
			</div>
		);
	};

	return {
		Component,
		currentStep,
		setCurrentStep,
		handleNext,
		handlePrev,
	};
};

export default ReactStepper;

//STEPS is aan array of label value pair
