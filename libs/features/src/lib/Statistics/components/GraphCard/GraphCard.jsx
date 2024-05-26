import styles from "./GraphCard.module.scss";
import {
	LineChart,
	BarChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Bar,
} from "recharts";
import { Colors } from "@cadence-frontend/utils";
import { useState } from "react";
import { GRAPHFILTER_OPTIONS } from "../../constants";
import { Skeleton } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const GraphCard = ({ data, loading, width, height, type, activeGraph }) => {
	const user = useRecoilValue(userInfo);
	const totalTasks = data?.reduce(
		(prevVal, curr) =>
			prevVal +
			(curr?.done ? curr?.done : 0) +
			(curr?.bounced ? curr?.bounced : 0) +
			(curr?.clicked ? curr?.clicked : 0) +
			(curr?.opened ? curr?.opened : 0) +
			(curr?.unsubscribed ? curr?.unsubscribed : 0) +
			(curr?.delivered ? curr?.delivered : 0),
		0
	);

	const xAxisTickFormatter = value =>
		value === 9 || value === 11 ? `${value}AM` : `${value}PM`;

	const CustomTooltip = ({ active, payload, label }) => {
		const contentrow = (index, req) => {
			return (
				<div className={styles.customtooltip_content}>
					<div
						className={`${styles.customtooltip_content_circle} ${
							index === 1
								? styles.bounced
								: index === 2
								? styles.delivered
								: index === 3
								? styles.unsubscribed
								: index === 4
								? styles.opened
								: index === 5
								? styles.clicked
								: styles.blue
						}`}
					></div>
					<div className={styles.customtooltip_content_value}>
						{Object.values(req)?.[index]}
					</div>
					<div className={styles.customtooltip_content_text}>
						{Object.keys(req)?.[index]}
					</div>

					{/* <div
						className={`${styles.customtooltip_content_change} ${
							Object.values(req)?.[index + 2] > 0 ? styles.increase : styles.decrease
						}`}>
						{Object.values(req)?.[index + 2] > 0 ? "+" : ""}
						{`${Object.values(req)?.[index + 2]}%`}
					</div> */}
				</div>
			);
		};

		if (active && payload) {
			let req = payload?.[0]?.payload;
			// console.log(Object.keys(req));
			return (
				<div className={styles.customtooltip}>
					<div className={styles.customtooltip_label}>{label}</div>
					{contentrow(1, req)}
					{(type === "email" || type === "automated_mail") && contentrow(2, req)}
					{(type === "email" || type === "automated_mail") && contentrow(3, req)}
					{(type === "email" || type === "automated_mail") && contentrow(4, req)}
					{(type === "email" || type === "automated_mail") && contentrow(5, req)}
				</div>
			);
		}
		return null;
	};

	return (
		<div className={styles.graph}>
			{activeGraph === "line" && (
				<>
					{!loading ? (
						totalTasks > 0 ? (
							<LineChart
								width={width}
								height={height}
								data={data}
								margin={{
									top: 20,
									right: 0,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									padding={{
										left: 50,
										right: 50,
										bottom: 0,
										top: 0,
									}}
									stroke={Colors.blueShade1}
								/>
								<YAxis axisLine={false} tickLine={false} />
								<Tooltip
									cursor={{
										strokeWidth: "10.3%",
										stroke: "#4B90E2",
										strokeOpacity: 0.2,
									}}
									content={<CustomTooltip />}
								/>
								{!loading ? (
									totalTasks > 0 && (
										<>
											<Line
												type="monotone"
												dataKey={"done"}
												stroke="#4B90E2"
												strokeWidth={1.8}
												activeDot={{
													fill: Colors.white,
													stroke: "#4B90E2",
													r: 3,
												}}
											/>
											{(type === "email" || type === "automated_mail") && (
												<>
													<Line
														type="monotone"
														dataKey="bounced"
														stroke={Colors.red}
														strokeWidth={1.8}
														activeDot={{
															fill: Colors.white,
															stroke: Colors.red,
														}}
													/>
													<Line
														type="monotone"
														dataKey="unsubscribed"
														stroke={Colors.pink}
														strokeWidth={1.8}
														activeDot={{
															fill: Colors.white,
															stroke: Colors.pink,
														}}
													/>
													<Line
														type="monotone"
														dataKey="delivered"
														stroke={Colors.green}
														strokeWidth={1.8}
														activeDot={{
															fill: Colors.white,
															stroke: Colors.green,
														}}
													/>
													<Line
														type="monotone"
														dataKey="opened"
														stroke={Colors.darkBlue}
														strokeWidth={1.8}
														activeDot={{
															fill: Colors.white,
															stroke: Colors.darkBlue,
														}}
													/>
													<Line
														type="monotone"
														dataKey="clicked"
														stroke={Colors.blueShade1}
														strokeWidth={1.8}
														activeDot={{
															fill: Colors.white,
															stroke: Colors.blueShade1,
														}}
													/>
												</>
											)}
										</>
									)
								) : (
									<></>
								)}
							</LineChart>
						) : (
							<LineChart
								width={width}
								height={height}
								data={data}
								margin={{
									top: 20,
									right: 0,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									// ticks={[9, 11, 1, 3, 4, 5, 6, 7, 8]}
									// domain={["auto", "auto"]}
									axisLine={false}
									tickLine={false}
									padding={{
										left: 50,
										right: 50,
										bottom: 0,
										top: 0,
									}}
									// tickFormatter={xAxisTickFormatter}
									tick={{ fill: "#778F9B" }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									ticks={[0, 25, 50, 75]}
									domain={[0, 75]}
									tick={{ fill: "#778F9B" }}
								/>
							</LineChart>
						)
					) : (
						<div className={styles.linePlaceholders}>
							{[...Array(4).keys()].map(key => (
								<Skeleton className={styles.linePlaceholder} />
							))}
						</div>
					)}
				</>
			)}

			{activeGraph === "bar" && (
				<>
					{!loading ? (
						totalTasks > 0 ? (
							<BarChart
								width={width}
								height={height}
								data={data}
								margin={{
									top: 20,
									right: 0,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									padding={{
										left: 50,
										right: 50,
										bottom: 0,
										top: 0,
									}}
									stroke={Colors.blueShade1}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									// ticks={[0, 25, 50, 75]}
									// domain={[0, 75]}
									tick={{ fill: "#778F9B" }}
								/>
								<Tooltip
									cursor={{
										strokeWidth: "0.5%",
										fill: "#4B90E2",
										fillOpacity: 0.2,
									}}
									content={<CustomTooltip />}
								/>

								{(type === "email" || type === "automated_mail") && (
									<>
										<Bar stackId="a" dataKey="unsubscribed" fill={Colors.pink} />
										<Bar stackId="a" dataKey="bounced" fill={Colors.red} />
										<Bar stackId="a" dataKey="delivered" fill={Colors.green} />
										<Bar stackId="a" dataKey="opened" fill={Colors.darkBlue} />
										<Bar stackId="a" dataKey="clicked" fill={Colors.blueShade1} />
									</>
								)}
								{/* {(type === "call" && type==="callback")(
								<Bar stackId="a" dataKey="outgoing" fill={Colors.blueShade1} />
							)}
							{type === "data_check" && (
								<Bar stackId="a" dataKey="completed" fill={Colors.blueShade1} />
							)} */}
								{(type === "message" ||
									type === "automated_message" ||
									type === "linkedin" ||
									type === "whatsapp" ||
									type === "email" ||
									type === "automated_mail" ||
									type === "cadence_custom" ||
									type === "call" ||
									type === "data_check" ||
									type === "done_tasks") && (
									<Bar dataKey="done" stackId="a" fill={Colors.blueShade1} />
								)}
								{/* {type === "done_tasks" && (
								<Bar dataKey="count" stackId="a" fill={Colors.blueShade1} />
							)} */}
							</BarChart>
						) : (
							<BarChart
								width={width}
								height={height}
								data={data}
								margin={{
									top: 20,
									right: 0,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									padding={{
										left: 50,
										right: 50,
										bottom: 0,
										top: 0,
									}}
									// ticks={[9, 11, 1, 3, 4, 5, 6, 7, 8]}
									// domain={[0, 24]}
									// tickFormatter={xAxisTickFormatter}
									tick={{ fill: "#778F9B" }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									ticks={[0, 25, 50, 75]}
									domain={[0, 75]}
									tick={{ fill: "#778F9B" }}
								/>
							</BarChart>
						)
					) : (
						<div className={styles.placeholder}>
							{[...Array(7).keys()].map(key => (
								<Skeleton className={styles.barPlaceholder} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default GraphCard;
