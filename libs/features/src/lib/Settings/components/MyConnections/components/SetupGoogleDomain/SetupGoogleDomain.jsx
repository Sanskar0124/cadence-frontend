import { userInfo } from "@cadence-frontend/atoms";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import styles from "./SetupGoogleDomain.module.scss";
import { Link2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

const SetupGoogleDomain = () => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.container} id={SEARCH_OPTIONS.SETUP_GOOGLE_DOMAIN}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.SETUP_GOOGLE_DOMAIN[user?.language?.toUpperCase()]}</h2>
				<p>
					{
						SETTINGS_TRANSLATION.WE_REQUIRE_YOUR_G_SUIT_ACCOUNT[
							user?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<a
					href="https://support.ringover.com/hc/en-us/articles/18290747474449-V%C3%A9rification-Google-OAuth-Configuration-de-l-organisation"
					target="_blank"
					rel="noreferrer"
				>
					<Link2 color={Colors.blue} />{" "}
					{
						SETTINGS_TRANSLATION.DOCUMENTATION_TO_SETUP_DOMAIN[
							user?.language.toUpperCase()
						]
					}
				</a>
			</div>
		</div>
	);
};

export default SetupGoogleDomain;
