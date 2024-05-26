import { Modal } from "@cadence-frontend/components";
import React from "react";
import styles from "./SettingsModal.module.scss";
import { Select, TabNavSlider } from "@cadence-frontend/widgets";
import { TIMERANGEFILTER_OPTIONS } from "../../../../constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SettingsModal = ({
	isShowSettings,
	setShowSettings,
	kpisModalData,
	setKpisModalData,
}) => {
	const tasks = ["total_tasks", "done_tasks", "skipped_tasks"];
	const user = useRecoilValue(userInfo);
	const closeModal = () => {
		setShowSettings(false);
	};
	console.log(kpisModalData, "modaldata");

	return (
		<Modal
			isModal={Boolean(isShowSettings)}
			onClose={closeModal}
			showCloseButton
			className={styles.settingscontainer}
			// outsideClickDeps={[kpisModalData]}
		>
			<p className={styles.selectedKPI}>Selected KPI</p>
			<div className={styles.container}>
				<div className={styles.timeperioddiv}>
					<p>Select time period over which you want to compare</p>
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
					/>
				</div>
				<div className={styles.compareoptions}>
					<div className={styles.comparevaluesdiv}>
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
					</div>
					<div className={styles.comparevaluesdiv}>
						<p>Select how you want to compare the values </p>
						<TabNavSlider
							buttons={[
								{
									label: "Value over time",
									value: "value_over_time",
								},
								{
									label: "Total value",
									value: "total_value",
								},
							]}
							value={kpisModalData.valueType}
							setValue={opt => setKpisModalData(prev => ({ ...prev, valueType: opt }))}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
						/>
					</div>
				</div>
				{!tasks.includes(kpisModalData.type) && (
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
				)}
			</div>
		</Modal>
	);
};

export default SettingsModal;
