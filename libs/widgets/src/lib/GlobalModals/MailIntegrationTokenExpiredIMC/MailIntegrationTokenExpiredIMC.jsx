import { MailUnauthorized } from "@cadence-frontend/icons";
import ThemedButton from "../../ThemedButton/ThemedButton";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useGoogle, useOutlook } from "@cadence-frontend/data-access";

import styles from "./MailIntegrationTokenExpiredIMC.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const MailIntegrationTokenExpiredIMC = ({ title }) => {
	const { signIn: googleSignIn } = useGoogle();
	const { signIn: outlookSignIn } = useOutlook();
	const user = useRecoilValue(userInfo);

	const getSignInFunction = mail_integration_type => {
		switch (mail_integration_type) {
			case MAIL_INTEGRATION_TYPES.GOOGLE:
				return googleSignIn;
			case MAIL_INTEGRATION_TYPES.OUTLOOK:
				return outlookSignIn;
		}
	};

	function capitalize(word) {
		if (!word) return "";
		return word[0].toUpperCase() + word.slice(1, word.length);
	}

	return (
		<div className={styles.mailIntegrationTokenExpiredIMC}>
			<div className={styles.icon}>
				<MailUnauthorized />
			</div>
			<h3 className={styles.title}>{title}</h3>
			<h4 className={styles.subTitle}>
				Sign in with {capitalize(user.mail_integration_type)} to access this feature
			</h4>
			<ThemedButton
				className={styles.btn}
				onClick={() => getSignInFunction(user.mail_integration_type)}
				theme={ThemedButtonThemes.PRIMARY}
			>
				Sign In with {capitalize(user.mail_integration_type)}
			</ThemedButton>
		</div>
	);
};

export default MailIntegrationTokenExpiredIMC;
