import React, { useState, useEffect } from "react";
import styles from "./SelectKPI.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Select, TabNavSlider } from "@cadence-frontend/widgets";
import { useRecoilState, useRecoilValue } from "recoil";
import { kpiObjects, userInfo } from "@cadence-frontend/atoms";
import { COMPARISON_TYPE, LEADS_OPTION, TASKS_OPTION } from "../../../Constants";
import { TabNavThemes } from "@cadence-frontend/themes";
const BUTTONS = [
	{ label: "Value over time", value: COMPARISON_TYPE.VALUE_OVER_TIME },
	{ label: "Total value", value: COMPARISON_TYPE.TOTAL_VALUE },
];
import { Statistics as STATISTICS_TRANSLATION } from "@cadence-frontend/languages";

//info: in this file the code is commented because of design change

const SelectKPI = ({
	isSelectKpiModalShow,
	setIsSelectKpiModalShow,
	setKpisModalData,
	kpisModalData,
	selected,
}) => {
	const tasks = ["total_tasks", "done_tasks", "skipped_tasks"];
	const user = useRecoilValue(userInfo);
	const [kpi, setKpis] = useRecoilState(kpiObjects);
	const [isKpiSelected, setIsKpiSelected] = useState({
		isnodeType: false,
		isrendering: false,
		isSelected: false,
	});

	const closeModal = () => {
		setIsSelectKpiModalShow(prev => ({ ...prev, isShow: false }));
		setKpisModalData(prev => ({ ...prev, type: "" }));
	};

	const addKpisDataHandler = kpisModalData => {
		if (
			kpisModalData.type !== "" &&
			!selected.includes(kpisModalData.type) &&
			kpi?.selected.length < 6
		) {
			setKpis(prev => ({ ...prev, selected: prev.selected.concat(kpisModalData) }));
		}
	};

	useEffect(() => {
		if (isKpiSelected.isSelected) {
			addKpisDataHandler(kpisModalData);
		}
		setIsKpiSelected(prev => ({ ...prev, isSelected: false }));
	}, [isKpiSelected.isSelected]);

	const removeKpiHandler = item => {
		if (selected.includes(item)) {
			setKpis(prev => ({
				...prev,
				selected: prev?.selected.filter(obj => obj.type !== item),
			}));
		}
	};

	const clickHandler = item => {
		if (kpi?.selected.length === 6) {
			if (!selected.includes(item)) {
				return;
			}
		} else {
			setKpisModalData(prev => ({ ...prev, type: item }));
			setIsKpiSelected(prev => ({ ...prev, isSelected: true }));
		}
	};
	const clearAll = () => {
		setKpis(prev => ({ ...prev, selected: [] }));
		setKpisModalData(prev => ({ ...prev, type: "" }));
	};

	return (
		<Modal
			isModal={Boolean(isSelectKpiModalShow.isShow)}
			onClose={closeModal}
			showCloseButton
			className={styles.selectkpicontainer}
			outsideClickDeps={[kpisModalData]}
		>
			<p className={styles.selectkpicontainer_title}>
				{STATISTICS_TRANSLATION.SELECT_KPI[user?.language.toUpperCase()]}
			</p>
			<p className={styles.selectkpicontainer_clearbtn} onClick={clearAll}>
				{STATISTICS_TRANSLATION.CLEAR_SELECTION[user?.language.toUpperCase()]}
			</p>
			<div className={styles.containerdiv}>
				<p className={styles.subtitle}>
					{STATISTICS_TRANSLATION.KPI_MSG[user?.language.toUpperCase()]}
				</p>
				<div className={styles.tasksdiv}>
					<p>Tasks</p>
					<div className={styles.alltasks}>
						{Object.keys(TASKS_OPTION).map(item => {
							return (
								<span
									className={
										selected.includes(item)
											? kpisModalData.type === item
												? `${styles.taskname} ${styles.isSelect}`
												: `${styles.taskname} ${styles.isSelected}`
											: selected.length === 6
											? `${styles.taskname} ${styles.disabledkpi}`
											: styles.taskname
									}
									onClick={() =>
										selected.includes(item) ? removeKpiHandler(item) : clickHandler(item)
									}
								>
									{TASKS_OPTION[item]}
								</span>
							);
						})}
					</div>
				</div>
				<div className={`${styles.tasksdiv} ${styles.leads}`}>
					<p>Leads</p>
					<div className={styles.alltasks}>
						{Object.keys(LEADS_OPTION).map(item => {
							return (
								<span
									className={
										selected.includes(item)
											? kpisModalData.type === item
												? `${styles.taskname} ${styles.isSelect}`
												: `${styles.taskname} ${styles.isSelected}`
											: selected.length === 6
											? `${styles.taskname} ${styles.disabledkpi}`
											: styles.taskname
									}
									onClick={() =>
										selected.includes(item) ? removeKpiHandler(item) : clickHandler(item)
									}
								>
									{LEADS_OPTION[item]}
								</span>
							);
						})}
					</div>
				</div>
				{/* <div className={styles.outerdiv}> */}
				{/* <div className={styles.compareoptions}> */}
				{/* <div className={styles.comparevaluesdiv}>
								<p>Select what you want to compare</p>
								<TabNavSlider
									buttons={[
										{
											label: "Absolute values",
											value: "absolute_values",
										},
										{
											label: "Percentage values",
											value: "percentage_values",
										},
									]}
									value={kpisModalData.comparisonType}
									setValue={opt =>
										setKpisModalData(prev => ({ ...prev, comparisonType: opt }))
									}
									className={styles.tabs}
									btnClassName={styles.tabBtns}
									activeBtnClassName={styles.tabBtnActive}
									activePillClassName={styles.activePill}
								/>
							</div> */}
				<div className={`${styles.comparevaluesdiv}`}>
					<p>
						{STATISTICS_TRANSLATION.SELECT_COMPARE_VALUES[user?.language.toUpperCase()]}
					</p>
					<div className={styles.navSlider}>
						<TabNavSlider
							theme={TabNavThemes.GREY}
							buttons={BUTTONS.map(opt => ({
								label: opt.label,
								value: opt.value,
							}))}
							value={kpisModalData.comparisonType}
							setValue={opt =>
								setKpisModalData(prev => ({ ...prev, comparisonType: opt }))
							}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
							squareButton={true}
						/>
					</div>
				</div>
				{/* </div> */}
				{/* {isKpiSelected.isnodeType && (
							<div className={styles.compareoptions}>
								<div className={styles.comparevaluesdiv}>
									<p>Calculate as a % of</p>
									<TabNavSlider
										buttons={[
											{
												label: "Total call tasks",
												value: "node_tasks",
											},
											{
												label: "Total tasks",
												value: "total_tasks",
											},
										]}
										value={kpisModalData.percentageType}
										setValue={opt =>
											setKpisModalData(prev => ({ ...prev, percentageType: opt }))
										}
										className={styles.tabs}
										btnClassName={styles.tabBtns}
										activeBtnClassName={styles.tabBtnActive}
										activePillClassName={styles.activePill}
									/>
								</div>
							</div>
						)} */}
				{/* </div> */}
			</div>
		</Modal>
	);
};

export default React.memo(SelectKPI);
