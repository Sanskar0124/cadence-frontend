import styles from "./piechartCardv3.module.scss";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import {
	COLORS,
	COMPLETED_TASK_TOOLTIP,
	INITIALCOLORSTATE,
	PENDING_TASK_TOOLTIP,
} from "../../constants";
import { InfoCircle, NoTasksPiechart, Plus } from "@cadence-frontend/icons";
import { Skeleton, Title } from "@cadence-frontend/components";
import { INITIAL_EMPTY_STATE, INITIAL_PIE_STATE, TASK_TYPES } from "./constants";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import PiechartModal from "../Modals/EmailTaskModal/PiechartModal";
import Tooltip from "../Tooltip/Tooltip";

const PiechartCardv3 = ({ data, loading, type, emailTaskData, emailtaskloading }) => {
	// console.log(type === "completed" ? data : "", "loading");
	const user = useRecoilValue(userInfo);
	const role = user.role;
	const totalTasks = data?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const [tasks, setTasks] = useState(INITIAL_PIE_STATE[type.toUpperCase()]);
	const [isShow, setIsShow] = useState(false);
	const [isCompletedModalShow, setCompletedModalShow] = useState(false);
	const pendingTaskModalRef = useRef(null);
	const completeTaskModalRef = useRef(null);
	const [emptyState, setEmptyState] = useState(INITIAL_EMPTY_STATE[type.toUpperCase()]);

	const makeCapital = string => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	if (type === "pending") {
		useOutsideClickHandler(pendingTaskModalRef, () => setIsShow(false));
	} else {
		useOutsideClickHandler(completeTaskModalRef, () => setCompletedModalShow(false));
	}

	useEffect(() => {
		if (data) {
			setTasks(
				INITIAL_PIE_STATE[type.toUpperCase()].map(task => {
					let taskToBeUpdated = data?.find(t => t.name === task.name);
					if (taskToBeUpdated) return taskToBeUpdated;
					return task;
				})
			);
		} else {
			setEmptyState(
				INITIAL_EMPTY_STATE[type.toUpperCase()].map(task => {
					let taskToBeUpdated = data?.find(t => t.name === task.name);
					if (taskToBeUpdated) return taskToBeUpdated;
					return task;
				})
			);
		}
	}, [data]);

	const handleClick = entry => {
		if (entry.name === "email" && entry.value > 0) {
			if (type === "pending") {
				setIsShow(true);
			} else {
				setCompletedModalShow(true);
			}
		}
	};
	useEffect(() => {
		return () => {
			setIsShow(false);
			setCompletedModalShow(false);
		};
	}, [data]);

	return (
		<div className={styles.piechartcard}>
			<div className={styles.piechartcard_header}>
				<Title size="1.25rem" className={styles.piechartcard_title}>
					{type === "completed"
						? TASKS_TRANSLATION.DONE_TASKS[user?.language?.toUpperCase()]
						: STATISTICS_TRANSLATION.PENDING_TASKS[user?.language?.toUpperCase()]}
				</Title>
				<Tooltip
					text={type === "completed" ? COMPLETED_TASK_TOOLTIP : PENDING_TASK_TOOLTIP}
				>
					<InfoCircle />
				</Tooltip>
			</div>

			<div className={styles.piechartcontent}>
				<div className={styles.piechartcontent_piechart}>
					{!loading ? (
						totalTasks > 0 ? (
							<ResponsiveContainer width={190} height={190}>
								<PieChart width="100%" height="100%" className={styles.piechart}>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={"25%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
									>
										{data.map((entry, index) => {
											return (
												<Cell key={`cell-${entry.name}`} fill={COLORS?.[entry.name]} />
											);
										})}
									</Pie>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={"32%"}
										outerRadius={"45%"}
										fill="#F5F6F7"
										dataKey="value"
										stroke="0.1"
									></Pie>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<ResponsiveContainer width={190} height={190}>
								<PieChart width="100%" height="100%" className={styles.piechart}>
									<Pie
										data={emptyState}
										cx="50%"
										cy="50%"
										innerRadius={"25%"}
										fill="#8884d8"
										dataKey="value"
										stroke="0.1"
									>
										{emptyState.map((entry, index) => {
											return (
												<Cell
													key={`cell-${entry.name}`}
													fill={INITIALCOLORSTATE?.[entry.name]}
												/>
											);
										})}
									</Pie>
									<Pie
										data={emptyState}
										cx="50%"
										cy="50%"
										innerRadius={"32%"}
										outerRadius={"45%"}
										fill="#FDFDFD"
										dataKey="value"
										stroke="0.1"
									></Pie>
								</PieChart>
							</ResponsiveContainer>
						)
					) : (
						<Skeleton className={styles.piePlaceholder} />
					)}
					<div className={styles.piechartcontent_center}>
						{!loading ? (
							totalTasks > 0 ? (
								<>
									<div className={styles.piechartcontent_center_value}>{totalTasks}</div>
									<div className={styles.piechartcontent_center_exception}>
										{type === "pending" ? (
											<div>
												<p>
													<span>
														{data?.reduce((prevVal, curr) => prevVal + curr?.urgent, 0)}
													</span>{" "}
													{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}
												</p>
												<p className={styles.piechartcontent_center_exception_late_text}>
													<span>
														{data?.reduce((prevVal, curr) => prevVal + curr?.late, 0)}
													</span>{" "}
													{TASKS_TRANSLATION.LATE[user?.language?.toUpperCase()]}
												</p>
											</div>
										) : (
											<>
												<span>
													<Plus size={6} color={Colors.lightBlue} />{" "}
													{data?.reduce((prevVal, curr) => prevVal + curr?.skipped, 0)}
												</span>{" "}
												{COMMON_TRANSLATION.SKIPPED[user?.language?.toUpperCase()]}
											</>
										)}
									</div>
								</>
							) : (
								<>
									<div className={styles.piechartcontent_center_value}>0</div>
								</>
							)
						) : (
							<></>
						)}
					</div>
				</div>
				{!loading ? (
					totalTasks > 0 ? (
						<div className={styles.piechartcontent_details}>
							{tasks?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div
										className={styles.detailcard_row1}
										style={{ cursor: entry.name === "email" ? "pointer" : "" }}
										onClick={() => handleClick(entry)}
									>
										<div
											className={`${styles.detailcard_row1_colorbox} ${
												styles[`box_${entry.name}`]
											}`}
										></div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${entry.name}`]
											}`}
										>
											{entry.value}
										</div>
										<div
											className={`${styles.detailcard_row1_value} ${
												styles[`background_${entry.name}`]
											}`}
										>
											{((entry.value / totalTasks) * 100).toFixed()}%
										</div>
										<div className={styles.detailcard_row1_name}>{`${
											entry.name === "linkedin"
												? TASK_TYPES["linkedin"][user?.language.toUpperCase()]
												: entry.name === "custom"
												? TASK_TYPES["custom"][user?.language.toUpperCase()]
												: entry.name === "message"
												? TASK_TYPES["message"][user?.language.toUpperCase()]
												: entry.name === "whatsapp"
												? TASK_TYPES["whatsapp"][user?.language.toUpperCase()]
												: TASK_TYPES[entry.name][user?.language.toUpperCase()] + "s"
										}`}</div>
									</div>
									<div className={styles.detailcard_row2}>
										<div className={styles.detailcard_row2_exception}>
											{type === "pending" ? (
												<>
													<div>
														{entry.urgent > 0 && (
															<>
																<span>{entry.urgent}</span>{" "}
																{TASKS_TRANSLATION.URGENT[user?.language?.toUpperCase()]}{" "}
															</>
														)}
													</div>
													<div>
														{entry.late > 0 && (
															<>
																<span>{entry.late}</span>{" "}
																{TASKS_TRANSLATION.LATE[user?.language?.toUpperCase()]}{" "}
															</>
														)}
													</div>
												</>
											) : (
												<div>
													{entry.skipped > 0 && (
														<>
															<span>
																<Plus size={6} color={Colors.veryLightBlue} />{" "}
																{entry.skipped}
															</span>{" "}
															{COMMON_TRANSLATION.SKIPPED[user?.language?.toUpperCase()]}
														</>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.piechartcontent_details}>
							{emptyState?.map((entry, index) => (
								<div key={index} className={styles.detailcard}>
									<div className={styles.detailcard_row1}>
										<div
											className={`${styles.detailcard_row1_colorbox} ${styles.detailcard_row1_colorbox_emptystate}`}
										></div>
										<div
											className={`${styles.detailcard_row1_value} ${styles.detailcard_row1_emptystatevalue}`}
										>
											0
										</div>
										<div
											className={`${styles.detailcard_row1_value} ${styles.detailcard_row1_emptystatevalue}`}
										>
											0%
										</div>
										<div className={styles.detailcard_row1_name}>{`${
											entry.name === "linkedin"
												? TASK_TYPES["linkedin"][user?.language.toUpperCase()]
												: entry.name === "custom"
												? TASK_TYPES["custom"][user?.language.toUpperCase()]
												: entry.name === "message"
												? TASK_TYPES["message"][user?.language.toUpperCase()]
												: entry.name === "whatsapp"
												? TASK_TYPES["whatsapp"][user?.language.toUpperCase()]
												: TASK_TYPES[entry.name][user?.language.toUpperCase()] + "s"
										}`}</div>
									</div>
								</div>
							))}
						</div>
					)
				) : (
					<div className={styles.piechartcontent_details}>
						{[...Array(6).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)}
			</div>
			{isShow && (
				<PiechartModal
					data={emailTaskData}
					loading={emailtaskloading}
					setIsShow={setIsShow}
					type={type}
					isShow={isShow}
					modalRef={pendingTaskModalRef}
				/>
			)}
			{isCompletedModalShow && (
				<PiechartModal
					data={emailTaskData}
					loading={emailtaskloading}
					setIsShow={setCompletedModalShow}
					isShow={isCompletedModalShow}
					type={type}
					modalRef={completeTaskModalRef}
				/>
			)}
		</div>
	);
};

export default PiechartCardv3;
