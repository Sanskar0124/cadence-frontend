import styles from "./PiechartModal.module.scss";
import { useEffect, useState } from "react";
import { COLORS, MODALCOLORS, SKIPPEDPIECHARTCOLORS } from "../../../constants";
import { NoTasksPiechart } from "@cadence-frontend/icons";
import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import { Statistics as STATISTICS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { PieChart, Pie, Cell } from "recharts";
import { EMAIL_CONSTANTS } from "./constant";

const PiechartModal = ({ data, loading, setIsShow, type, isShow, modalRef }) => {
	const emailTasks = data?.reduce((prevVal, curr) => prevVal + curr?.value, 0);
	const user = useRecoilValue(userInfo);
	const role = user.role;

	const closeModal = () => {
		setIsShow(false);
	};

	return (
		<div
			className={styles.piechartcard}
			onClick={() => setIsShow(!isShow)}
			ref={modalRef}
			style={{
				position: "absolute",
				left: type === "headerModal" ? "50rem" : "",
				top: type === "headerModal" ? "10rem" : "",
			}}
		>
			<div className={styles.piechartcard_title}>
				<Title size="1.25rem">
					{STATISTICS_TRANSLATION.EMAIL_TASKS[user?.language?.toUpperCase()]}
				</Title>
				{/* <InfoCircle color={Colors.veryLightBlue} style={{cursor:"pointer"}}/> */}
			</div>
			<div className={styles.piechartcontent}>
				<div className={styles.piechartcontent_piechart}>
					{!loading ? (
						emailTasks > 0 ? (
							<PieChart width={450} height={175}>
								<Pie
									data={data}
									dataKey="value"
									cx="50%"
									cy="50%"
									innerRadius={"25%"}
									fill="#8884d8"
									stroke="0.1"
								>
									{data?.map((entry, index) => {
										return (
											<Cell key={`cell-${entry.name}`} fill={MODALCOLORS?.[index]} />
										);
									})}
								</Pie>
								<Pie
									data={data}
									dataKey="value"
									cx="50%"
									cy="50%"
									innerRadius={"32%"}
									outerRadius={"45%"}
									fill="#F5F6F7"
									stroke="0.1"
								></Pie>
							</PieChart>
						) : (
							<NoTasksPiechart style={{ transform: "translateX(56px)" }} />
						)
					) : (
						<Skeleton className={styles.piePlaceholder} />
					)}
					{emailTasks > 0 && (
						<div
							className={` ${styles.piechartcontent_center} ${styles.piechartcontent_center_value}`}
						>
							{emailTasks}
						</div>
					)}
				</div>
				{!loading ? (
					emailTasks > 0 && (
						<div className={styles.piechartcontent_details}>
							{data?.map((entry, index) => (
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
											{((entry.value / emailTasks) * 100).toFixed()}%
										</div>
										<div className={styles.detailcard_row1_name}>
											{EMAIL_CONSTANTS[entry.name][user?.language.toUpperCase()]}
										</div>
									</div>
								</div>
							))}
						</div>
					)
				) : (
					<div className={styles.piechartcontent_details}>
						{[...Array(2).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				)}
			</div>
		</div>
		// </Modal>
	);
};

export default PiechartModal;
