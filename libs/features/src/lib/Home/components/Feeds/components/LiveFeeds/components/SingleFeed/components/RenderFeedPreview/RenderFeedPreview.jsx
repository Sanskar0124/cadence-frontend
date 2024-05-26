import moment from "moment-timezone";
//components
import { AudioPlayer } from "@cadence-frontend/widgets";
import { NotePen } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors, getLabelFromEnum } from "@cadence-frontend/utils";
import { Tooltip, Button, Skeleton } from "@cadence-frontend/components";

import { CADENCE_STATUS } from "@cadence-frontend/constants";
//constants
import { Pause, Stop } from "@cadence-frontend/icons";
import styles from "./RenderFeedPreview.module.scss";
import { getTranslateSubtext } from "./constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const RenderFeedPreview = ({ activity, handleActivityActions, cadence }) => {
	const user = useRecoilValue(userInfo);
	const stripHtml = html => {
		let tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	};

	const renderComponent = ({ activity, handleActivityActions, cadence }) => {
		switch (activity?.type) {
			case "mail":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "reply_to":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "hot_lead":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "bounced_mail":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);
			case "viewed_mail":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);
			case "clicked_mail":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "clicked_message":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "unsubscribe":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "message":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
					</div>
				);

			case "call":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>
							<span>{activity?.Lead?.full_name}</span>
							{activity?.comment && (
								<div className={styles.note} tooltip={activity.comment}>
									<NotePen size="14px" />
								</div>
							)}
						</div>
						<div className={`${styles.description} ${styles.callDescription}`}>
							{getTranslateSubtext(activity)[user?.language?.toUpperCase()]}
						</div>
						{activity?.recording && (
							<div className={styles.audioPlayer}>
								<AudioPlayer source={activity?.recording} />
							</div>
						)}
					</div>
				);
			case "message":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{activity?.status?.substring(0, 100)}
						</div>
					</div>
				);
			case "linkedin_connection":
			case "linkedin_message":
			case "linkedin_profile":
			case "linkedin_interact":
				return (
					<div className={`${styles.activityPreview} ${styles[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
					</div>
				);
			case "voicemail":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "note":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{stripHtml(activity?.status).replace(/\s+/g, " ")?.substring(0, 240) || ""}
						</div>
					</div>
				);

			case "meeting":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "move_cadence":
			case "stop_cadence":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "pause_cadence":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{
								//replace only if it contains unix
								activity?.status.replace(
									/\d/.test(
										activity.status.split(" ")[activity.status.split(" ").length - 1]
									)
										? activity.status.split(" ")[activity.status.split(" ").length - 1]
										: null,
									match => moment(match, "x").format("hh:mm A, MMM D YYYY")
								)
							}
						</div>
					</div>
				);
			case "resume_cadence":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "lead_converted":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "lead_disqualified":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "contact_disqualified":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "launch_cadence":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>
							{
								//replace only if it contains unix
								activity?.status.replace(
									/\d/.test(
										activity.status.split(" ")[activity.status.split(" ").length - 1]
									)
										? activity.status.split(" ")[activity.status.split(" ").length - 1]
										: null,
									match => moment(match, "X").format("hh:mm A, MMM D YYYY")
								)
							}
						</div>
					</div>
				);

			case "task_skipped":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
			case "out_of_office":
				return (
					<div className={`${styles.activityPreview} ${styles?.[activity?.type]}`}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
						{activity.cadence_id && (
							<div className={styles.actions}>
								<Tooltip
									text={
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING
											? `Cadence ${getLabelFromEnum(cadence.status)}`
											: cadence?.status === CADENCE_STATUS.STOPPED
											? "Lead Stopped"
											: cadence?.status === CADENCE_STATUS.PAUSED
											? "Lead Paused"
											: null
									}
									className={styles.stopTooltip}
								>
									<ThemedButton
										theme={ThemedButtonThemes.SECONDARY}
										style={{
											height: "2.75em",
											width: "fit-content",
											minWidth: "6em",
											padding: "0rem 0.75rem",
											borderRadius: "20px",
										}}
										disabled={
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING ||
											cadence?.status === CADENCE_STATUS.STOPPED ||
											cadence?.status === CADENCE_STATUS.PAUSED
										}
										onClick={e => {
											e.stopPropagation();
											handleActivityActions({ type: "pause_cadence_oof" });
										}}
									>
										<Pause color={Colors.purpleGradient} /> Pause Cadence
									</ThemedButton>
								</Tooltip>
								<Tooltip
									text={
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
										cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING
											? `Cadence ${getLabelFromEnum(cadence.status)}`
											: cadence?.status === CADENCE_STATUS.STOPPED
											? "Lead Stopped"
											: null
									}
									className={styles.stopTooltip}
								>
									<ThemedButton
										theme={ThemedButtonThemes.SECONDARY}
										style={{
											height: "2.75em",
											width: "fit-content",
											minWidth: "8em",
											padding: "0rem 0.75rem",
											borderRadius: "20px",
										}}
										disabled={
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.NOT_STARTED ||
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PAUSED ||
											cadence?.Cadence?.[0]?.status === CADENCE_STATUS.PROCESSING ||
											cadence?.status === CADENCE_STATUS.STOPPED
										}
										onClick={e => {
											e.stopPropagation();
											handleActivityActions({ type: "stop_cadence_oof" });
										}}
									>
										<Stop color={Colors.purpleGradient} /> Stop Cadence
									</ThemedButton>
								</Tooltip>
							</div>
						)}
					</div>
				);
			default:
				return (
					<div className={styles.activityPreview}>
						<div className={styles.title}>{activity?.Lead?.full_name}</div>
						<div className={styles.description}>{activity?.status}</div>
					</div>
				);
		}
	};
	return renderComponent({ activity, handleActivityActions, cadence });
};

export default RenderFeedPreview;
