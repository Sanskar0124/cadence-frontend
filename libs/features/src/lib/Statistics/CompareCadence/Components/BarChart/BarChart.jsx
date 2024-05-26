import { Skeleton, Title } from "@cadence-frontend/components";
import React, { useState, useEffect, useRef } from "react";
import styles from "./BarChart.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Statistics as STATISTICS_TRANSLATION } from "@cadence-frontend/languages";
import {
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Bar,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { Colors } from "@cadence-frontend/utils";
import {
	BAR_CHART_COLORS,
	EMPTY_STATE,
	LEADS_OPTION,
	TASKS_OPTION,
} from "../../Constants";

const BarChartCard1 = ({ Kpitask, kpi, isLoading, setIsSelectKpiModalShow }) => {
	const [data, setData] = useState({ data: [], loading: true, totalCount: 0, width: 0 });
	const graphRef = useRef(null);
	// const finalData = kpi?.responseData?.flatMap(item => item[Kpitask.type]);
	// .filter(item => item.count !== 0 && item.percentage !== 0);

	// const datakeyVal = finalData?.flatMap(
	// 	item =>
	// 		Object.keys(item) ||
	// 		[]?.filter(item => item !== "cadence_id" && item !== "cadence_name")
	// );
	// const all_matched = datakeyVal.slice(1).every(element => element === datakeyVal[0]);

	useEffect(() => {
		setIsSelectKpiModalShow(prev => ({ ...prev, isLoading: true }));
		const IsKeyPersent = Object.keys(kpi?.responseData[0]).includes(Kpitask.type);
		if (IsKeyPersent) {
			const kpidata = kpi?.responseData?.flatMap(item => item[Kpitask.type]);

			const renderedData =
				!kpidata.includes(undefined) &&
				kpidata.map(finalItem => {
					const foundCardData = kpi?.cardData.find(
						cardItem => cardItem?.data?.name === finalItem.cadence_name
					);
					return foundCardData
						? { ...finalItem, indexOfBtn: foundCardData.indexOfBtn }
						: null;
				});
			if (renderedData?.length > 0 && !renderedData.includes(undefined)) {
				setData(prev => ({
					...prev,
					data: [...renderedData],
					totalCount: renderedData.reduce((acc, curr) => acc + curr.count, 0),
					width: graphRef.current.getBoundingClientRect().width,
				}));
			}
		}
	}, [kpi.responseData]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsSelectKpiModalShow(prev => ({ ...prev, isLoading: false }));
		}, 1200);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [data]);

	const user = useRecoilValue(userInfo);

	const xAxisTickFormatter = value => ``;
	const yAxisTickFormatter = value => {
		if (value === 0 || value === "0") return value;
		else return `${value}%`;
	};
	const newYAxisLabels = value => value + 10;
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.custom_tooltip}>
					<p className={styles.custom_tooltip_label}>
						{Object.keys(TASKS_OPTION).includes(Kpitask.type)
							? TASKS_OPTION[Kpitask.type]
							: LEADS_OPTION[Kpitask.type]}{" "}
					</p>
					<p className={styles.custom_tooltip_content}>
						<span className={styles.custom_tooltip_content_name}>{label}</span>
						&nbsp;:&nbsp;
						<span className={styles.custom_tooltip_content_value}>
							{payload[0].value}
						</span>
					</p>
				</div>
			);
		}

		return null;
	};
	return (
		<div className={styles.barchartcontainer}>
			<Title
				size="16px"
				className={styles.barchartcontainer_title}
				// style={{
				// 	left: isFullWidth && "2.5%",
				// Kpitask.comparisonType === "percentage_values"
				// 	? isFullWidth
				// 		? "2.1%"
				// 		: "2.2%"
				// 	:
				// Kpitask.comparisonType === "absolute_values"
				// 	? isFullWidth
				// 		? "2.4%"
				// 		: "3.2%"
				// 	: "3%",
				// }}
			>
				{Object.keys(TASKS_OPTION).includes(Kpitask.type)
					? TASKS_OPTION[Kpitask.type]
					: LEADS_OPTION[Kpitask.type]}
			</Title>

			<div className={styles.barchartcontainer_chart} ref={graphRef}>
				<div className={styles.barchartcontainer_chart_chartgraph}>
					{!isLoading ? (
						data?.totalCount > 0 ? (
							<ResponsiveContainer width="93%" height="80%">
								<BarChart
									width={670}
									height={340}
									data={data.data}
									margin={{ top: 70, left: 30 }}
									// barSize={150}
									// maxBarSize={700}
								>
									<CartesianGrid
										stroke={Colors.veryLightBlue}
										strokeDasharray="1 4"
										vertical={false}
										cursor={"none"}
									/>
									<XAxis
										dataKey="cadence_name"
										stroke={Colors.veryLightBlue}
										axisLine={false}
										tickLine={false}
										textAnchor="middle"
										label={{
											value: "Cadences",
											fill: "#8193A8",
											position: "insideBottom",
											style: { fontSize: "12px" },
										}}
										tickFormatter={xAxisTickFormatter}
										dy={100}
									/>

									<YAxis
										datakey="count"
										// dataKey={all_matched ? datakeyVal[0] : ""}
										stroke={Colors.veryLightBlue}
										axisLine={false}
										tickLine={false}
										dx={-10}
										// tickFormatter={
										// 	Kpitask.comparisonType === "percentage_values" && yAxisTickFormatter
										// }
									/>
									<Tooltip cursor={false} content={CustomTooltip} />

									<Bar
										// dataKey={all_matched ? datakeyVal[0] : ""}
										dataKey="count"
										stackId="a"
										maxBarSize={300}
										radius={3}
										fontSize={10}
										barSize={data.width > 700 || data.data.length < 3 ? 200 : 90}
										minPointSize={3}
									>
										{data?.data?.length > 0 &&
											data?.data?.map((entry, index) => (
												<Cell
													key={`cell-${entry?.cadence_name}`}
													fill={BAR_CHART_COLORS?.[entry.indexOfBtn]}
												/>
											))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<ResponsiveContainer width="93%" height="80%">
								<BarChart
									width={670}
									height={340}
									data={EMPTY_STATE.slice(0, data.data?.length)}
									margin={{ top: 70, left: 30 }}
									barSize={150}
									maxBarSize={700}
								>
									<CartesianGrid
										stroke={Colors.veryLightBlue}
										strokeDasharray="1 4"
										vertical={false}
										cursor={"none"}
									/>
									<XAxis
										stroke={Colors.veryLightBlue}
										axisLine={false}
										tickLine={false}
										textAnchor="middle"
										label={{
											value: "Cadences",
											fill: "#8193A8",
											position: "insideBottom",
											style: { fontSize: "12px" },
										}}
										tickFormatter={xAxisTickFormatter}
										dy={100}
									/>

									<YAxis
										domain={[0, 1000]}
										ticks={[0, 200, 400, 600, 800, 1000]}
										stroke={Colors.veryLightBlue}
										axisLine={false}
										tickLine={false}
										dx={-10}
									/>

									<Bar
										dataKey="count"
										stackId="a"
										maxBarSize={110}
										barSize={data.width > 700 || data.data.length < 3 ? 200 : 90}
										radius={3}
										fontSize={10}
									>
										{EMPTY_STATE.slice(0, data.data?.length)?.map((entry, index) => (
											<Cell key={`cell-${entry?.name}`} fill={"#E4E6EA"} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)
					) : (
						<div className={styles.barchartcontainer_barchartplaceholder}>
							{[...Array(4).keys()].map(key => (
								<Skeleton className={styles.placeholder} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BarChartCard1;
