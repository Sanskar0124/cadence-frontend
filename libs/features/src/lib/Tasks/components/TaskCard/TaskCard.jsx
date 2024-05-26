/* eslint-disable no-console */
import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { Div, Tooltip } from "@cadence-frontend/components";
import {
	CUSTOM_TASK_NODE_IDS,
	ENUMS,
	LANGUAGES,
	LEAD_WARMTH,
	POWER_STATUS,
} from "@cadence-frontend/constants";
import {
	CustomTaskGradient,
	Hot,
	PowerGradient,
	Timezone,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { TooltipThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import "moment-timezone";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { VIEW_MODES } from "../../constants";
import { getTaskEnum } from "../utils";
import styles from "./TaskCard.module.scss";

const TaskCard = ({
	userTimeZone,
	task,
	onClick,
	active,
	cardInfoWidth,
	viewMode,
	loading = false,
	index,
}) => {
	const user = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);
	const [timeString, setTimeString] = useState("");
	const task_enum = ENUMS[task?.Node?.type ?? task?.name];

	const isDisabled = () => {
		if (power.status === POWER_STATUS.BOOSTED || power.status === POWER_STATUS.PAUSED) {
			return !power.tasks.find(t => t.task_id === task.task_id)?.active;
		}
		return false;
	};

	useEffect(() => {
		if (task?.Lead && task?.Lead.Lead_phone_numbers) {
			let ph =
				task?.Lead.Lead_phone_numbers.filter(phone => phone.is_primary)[0] ||
				task?.Lead.Lead_phone_numbers[0];
			if (ph?.timezone) {
				setTimeString(`${moment().tz(ph?.timezone).format("hh:mm A")}, ${ph?.timezone}`);
			} else setTimeString(null);
		}
	}, [task?.Lead?.Lead_phone_numbers, task?.Lead]);

	return (
		<Div
			loading={loading}
			className={`${styles.card} ${active ? styles.active : ""} ${
				loading ? styles.loading : ""
			} ${isDisabled() ? styles.disabled : ""}`}
			onClick={isDisabled() ? () => null : onClick}
			id={index === 0 ? "first-task" : null}
		>
			<div
				className={styles.left}
				style={{ ...(viewMode === VIEW_MODES.TASK && { overflow: "hidden" }) }}
			>
				<div className={styles.icon}>
					{power.status === POWER_STATUS.BOOSTED ||
					power.status === POWER_STATUS.PAUSED ? (
						<PowerGradient />
					) : (
						task_enum?.icon?.gradient ??
						(ENUMS["linkedin"]?.type[getTaskEnum(task)] ? (
							ENUMS["linkedin"].icon?.gradient
						) : (
							<CustomTaskGradient />
						))
					)}
				</div>
				<div
					className={`${styles.taskInfo} ${
						task?.Lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD ? styles.isHotLead : ""
					}`}
					style={{
						...(viewMode !== VIEW_MODES.TASK && { minWidth: "400px", maxWidth: "400px" }),
					}}
				>
					<div>
						<span>{task_enum?.name[user?.language?.toUpperCase()]}</span>
						{task_enum?.name[user?.language?.toUpperCase()] && <i>•</i>}
						<span>
							{moment(
								task?.completed
									? task?.complete_time
									: CUSTOM_TASK_NODE_IDS.includes(task?.Node?.node_id)
									? task?.start_time
									: task?.shown_time
							).fromNow()}
						</span>

						{task?.Cadence && !CUSTOM_TASK_NODE_IDS.includes(task?.Node?.node_id) && (
							<>
								<i>•</i>
								<span>
									{task?.Node?.step_number}/{task?.Cadence?.Nodes.length}{" "}
									{COMMON_TRANSLATION.STEPS[user?.language?.toUpperCase()]}
								</span>
							</>
						)}

						<span
							className={`${styles.hotLead} ${
								viewMode !== VIEW_MODES.TASK &&
								task?.Lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD
									? styles.view
									: styles.hide
							}`}
						>
							<Hot />
						</span>
					</div>
					<div>
						<p className={viewMode === VIEW_MODES.TASK && styles.small}>
							{task?.Cadence?.name ?? "Custom Task"}
						</p>
					</div>
				</div>
				{viewMode !== VIEW_MODES.TASK && (
					<div className={styles.leadContainer}>
						<div className={styles.leadInfo}>
							<div>
								<span>{task?.Lead?.Account?.name ?? ""}</span>

								{task?.Lead?.Account?.size && (
									<>
										<i>•</i>
										<span>{task?.Lead?.Account?.size ?? ""}</span>
									</>
								)}
							</div>
							<br />
							<div>
								<p>
									{(task?.Lead?.first_name ?? "") + " " + task?.Lead?.last_name ?? ""}
								</p>{" "}
								{timeString && (
									<Tooltip
										theme={TooltipThemes.RIGHT}
										text={timeString}
										className={styles.timezone}
									>
										<Timezone
											color={
												moment.tz(userTimeZone).format("z") ===
												moment
													.tz(
														task?.Lead.Lead_phone_numbers.filter(
															phone => phone.is_primary
														)[0]?.timezone || task?.Lead.Lead_phone_numbers[0]?.timezone
													)
													.format("z")
													? Colors.lightBlue
													: Colors.orange
											}
											size="1.2rem"
										/>
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={styles.right}>
				<div className={styles.tags}>
					{!!task?.completed && (
						<div
							className={`${styles.done} ${
								user?.language === LANGUAGES.SPANISH && styles.increasewidth
							}`}
						>
							{COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
						</div>
					)}
					{!!task?.Node?.is_urgent && (
						<div
							className={`${styles.urgent} ${
								user?.language === LANGUAGES.SPANISH && styles.increasewidth
							}`}
						>
							{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}
						</div>
					)}
					{!!task?.Node?.isLate && (
						<div
							className={`${styles.late} ${
								user?.language === LANGUAGES.SPANISH && styles.increasewidth
							}`}
						>
							{" "}
							{TASKS_TRANSLATION.LATE[user?.language?.toUpperCase()]}
						</div>
					)}
					{CUSTOM_TASK_NODE_IDS.includes(task?.Node?.node_id) && (
						<div
							className={`${styles.custom} ${
								user?.language === LANGUAGES.SPANISH && styles.increasewidth
							}`}
						>
							{TASKS_TRANSLATION.REMINDER[user?.language?.toUpperCase()]}
						</div>
					)}
					{!!task?.Lead?.duplicate && (
						<div
							className={`${styles.duplicate} ${
								user?.language === LANGUAGES.SPANISH && styles.increasewidth
							}`}
						>
							{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
						</div>
					)}
				</div>
			</div>
		</Div>
	);
};

export default TaskCard;
