import React, { useState } from "react";
import {
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar,
	ResponsiveContainer,
	Cell,
} from "recharts";
import styles from "./BarchartCard.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { Skeleton } from "@cadence-frontend/components";

const emptyStateData = [
	{ name: "Call", value: 50 },
	{ name: "Callback", value: 50 },
	{ name: "Email", value: 50 },
	{ name: "SMS", value: 50 },
	{ name: "Linkedin", value: 50 },
	{ name: "Data", value: 50 },
	{ name: "Custom", value: 50 },
];

const BarchartCard = ({ data, type, loading }) => {
	const skippedChartData = data?.filter(item => item.value > 0);
	const [focusBar, setFocusBar] = useState(null);
	const [mouseLeave, setMouseLeave] = useState(true);

	const hoverOnBar = state => {
		if (state.isTooltipActive) {
			setFocusBar(state.activeTooltipIndex);
			setMouseLeave(false);
		} else {
			setFocusBar(null);
			setMouseLeave(true);
		}
	};

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.custom_tooltip}>
					<p className={styles.custom_tooltip_label}>{label} </p>
					<p
						className={styles.custom_tooltip_content}
					>{`Tasks skipped : ${payload[0].value}`}</p>
				</div>
			);
		}

		return null;
	};

	const data1 = [
		{ name: "A", x: 12, y: 23, z: 122, w: 40 },
		{ name: "B", x: 22, y: 3, z: 73, w: 50 },
		{ name: "C", x: 13, y: 15, z: 32, w: 18 },
		{ name: "D", x: 44, y: 35, z: 23, w: 20 },
		{ name: "E", x: 35, y: 45, z: 20, w: 10 },
		{ name: "F", x: 62, y: 25, z: 29, w: 15 },
		{ name: "G", x: 37, y: 17, z: 61, w: 37 },
		{ name: "H", x: 28, y: 32, z: 45, w: 47 },
		{ name: "I", x: 19, y: 43, z: 93, w: 67 },
	];

	const yAxisTickFormatter = value => `${value}%`;

	const makeFirstLetterCapital = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	return (
		<>
			{
				!loading ? (
					type === "skipped" && skippedChartData?.length > 0 ? (
						<div className={styles.skippedbarchart}>
							<BarChart
								width={500}
								height={240}
								data={skippedChartData}
								onMouseMove={hoverOnBar}
								margin={{ right: 1 }}
							>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									stroke={Colors.veryLightBlue}
									axisLine={false}
									tickLine={false}
									dy={10}
									textAnchor="middle"
								/>

								<YAxis
									dataKey="value"
									stroke={Colors.veryLightBlue}
									axisLine={false}
									tickLine={false}
									dx={-10}
								/>

								<Tooltip cursor={false} content={CustomTooltip} />

								<Bar dataKey="value" stackId="a" maxBarSize={80} radius={3} fontSize={10}>
									{data?.map((entry, index) => (
										<Cell
											fill={
												focusBar === index || mouseLeave
													? "#FB7A96"
													: "rgba(251, 122, 150, 0.2)"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</div>
					) : (
						<div className={styles.skippedbarchart}>
							<BarChart width={500} height={240} data={emptyStateData}>
								<CartesianGrid
									stroke={Colors.veryLightBlue}
									strokeDasharray="1 4"
									vertical={false}
									cursor={"none"}
								/>
								<XAxis
									dataKey="name"
									stroke={Colors.veryLightBlue}
									axisLine={false}
									tickLine={false}
									dy={10}
								/>

								<YAxis
									dataKey="value"
									stroke={Colors.veryLightBlue}
									axisLine={false}
									tickLine={false}
									dx={-10}
									domain={[0, 1000]}
									ticks={[0, 200, 400, 600, 800, 1000]}
								/>

								<Bar dataKey="value" stackId="a" maxBarSize={90} radius={3} fontSize={10}>
									{emptyStateData?.map((entry, index) => (
										<Cell fill="#E4E6EA" />
									))}
								</Bar>
							</BarChart>
						</div>
					)
				) : (
					<div className={styles.barchartcard_details}>
						{[...Array(6).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)

				// :(
				// <div className={styles.barchartcard}>
				//     <div className={styles.barchart_figure}>
				//         <BarChart width={600} height={200} data={data1}>
				//             <CartesianGrid stroke={Colors.veryLightBlue}
				//                                 strokeDasharray="1 1"
				//                                 vertical={false}
				//                                 cursor={"none"} />
				//             <YAxis domain={[0,100]} ticks={[0,20,40,60,80,100]} dataKey="name" tickFormatter={yAxisTickFormatter} stroke={Colors.veryLightBlue}  />
				//             <Tooltip  cursor={{
				//                                     strokeWidth: "0.5%",
				//                                     fill: "#4B90E2",
				//                                     fillOpacity: 0.2,
				//                                 }}/>
				//             <Bar dataKey="x" stackId="a" fill="#5B6BE1" barSize={15} />
				//             <Bar dataKey="y" stackId="a" fill="#037DFC" barSize={15}/>
				//             <Bar dataKey="z" stackId="a" fill="#5eead4" barSize={15} />
				//             <Bar dataKey="w" stackId="a" fill="#fb7185" barSize={15}/>
				//             {/* <Legend/> */}
				//         </BarChart>
				//         </div>
				//         <div className={styles.figurecaption}>
				//             <span>Active cadences</span>
				//         </div>
				// </div>
				// )
			}
		</>
	);
};

export default BarchartCard;
