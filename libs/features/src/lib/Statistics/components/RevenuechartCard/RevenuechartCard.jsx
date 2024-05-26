import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import styles from "./RevenuechartCard.module.scss";
import { Colors } from "@cadence-frontend/utils";

const RevenuechartCard = ({ width, height }) => {
	const data = [
		{
			name: "Jan",
			uv: 40,
			pv: 24,
		},
		{
			name: "Feb",
			uv: 30,
			pv: 13,
		},
		{
			name: "March",
			uv: 20,
			pv: 60,
		},
		{
			name: "April",
			uv: 27,
			pv: 39,
		},
		{
			name: "May",
			uv: 18,
			pv: 48,
		},
		{
			name: "Jun",
			uv: 23,
			pv: 38,
		},
		{
			name: "Jul",
			uv: 34,
			pv: 43,
		},
		{
			name: "Aug",
			uv: 39,
			pv: 40,
		},
		{
			name: "Sep",
			uv: 43,
			pv: 62,
		},
		{
			name: "Oct",
			uv: 35,
			pv: 46,
		},
		{
			name: "Nov",
			uv: 45,
			pv: 43,
		},
		{
			name: "Dec",
			uv: 54,
			pv: 43,
		},
	];

	return (
		<div className={styles.revenuechartcard}>
			<div className={styles.chartfigure}>
				<LineChart
					width={width}
					height={height}
					data={data}
					margin={{ top: 5, left: -20 }}
				>
					<CartesianGrid
						vertical={false}
						stroke={Colors.veryLightBlue}
						strokeDasharray="1 1"
						cursor={"none"}
					/>
					<XAxis dataKey="name" axisLine={false} stroke={Colors.veryLightBlue} />
					<YAxis
						type="number"
						ticks={[5, 10, 20, 30, 40, 50, 60]}
						tickCount={6}
						axisLine={false}
						stroke={Colors.veryLightBlue}
					/>
					<Tooltip />
					{/* <Legend /> */}
					<Line type="monotone" dataKey="pv" stroke="#28C2FF" />
					<Line type="monotone" dataKey="uv" stroke="#47E5BC" />
				</LineChart>
			</div>
		</div>
	);
};

export default RevenuechartCard;
