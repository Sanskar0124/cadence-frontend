import {
	powerInfo,
	timeElapsed as timeElapsedAtom,
	userInfo,
} from "@cadence-frontend/atoms";
import { POWER_STATUS, POWER_TASK_STATUS } from "@cadence-frontend/constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./PowerTasksOverview.module.scss";

const PowerTasksOverview = ({ tasksDataAccess, filterTasksForPower }) => {
	const recoilUser = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);
	const [timeElapsed, setTimeElapsed] = useRecoilState(timeElapsedAtom);

	const { tasks, taskLoading } = tasksDataAccess;

	useEffect(() => {
		let timeout;
		if (power.status === POWER_STATUS.BOOSTED) {
			timeout = setTimeout(() => {
				setTimeElapsed(prev => ({ ...prev, power: prev.power + 1 }));
			}, 1000);
		}
		return () => clearTimeout(timeout);
	}, [power, timeElapsed]);

	const renderSeconds = () => {
		return timeElapsed.power > 59
			? timeElapsed.power - Math.floor(timeElapsed.power / 60) * 60
			: timeElapsed.power;
	};

	return (
		<div
			className={`${styles.container}  ${
				power.status === POWER_STATUS.BOOSTED ? styles.boosted : ""
			}`}
		>
			<div className={styles.tasks}>
				<span>
					{TASKS_TRANSLATION.TOTAL_TASKS_IN_QUEUE[recoilUser?.language?.toUpperCase()]} :{" "}
				</span>
				<span>
					{taskLoading
						? "Calculating"
						: power.status === POWER_STATUS.IN_SETUP
						? tasks?.filter(task => filterTasksForPower(task))?.length
						: power.tasks.filter(t => t.status === POWER_TASK_STATUS.PENDING)?.length}
				</span>
			</div>
			<div className={styles.time}>
				<span>
					{TASKS_TRANSLATION.ELAPSED_TIME[recoilUser?.language?.toUpperCase()]}:{" "}
				</span>
				<span>
					{Math.floor(timeElapsed.power / 3600)
						.toString()
						.padStart(2, "0")}
					:
					{Math.floor(timeElapsed.power / 60)
						.toString()
						.padStart(2, "0")}
					:{renderSeconds().toString().padStart(2, "0")}
				</span>
			</div>
			<div className={styles.divider} />
		</div>
	);
};

export default PowerTasksOverview;
