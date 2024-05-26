import { StepsSetup } from "@cadence-frontend/icons";
import React, { useContext, useEffect, useState } from "react";
import { CadenceContext } from "../../Settings";
import { stepSetupMap } from "./constants";
import styles from "./StepSettings.module.scss";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "@cadence-frontend/components";

const StepSettings = ({ cadence }) => {
	const { activeStep } = useContext(CadenceContext);
	const [step, setStep] = useState(
		cadence?.sequence?.find(s => s.node_id === activeStep)
	);

	const user = useRecoilValue(userInfo);
	useEffect(() => {
		activeStep && setStep(cadence?.sequence?.find(s => s.node_id === activeStep));
	}, [cadence, activeStep]);

	return (
		<ErrorBoundary>
			<div className={styles.settings}>
				{activeStep ? (
					stepSetupMap({
						type: step?.type === "linkedin" ? `linkedin_${step?.data?.type}` : step?.type,
						step,
					})
				) : (
					<>
						<h2 className={styles.title}>
							{CADENCE_TRANSLATION.STEP_SET_UP[user?.language?.toUpperCase()]}
						</h2>
						<div className={styles.container}>
							<StepsSetup />
							<span>
								{CADENCE_TRANSLATION.STEPS_TO_CONFIGURE[user?.language?.toUpperCase()]}
							</span>
						</div>
					</>
				)}
			</div>
		</ErrorBoundary>
	);
};

export default StepSettings;
