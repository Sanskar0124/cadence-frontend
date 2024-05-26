import { powerDelay, powerInfo, timeElapsed, userInfo } from "@cadence-frontend/atoms";
import { Tooltip } from "@cadence-frontend/components";
import { POWER_STATUS, POWER_TASK_STATUS } from "@cadence-frontend/constants";
import {
	Next,
	PauseYellowGradient,
	PlayGreenGradient,
	Power,
	Stop,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { StopPowerModal, ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./PowerControls.module.scss";
import { useUser } from "@cadence-frontend/data-access";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

const PowerControls = ({ stopPower }) => {
	const timeoutRef = useRef(null);
	const recoilUser = useRecoilValue(userInfo);
	const [power, setPower] = useRecoilState(powerInfo);
	const [seconds, setSeconds] = useRecoilState(powerDelay);
	const [stopModal, setStopModal] = useState(false);
	const { user } = useUser({ user: true });

	const onCountDown = () => setSeconds(prev => prev - 1);

	useEffect(() => {
		if (
			power.status === POWER_STATUS.BOOSTED &&
			power.tasks?.find(
				task => task.active && task.status === POWER_TASK_STATUS.COMPLETED
			)
		) {
			if (seconds === 1) {
				timeoutRef.current = setTimeout(() => {
					onCountDown();
					changeToNextPowerTask();
				}, 1000);
			} else if (seconds !== 0) timeoutRef.current = setTimeout(onCountDown, 1000);
			else {
				if (user?.focus_delay) setSeconds(user?.focus_delay);
				else changeToNextPowerTask();
			}
		}
		return () => clearTimeout(timeoutRef.current);
	}, [power, seconds]);

	const changeToNextPowerTask = () => {
		if (power.status !== POWER_STATUS.BOOSTED) return;
		setPower(prev => {
			let tasks = prev.tasks;
			let nextTaskIndex = null;
			tasks = tasks.map((task, index) => {
				if (task.active) {
					nextTaskIndex = index + 1;
					return { ...task, active: false };
				}
				if (nextTaskIndex === index) {
					return { ...task, active: true };
				}
				return task;
			});
			return { ...prev, tasks };
		});
		setSeconds(0);
		clearTimeout(timeoutRef.current);
	};

	const onPowerStatusChange = status => {
		setPower(prev => ({ ...prev, status }));
	};

	return (
		<div className={styles.container}>
			<div className={styles.powerControls}>
				<div className={styles.logo}>
					<Power />
				</div>
				<Tooltip text={TASKS_TRANSLATION.STOP_FOCUS[recoilUser?.language?.toUpperCase()]}>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						onClick={() => setStopModal(true)}
						height="36px"
						width="36px"
					>
						<Stop color={Colors.red} size="20px" />
					</ThemedButton>
				</Tooltip>
				{power.status === POWER_STATUS.PAUSED && (
					<Tooltip
						text={TASKS_TRANSLATION.RESUME_FOCUS[recoilUser?.language?.toUpperCase()]}
					>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={() => onPowerStatusChange(POWER_STATUS.BOOSTED)}
							height="36px"
							width="36px"
						>
							<PlayGreenGradient size="20px" />
						</ThemedButton>
					</Tooltip>
				)}
				{power.status === POWER_STATUS.BOOSTED && (
					<Tooltip
						text={TASKS_TRANSLATION.PAUSE_FOCUS[recoilUser?.language?.toUpperCase()]}
					>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={() => onPowerStatusChange(POWER_STATUS.PAUSED)}
							height="36px"
							width="36px"
						>
							<PauseYellowGradient size="20px" />
						</ThemedButton>
					</Tooltip>
				)}
				{Boolean(user?.focus_delay) && (
					<Tooltip
						text={TASKS_TRANSLATION.NEXT_TASK[recoilUser?.language?.toUpperCase()]}
					>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							onClick={changeToNextPowerTask}
							height="36px"
							width="36px"
							disabled={Boolean(
								power.status !== POWER_STATUS.BOOSTED ||
									power.tasks?.find(
										task => task.active && task.status !== POWER_TASK_STATUS.COMPLETED
									)
							)}
						>
							<Next size="13px" />
						</ThemedButton>
					</Tooltip>
				)}
				<StopPowerModal
					modal={stopModal}
					setModal={setStopModal}
					onStopPower={stopPower}
				/>
			</div>
			{Boolean(user?.focus_delay) && (
				<div
					className={styles.timer}
					style={{
						background:
							power?.status === POWER_STATUS.BOOSTED
								? "linear-gradient(107deg, rgba(162, 130, 232, 0.09) -11.57%, rgba(126, 142, 231, 0.09) 50.39%, rgba(68, 153, 233, 0.09) 116.35%)"
								: "linear-gradient(135deg,rgba(255, 207, 77, 0.2) 0%,rgba(255, 155, 74, 0.2) 100%)",
					}}
				>
					<CircularProgressbar
						value={seconds ?? 0}
						text={`${seconds ?? 0}`}
						maxValue={user?.focus_delay || 0}
						counterClockwise
						styles={{
							path: {
								stroke:
									power.status === POWER_STATUS.BOOSTED
										? Colors.mainPurple
										: Colors.orange,
							},
							trail: { stroke: "transparent" },
							text: {
								fill:
									power.status === POWER_STATUS.BOOSTED
										? Colors.mainPurple
										: Colors.orange,
								fontSize: "30px",
								fontWeight: "700",
							},
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default PowerControls;
