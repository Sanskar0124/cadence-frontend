/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { CadenceLogo, Linkedin } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { PageContainer } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./LinkedinExtensionSuccess.module.scss";

const LinkedinExtensionSuccess = ({ user }) => {
	return (
		<div className={styles.parentContainer}>
			<div className={styles.container2}>
				<div className={styles.logo}>
					<CadenceLogo size="38px" />
					<div>
						<span>Cadence</span>
						<span>By Ringover</span>
					</div>
				</div>
				<div className={styles.content}>
					<h2>Login Successful</h2>
					<p>
						Your login to the Ringover extension was successful. You can continue your
						work on LinkedIn.
					</p>
					<ThemedButton
						onClick={() => window.close()}
						theme={ThemedButtonThemes.WHITE}
						width="fit-content"
					>
						<Linkedin />
						{COMMON_TRANSLATION.GO_BACK_TO_LINKEDIN[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
				<div className={styles.bgLogo1}>
					<CadenceLogo size="180px" />
				</div>
				<div className={styles.bgLogo2}>
					<CadenceLogo size="170px" />
				</div>
				<div className={styles.bgLogo3}>
					<CadenceLogo size="400px" />
				</div>
			</div>
		</div>
	);
};

export default LinkedinExtensionSuccess;
