import { HeatMapGrid } from "react-grid-heatmap";
import { useHeatmap } from "@cadence-frontend/data-access";
import { Skeleton, Title } from "@cadence-frontend/components";
import { Select } from "@cadence-frontend/widgets";
import styles from "../../Statistics.module.scss";
import { useState, useEffect } from "react";
import { HEATMAPFILTER_OPTIONS } from "../../constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const xLabels = [
	"12AM",
	"1AM",
	"2AM",
	"3AM",
	"4AM",
	"5AM",
	"6AM",
	"7AM",
	"8AM",
	"9AM",
	"10AM",
	"11AM",
	"12PM",
	"1PM",
	"2PM",
	"3PM",
	"4PM",
	"5PM",
	"6PM",
	"7PM",
	"8PM",
	"9PM",
	"10PM",
	"11PM",
];

const yLabels = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const HeatmapFrame = ({ timerangefilter, cadenceSelected, userfilter, id }) => {
	const [nodeType, setNodeType] = useState("done_tasks");

	const filters = {
		filter: timerangefilter,
		cadence_id: Object.values(cadenceSelected).flat(),
		user_ids: userfilter,
	};
	const user = useRecoilValue(userInfo);
	const role = user.role;
	const { heatmapDataLoading, heatmapData, setHeatmapFilter, heatmapHasError } =
		useHeatmap(filters, role);

	useEffect(() => {
		setHeatmapFilter(() => ({
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
		}));
	}, [nodeType]);

	const data = new Array(yLabels.length)
		.fill(0)
		.map(() => new Array(xLabels.length).fill(-1));

	let heatmapInputData = data;
	if (!heatmapDataLoading) {
		if (!heatmapHasError) {
			heatmapInputData = heatmapData;
		}
	}

	return (
		<div className={styles.statistics_body_heatmap} id={id}>
			<div className={styles.statistics_body_heatmap_title}>
				<div className={styles.statistics_body_heatmap_title_left}>
					<Title size="1.25rem" className={styles.heatmap_pageTitle}>
						{COMMON_TRANSLATION.HEAT_MAP[user?.language?.toUpperCase()]}
					</Title>
					<Select
						value={nodeType}
						setValue={setNodeType}
						theme="rounded"
						// options={HEATMAPFILTER_OPTIONS}
						options={Object.keys(HEATMAPFILTER_OPTIONS).map(opt => ({
							label: HEATMAPFILTER_OPTIONS[opt][user?.language?.toUpperCase()],
							value: opt,
						}))}
						className={styles.graphfilter}
						dropdownarrow="triangularDropDown"
						numberOfOptionsVisible="6"
					/>
				</div>
			</div>
			<div className={styles.statistics_body_heatmap_content}>
				<div>
					<HeatMapGrid
						data={heatmapInputData}
						xLabels={xLabels}
						yLabels={yLabels}
						cellRender={(x, y, value) =>
							!heatmapDataLoading ? (
								(value && value === -1) || value === 0 ? (
									" "
								) : (
									value
								)
							) : (
								<Skeleton className={styles.loadingCell} />
							)
						}
						xLabelsStyle={() => {
							return {
								fontSize: "10px",
								textAlign: "center",
								width: "48px",

								marginBottom: "15px",
								color: "rgba(3, 125, 252)",
							};
						}}
						cellStyle={(x, y, opacity) => {
							const defaultCellStyle = {
								marginRight: "5px",
								marginBottom: y === yLabels.length - 1 ? "5px" : "0",
								height: "36px",
								borderRadius: "3px",
								fontWeight: "600",
								width: "39px",
								fontSize: "12px",
							};

							if (heatmapDataLoading) {
								return {
									...defaultCellStyle,
									background: "rgba(255, 255, 255, 0.64)",
									color: "#fff",
								};
							}

							if (Number.isNaN(opacity)) {
								return {
									...defaultCellStyle,
									color: "rgba(255, 255, 255, 0.64)",
									background: "rgba(3, 125, 252, 0.08)",
								};
							}

							let value = heatmapData[x][y];
							if (value === 0)
								return {
									...defaultCellStyle,
									background: "rgba(3, 125, 252, 0.08)",
								};

							return {
								...defaultCellStyle,
								background:
									opacity === 0
										? `rgba(3, 125, 252, 0.08)`
										: opacity < 0.15
										? `rgba(3, 125, 252, 0.15)`
										: `rgba(3, 125, 252, ${opacity})`,

								borderRadius: "3px",

								color: "rgba(255, 255, 255, 0.64)",
							};
						}}
						cellHeight="36px"
					/>
				</div>
			</div>
		</div>
	);
};

export default HeatmapFrame;
