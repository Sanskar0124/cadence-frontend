/* eslint-disable react/jsx-no-useless-fragment */
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

const makeFirstLetterCapital = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const GraphCard = ({ data, loading, width, height, type, activeGraph }) => {
	const user = useRecoilValue(userInfo);

	const CustomTooltip = ({ active, payload, label }) => {
		const contentrow = (index, req) => {
			return (
				<div className={styles.customtooltip_content}>
					<div
						className={`${styles.customtooltip_content_circle} ${
							index === 1 ? styles.blue : index === 2 ? styles.orange : styles.red
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
			return (
				<div className={styles.customtooltip}>
					<div className={styles.customtooltip_label}>{label}</div>
					{contentrow(1, req)}
					{(type === "email" || type === "automated_mail") && contentrow(2, req)}
					{(type === "email" || type === "automated_mail") && contentrow(3, req)}
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
								tickFormatter={data?.length === 7 && makeFirstLetterCapital}
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
							{!loading && (
								<>
									<Line
										type="monotone"
										dataKey={type === "done_tasks" ? "done" : "sent"}
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
												stroke="#FF9B4A"
												strokeWidth={1.8}
												activeDot={{
													fill: Colors.white,
													stroke: "#FF9B4A",
												}}
											/>
											<Line
												type="monotone"
												dataKey="unsubscribed"
												stroke="#FF9A9A"
												strokeWidth={1.8}
												activeDot={{
													fill: Colors.white,
													stroke: "#FF9A9A",
												}}
											/>
										</>
									)}
								</>
							)}
						</LineChart>
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
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					{!loading ? (
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
								tickFormatter={data?.length === 7 && makeFirstLetterCapital}
							/>
							<YAxis axisLine={false} tickLine={false} />
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
									<Bar stackId="a" dataKey="unsubscribed" fill={Colors.redShade3} />
									<Bar stackId="a" dataKey="bounced" fill={Colors.orange} />
								</>
							)}
							{type === "call" && (
								<Bar stackId="a" dataKey="outgoing" fill={Colors.blueShade1} />
							)}
							{type === "callback" && (
								<Bar stackId="a" dataKey="sent" fill={Colors.blueShade1} />
							)}

							{type === "data_check" && (
								<Bar stackId="a" dataKey="completed" fill={Colors.blueShade1} />
							)}
							{(type === "message" ||
								type === "automated_message" ||
								type === "linkedin" ||
								type === "whatsapp" ||
								type === "email" ||
								type === "automated_mail" ||
								type === "cadence_custom") && (
								<Bar dataKey="sent" stackId="a" fill={Colors.blueShade1} />
							)}
							{type === "done_tasks" && (
								<Bar dataKey="done" stackId="a" fill={Colors.blueShade1} />
							)}
						</BarChart>
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
