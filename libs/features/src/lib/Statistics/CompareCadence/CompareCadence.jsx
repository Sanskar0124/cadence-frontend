import React, { useCallback, useEffect, useState } from "react";
import styles from "./CompareCadence.module.scss";
import { Container, ErrorBoundary, Title } from "@cadence-frontend/components";
import { BackButton, ThemedButton, Select } from "@cadence-frontend/widgets";
import { Statistics as STATISTICS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilState, useRecoilValue } from "recoil";
import { kpiObjects, userInfo } from "@cadence-frontend/atoms";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Download, SelectKpi } from "@cadence-frontend/icons";
import CadenceCard from "./Components/CadenceCard/CadenceCard";
import BarChartCard1 from "./Components/BarChart/BarChart";
import CadenceGraphCard from "./Components/CadenceGraphCard/CadenceGraphCard";
import SelectKPI from "./Components/Modals/SelectKPIs/SelectKPI";
import {
	CADENCE_BG_COLORS,
	CADENCE_COLORS,
	ABSOLUTE_VALUES,
	COMPARISON_TYPE,
} from "./Constants";
import { useCompareCadenceData } from "@cadence-frontend/data-access";
import { ReportDownload } from "./Components/utils";
import { TIMERANGEFILTER_OPTIONS } from "../constants";
import { Colors } from "@cadence-frontend/utils";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import EmptyStateCard from "./Components/EmptyStateCard/EmptyStateCard";

const CompareCadence = () => {
	const { loading } = useCompareCadenceData();
	const user = useRecoilValue(userInfo);
	const [kpi, setKpis] = useRecoilState(kpiObjects);
	const [pdf, setPdf] = useState({ isPdf: false, loading: false });
	const FULL_WIDTH_FILTERS = ["this_month", "last_month", "today", "yesterday"];
	const [isSelectKpiModalShow, setIsSelectKpiModalShow] = useState({
		isShow: false,
		selectedKpis: [],
		ids: [],
		isLoading: false,
		isFullWidth: false,
	});

	// const getFiltersFromLocalStorage = () => {
	// 	let filters = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPARE_CADENCE_FILTER);
	// 	if (filters) filters = JSON.parse(filters);
	// 	return filters;
	// };
	const getFiltersFromRecoil = () => {
		let filters = kpi?.selected.length > 0 && kpi?.selected[0];
		if (filters && Object.keys(filters).length > 0) return filters;
	};

	const [kpisModalData, setKpisModalData] = useState(() => {
		const filters = getFiltersFromRecoil();
		return {
			type: "",
			filter: filters ? filters.filter : "this_month",
			valueType: ABSOLUTE_VALUES.ABSOLUTE,
			comparisonType: filters ? filters.comparisonType : COMPARISON_TYPE.VALUE_OVER_TIME,
		};
	});

	useEffect(() => {
		const filters = getFiltersFromRecoil();
		if (filters && Object.keys(filters).length > 0) {
			setKpisModalData(prev => ({
				...prev,
				filter: filters.filter,
				comparisonType: filters.comparisonType,
			}));
		}
	}, []);
	useEffect(() => {
		if (
			kpisModalData.filter === "today" ||
			kpisModalData.filter === "yesterday" ||
			kpisModalData.filter === "this_month" ||
			kpisModalData.filter === "last_month"
		) {
			setIsSelectKpiModalShow(prev => ({ ...prev, isFullWidth: true }));
		} else {
			setIsSelectKpiModalShow(prev => ({ ...prev, isFullWidth: false }));
		}
	}, [kpisModalData.filter]);

	useEffect(() => {
		const selectedallKpis = kpi?.selected?.map(item => item.type);
		setIsSelectKpiModalShow(prev => ({
			...prev,
			selectedKpis: selectedallKpis,
		}));
	}, [kpi.selected]);

	useEffect(() => {
		setIsSelectKpiModalShow(prev => {
			const ids = kpi?.cardData
				?.filter(item => item?.cadence_id !== null)
				?.map(item => item?.cadence_id);

			return {
				...prev,
				ids: ids,
			};
		});
	}, [kpi.cardData]);

	const clickHandler = () => {
		setPdf(prev => ({ ...prev, isPdf: true, loading: true }));
		setTimeout(() => {
			ReportDownload();
		}, 500);
	};
	const stateChangeHandler = () => {
		setTimeout(() => {
			setPdf(prev => ({ ...prev, isPdf: false }));
		}, 6500);
	};

	useEffect(() => {
		setIsSelectKpiModalShow(prev => ({ ...prev, isLoading: true }));
		setKpis(prev => ({
			...prev,
			selected: prev?.selected?.map(
				item =>
					item.filter && {
						...item,
						comparisonType: kpisModalData.comparisonType,
						filter: kpisModalData.filter,
					}
			),
		}));

		// localStorage.setItem(
		// 	LOCAL_STORAGE_KEYS.COMPARE_CADENCE_FILTER,
		// 	JSON.stringify({
		// 		TIMERANGE_FILTER: kpisModalData.filter,
		// 		COMPARISON_TYPE: kpisModalData.comparisonType,
		// 	})
		// );
	}, [kpisModalData.filter, kpisModalData.comparisonType]);

	return (
		<Container className={styles.maincontainer} id="container">
			<ErrorBoundary>
				<div className={styles.header}>
					<div className={styles.header_left}>
						<BackButton
							text={STATISTICS_TRANSLATION.STATISTICS[user?.language?.toUpperCase()]}
							link="/stats"
							className={styles.header_left_backbtn}
						/>
						<Title className={styles.header_pagetitle} size="20px">
							{STATISTICS_TRANSLATION.COMPARE_CADENCES[user?.language?.toUpperCase()]}
						</Title>
					</div>
					<div className={styles.header_right}>
						<Select
							value={kpisModalData.filter}
							setValue={opt => setKpisModalData(prev => ({ ...prev, filter: opt }))}
							options={Object.keys(TIMERANGEFILTER_OPTIONS).map(opt => ({
								label: TIMERANGEFILTER_OPTIONS[opt][user?.language?.toUpperCase()],
								value: opt,
							}))}
							className={styles.filter}
							dropdownarrow="triangularDropDown"
							numberOfOptionsVisible={6}
							background={Colors.purpleGradient}
							color={Colors.white}
							height={"50px"}
						/>
						<ThemedButton
							theme={
								kpi?.selected.length > 0
									? ThemedButtonThemes.PRIMARY
									: ThemedButtonThemes.WHITE
							}
							className={
								kpi?.selected.length > 0
									? `${styles.header_right_btn} ${styles.isSelected}`
									: styles.header_right_btn
							}
							height="50px"
							width="168px"
							onClick={() => setIsSelectKpiModalShow(prev => ({ ...prev, isShow: true }))}
						>
							<SelectKpi
								color={kpi?.selected.length > 0 ? Colors.white : Colors.lightBlue}
							/>
							Select KPIs &nbsp;
							{kpi?.selected.length > 0 && `(${kpi?.selected.length})`}
						</ThemedButton>
						<ThemedButton
							theme={ThemedButtonThemes.WHITE}
							height="50px"
							width="60px"
							className={styles.header_right_downloadbtn}
							loading={pdf.isPdf}
							onClick={() => {
								clickHandler();
								stateChangeHandler();
							}}
						>
							<Download size={17} />
						</ThemedButton>
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.body_cadencecardscontainer}>
						{kpi?.cardData?.map((item, index) => {
							return (
								<CadenceCard
									key={item}
									bgColor={CADENCE_BG_COLORS[index]}
									cadenceColor={CADENCE_COLORS[index]}
									btnIndex={index}
									isSelectKpiModalShow={isSelectKpiModalShow}
									setIsSelectKpiModalShow={setIsSelectKpiModalShow}
									kpi={kpi}
									setKpis={setKpis}
								/>
							);
						})}
					</div>
					<div className={styles.body_chartcontainer}>
						{!loading && kpi?.responseData?.length > 0 && kpi?.selected?.length > 0 ? (
							kpi?.selected?.map(item => {
								return item.comparisonType === "value_over_time" ? (
									<CadenceGraphCard
										Kpitask={item}
										kpi={kpi}
										isLoading={isSelectKpiModalShow.isLoading}
										setIsSelectKpiModalShow={setIsSelectKpiModalShow}
										isFullWidth={isSelectKpiModalShow.isFullWidth}
									/>
								) : (
									<BarChartCard1
										Kpitask={item}
										kpi={kpi}
										isLoading={isSelectKpiModalShow.isLoading}
										setIsSelectKpiModalShow={setIsSelectKpiModalShow}
									/>
								);
							})
						) : (
							<EmptyStateCard />
						)}
					</div>
				</div>
			</ErrorBoundary>
			{isSelectKpiModalShow.isShow && (
				<SelectKPI
					isSelectKpiModalShow={isSelectKpiModalShow}
					setIsSelectKpiModalShow={setIsSelectKpiModalShow}
					kpisModalData={kpisModalData}
					setKpisModalData={setKpisModalData}
					selected={isSelectKpiModalShow.selectedKpis}
				/>
			)}
		</Container>
	);
};

export default CompareCadence;
