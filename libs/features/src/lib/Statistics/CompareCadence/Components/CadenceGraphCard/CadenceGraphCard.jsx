import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
	LineChart as LineChartIcon,
	BarChart as BarChartIcon,
	Settings,
} from "@cadence-frontend/icons";
import styles from "./CadenceGraphCard.module.scss";
import { Title, Skeleton } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import {
	LineChart,
	BarChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Bar,
	ResponsiveContainer,
} from "recharts";
import { TASKS_OPTION, LEADS_OPTION, BAR_CHART_COLORS } from "../../Constants";

const CadenceGraphCard = ({
	Kpitask,
	kpi,
	isLoading,
	setIsSelectKpiModalShow,
	isFullWidth,
}) => {
	const [newData, setNewData] = useState({
		data: [],
		btnIndex: [],
		dataKeys: [],
		totalCount: 0,
	});

	useEffect(() => {
		setIsSelectKpiModalShow(prev => ({ ...prev, isLoading: true }));
		const IsKeyPersent = Object.keys(kpi?.responseData[0]).includes(Kpitask.type);
		if (IsKeyPersent) {
			const kpiData = kpi?.responseData?.flatMap(item => item[Kpitask.type]);

			const renderedData =
				!kpiData.includes(undefined) &&
				kpiData?.reduce((result, { name, count, cadence_name }) => {
					const existingEntry = result.find(entry => entry.name === name);
					if (existingEntry) {
						existingEntry[cadence_name] = count;
					} else {
						const newEntry = { name, [cadence_name]: count };
						result.push(newEntry);
					}
					return result;
				}, []);

			const updatedRenderedData =
				renderedData?.length > 0 &&
				renderedData?.map(item => {
					const newItem = { ...item };
					Object.keys(item).forEach(item1 => {
						let foundData = kpi?.cardData.find(obj => obj?.data?.name === item1);
						if (foundData) {
							newItem[`${item1} btnIndex`] = foundData.indexOfBtn;
						}
					});
					return newItem;
				});

			const datakeys =
				updatedRenderedData?.length > 0 &&
				!updatedRenderedData.includes(undefined) &&
				Object?.keys(updatedRenderedData[0]).filter(item => {
					let foundData = kpi?.cardData.find(obj => obj?.data?.name === item);
					return foundData ? item : null;
				});

			const filteredBtnIndex =
				updatedRenderedData?.length > 0 &&
				!updatedRenderedData.includes(undefined) &&
				Object.entries(updatedRenderedData[0])
					.filter(([key]) => key.endsWith(" btnIndex"))
					.map(([, value]) => value);

			const totalCount =
				renderedData?.length > 0 &&
				!renderedData.includes(undefined) &&
				renderedData.reduce((prevVal, curr) => {
					const keys = Object?.keys(curr);
					if (keys?.length > 1) {
						return (
							prevVal +
							(curr[keys[1]] ? curr[keys[1]] : 0) +
							(curr[keys[2]] ? curr[keys[2]] : 0) +
							(curr[keys[3]] ? curr[keys[3]] : 0) +
							(curr[keys[4]] ? curr[keys[4]] : 0)
						);
					}
					return prevVal;
				}, 0);

			if (
				updatedRenderedData?.length > 0 &&
				datakeys?.length > 0 &&
				filteredBtnIndex?.length > 0
			) {
				setNewData(prev => ({
					...prev,
					data: [...updatedRenderedData],
					btnIndex: [...filteredBtnIndex],
					dataKeys: [...datakeys],
					totalCount: totalCount,
				}));
			}
		}
	}, [kpi.responseData]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsSelectKpiModalShow(prev => ({ ...prev, isLoading: false }));
		}, 1700);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [newData.data]);

	const [activeGraph, setActiveGraph] = useState("bar");

	const yAxisTickFormatter = value => {
		if (value === 0 || value === "0") return value;
		else return `${value}%`;
	};

	const xAxisTickFormatter = value => {
		if (newData?.data.length > 2) {
			if (Kpitask.filter === "this_week" || Kpitask.filter === "last_week")
				return value?.slice(0, 3);
			else return value;
		}
	};

	const CustomTooltip = ({ active, payload, label }) => {
		const contentrow = (index, req, btnIndex) => {
			return (
				<div className={styles.customtooltip_content}>
					<div
						className={`${styles.customtooltip_content_circle} ${
							btnIndex === 0
								? styles.mainpurple
								: btnIndex === 1
								? styles.green
								: btnIndex === 2
								? styles.darkblue
								: btnIndex === 3
								? styles.pink
								: styles.blue
						}`}
					></div>
					<div className={styles.customtooltip_content_value}>
						{Object?.values(req)?.[index]}
					</div>
					<div className={styles.customtooltip_content_text}>
						{Object?.keys(req)?.[index]}
					</div>
				</div>
			);
		};

		if (active && payload) {
			let req = payload?.[0]?.payload;
			return (
				<div className={styles.customtooltip}>
					<div className={styles.customtooltip_label}>{label}</div>
					{newData.dataKeys[0] && contentrow(1, req, newData.btnIndex[0])}
					{newData.dataKeys[1] && contentrow(2, req, newData.btnIndex[1])}
					{newData.dataKeys[2] && contentrow(3, req, newData.btnIndex[2])}
					{newData.dataKeys[3] && contentrow(4, req, newData.btnIndex[3])}
				</div>
			);
		}
		return null;
	};

	return (
		<div
			className={styles.graphcontainer}
			style={{
				width: isFullWidth && "100%",
			}}
		>
			<div className={styles.graphcontainer_header}>
				<Title
					size="16px"
					className={styles.graphcontainer_header_title}
					style={{
						left: isFullWidth && "2.2%",
						// Kpitask.comparisonType === "percentage_values"
						// 	? isFullWidth
						// 		? "2.1%"
						// 		: "2.5%"
						// 	: Kpitask.comparisonType === "absolute_values"
						// 	? isFullWidth
						// 		? "2.4%"
						// 		: "3.2%"
						// 	: "3%",
					}}
				>
					{Object.keys(TASKS_OPTION).includes(Kpitask.type)
						? TASKS_OPTION[Kpitask.type]
						: LEADS_OPTION[Kpitask.type]}
				</Title>
				<div className={styles.graphcontainer_header_rightbtns}>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						className={activeGraph === "bar" ? styles.active : ""}
						onClick={() => setActiveGraph("bar")}
						height="38px"
						width="50%"
					>
						<BarChartIcon />
					</ThemedButton>
					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						onClick={() => setActiveGraph("line")}
						className={activeGraph === "line" ? styles.active : ""}
						height="38px"
						width="50%"
					>
						<LineChartIcon />
					</ThemedButton>
				</div>
			</div>
			<div className={styles.graphcontainer_chart}>
				<div className={styles.graphcontainer_chart_chartgraph}>
					{activeGraph === "line" && (
						<ResponsiveContainer height="80%" width="95%">
							{!isLoading ? (
								newData?.totalCount > 0 ? (
									<LineChart
										width={isFullWidth ? 670 : 675}
										height={225}
										maxBarSize={200}
										data={newData.data}
										margin={{
											top: 10,
											left: 30,
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
											stroke={Colors.veryLightBlue}
											dy={9}
											padding={{
												left: 20,
												right: 20,
												bottom: 0,
												top: 0,
											}}
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											stroke={Colors.veryLightBlue}
											dx={-10}
											// tickFormatter={
											// 	Kpitask.comparisonType === "percentage_values" && yAxisTickFormatter
											// }
										/>
										<Tooltip cursor={false} content={<CustomTooltip />} />

										{!isLoading ? (
											newData?.totalCount > 0 && (
												<>
													{newData.dataKeys[0] && (
														<Line
															type="monotone"
															dataKey={newData.dataKeys[0] ? newData.dataKeys[0] : ""}
															stroke={`${BAR_CHART_COLORS[newData.btnIndex[0]]}`}
															strokeWidth={1.8}
															dot={false}
														/>
													)}

													{newData.dataKeys[1] && (
														<Line
															type="monotone"
															dataKey={newData.dataKeys[1] ? newData.dataKeys[1] : ""}
															stroke={`${BAR_CHART_COLORS[newData.btnIndex[1]]}`}
															strokeWidth={1.8}
															dot={false}
														/>
													)}
													{newData.dataKeys[2] && (
														<Line
															type="monotone"
															dataKey={newData.dataKeys[2] ? newData.dataKeys[2] : ""}
															stroke={`${BAR_CHART_COLORS[newData.btnIndex[2]]}`}
															strokeWidth={1.8}
															dot={false}
														/>
													)}
													{newData.dataKeys[3] && (
														<Line
															type="monotone"
															dataKey={newData.dataKeys[3] ? newData.dataKeys[3] : ""}
															stroke={`${BAR_CHART_COLORS[newData.btnIndex[3]]}`}
															strokeWidth={1.8}
															dot={false}
														/>
													)}
												</>
											)
										) : (
											<></>
										)}
									</LineChart>
								) : (
									<LineChart
										width={isFullWidth ? 670 : 675}
										height={225}
										maxBarSize={200}
										data={newData.data}
										margin={{
											top: 10,
											left: 30,
										}}
									>
										<CartesianGrid
											stroke={Colors.veryLightBlue}
											strokeDasharray="1 4"
											vertical={false}
											cursor={"none"}
										/>
										<XAxis
											axisLine={false}
											tickLine={false}
											padding={{
												left: 30,
												right: 30,
												bottom: 0,
												top: 0,
											}}
											tick={{ fill: "#778F9B" }}
											dataKey={"name"}
											tickFormatter={
												(Kpitask.filter === "this_week" ||
													Kpitask.filter === "last_week") &&
												xAxisTickFormatter
											}
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
						</ResponsiveContainer>
					)}
					{activeGraph === "bar" && (
						<ResponsiveContainer height="80%" width="95%">
							{!isLoading ? (
								newData?.totalCount ? (
									<BarChart
										width={isFullWidth ? 670 : 675}
										height={225}
										// maxBarSize={200}
										data={newData.data}
										margin={{
											top: 10,
											left: 30,
										}}
										barGap={1.5}
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
											stroke={Colors.veryLightBlue}
											style={{ fontSize: 10, fontWeight: 400 }}
											dy={9}
											padding="gap"
										/>
										<YAxis
											axisLine={false}
											tickLine={false}
											stroke={Colors.veryLightBlue}
											tick={{ fontSize: 1 }}
											dx={-10}
											// tickFormatter={
											// 	Kpitask.comparisonType === "percentage_values" && yAxisTickFormatter
											// }
										/>
										<Tooltip
											cursor={{ fill: Colors.whiteShade1 }}
											content={<CustomTooltip />}
										/>

										{!isLoading ? (
											newData?.totalCount && (
												<>
													{newData.dataKeys[0] && (
														<Bar
															type="monotone"
															dataKey={newData.dataKeys[0] ? newData.dataKeys[0] : ""}
															fill={`${BAR_CHART_COLORS[newData.btnIndex[0]]}`}
															radius={[3, 3, 0, 0]}
															barCategoryGap={20}
															minPointSize={4}
														/>
													)}

													{newData.dataKeys[1] && (
														<Bar
															type="monotone"
															dataKey={newData.dataKeys[1] ? newData.dataKeys[1] : ""}
															fill={`${BAR_CHART_COLORS[newData.btnIndex[1]]}`}
															radius={[3, 3, 0, 0]}
															barCategoryGap={20}
															minPointSize={4}
														/>
													)}
													{newData.dataKeys[2] && (
														<Bar
															type="monotone"
															dataKey={newData.dataKeys[2] ? newData.dataKeys[2] : ""}
															fill={`${BAR_CHART_COLORS[newData.btnIndex[2]]}`}
															radius={[3, 3, 0, 0]}
															barCategoryGap={20}
															minPointSize={4}
														/>
													)}
													{newData.dataKeys[3] && (
														<Bar
															type="monotone"
															dataKey={newData.dataKeys[3] ? newData.dataKeys[3] : ""}
															fill={`${BAR_CHART_COLORS[newData.btnIndex[3]]}`}
															radius={[3, 3, 0, 0]}
															barCategoryGap={20}
															minPointSize={4}
														/>
													)}
												</>
											)
										) : (
											<></>
										)}
									</BarChart>
								) : (
									<BarChart
										width={isFullWidth ? 670 : 675}
										height={225}
										// maxBarSize={200}
										data={newData.data}
										margin={{
											top: 10,
											left: 30,
										}}
										barGap={1.5}
									>
										<CartesianGrid
											stroke={Colors.veryLightBlue}
											strokeDasharray="1 4"
											vertical={false}
											cursor={"none"}
										/>
										<XAxis
											axisLine={false}
											tickLine={false}
											padding={{
												left: 10,
												right: 10,
												bottom: 0,
												top: 0,
											}}
											tickFormatter={
												(Kpitask.filter === "this_week" ||
													Kpitask.filter === "last_week") &&
												xAxisTickFormatter
											}
											dataKey={"name"}
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
								<div className={styles.linePlaceholders}>
									{[...Array(4).keys()].map(key => (
										<Skeleton className={styles.linePlaceholder} />
									))}
								</div>
							)}
						</ResponsiveContainer>
					)}
				</div>
			</div>
		</div>
	);
};

export default React.memo(CadenceGraphCard);
