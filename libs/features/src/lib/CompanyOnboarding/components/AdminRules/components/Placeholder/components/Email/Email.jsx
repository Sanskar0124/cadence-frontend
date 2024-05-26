import styles from "./Email.module.scss";
import { Skeleton, Title } from "@cadence-frontend/components";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Email as EMAIL_TRANSLATION } from "@cadence-frontend/languages";

const Email = () => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.settingsTypeContainer}>
			<div className={styles.header}>
				<Title size="1.4rem" className={styles.title}>
					{SETTINGS_TRANSLATION.SENDING_CALENDER[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet{" "}
				</div>
			</div>
			<div className={styles.settingBody}>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.description}></div>
					{[...Array(2).keys()].map(key => (
						<Skeleton className={styles.placeholder} key={key} />
					))}
				</div>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{
							EMAIL_TRANSLATION.MAXIMUM_AUTOMATED_MAIL_SENT_PER_DAY_PER_USER[
								user?.language?.toUpperCase()
							]
						}
					</Title>
					<div className={styles.description}></div>
					<Skeleton className={styles.placeholder} />
				</div>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{SETTINGS_TRANSLATION.MAX_SMS_SENT[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.description}></div>
					<Skeleton className={styles.placeholder} />
				</div>
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						{
							SETTINGS_TRANSLATION.TIME_BETWEEN_EMAILS_AND_SMS[
								user?.language?.toUpperCase()
							]
						}
					</Title>
					<div className={styles.description}></div>
					<Skeleton className={styles.placeholder} />
				</div>
			</div>
		</div>
	);
};

export default Email;
