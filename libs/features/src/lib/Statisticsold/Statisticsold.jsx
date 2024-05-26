/* eslint-disable no-console */
import { useEffect, useRef, useState } from "react";

import { useStatisticsold } from "@cadence-frontend/data-access";

import styles from "./Statistics.module.scss";
import { Container, Div, Title, Skeleton } from "@cadence-frontend/components";
import PiechartCard from "./components/PiechartCard/PiechartCard";
import GraphCard from "./components/GraphCard/GraphCard";
import RanktableRow from "./components/RanktableRow/RanktableRow";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import SelectUser from "./components/SelectUser/SelectUser";
import { LineChart, BarChart, Download } from "@cadence-frontend/icons";

import { GRAPHFILTER_OPTIONS, TABLE_COLUMNS, TIMERANGEFILTER_OPTIONS } from "./constants";
import { ThemedButton, Select } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import HeatmapFrameTemp from "./components/Heatmap/HeatmapFrameTemp";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
const Statisticsold = () => {
	const [dimensions, setdimensions] = useState({ width: 0, height: 0 });
	const [nodeType, setNodeType] = useState("done_tasks");
	const [userfilter, setUserFilter] = useState([]);
	const [isDrop, setIsDrop] = useState({
		cadenceDropDown: false,
		userDropDown: false,
		filterDropDown: false,
	});

	const user = useRecoilValue(userInfo);
	const role = user.role;

	const [timerangefilter, setTimerangeFilter] = useState("today");
	const [cadenceSelected, setCadenceSelected] = useState({
		personal: [],
		team: [],
		company: [],
	});
	const [activeGraph, setActiveGraph] = useState("line");

	const graphref = useRef(null);

	useEffect(() => {
		setdimensions({
			width: graphref.current.getBoundingClientRect().width,
			height: graphref.current.getBoundingClientRect().height,
		});
	}, []);

	//data access

	const {
		pendingTasks,
		pendingTaskLoading,
		completedTasks,
		completedTaskLoading,
		graphData,
		graphDataLoading,
		setFilters,
		setGraphFilters,
		tableData,
		tableDataLoading,
	} = useStatisticsold({ stats: true }, { role });

	useEffect(() => {
		setFilters({
			filter: timerangefilter,
			cadence_id: Object.values(cadenceSelected).flat(),
			user_ids: userfilter,
		});
	}, [timerangefilter, cadenceSelected, userfilter]);

	useEffect(() => {
		setGraphFilters({
			node_type:
				nodeType === "linkedin"
					? [
							"linkedin_connection",
							"linkedin_message",
							"linkedin_interact",
							"linkedin_profile",
					  ]
					: nodeType === "email"
					? "mail"
					: nodeType,
		});
	}, [nodeType]);

	return (
		<Container className={styles.statistics}>
			<div className={styles.statistics_title}>
				<Title className={styles.pageTitle}>
					{COMMON_TRANSLATION.STATISTICS[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.filter_wrapper}>
					<SelectCadence
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
					/>
					<SelectUser
						usersSelected={userfilter}
						setUsersSelected={setUserFilter}
						cadenceSelected={cadenceSelected}
						isDrop={isDrop}
						setIsDrop={setIsDrop}
					/>
					<Select
						value={timerangefilter}
						setValue={setTimerangeFilter}
						// options={TIMERANGEFILTER_OPTIONS}
						options={Object.keys(TIMERANGEFILTER_OPTIONS).map(opt => ({
							label: TIMERANGEFILTER_OPTIONS[opt][user?.language?.toUpperCase()],
							value: opt,
						}))}
						className={styles.filter}
						dropdownarrow="triangularDropDown"
						numberOfOptionsVisible={6}
						isDrop={isDrop}
						setIsDrop={setIsDrop}
						onMouseEnter={() =>
							setIsDrop(prev => ({
								...prev,
								userDropDown: false,
								cadenceDropDown: false,
							}))
						}
					/>
				</div>
			</div>
			<div className={styles.statistics_body}>
				<div className={styles.statistics_body_piecharts}>
					<PiechartCard data={pendingTasks} loading={pendingTaskLoading} type="pending" />
					<PiechartCard
						data={completedTasks}
						loading={completedTaskLoading}
						type="done"
					/>
				</div>
				{/* <div className={styles.statistics_body_heatmap}>
					<div className={styles.statistics_body_heatmap_title}>
						<div className={styles.statistics_body_heatmap_title_left}>
							<Title size="1.25rem" className={styles.heatmap_pageTitle}>
								Heat map
							</Title>
							<Select
								value={heatmapFilter}
								setValue={setNodeType}
								theme="rounded"
								options={GRAPHFILTER_OPTIONS}
								className={styles.graphfilter}
								dropdownarrow="triangularDropDown"
								onChange={e => setHeatmapFilter(e.target.value)}
							/>
						</div>
					</div>
					<div className={styles.statistics_body_heatmap_content}>
						<Heatmap />
					</div>
				</div> */}
				<div className={styles.statistics_body_graph}>
					<div className={styles.statistics_body_graph_title}>
						<div className={styles.statistics_body_graph_title_left}>
							<Title size="1.25rem" className={styles.graph_pageTitle}>
								{STATISTICS_TRANSLATION.HISTORY[user?.language?.toUpperCase()]}
							</Title>
							<Select
								value={nodeType}
								setValue={setNodeType}
								theme="rounded"
								// options={Object.values(GRAPHFILTER_OPTIONS)?.map(opt => ({
								// 	label: opt,
								// 	value: opt,
								// }))}
								// options={GRAPHFILTER_OPTIONS}
								options={Object.keys(GRAPHFILTER_OPTIONS).map(opt => ({
									label: GRAPHFILTER_OPTIONS[opt][user?.language?.toUpperCase()],
									value: opt,
								}))}
								className={styles.graphfilter}
								dropdownarrow="triangularDropDown"
							/>
						</div>
						<div className={styles.statistics_body_graph_title_right}>
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() => setActiveGraph("line")}
								className={activeGraph === "line" ? styles.active : ""}
							>
								<LineChart />
							</ThemedButton>
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								className={activeGraph === "bar" ? styles.active : ""}
								onClick={() => setActiveGraph("bar")}
							>
								<BarChart />
							</ThemedButton>
						</div>
					</div>
					<div className={styles.statistics_body_graph_content} ref={graphref}>
						<GraphCard
							activeGraph={activeGraph}
							data={graphData}
							loading={graphDataLoading}
							width={dimensions.width}
							height={dimensions.height}
							type={nodeType}
						/>
					</div>
				</div>
				<HeatmapFrameTemp
					timerangefilter={timerangefilter}
					cadenceSelected={cadenceSelected}
					userfilter={userfilter}
				/>
			</div>
			<div className={styles.ranktable}>
				<div className={`${styles.ranktable_header}`}>
					{TABLE_COLUMNS.map((header, index) => {
						return (
							<div className={` ${styles[`header_${index}`]}`}>
								{header.label[user?.language?.toUpperCase()]}
							</div>
						);
					})}
				</div>
				<div className={styles.ranktable_body}>
					{tableDataLoading ? (
						<Placeholder />
					) : (
						tableData?.map((data, index) => <RanktableRow data={data} />)
					)}
				</div>
			</div>
		</Container>
	);
};

export default Statisticsold;

const Placeholder = () => {
	return (
		<>
			{[...Array(4)].map((_, j) => (
				<div className={styles.card}>
					<div className={styles.top}>
						<div className={styles.round}>
							<Skeleton className={styles.skeleton} />
						</div>
						<Div className={styles.name} loading></Div>
					</div>
				</div>
			))}
		</>
	);
};
