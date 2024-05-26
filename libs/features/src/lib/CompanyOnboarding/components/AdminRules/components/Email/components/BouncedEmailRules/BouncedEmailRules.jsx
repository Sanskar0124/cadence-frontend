//components
import { Title } from "@cadence-frontend/components";
import SingleBounceSetting from "./components/SingleBounceSetting/SingleBounceSetting";

import styles from "./BouncedEmailRules.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const BouncedEmailRules = ({
	bouncedMailSettings: data,
	setBouncedMailSettings: setData,
}) => {
	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.settingsTypeContainer} id="bounced_email_rules">
			<div className={styles.header}>
				<Title size="1.3rem" className={styles.title}>
					{SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES[user?.language?.toUpperCase()]}{" "}
				</div>
			</div>
			<Title className={styles.title} size="1.1rem">
				{SETTINGS_TRANSLATION.TASKS_SKIPPED_IF_BOUNCED[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.description}>
				{
					SETTINGS_TRANSLATION.TASK_SKIPPED_IF_EMAIL_BOUNCES[
						user?.language?.toUpperCase()
					]
				}
			</div>
			{data && <SingleBounceSetting data={data} setData={setData} />}
		</div>
	);
};

export default BouncedEmailRules;
