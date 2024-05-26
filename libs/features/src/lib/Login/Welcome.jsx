import { CadenceLogo } from "@cadence-frontend/icons";
import ConnectRingover from "./ConnectRingover/ConnectRingover";
import styles from "./Login.module.scss";
import { useQuery } from "@cadence-frontend/utils";
import { Tour as TOUR_TRANSLATION } from "@cadence-frontend/languages";

const Welcome = () => {
	const query = useQuery();
	const language = query.get("lang") ?? "ENGLISH";

	return (
		<div className={styles.welcome}>
			<div className={styles.logo}>
				<CadenceLogo size="38px" />
				<div>
					<span>Cadence</span>
					<span>by Ringover</span>
				</div>
			</div>
			<div className={styles.title}>
				{TOUR_TRANSLATION.WELCOME_TO_CADENCE[language?.toUpperCase()]} 👋
			</div>
			<div className={styles.subtitle}>
				{TOUR_TRANSLATION.RINGOVER_CONNECTION[language?.toUpperCase()]}
			</div>
			<ConnectRingover width="342px" />
			<div className={styles.marquee}>
				<img
					src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/onboarding_homepage.svg"
					alt=""
				/>
			</div>
		</div>
	);
};

export default Welcome;
