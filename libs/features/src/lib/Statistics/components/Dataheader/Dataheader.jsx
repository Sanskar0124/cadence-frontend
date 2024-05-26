import React, { useEffect, useRef, useState } from "react";
import { HEADER_DATA } from "../../constants";
import styles from "./Dataheader.module.scss";
import { selectedColumn, userInfo } from "@cadence-frontend/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import integrationType from "libs/constants/src/lib/integrationType";
import PiechartModal from "../Modals/EmailTaskModal/PiechartModal";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Div, Skeleton } from "@cadence-frontend/components";

const Dataheader = ({ data, loading, headerData, activeBtn }) => {
	const user = useRecoilValue(userInfo);
	const [dataHeader, setDataHeader] = useState([]);
	const [isVisible, setIsVisible] = useState(false);
	const modalRef = useRef(null);
	// let newRenderdData = Object.entries(data || {}).map(item => ({
	// 	label: item[0],
	// 	value: item[1],
	// }));
	// newRenderdData = newRenderdData.filter(item =>
	// 	Object.keys(HEADER_DATA).includes(item.label)
	// );

	const emailData = Object.keys(data || {})
		?.filter(item => item.includes("semi"))
		.map(label => ({ name: label, value: data[label] }))
		.slice(0, 2);

	const emailTaskValue = emailData.reduce((prevValue, curr) => prevValue + curr.value, 0);

	useOutsideClickHandler(modalRef, () => setIsVisible(false));

	useEffect(() => {
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
			setDataHeader(
				Object.entries(data || {})
					.map(item => ({
						label: item[0],
						value: item[1],
					}))
					.filter(item => Object.keys(HEADER_DATA).includes(item.label))
					.filter(item => item.label !== "disqualified" && item.label !== "converted")
					.filter(newitem => newitem?.label !== "mails")
			);
		} else {
			setDataHeader(
				Object.entries(data || {})
					.map(item => ({
						label: item[0],
						value: item[1],
					}))
					.filter(item => Object.keys(HEADER_DATA).includes(item.label))
					.filter(newitem => newitem?.label !== "mails")
			);
		}
	}, [data, activeBtn]);

	const sortedheaderData =
		dataHeader &&
		dataHeader
			.map(item =>
				item.label === "disqualified"
					? { ...item, order: 2 }
					: item?.label === "converted"
					? { ...item, order: 3 }
					: { ...item, order: 1 }
			)
			.sort((a, b) => a.order - b.order);

	return (
		<div className={styles.dataheader}>
			{loading ? (
				<div className={styles.linePlaceholders}>
					{[...Array(10).keys()].map(key => (
						<Skeleton className={styles.linePlaceholder} />
					))}
				</div>
			) : (
				sortedheaderData?.map((task, index) => (
					<div
						style={{ cursor: task.label === "mails" ? "pointer" : "" }}
						key={task.label}
						className={`${styles.data_item} ${
							task.label === "disqualified" && styles.data_disqualified
						} ${task.label === "converted" && styles.data_converted}`}
						onClick={
							task.label === "mails"
								? () => setIsVisible(!isVisible)
								: () => setIsVisible(false)
						}
					>
						<span className={`${styles.data_name}`}>
							{Object.keys(HEADER_DATA).map(key =>
								key === task.label ? HEADER_DATA[key][user?.language.toUpperCase()] : null
							)}
						</span>
						<span className={styles.data_value}>
							{Object.keys(HEADER_DATA).map((key, ind) =>
								key === task.label ? task.value : null
							)}
						</span>
					</div>
				))
			)}
			{/* COMMENTING THIS CODE BECAUSE WE ARE NOT RENDERING EMAIL IN DATA HEADER  */}
			{/* {emailTaskValue > 0 && isVisible && (
				<PiechartModal
					data={emailData}
					isShow={isVisible}
					setIsShow={setIsVisible}
					loading={loading}
					modalRef={modalRef}
					type="headerModal"
				/>
			)} */}
		</div>
	);
};

export default Dataheader;
