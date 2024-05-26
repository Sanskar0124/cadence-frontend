import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./LogActivities.module.scss";

export const getLOG_TYPES = TRANSLATIONS => {
	const LOGS_TYPES = {};
	LOGS_TYPES.MAIL = TRANSLATIONS.SYNC_YOUR_EMAIL_ACTIVITIES;
	LOGS_TYPES.CALENDAR = TRANSLATIONS.SYNC_YOUR_CALENDAR_ACTIVITIES;
	LOGS_TYPES.NOTE = TRANSLATIONS.SYNC_YOUR_NOTE_ACTIVITIES;
	return LOGS_TYPES;
};

export const getNoteDoc = (user, TRANSLATIONS) => {
	switch (user.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<>
					{/* <p>{TRANSLATIONS.LOG_NOTE_ACTIVITIES[user?.language?.toUpperCase()]}</p> */}
					<div className={styles.helpLinks}>
						<a
							href={
								user?.language === "english"
									? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044321-salesforce-onboarding"
									: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044321-int%C3%A9gration-salesforce"
							}
							target="_blank"
							rel="noreferrer"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
						<a
							href="https://www.loom.com/share/abcc7018b64b45caa9e435e915827f3b"
							target="_blank"
							rel="noreferrer"
						>
							{COMMON_TRANSLATION.WATCH_VIDEO[user?.language?.toUpperCase()]}
						</a>
					</div>
				</>
			);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <p>{TRANSLATIONS.LOG_NOTE_ACTIVITIES[user?.language?.toUpperCase()]}</p>;
		default:
			return "";
	}
};
