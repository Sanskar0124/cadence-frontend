import { Title, Skeleton } from "@cadence-frontend/components";
import {
	Cadence,
	CadenceGreenGradient,
	PlayGreenGradient,
	PauseGradient,
	CadenceYellowGradient,
	ClockGrayGradient,
	PauseYellowGradient,
	InfoCircle,
	NoTasksPiechart,
} from "@cadence-frontend/icons";
import React, { useState, useEffect } from "react";
import styles from "./CadenceCard.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { cadenceConstants, CADENCE_STATUS } from "./constants";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { CADENCE_TOOLTIP } from "../../constants";
import Tooltip from "../Tooltip/Tooltip";
import { TooltipThemes } from "@cadence-frontend/themes";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const CadenceCardData = ({
	data,
	loading,
	cadenceSelected,
	setCadenceSelected,
	tab,
	setTab,
}) => {
	const user = useRecoilValue(userInfo);

	const selectActiveCadence = () => {
		const activeCadences = data?.find(item => item.status === "in_progress");
		const teamIds = activeCadences?.team?.map(item => item.cadence_id);
		const companyIds = activeCadences?.company?.map(item => item.cadence_id);
		const personalIds = activeCadences?.personal?.map(item => item.cadence_id);
		setCadenceSelected(prevState => ({
			...prevState,
			personal: personalIds?.length > 0 ? [...personalIds] : [],
			team: teamIds?.length > 0 ? [...teamIds] : [],
			company: companyIds?.length > 0 ? [...companyIds] : [],
		}));
		// setCadenceSelected({ personal: [], team: [], company: [] });
	};
	// console.log(cadenceSelected, "cadence card data");

	return (
		<div
			className={styles.cadencecard}
			style={{
				width:
					user?.integration_type === INTEGRATION_TYPE?.SALESFORCE ||
					user?.integration_type === INTEGRATION_TYPE?.HUBSPOT
						? "34%"
						: "49.5%",
			}}
		>
			<div className={styles.cadencecard_header}>
				<Title className={styles.cadencecard_title} size="1.25rem">
					{STATISTICS_TRANSLATION.CADENCE[user?.language?.toUpperCase()]}
				</Title>
				<Tooltip text={CADENCE_TOOLTIP}>
					<InfoCircle />
				</Tooltip>
			</div>

			<div className={styles.cadencecard_data}>
				{loading ? (
					<div className={styles.cadencecard_data_skeleton_details}>
						{[...Array(3).keys()].map(key => (
							<Skeleton className={styles.detailsPlaceholder} />
						))}
					</div>
				) : data?.length > 0 ? (
					data?.map(({ status, cadence_count, index }) => {
						return (
							<>
								<div
									className={styles.data}
									key={status}
									style={{ cursor: loading ? "" : status === "in_progress" && "pointer" }}
									onClick={status === "in_progress" && selectActiveCadence}
								>
									<CadenceIconContainer
										relativeIcon={
											status === "in_progress" ? (
												<CadenceGreenGradient />
											) : status === "paused" ? (
												<CadenceYellowGradient />
											) : (
												<Cadence color={Colors.veryLightBlue} />
											)
										}
										absoluteIcon={
											status === "in_progress" ? (
												<PlayGreenGradient />
											) : status === "paused" ? (
												<PauseYellowGradient />
											) : (
												<ClockGrayGradient color={Colors.veryLightBlue} />
											)
										}
										gradient={
											status === "in_progress"
												? styles.isactive
												: status === "paused"
												? styles.ispaused
												: styles.isidle
										}
									/>

									<div className={styles.data_with_status}>
										<span className={styles.number}>{cadence_count}</span>
										<span className={styles.status}>
											{CADENCE_STATUS[status][user?.language.toUpperCase()]}
										</span>
									</div>
								</div>
								{status !== "not_started" && <div className={styles.verticalline}></div>}
							</>
						);
					})
				) : (
					<div className={styles.noTasks}>
						<p>
							{COMMON_TRANSLATION.CURRENTLY_NO_CADENCE[user?.language?.toUpperCase()]}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export const CadenceIconContainer = ({ relativeIcon, absoluteIcon, gradient }) => {
	return (
		<div className={`${styles.icon_container} ${gradient}`}>
			<div className={styles.cadence_icon}>{relativeIcon}</div>
			<div className={styles.cadence_absolute_icon}>{absoluteIcon}</div>
		</div>
	);
};

export default CadenceCardData;
