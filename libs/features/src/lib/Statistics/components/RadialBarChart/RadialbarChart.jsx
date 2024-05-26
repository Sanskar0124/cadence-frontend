import styles from "./RadialbarChart.module.scss";
import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { COLORS, PIECHARTTASKCOLORS, PIECHARTLEADCOLORS } from "../../constants";
import { NoTasksPiechart } from "@cadence-frontend/icons";
import { Skeleton } from "@cadence-frontend/components";
import { INITIAL_RADIAL_BAR_STATE } from "./constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const RadialbarChartCard = () => {
	const data = [
		{
			name: "A",
			fill: "#5B6BE1",
			x: 3100,
		},
		{
			name: "B",
			x: 3298,
			fill: "#037DFC",
		},
		{
			name: "C",
			x: 1413,
			fill: "#5eead4",
		},
		{
			name: "D",
			x: 1156,
			fill: "#fb7185",
		},
	];
	return (
		<div className={styles.radialbarchartcard}>
			<div className={styles.radialbarchartcontent}>
				{INITIAL_RADIAL_BAR_STATE.OPPORTUNITIES.map(entry => (
					<div className={styles.detailcard_row1}>
						<div
							className={styles.colorbox}
							style={{ backgroundColor: entry.color }}
						></div>
						<div className={styles.value}>
							<div className={styles.name}>{entry.name}</div>
							<div className={styles.tasknumber} style={{ color: entry.color }}>
								{entry.value}
							</div>
							<div
								className={`${styles.percentage} ${styles.tasknumber}`}
								style={{ color: entry.color }}
							>
								{entry.percentage}%
							</div>
						</div>
					</div>
				))}
			</div>
			<div className={styles.radialbarchartfigure}>
				<div className={styles.radialbarchartfigure_chart}>
					<RadialBarChart
						width={210}
						height={210}
						data={data}
						innerRadius="20%"
						outerRadius="80%"
						startAngle={270}
						endAngle={-90}
						barSize={10}
					>
						<RadialBar minAngle={0} dataKey="x" background clockWise={true} />
					</RadialBarChart>
				</div>
				<div className={styles.radialbarchartfigure_details}>
					<span className={styles.totalleads}>13425</span>
					<span className={styles.leadname}>Total Leads</span>
				</div>
			</div>
		</div>
	);
};

export default RadialbarChartCard;
