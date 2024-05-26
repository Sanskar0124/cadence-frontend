import { userInfo } from "@cadence-frontend/atoms";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { getHomepageSteps } from "../../constants";
import styles from "./Homepage.module.scss";
import { Home as HOME_TRANSLATION } from "@cadence-frontend/languages";
import Language from "../../../CompanyOnboarding/components/General/components/Language/Language";

const Homepage = ({ setCurrentStep }) => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	const user = useRecoilValue(userInfo);
	useEffect(() => {
		sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_ONBOARDING_CS, -1);
	}, []);
	return (
		<div className={styles.homepage}>
			<div className={styles.titles}>
				<div className={styles.title}>
					{HOME_TRANSLATION.WELCOME_TO_CADENCE[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subtitle}>
					{
						HOME_TRANSLATION.IN_FEW_SHORT_STEPS_CONNECT_YOUR_CRM[
							user?.language?.toUpperCase()
						]
					}
				</div>
				<div className={styles.selectLang}>
					<Language isHome />
				</div>
				<div className={styles.startButton}>
					<ThemedButton
						className={styles.button}
						theme={ThemedButtonThemes.PRIMARY}
						onClick={() => setCurrentStep(0)}
						width="200px"
					>
						<div>{HOME_TRANSLATION.LETS_GET_STARTED[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
				<div className={styles.marquee}>
					<img
						src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/onboarding_homepage.svg"
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
