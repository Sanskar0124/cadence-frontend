import styles from "./piechartCardv2.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import {
	LEAD_TOOLTIP,
	PIECHARTTASKCOLORS,
	TASK_TOOLTIP,
	PIECHARTEMPTYSTATE,
} from "../../constants";
import { InfoCircle, NoTasksPiechart } from "@cadence-frontend/icons";
import { Skeleton, Title } from "@cadence-frontend/components";
import { INITIAL_EMPTY_STATE, INITIAL_PIE_STATE, TASKS_AND_PEOPLE } from "./constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import Tooltip from "../Tooltip/Tooltip";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const PiechartCardv2 = ({ data, loading, type, makeCapital }) => {
	const user = useRecoilValue(userInfo);
	const totalTasks = data?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const [tasks, setTasks] = useState(INITIAL_PIE_STATE[type.toUpperCase()]);
	const [emptyState, setEmptyState] = useState(INITIAL_EMPTY_STATE[type.toUpperCase()]);

	useEffect(() => {
		if (data) {
			setTasks(
				INITIAL_PIE_STATE[type.toUpperCase()].map(task => {
					let taskToBeUpdated = data?.find(t => t.name === task.name);
					if (taskToBeUpdated) return taskToBeUpdated;
					return task;
				})
			);
		} else {
			setEmptyState(
				INITIAL_EMPTY_STATE[type.toUpperCase()].map(task => {
					let taskToBeUpdated = data?.find(t => t.name === task.name);
					if (taskToBeUpdated) return taskToBeUpdated;
					return task;
				})
			);
		}
	}, [data]);

	return (
		<div
			className={styles.piechartcard}
			style={{
				width:
					user?.integration_type === INTEGRATION_TYPE?.SALESFORCE ||
					user?.integration_type === INTEGRATION_TYPE?.HUBSPOT
						? "34%"
						: "49.5%",
			}}
		>
			<div className={styles.piechartcard_header}>
				<Title size="1.25rem" className={styles.piechartcard_title}>
					{type === "tasks"
						? TASKS_TRANSLATION.TASKS[user?.language?.toUpperCase()]
						: TASKS_TRANSLATION.PEOPEL[user?.language?.toUpperCase()]}
				</Title>
				<Tooltip text={type === "tasks" ? TASK_TOOLTIP : LEAD_TOOLTIP}>
					<InfoCircle />
				</Tooltip>
			</div>

			<div className={styles.piechartcontent}>
				<div className={styles.piechartcontent_piechart}>
					{!loading ? (
						totalTasks > 0 ? (
							<ResponsiveContainer width={185} height={185}>
								<PieChart width={300} height={300}>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={"58%"}
										outerRadius={"75%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
									>
										{data.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={PIECHARTTASKCOLORS?.[entry.name]}
												/>
											);
										})}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<ResponsiveContainer width={185} height={185}>
								<PieChart width={300} height={300}>
									<Pie
										data={emptyState}
										cx="50%"
										cy="50%"
										innerRadius={"58%"}
										outerRadius={"75%"}
										fill="#8884d8"
										dataKey="value"
										strokeWidth={3}
									>
										{emptyState.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={PIECHARTEMPTYSTATE?.[entry.name]}
												/>
											);
										})}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						)
					) : (
						<Skeleton className={styles.piePlaceholder} />
					)}
					<div className={styles.piechartcontent_center}>
						{!loading ? (
							totalTasks > 0 ? (
								<>
									<div className={styles.piechartcontent_center_value}>{totalTasks}</div>
									<div className={styles.piechartcontent_center_exception}>
										{type === "tasks" ? (
											<>{TASKS_TRANSLATION.TOTAL_TASKS[user?.language?.toUpperCase()]}</>
										) : (
											<>{TASKS_TRANSLATION.PEOPEL[user?.language?.toUpperCase()]}</>
										)}
									</div>
								</>
							) : (
								<>
									<div className={styles.piechartcontent_center_value}>0</div>
									<div className={styles.piechartcontent_center_exception}>
										{type === "tasks" ? (
											<>{TASKS_TRANSLATION.TOTAL_TASKS[user?.language?.toUpperCase()]}</>
										) : (
											<>{TASKS_TRANSLATION.PEOPEL[user?.language?.toUpperCase()]}</>
										)}
									</div>
								</>
							)
						) : (
							<></>
						)}
					</div>
				</div>
				{!loading ? (
					totalTasks > 0 ? (
						<div className={styles.piechartcontent_details}>
							{tasks.map(entry => {
								return (
									<div className={styles.detailcard_row1} key={entry.name}>
										<div className={styles.value}>
											<div
												className={`${styles.colorbox} ${styles[`box_${entry.name}`]}`}
											></div>
											<div className={styles.name}>
												{TASKS_AND_PEOPLE[entry.name][user?.language.toUpperCase()]}
											</div>
										</div>
										<div
											className={`${styles.tasknumber} ${
												styles[`fontColor_${entry.name}`]
											}`}
										>
											{entry.value}
										</div>
										<div
											className={`${styles.tasknumber} ${
												styles[`fontColor_${entry.name}`]
											}`}
										>
											{((entry.value / totalTasks) * 100).toFixed()}%
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className={styles.piechartcontent_details}>
							{emptyState.map(entry => {
								return (
									<div className={styles.detailcard_row1} key={entry.name}>
										<div className={styles.value}>
											<div className={`${styles.colorbox1}`}></div>
											<div className={styles.name}>
												{TASKS_AND_PEOPLE[entry.name][user?.language.toUpperCase()]}
											</div>
										</div>
										<div className={`${styles.tasknumber1} ${styles.tasknumber}`}>0</div>
										<div className={`${styles.tasknumber} ${styles.tasknumber1}`}>0%</div>
									</div>
								);
							})}
						</div>
					)
				) : (
					<div className={styles.piechartcontent_details}>
						{[...Array(3).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PiechartCardv2;
