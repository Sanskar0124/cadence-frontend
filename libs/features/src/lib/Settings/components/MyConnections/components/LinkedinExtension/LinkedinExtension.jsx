import { CadenceLogo } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./LinkedinExtension.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const LinkedinExtension = () => {
	const language = useRecoilValue(userInfo).language;
	return (
		<div className={styles.container} id={SEARCH_OPTIONS.INSTALL_EXTENSION}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.INSTALL_EXTENSION[language?.toUpperCase()]}</h2>
				<p>
					{
						PROFILE_TRANSLATION.INSTALL_EXTENSION_FOR_LINKEDIN_TASKS[
							language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					width="fit-content"
					onClick={() =>
						window.open(
							"https://chrome.google.com/webstore/detail/ringover-cadence/occmhhljphpdnjhpllcdamgcamnlbhoe?hl=fr"
						)
					}
				>
					<CadenceLogo size="24px" />
					<div>
						{PROFILE_TRANSLATION.INSTALL_LINKEDIN_EXTENSION[language?.toUpperCase()]}
					</div>
				</ThemedButton>
			</div>
		</div>
	);
};

export default LinkedinExtension;
