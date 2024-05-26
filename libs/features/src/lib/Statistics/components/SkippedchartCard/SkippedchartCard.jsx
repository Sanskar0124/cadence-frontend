import styles from "./SkippedchartCard.module.scss";
import { useEffect, useState } from "react";
import {
	COLORS,
	SKIPPEDPIECHARTCOLORS,
	SKIPPED_EMPTY_STATE_COLORS,
} from "../../constants";
import { NoTasksPiechart } from "@cadence-frontend/icons";
import { Skeleton } from "@cadence-frontend/components";
import { INITIAL_PIE_CHART_STATE } from "./constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";

const SkippedchartCard = ({ data, loading }) => {
	const newData = data?.sort((a, b) => b.value - a.value).slice(0, 10);
	const totalTasks = newData?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const user = useRecoilValue(userInfo);
	const emptyState = [{ name: "Other", value: 100 }];

	return (
		<div className={styles.piechartcard}>
			<div className={styles.piechartcontent}>
				<div className={styles.piechartcontent_piechart}>
					{!loading ? (
						totalTasks > 0 ? (
							<ResponsiveContainer width={190} height={190}>
								<PieChart width="100%" height="100%" className={styles.piechart}>
									<Pie
										data={newData}
										cx="50%"
										cy="50%"
										innerRadius={"25%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
									>
										{newData.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={SKIPPEDPIECHARTCOLORS?.[index]}
												/>
											);
										})}
									</Pie>
									<Pie
										data={newData}
										stroke="0.1"
										cx="50%"
										cy="50%"
										innerRadius={"32%"}
										outerRadius={"45%"}
										fill="#F5F6F7"
										dataKey="value"
									></Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<ResponsiveContainer width={190} height={190}>
								<PieChart width="100%" height="100%" className={styles.piechart}>
									<Pie
										data={INITIAL_PIE_CHART_STATE.SKIPPED_TASK}
										cx="50%"
										cy="50%"
										innerRadius={"25%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
										startAngle={320}
										endAngle={-40}
									>
										{INITIAL_PIE_CHART_STATE.SKIPPED_TASK.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={SKIPPED_EMPTY_STATE_COLORS?.[index]}
												/>
											);
										})}
									</Pie>
									<Pie
										data={INITIAL_PIE_CHART_STATE.SKIPPED_TASK}
										stroke="0.1"
										cx="50%"
										cy="50%"
										innerRadius={"32%"}
										outerRadius={"45%"}
										fill="#fdfdfd"
										dataKey="value"
									></Pie>
								</PieChart>
							</ResponsiveContainer>
						)
					) : (
						<Skeleton className={styles.piePlaceholder} />
					)}

					{!loading ? (
						totalTasks > 0 ? (
							<div
								className={` ${styles.piechartcontent_center} ${styles.piechartcontent_center_value}`}
							>
								{totalTasks}
							</div>
						) : (
							<div
								className={` ${styles.piechartcontent_center} ${styles.piechartcontent_center_value}`}
							>
								0
							</div>
						)
					) : (
						<></>
					)}
				</div>
				{!loading ? (
					totalTasks > 0 ? (
						<div className={styles.piechartcontent_details}>
							{newData?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div className={styles.detailcard_row1}>
										<div
											className={`${styles.detailcard_row1_colorbox} ${
												styles[`box_${index}`]
											}`}
										></div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${index}`]
											}`}
										>
											{entry.value}
										</div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${index}`]
											}`}
										>
											{((entry.value / totalTasks) * 100).toFixed()}%
										</div>
										<div className={styles.detailcard_row1_name}>
											{entry.name === "alreadydone"
												? "Already completed"
												: entry.name === "nomails"
												? "Did not want mails"
												: entry.name === "duplicatelead"
												? "Duplicate lead"
												: entry.name}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.piechartcontent_details}>
							{emptyState?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div className={styles.detailcard_row1}>
										<div
											className={`${styles.detailcard_row1_colorbox} ${styles.detailcard_row1_colorbox1}`}
										></div>
										<div
											className={`${styles.detailcard_row1_value} ${styles.detailcard_row1_value_emptystate}`}
										>
											0
										</div>
										<div
											className={`${styles.detailcard_row1_value} ${styles.detailcard_row1_value_emptystate}`}
										>
											0%
										</div>
										<div className={styles.detailcard_row1_name}>Other</div>
									</div>
								</div>
							))}
						</div>
					)
				) : (
					<div className={styles.piechartcontent_details}>
						{[...Array(10).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SkippedchartCard;
