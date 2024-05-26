import styles from "./PiechartCard.module.scss";

import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { COLORS } from "../../constants";
import { NoTasksPiechart } from "@cadence-frontend/icons";
import { Skeleton } from "@cadence-frontend/components";
import { INITIAL_PIE_STATE } from "./constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const PiechartCard = ({ data, loading, type }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const user = useRecoilValue(userInfo);
	const totalTasks = data?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const [tasks, setTasks] = useState(INITIAL_PIE_STATE[type.toUpperCase()]);

	const onPieEnter = (_, index) => {
		setActiveIndex(index);
	};

	useEffect(() => {
		if (data) {
			setTasks(
				INITIAL_PIE_STATE[type.toUpperCase()].map(task => {
					let taskToBeUpdated = data?.find(t => t.name === task.name);
					if (taskToBeUpdated) return taskToBeUpdated;
					return task;
				})
			);
		}
	}, [data]);

	return (
		<div className={styles.piechartcard}>
			<div className={styles.piechartcard_title}>
				{type === "done"
					? TASKS_TRANSLATION.DONE_TASKS[user?.language?.toUpperCase()]
					: STATISTICS_TRANSLATION.PENDING_TASKS[user?.language?.toUpperCase()]}
			</div>
			<div className={styles.piechartcontent}>
				<div className={styles.piechartcontent_piechart}>
					{!loading ? (
						totalTasks > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart width="100%" height="100%">
									<Pie
										activeIndex={activeIndex}
										activeShape={renderActiveShape}
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={"55%"}
										outerRadius={"75%"}
										fill="#8884d8"
										dataKey="value"
										onMouseEnter={onPieEnter}
									>
										{data?.map((entry, index) => (
											<Cell key={`cell-${entry.name}`} fill={COLORS?.[entry.name]} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<NoTasksPiechart style={{ transform: "translateX(56px)" }} />
						)
					) : (
						<Skeleton className={styles.piePlaceholder} />
					)}
					<div className={styles.piechartcontent_center}>
						{totalTasks > 0 && (
							<>
								<div className={styles.piechartcontent_center_value}>{totalTasks}</div>
								<div className={styles.piechartcontent_center_exception}>
									{type === "pending" ? (
										<>
											<span>
												{data?.reduce((prevVal, curr) => prevVal + curr?.urgent, 0)}
											</span>{" "}
											{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}
										</>
									) : (
										<>
											<span>
												{data?.reduce((prevVal, curr) => prevVal + curr?.skipped, 0)}
											</span>{" "}
											{COMMON_TRANSLATION.SKIPPED[user?.language?.toUpperCase()]}
										</>
									)}
								</div>
							</>
						)}
					</div>
				</div>
				{!loading ? (
					totalTasks > 0 ? (
						<div className={styles.piechartcontent_details}>
							{tasks?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div className={styles.detailcard_row1}>
										<div
											className={`${styles.detailcard_row1_colorbox} ${
												styles[`box_${entry.name}`]
											}`}
										></div>
										<div className={styles.detailcard_row1_value}>{entry.value}</div>
										<div className={styles.detailcard_row1_name}>{`${
											entry.name === "linkedin"
												? "linkedin"
												: entry.name === "custom"
												? "custom"
												: entry.name === "whatsapp"
												? "whatsapp"
												: entry.name + "s"
										}`}</div>
									</div>
									<div className={styles.detailcard_row2}>
										<div className={styles.detailcard_row2_colorbox}></div>

										<div className={styles.detailcard_row2_exception}>
											{type === "pending" ? (
												<>
													<div>
														<span>{entry.urgent}</span>{" "}
														{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}{" "}
													</div>
													<div>
														<span>{entry.late}</span>{" "}
														{TASKS_TRANSLATION.LATE[user?.language?.toUpperCase()]}{" "}
													</div>
												</>
											) : (
												<div>
													<span>{entry.skipped}</span>{" "}
													{COMMON_TRANSLATION.SKIPPED[user?.language?.toUpperCase()]}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.noTasks}>
							<p>
								{COMMON_TRANSLATION.CURRENTLY_NO_TASKS[user?.language?.toUpperCase()]}{" "}
								{type === "pending"
									? COMMON_TRANSLATION.PENDING[user?.language?.toUpperCase()]
									: COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
							</p>
						</div>
					)
				) : (
					<div className={styles.piechartcontent_details}>
						{[...Array(6).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PiechartCard;

const renderActiveShape = props => {
	const RADIAN = Math.PI / 180;
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		value,
	} = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 15) * cos;
	const my = cy + (outerRadius + 20) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 10;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				className={styles.hover_text}
				x={ex + (cos >= 0 ? 1 : -1) * 7}
				y={ey + 5}
				textAnchor={textAnchor}
				fill={fill}
			>{`${value} ${payload.name}(s)`}</text>
		</g>
	);
};
