import { useEffect, useRef, useState } from "react";
import { useStatistics } from "@cadence-frontend/data-access";

import styles from "./Statistics.module.scss";
import { Container, Div, Title, Skeleton } from "@cadence-frontend/components";
import GraphCard from "./components/GraphCard/GraphCard";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import SelectUser from "./components/SelectUser/SelectUser";
import {
	LineChart,
	BarChart,
	Download,
	Trending,
	CompareHorizontal,
	InfoCircle,
	TableIcon,
	TriangleArrow,
	TriangleDown,
} from "@cadence-frontend/icons";
import {
	CADENCE_NAME,
	DEFAULT_COLUMNS,
	DEFAULT_COLUMNS1,
	GRAPHFILTER_OPTIONS,
	TABLE_HEADERS,
	TIMERANGEFILTER_OPTIONS,
	SKIPPED_TASK_TOOLTIP,
	CADENCE_TYPES,
	BUTTONS,
	USER_NAME,
} from "./constants";
import {
	ThemedButton,
	Select,
	HighlightBox,
	Toggle,
	TabNavSliderBtn,
	TabNavSlider,
} from "@cadence-frontend/widgets";
import {
	ThemedButtonThemes,
	HighlightBoxThemes,
	TabNavThemes,
} from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import HeatmapFrame from "./components/Heatmap/HeatmapFrame";
import CadenceCardData from "./components/CadenceCard/CadenceCard";
import PiechartCardv2 from "./components/PiechartCardv2/PiechartCardv2";
import RadialbarChartCard from "./components/RadialBarChart/RadialbarChart";
import BarchartCard from "./components/BarchartCard/BarchartCard";
import RevenuechartCard from "./components/RevenuechartCard/RevenuechartCard";
import { Colors } from "@cadence-frontend/utils";
import PiechartCardv3 from "./components/PiechartCardv3/PiechartCardv3";
import SkippedchartCard from "./components/SkippedchartCard/SkippedchartCard";
import RanktableRowv2 from "./components/RanktableRowv2/RanktableRowv2";
import Dataheader from "./components/Dataheader/Dataheader";
import Selectcolumn from "./components/Selectcolumn/Selectcolumn";
import GotoTop, { GotoTop1 } from "./components/GoToTop/GotoTop";
import integrationType from "libs/constants/src/lib/integrationType";
import { INTEGRATION_TYPE, LOCAL_STORAGE_KEYS, ROLES } from "@cadence-frontend/constants";
import Tooltip from "./components/Tooltip/Tooltip";
import { PDFDownload, captureProfileImage, htmlpdf } from "./utils";
import { useNavigate } from "react-router-dom";

const Statistics = () => {
	const navigate = useNavigate();
	const [modalData, setModalData] = useState({
		data: [],
		isShow: false,
		localCoords: { x: 0, y: 0 },
		cadenceId: "",
		userId: "",
		indexofRow: "",
	});
	const [modal, setModal] = useState(false);
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
	const divRef = useRef(null);
	const [scrollposition, setScrollPosition] = useState(0);
	const [newTableData, setNewTableData] = useState([]);
	const [timerangefilter, setTimerangeFilter] = useState("this_month");
	const [cadenceSelected, setCadenceSelected] = useState({
		personal: [],
		team: [],
		company: [],
	});
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [activeGraph, setActiveGraph] = useState("line");
	const graphref = useRef(null);
	const [loading, setLoading] = useState(false);
	const [taskData, setTaskData] = useState([]);
	const [pdf, setPdf] = useState({ isPdf: false, loading: false });
	const [activeBtn, setActiveBtn] = useState("cadence");

	const makeFirstLetterCapital = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	useEffect(() => {
		setdimensions({
			width: graphref.current.getBoundingClientRect().width,
			height: graphref.current.getBoundingClientRect().height,
		});
	}, []);
	useEffect(() => {
		return () =>
			setModalData(prev => ({ ...prev, isShow: false, data: [], indexofRow: "" }));
	}, []);

	//data access

	const {
		columnData,
		columnDataLoading,
		cadenceData,
		cadenceDataLoading,
		leadsCount,
		leadsCountLoading,
		pendingTasks,
		pendingTaskLoading,
		completedTasks,
		completedTaskLoading,
		skippedTasks,
		skippedTaskLoading,
		newgraphData,
		newgraphDataLoading,
		setFilters,
		setGraphFilters,
		tableData,
		tableDataLoading,
		pendingEmailTasks,
		completedEmailTasks,
		pendingEmailTasksLoading,
		completedEmailTasksLoading,
	} = useStatistics({ stats: true }, { role }, activeBtn);

	const [columns, setColumns] = useState(DEFAULT_COLUMNS1);

	useEffect(() => {
		if (!columnData) {
			if (
				user.integration_type === integrationType.PIPEDRIVE ||
				user.integration_type === integrationType.ZOHO ||
				user.integration_type === integrationType.SELLSY ||
				user.integration_type === integrationType.DYNAMICS ||
				user.integration_type === integrationType.BULLHORN ||
				user.integration_type === integrationType.EXCEL ||
				user.integration_type === integrationType.GOOGLE_SHEETS ||
				user.integration_type === integrationType.SHEETS
			) {
				setColumns(
					DEFAULT_COLUMNS1.filter(
						item => item.label !== "disqualified" && item.label !== "converted"
					)
				);
			} else {
				setColumns(DEFAULT_COLUMNS1);
			}
		} else {
			if (
				user.integration_type === integrationType.PIPEDRIVE ||
				user.integration_type === integrationType.ZOHO ||
				user.integration_type === integrationType.SELLSY ||
				user.integration_type === integrationType.DYNAMICS ||
				user.integration_type === integrationType.BULLHORN ||
				user.integration_type === integrationType.EXCEL ||
				user.integration_type === integrationType.GOOGLE_SHEETS ||
				user.integration_type === integrationType.SHEETS
			) {
				setColumns(
					columnData.filter(
						item => item.label !== "disqualified" && item.label !== "converted"
					)
				);
			} else {
				setColumns(columnData);
			}
		}
	}, [columnData]);

	const filteredHeaders = columns
		?.filter(item => item.order > 0)
		.sort((a, b) => a.order - b.order);

	useEffect(() => {
		const headerLabels = filteredHeaders?.map(item => item.label);
		const data = tableData?.newData?.map(obj => {
			let filteredusers = obj.users?.filter(user => {
				let taskValues = {};
				Object.keys(user.tasks).forEach(label => {
					if (headerLabels.includes(label)) {
						taskValues[label] = user.tasks[label];
					}
				});

				return Object.values(taskValues).reduce(
					(prevVal, curr) => prevVal + curr.value,
					0
				);
			});
			return { ...obj, users: filteredusers };
		});

		if (filteredHeaders.map(item => item.label).includes("doneTasks")) {
			const newData = data;
			newData?.sort((a, b) => {
				let fa = a.tasks["doneTasks"];
				let fb = b.tasks["doneTasks"];

				if (fa > fb) {
					return -1;
				}
				if (fa < fb) {
					return 1;
				}
				return 0;
			});
			setNewTableData(newData);
		} else {
			setNewTableData(data);
		}
	}, [tableData?.newData, columns]);

	useEffect(() => {
		if (!pendingTasks && !completedTasks) {
			setLoading(true);
		} else if (pendingTasks && completedTasks) {
			setLoading(false);
			const totalPendingTasks =
				pendingTasks?.reduce((prevVal, curr) => prevVal + curr?.value, 0) ?? 0;

			const totalCompletedTask = completedTasks?.reduce(
				(prevVal, curr) => prevVal + curr?.value,
				0
			);
			const totalSkippedTasks = completedTasks?.reduce(
				(prevVal, curr) => prevVal + curr?.skipped,
				0
			);

			const data = [
				{ name: "completed", value: totalCompletedTask },
				{ name: "skipped", value: totalSkippedTasks },
				{ name: "pending", value: totalPendingTasks },
			];
			setTaskData(data);
		}
	}, [pendingTasks, completedTasks]);

	useEffect(() => {
		// let cadence_filter = localStorage.getItem(
		// 	LOCAL_STORAGE_KEYS.STATISTICS_CADENCE_FILTER
		// );
		// if (cadence_filter) setCadenceSelected(JSON.parse(cadence_filter));
		let user_filter = localStorage.getItem(LOCAL_STORAGE_KEYS.STATISTICS_USER_FILTER);
		if (user_filter) setUserFilter(JSON.parse(user_filter));
		let time_range_filter = localStorage.getItem(
			LOCAL_STORAGE_KEYS.STATISTICS_TIMERANGE_FILTER
		);
		if (time_range_filter) setTimerangeFilter(JSON.parse(time_range_filter));
	}, []);

	useEffect(() => {
		setFilters({
			filter: timerangefilter,
			cadence_id: Object.values(cadenceSelected).flat(),
			user_ids: userfilter,
		});
		// localStorage.setItem(
		// 	LOCAL_STORAGE_KEYS.STATISTICS_CADENCE_FILTER,
		// 	JSON.stringify(cadenceSelected)
		// );
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.STATISTICS_USER_FILTER,
			JSON.stringify(userfilter)
		);
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.STATISTICS_TIMERANGE_FILTER,
			JSON.stringify(timerangefilter)
		);
	}, [timerangefilter, cadenceSelected, userfilter]);

	const asendingOrder = header => {
		const newData = [...newTableData];
		if (activeBtn === "cadence") {
			newData?.sort((a, b) => {
				let fa = a.tasks[header.label];
				let fb = b.tasks[header.label];
				if (fa < fb) {
					return -1;
				}
				if (fa > fb) {
					return 1;
				}
				return 0;
			});

			setNewTableData(newData);
		} else {
			newData?.sort((a, b) => {
				let fa = a.tasks[header.label].value;
				let fb = b.tasks[header.label].value;
				if (fa < fb) {
					return -1;
				}
				if (fa > fb) {
					return 1;
				}
				return 0;
			});

			setNewTableData(newData);
		}
	};

	const descendingOrder = header => {
		const newData = [...newTableData];
		if (activeBtn === "cadence") {
			newData?.sort((a, b) => {
				let fa = a.tasks[header.label];
				let fb = b.tasks[header.label];

				if (fa > fb) {
					return -1;
				}
				if (fa < fb) {
					return 1;
				}
				return 0;
			});
			setNewTableData(newData);
		} else {
			newData?.sort((a, b) => {
				let fa = a.tasks[header.label]?.value;
				let fb = b.tasks[header.label]?.value;

				if (fa > fb) {
					return -1;
				}
				if (fa < fb) {
					return 1;
				}
				return 0;
			});
			setNewTableData(newData);
		}
	};

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

	const onScroll = e => {
		setScrollPosition(e.target.scrollTop);
	};

	const clickHandler = () => {
		setPdf(prev => ({ ...prev, isPdf: true, loading: true }));
		setTimeout(() => {
			PDFDownload();
		}, 500);
	};
	const stateChangeHandler = () => {
		setTimeout(() => {
			setPdf(prev => ({ ...prev, isPdf: false }));
		}, 6500);
	};

	return (
		<Container className={styles.statistics} onScroll={onScroll} id="container">
			<div className={styles.statistics_title} ref={divRef}>
				<Title className={styles.pageTitle}>
					{COMMON_TRANSLATION.STATISTICS[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.filter_wrapper}>
					<SelectCadence
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						cadenceData={cadenceData}
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
						background={Colors.purpleGradient}
						color={Colors.white}
						className={styles.filter}
						height={"50px"}
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
					{/* <ThemedButton theme={ThemedButtonThemes.WHITE} width="6%" height="40px">
						<Trending />
					</ThemedButton> */}

					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						width="64px"
						height="50px"
						onClick={() => navigate(`/stats/comparecadence`)}
						className={styles.topBtns}
					>
						<CompareHorizontal />
					</ThemedButton>

					<ThemedButton
						theme={ThemedButtonThemes.WHITE}
						loading={pdf.isPdf}
						width="64px"
						height="50px"
						onClick={() => {
							clickHandler();
							stateChangeHandler();
						}}
						className={styles.topBtns}
					>
						<Download />
					</ThemedButton>
				</div>
			</div>
			<div className={styles.statistics_body} id="container1">
				{/* cadence task and leads pie charts */}
				<div className={styles.statistics_body_piecharts}>
					<CadenceCardData
						data={cadenceData}
						loading={cadenceDataLoading}
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						tab={tab}
						setTab={setTab}
					/>
					<PiechartCardv2
						data={taskData}
						loading={loading}
						type="tasks"
						makeCapital={makeFirstLetterCapital}
					/>
					{(user?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
						user?.integration_type === INTEGRATION_TYPE?.HUBSPOT) && (
						<PiechartCardv2
							data={leadsCount}
							loading={leadsCountLoading}
							type="leads"
							makeCapital={makeFirstLetterCapital}
						/>
					)}
				</div>

				{/*  opportunities card*/}
				{/* <div className={styles.statistics_body_graph}>
					<div className={styles.statistics_body_graph_title}>
						<div className={styles.statistics_body_graph_title_left}>
							<Title size="1.25rem" className={styles.graph_pageTitle}>
								{STATISTICS_TRANSLATION.OPPORTUNITIES[user?.language?.toUpperCase()]}
							</Title>							
						</div>
						<InfoCircle color={Colors.veryLightBlue} style={{cursor:"pointer"}}/>						
					</div>
					<div className={styles.statistics_body_graph_content}>
						<RadialbarChartCard/>
						<BarchartCard/>
					</div>
				</div> */}
				{/* line chart for revenue */}

				{/* <div className={styles.statistics_body_graph}>
					 <div className={styles.statistics_body_graph_title_revenue_title}> 
						<div className={styles.statistics_body_graph_title_left}>
							<Title size="1.25rem" className={styles.graph_pageTitle}>
								{STATISTICS_TRANSLATION.REVENUE[user?.language?.toUpperCase()]}
							</Title>							
						</div>	
						<div className={styles.statistics_body_graph_title_revenue_title_right}>							
							<HighlightBox height={55}  theme={HighlightBoxThemes.GREEN} fontWeight={400} borderRadius={10} className={styles.highlighbox_children}>
								<p>Revenue generated</p>
								<p className={styles.highlighbox_children_count}>$576,356</p>
							</HighlightBox>				 

							<HighlightBox height={55} theme={HighlightBoxThemes.BLUE} fontWeight={400} borderRadius={10} className={styles.highlighbox_children} >
								<p>Revenue forecast(opp count)</p>
								<p className={styles.highlighbox_children_count}>$605,346</p>
							</HighlightBox>	
							<InfoCircle color={Colors.veryLightBlue} style={{cursor:"pointer"}}/>						
						</div>															
					</div> 
					<div className={styles.statistics_body_graph_content}>
						<RevenuechartCard width={1290} height={230}/>
					</div>
				</div> */}

				{/* pending task and completed task graphs */}

				<div className={` ${styles.piechart_lg}`}>
					<PiechartCardv3
						data={pendingTasks}
						loading={pendingTaskLoading}
						type="pending"
						emailtaskloading={pendingEmailTasksLoading}
						emailTaskData={pendingEmailTasks}
					/>
					<PiechartCardv3
						data={completedTasks}
						loading={completedTaskLoading}
						type="completed"
						emailtaskloading={completedEmailTasksLoading}
						emailTaskData={completedEmailTasks}
					/>
				</div>

				{/* Skipped Tasks chart  */}

				<div
					className={`${styles.statistics_body_graph} ${styles.statistics_body_skippedChartGraph}`}
					id="skippedchart"
				>
					<div className={styles.statistics_body_graph_skippedchart_header}>
						<Title
							size="1.25rem"
							className={styles.statistics_body_graph_skippedchart_header_title}
						>
							{STATISTICS_TRANSLATION.SKIPPED_TASKS[user?.language?.toUpperCase()]}
						</Title>
						<Tooltip text={SKIPPED_TASK_TOOLTIP}>
							<InfoCircle />
						</Tooltip>
					</div>

					<div className={styles.statistics_body_graph_skippedchart_content}>
						<SkippedchartCard
							data={skippedTasks?.reasonData}
							loading={skippedTaskLoading}
							type="card"
						/>
						<BarchartCard
							data={skippedTasks?.newChartData}
							loading={skippedTaskLoading}
							type="skipped"
						/>
					</div>
				</div>

				{/* History map */}
				<div className={styles.statistics_body_graph} id="historygraph">
					<div className={styles.title_history}>
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
							data={newgraphData}
							loading={newgraphDataLoading}
							width={dimensions.width}
							height={dimensions.height}
							type={nodeType}
						/>
					</div>
				</div>
				<HeatmapFrame
					timerangefilter={timerangefilter}
					cadenceSelected={cadenceSelected}
					userfilter={userfilter}
					id="heatmap"
				/>

				<div className={styles.statistics_body_graph_ranktable} id="cadencetable">
					<div className={styles.statistics_body_graph_title}>
						<div className={styles.statistics_body_graph_title_left}>
							<Title size="1.25rem" className={styles.ranktable_title}>
								{STATISTICS_TRANSLATION.CADENCE_AND_USERS[user?.language?.toUpperCase()]}
							</Title>
						</div>
						<div className={styles.statistics_body_graph_title_right}>
							<div className={styles.togglebutton}>
								<TabNavSlider
									theme={TabNavThemes.GREY}
									buttons={BUTTONS.map(opt => ({
										label: opt.label,
										value: opt.value,
									}))}
									value={activeBtn}
									setValue={setActiveBtn}
									className={styles.tabs}
									btnClassName={styles.tabBtns}
									activeBtnClassName={styles.tabBtnActive}
									activePillClassName={styles.activePill}
									squareButton={true}
								/>
								{/* <ThemedButton
									theme={ThemedButtonThemes.WHITE}
									className={activeBtn === "Cadence" ? styles.active : ""}
								>
									Cadence
								</ThemedButton>
								<ThemedButton
									onClick={() => setActiveBtn("Users")}
									className={activeBtn === "Users" ? styles.active : ""}
								>
									Users
								</ThemedButton> */}
							</div>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => setModal(true)}
							>
								<TableIcon />
							</ThemedButton>
						</div>
					</div>
					{/* data header starts here */}
					<div className={styles.data_header}>
						<Dataheader
							data={tableData?.headerRes}
							loading={tableDataLoading}
							headerData={filteredHeaders}
							activeBtn={activeBtn}
						/>
					</div>
					{/* rank table starts from here */}
					<div className={styles.cadencetable}>
						<div className={`${styles.cadencetable_header}`}>
							<div className={`${styles.cadence_header} ${styles.indexzero}`}>
								{activeBtn === "cadence"
									? CADENCE_NAME.label[user?.language?.toUpperCase()]
									: USER_NAME.label[user?.language?.toUpperCase()]}
							</div>

							{filteredHeaders?.map((header, index) => {
								return (
									<>
										{header.isVisible && (
											<div
												className={`${styles.header} ${styles[`header_${index}`]}`}
												key={header.label}
											>
												{Object.keys(TABLE_HEADERS).map(item =>
													item === header.label
														? TABLE_HEADERS[item][user?.language?.toUpperCase()]
														: null
												)}

												{
													<div className={styles.arrow_icon_div}>
														<TriangleArrow
															size={10}
															onClick={() => asendingOrder(header)}
														/>
														<TriangleDown
															size={7}
															onClick={() => descendingOrder(header)}
														/>
													</div>
												}
											</div>
										)}
									</>
								);
							})}
						</div>
						<div className={styles.cadencetable_ranktable_body}>
							{tableDataLoading ? (
								<Placeholder />
							) : (
								newTableData?.map((data, index) => (
									<RanktableRowv2
										data={data}
										headerData={filteredHeaders}
										resData={tableData.headerRes}
										filter={timerangefilter}
										modalData={modalData}
										setModalData={setModalData}
										rowindex={index}
										isPdf={pdf.isPdf}
										activeBtn={activeBtn}
										singleUser={newTableData?.length === 1 && true}
										selectedCadences={Object.values(cadenceSelected).flat()}
									/>
								))
							)}
						</div>
					</div>
				</div>

				{modal && (
					<Selectcolumn
						modal={modal}
						setModal={setModal}
						columns={columns}
						setColumns={setColumns}
						filteredHeaders={filteredHeaders}
						columnloading={columnDataLoading}
					/>
				)}
			</div>
			<GotoTop divRef={divRef} scrollposition={scrollposition} />
			{/* <GotoTop1 /> */}
		</Container>
	);
};

export default Statistics;

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
