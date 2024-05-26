import { LockGradient } from "@cadence-frontend/icons";

import styles from "./ProhibitedEmailIMC.module.scss";

const ProhibitedEmailIMC = () => {
	return (
		<div className={styles.prohibitedEmailIMC}>
			<div className={styles.icon}>
				<LockGradient />
			</div>
			<h3 className={styles.title}>You cannot access this email</h3>
			<h4 className={styles.subTitle}>
				The email you are trying to access, wasn’t sent by you
			</h4>
		</div>
	);
};

export default ProhibitedEmailIMC;
