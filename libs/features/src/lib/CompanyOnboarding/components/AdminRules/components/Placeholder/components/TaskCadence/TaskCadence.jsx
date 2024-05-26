import styles from "./TaskCadence.module.scss";
import { Skeleton, Title } from "@cadence-frontend/components";
import { TASK_OPTIONS } from "./constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const TaskCadence = () => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.settingsTypeContainer}>
			<div className={styles.header}>
				<Title size="1.3rem">
					{SETTINGS_TRANSLATION.MAXIMUM_TASKS[user?.language?.toUpperCase()]}
				</Title>
			</div>
			<div className={styles.settingBody}>
				<div className={styles.setting}>
					<Title size="1.1rem" className={styles.title}>
						{SETTINGS_TRANSLATION.MAX_TASKS_PER_USER[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.description}>
						{SETTINGS_TRANSLATION.USER_DAILY_LIMIT_TASK[user?.language?.toUpperCase()]}
					</div>
					<Skeleton className={styles.placeholder} />
				</div>
				<div className={styles.setting}>
					<Title size="1.1rem" className={styles.title}>
						{SETTINGS_TRANSLATION.PRIORITY_SPLIT[user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.description}>
						{
							SETTINGS_TRANSLATION.PRIORITY_SPLIT_BETWEEN_HIGH_AND_STANDARD[
								user?.language?.toUpperCase()
							]
						}
					</div>
					<Skeleton className={styles.placeholder} />
				</div>
				<Title size="1.1rem" className={styles.title}>
					{SETTINGS_TRANSLATION.TASK_SPLIT[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{SETTINGS_TRANSLATION.ENTER_VALUES_FOR_TASK[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.setting}>
					{TASK_OPTIONS.map(taskOption => (
						<Skeleton className={styles.placeholder} key={taskOption.fieldName} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TaskCadence;
