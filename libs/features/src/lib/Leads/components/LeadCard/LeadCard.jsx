/* eslint-disable no-console */
import { forwardRef, useEffect, useState } from "react";
import moment from "moment-timezone";

import { Div } from "@cadence-frontend/components";
import { CadencesGradient, Hot, HotLead, Pause } from "@cadence-frontend/icons";
import {
	CADENCE_STATUS,
	CUSTOM_TASK_NODE_IDS,
	ENUMS,
	LANGUAGES,
	LEAD_STATUS,
	LEAD_WARMTH,
} from "@cadence-frontend/constants";
import { Colors, renderActivityIcon } from "@cadence-frontend/utils";
import { getTaskEnum } from "../utils";

import { LEAD_STATUS_LABELS } from "./constants";

import styles from "./LeadCard.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const LeadCard = forwardRef(
	(
		{ task, lead, onClick, active, cardInfoWidth, viewMode, loading = false, disabled },
		ref
	) => {
		const isCadencePaused = ltd =>
			lead.status === LEAD_STATUS.PAUSED || ltd.status === LEAD_STATUS.PAUSED;

		const user = useRecoilValue(userInfo);
		const [maxInd, setMaxInd] = useState(1);
		useEffect(() => {
			if (window.innerWidth <= 1320) setMaxInd(0);
			else setMaxInd(1);
			window.addEventListener("resize", () => {
				if (window.innerWidth <= 1320) setMaxInd(0);
				else setMaxInd(1);
			});
			return () => {
				window.removeEventListener("resize", () => setMaxInd(1));
			};
		}, []);

		const getUpperText = (cadence, lead) => {
			if (!cadence && !lead) return "";
			if (lead?.status === CADENCE_STATUS.NOT_STARTED)
				return `${COMMON_TRANSLATION.NOT_STARTED[user?.language.toUpperCase()]}`;

			if (lead?.status === CADENCE_STATUS.IN_PROGRESS)
				if (lead?.Tasks?.length === 0) {
					return `${CADENCE_TRANSLATION.IN_PROGRESS[user?.language.toUpperCase()]}`;
				} else {
					const isAllNodeNull = lead?.Tasks.every(item => item?.Node === null);
					if (lead?.Tasks[0]?.Node === null) {
						const nodeStep = lead?.Tasks?.find(item => item?.Node !== null);
						if (!nodeStep) {
							return `${CADENCE_TRANSLATION.IN_PROGRESS[user?.language.toUpperCase()]}`;
						}
						return `${COMMON_TRANSLATION.STEP[user?.language.toUpperCase()]} ${
							nodeStep?.Node?.step_number
						}/${cadence?.Nodes?.length}`;
					}
					if (isAllNodeNull) {
						return;
					} else {
						return `${COMMON_TRANSLATION.STEP[user?.language.toUpperCase()]} ${
							lead?.Tasks[0]?.Node?.step_number
						}/${cadence?.Nodes?.length}`;
					}
				}

			if (lead?.status === CADENCE_STATUS.PAUSED)
				if (lead?.Tasks?.length === 0) {
					return `${CADENCE_TRANSLATION.PAUSED[user?.language.toUpperCase()]}`;
				} else {
					const isAllNodeNull = lead?.Tasks.every(item => item?.Node === null);
					if (lead?.Tasks[0]?.Node === null) {
						const nodeStep = lead?.Tasks?.find(item => item?.Node !== null);
						if (!nodeStep) {
							return `${CADENCE_TRANSLATION.PAUSED[user?.language.toUpperCase()]}`;
						}
						return `${PEOPLE_TRANSLATION.LEAD_PAUSED_AT[user?.language.toUpperCase()]} ${
							nodeStep?.Node?.step_number
						}`;
					}
					if (isAllNodeNull) {
						return;
					}
					return `${PEOPLE_TRANSLATION.LEAD_PAUSED_AT[user?.language.toUpperCase()]} ${
						lead?.Tasks[0]?.Node?.step_number
					}`;
				}

			if (lead?.status === CADENCE_STATUS.STOPPED) {
				if (lead?.Tasks?.length === 0) {
					return `${PEOPLE_TRANSLATION.LEAD_STOPPED[user?.language.toUpperCase()]}`;
				} else {
					const isAllNodeNull = lead?.Tasks.every(item => item?.Node === null);
					if (lead?.Tasks[0]?.Node === null) {
						const nodeStep = lead?.Tasks?.find(item => item?.Node !== null);
						if (!nodeStep)
							return `${PEOPLE_TRANSLATION.LEAD_STOPPED[user?.language.toUpperCase()]}`;
						return `${PEOPLE_TRANSLATION.LEAD_PAUSED_AT[user?.language.toUpperCase()]} ${
							nodeStep?.Node?.step_number
						}`;
					}
					if (isAllNodeNull) {
						return;
					}
					return `${PEOPLE_TRANSLATION.LEAD_STOPPED_AT[user?.language.toUpperCase()]} ${
						lead?.Tasks[0]?.Node?.step_number
					}`;
				}
			}
		};

		return (
			<Div
				data-testid="lead-card"
				ref={ref}
				loading={loading}
				className={`${styles.card} ${active ? styles.active : ""} ${
					loading ? styles.loading : ""
				} ${disabled ? styles.disabled : ""}`}
				onClick={onClick}
			>
				<div className={styles.left}>
					<div className={styles.leadInfo}>
						<div>
							<span className={styles.accountName}>{lead?.Account?.name ?? ""}</span>
							{lead?.Account?.size && (
								<>
									<i>•</i>
									<span className={styles.accountSize}>
										{lead?.Account?.size}{" "}
										{PEOPLE_TRANSLATION.EMPLOYEE[user?.language.toUpperCase()]}
									</span>
								</>
							)}
						</div>
						<div>
							<p className={styles.leadName}>
								{(lead?.first_name ?? "") + " " + lead?.last_name ?? ""}
							</p>{" "}
						</div>
					</div>

					<div className={styles.hotLead}>
						<Hot
							style={{
								visibility:
									lead?.lead_warmth === LEAD_WARMTH.HOT_LEAD ? "visible" : "hidden",
							}}
						/>
					</div>
					<div className={`${styles.cadencesInfo}`}>
						{lead.LeadToCadences?.map((ltd, index) => {
							let taskEnum = null;
							if (ltd.Tasks?.length) taskEnum = ENUMS[getTaskEnum(ltd.Tasks[0])];
							const cadence = ltd.Cadences[0];

							return (
								index <= maxInd && (
									<div
										className={`${styles.cadenceTaskInfo} ${
											isCadencePaused(ltd) && styles.paused
										}`}
										key={index}
									>
										<div className={styles.icon}>
											{taskEnum?.icon?.gradient ??
												(ENUMS["linkedin"]?.type[getTaskEnum(task)] ? (
													ENUMS["linkedin"].icon?.gradient
												) : (
													<CadencesGradient />
												))}
											{isCadencePaused(ltd) && (
												<div className={styles.pauseIcon}>
													<Pause />
												</div>
											)}
										</div>
										<div className={styles.cadenceInfo}>
											<p className={styles.cadenceStep}>{getUpperText(cadence, ltd)}</p>
											<p
												title={ltd.Cadences[0]?.name ?? "Custom Task"}
												className={`${styles.cadenceName} ${
													lead.LeadToCadences?.length > 1 && styles.overflow
												}`}
											>
												{ltd.Cadences[0]?.name ?? "Custom Task"}
											</p>
										</div>
									</div>
								)
							);
						})}
					</div>
					<div className={styles.middle}>
						{lead.LeadToCadences?.length > maxInd + 1 && (
							<div className={styles.moreCadences}>
								+{lead.LeadToCadences.length - maxInd - 1}
							</div>
						)}
					</div>
				</div>
				<div className={`${styles.right}`}>
					{lead.Activities[0]?.name && (
						<div className={`${styles.activity} ${viewMode && styles.sidebarOpen}`}>
							<div className={styles.activityIcon}>
								{renderActivityIcon(lead.Activities[0], false)}
							</div>
							<div className={styles.activityInfo}>
								<p className={styles.activityTime}>
									{moment(lead.Activities[0]?.created_at)?.fromNow()}
								</p>
								<p className={styles.activityName} title={lead.Activities[0]?.name ?? ""}>
									{lead.Activities[0]?.name ?? ""}
								</p>
							</div>
						</div>
					)}
					<div className={styles.tags}>
						{lead.duplicate && (
							<div className={styles.duplicate}>
								{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
							</div>
						)}
						{
							<div
								className={`${lead.status} ${styles[lead.status]} ${
									styles[user?.language]
								}`}
							>
								{LEAD_STATUS_LABELS[lead.status][user?.language?.toUpperCase()]}
							</div>
						}
					</div>
				</div>
			</Div>
		);
	}
);

export default LeadCard;
