import styles from "./Email.module.scss";
import { Skeleton, Title } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Email as EMAIL_TRANSLATION } from "@cadence-frontend/languages";

const Email = () => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.settingBlock}>
			<Title size="1.1rem">
				{COMMON_TRANSLATION.EMAILS[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.divider} />
			<div className={styles.container}>
				<div className={styles.title}>
					<h2>{SETTINGS_TRANSLATION.SENDING_CALENDER[user?.language?.toUpperCase()]}</h2>
					<p>
						{SETTINGS_TRANSLATION.SENDING_CALENDER_DESC[user?.language?.toUpperCase()]}
					</p>
					<div className={styles.exceptions}>
						{[...Array(2).keys()].map(key => (
							<Skeleton className={styles.btnPlaceholder} key={key} />
						))}
					</div>
				</div>
				<div className={styles.settings}>
					<div className={styles.setting}>
						<h2 className={styles.title}>
							{SETTINGS_TRANSLATION.DAYS_AND_TIMING[user?.language.toUpperCase()]}
						</h2>
						<p className={styles.description}>
							{
								SETTINGS_TRANSLATION.SCHEDULE_FOR_OUTGOING_MAIL[
									user?.language.toUpperCase()
								]
							}
						</p>
						{[...Array(2).keys()].map(key => (
							<Skeleton className={styles.placeholder} key={key} />
						))}
					</div>
					<div className={styles.setting}>
						<h2>{SETTINGS_TRANSLATION.EMAILS_PER_DAY[user?.language.toUpperCase()]}</h2>
						<p>
							{
								SETTINGS_TRANSLATION.MAXIMUM_VALUE_FOR_EMAILS[
									user?.language.toUpperCase()
								]
							}
						</p>
						<Skeleton className={styles.placeholder} />
					</div>
					<div className={styles.setting}>
						<h2>{SETTINGS_TRANSLATION.SMS_PER_DAY[user?.language.toUpperCase()]}</h2>
						<p>
							{SETTINGS_TRANSLATION.MAXIMUM_VALUE_FOR_SMS[user?.language.toUpperCase()]}
						</p>
						<Skeleton className={styles.placeholder} />
					</div>
					<div className={styles.setting}>
						<h2>
							{
								SETTINGS_TRANSLATION.TIME_BETWEEN_EMAILS_AND_SMS[
									user?.language?.toUpperCase()
								]
							}
						</h2>
						<p>
							{
								SETTINGS_TRANSLATION.DELAY_TIME_BETWEEN_MAILS_AND_SMS[
									user?.language.toUpperCase()
								]
							}
						</p>
						<Skeleton className={styles.placeholder} />
					</div>
					{[...Array(3).keys()].map(key => (
						<Skeleton key={key} className={styles.placeholder} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Email;
