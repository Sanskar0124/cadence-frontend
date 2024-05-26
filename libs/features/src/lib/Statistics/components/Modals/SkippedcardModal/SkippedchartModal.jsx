import { Title, Skeleton } from "@cadence-frontend/components";
import SkippedchartCard from "../../SkippedchartCard/SkippedchartCard";
import styles from "./SkippedchartModal.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { COLORS, SKIPPEDPIECHARTCOLORS } from "../../../constants";
import { Close, NoTasksPiechart } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import { useSkippedChartModalData } from "@cadence-frontend/data-access";

const SkippedchartModal = ({
	setModalData,
	localCoords,
	modalData,
	filter,
	modalRef,
	singleUser,
}) => {
	const { getSkippedChartModalData, loading, success } = useSkippedChartModalData();
	useEffect(() => {
		const body = {
			cadence_id: modalData.cadenceId,
			user_ids: modalData.userId === undefined ? [] : [modalData.userId],
			filter: filter,
		};

		getSkippedChartModalData(body, {
			onSuccess: data => setModalData(prev => ({ ...prev, data: data })),
			onError: err => {
				setError(err?.message ?? "unable to redirect");
			},
		});
	}, []);

	const totalTasks = modalData?.data?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const user = useRecoilValue(userInfo);

	return (
		<div
			className={styles.chartmodalcard}
			style={{
				left:
					localCoords.x > 800
						? localCoords.x > 800 && modalData?.data?.length > 5
							? localCoords.x < 850 && modalData?.data?.length > 5
								? `${localCoords?.x - 750}px`
								: `${localCoords?.x - 950}px`
							: `${localCoords?.x - 650}px`
						: `${localCoords?.x}px`,
				top: singleUser ? "-16rem" : localCoords.y > 500 ? "-4rem" : "0px",
			}}
			onClick={() => {
				setModalData(prev => ({
					...prev,
					isShow: false,
					data: [],
					indexofRow: "",
					cadenceId: "",
					userId: "",
				}));
			}}
			ref={modalRef}
		>
			<div
				className={styles.chartmodalcard_title}
				// onClick={() => setModalData(prev => ({ ...prev, isShow: false, data: [] }))}
			>
				<Title size="1.25rem">
					{STATISTICS_TRANSLATION.SKIPPED_TASKS[user?.language.toUpperCase()]}
				</Title>
				{/* <Close /> */}
			</div>
			<div className={styles.piechartcard}>
				<div className={styles.piechartcontent}>
					<div className={styles.piechartcontent_piechart}>
						{loading ? (
							<Skeleton className={styles.piePlaceholder} />
						) : modalData?.data?.length > 0 ? (
							<ResponsiveContainer width={190} height={190}>
								<PieChart width="100%" height="100%" className={styles.piechart}>
									<Pie
										data={modalData?.data}
										cx="50%"
										cy="50%"
										innerRadius={"25%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
									>
										{modalData?.data?.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={SKIPPEDPIECHARTCOLORS?.[index]}
												/>
											);
										})}
									</Pie>
									<Pie
										data={modalData?.data}
										stroke="0.1"
										cx="50%"
										cy="50%"
										innerRadius={"32%"}
										outerRadius={"45%"}
										fill="#F5F6F7"
										dataKey="value"
									></Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<NoTasksPiechart style={{ transform: "translateX(10px)" }} />
						)}

						{!loading && modalData?.data?.length > 0 && (
							<div
								className={` ${styles.piechartcontent_center} ${styles.piechartcontent_center_value}`}
							>
								{totalTasks}
							</div>
						)}
					</div>
					{loading ? (
						<div
							className={
								modalData?.data?.length > 4
									? styles.piechartcontent_details
									: styles.piechartcontent_skeleton_details
							}
						>
							{modalData?.data?.length > 4
								? [...Array(10).keys()].map(key => (
										<Skeleton className={styles.detailsPlaceholder} />
								  ))
								: [...Array(4).keys()].map(key => (
										<Skeleton className={styles.detailsPlaceholder} />
								  ))}
						</div>
					) : modalData?.data.length > 0 ? (
						<div className={styles.piechartcontent_details}>
							{modalData?.data?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div className={styles.detailcard_row1}>
										<div
											className={`${styles.detailcard_row1_colorbox} ${
												styles[`box_${index}`]
											}`}
										></div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${index}`]
											}`}
										>
											{entry.value}
										</div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${index}`]
											}`}
										>
											{((entry.value / totalTasks) * 100).toFixed()}%
										</div>
										<div
											className={styles.detailcard_row1_name}
											style={{ minWidth: entry.name === "Other" ? "90px" : "" }}
										>
											{entry.name === "alreadydone"
												? "Already completed"
												: entry.name === "nomails"
												? "Did not want mails"
												: entry.name === "duplicatelead"
												? "Duplicate lead"
												: entry.name}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.noTasks}>
							<p>
								{COMMON_TRANSLATION.CURRENTLY_NO_TASKS[user?.language?.toUpperCase()]}{" "}
								{COMMON_TRANSLATION.SKIPPED[user?.language?.toUpperCase()]}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SkippedchartModal;
