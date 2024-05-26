import { MailUnauthorized } from "@cadence-frontend/icons";
import ThemedButton from "../../ThemedButton/ThemedButton";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useGoogle } from "@cadence-frontend/data-access";

import styles from "./GoogleTokenExpiredIMC.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const GoogleTokenExpiredIMC = ({ title }) => {
	const { signIn } = useGoogle();
	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.googleTokenExpiredIMC}>
			<div className={styles.icon}>
				<MailUnauthorized />
			</div>
			<h3 className={styles.title}>{title}</h3>
			<h4 className={styles.subTitle}>
				{
					COMMON_TRANSLATION.SIGN_IN_WITH_GOOGLE_TO_ACCESS_THIS_FEATURE[
						user?.language?.toUpperCase()
					]
				}
			</h4>
			<ThemedButton
				className={styles.btn}
				onClick={signIn}
				theme={ThemedButtonThemes.PRIMARY}
			>
				<div>{COMMON_TRANSLATION.SIGN_IN_WITH_GOOGLE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</div>
	);
};

export default GoogleTokenExpiredIMC;
