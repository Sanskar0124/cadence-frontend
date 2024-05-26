import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { CadenceLogo } from "@cadence-frontend/icons";
import { useState } from "react";
import styles from "./Onboarding.module.scss";
import { renderView } from "./constants";

const Onboarding = () => {
	const [progress, setProgress] = useState(0);
	const [currentStep, setCurrentStep] = useState(
		parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.ONBOARDING_CS) ?? 0)
	);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.logo}>
					<CadenceLogo size="38px" />
					<div>
						<span>Cadence</span>
						<span>By Ringover</span>
					</div>
				</div>
				<div className={styles.progress}>
					<div className={styles.bar1} />
					<div className={styles.bar2}>
						<div className={styles.completed} style={{ width: `${progress}%` }} />
					</div>
				</div>
			</div>
			<div className={styles.body}>
				{renderView(currentStep, {
					setCurrentStep,
					setProgress,
				})}
			</div>
			<div className={styles.bgLogo}>
				<CadenceLogo size="680px" />
			</div>
		</div>
	);
};
export default Onboarding;
