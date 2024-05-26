import moment from "moment-timezone";

//components
import { AudioPlayer } from "@cadence-frontend/widgets";
import { NotePen } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Pause, Stop } from "@cadence-frontend/icons";
import { Colors, getLabelFromEnum } from "@cadence-frontend/utils";
import { Tooltip, Button, Skeleton } from "@cadence-frontend/components";

import { CADENCE_STATUS, LEAD_WARMTH } from "@cadence-frontend/constants";
//constants
import { ENUMS, REASON_TYPES } from "../../constants";
import styles from "./RenderReasonPreview.module.scss";

const RenderReasonPreview = ({ reason, lead }) => {
	if (reason?.has_warmth_changed) {
		return (
			<div
				className={`
				${styles.activityPreview} 
				${styles?.[reason?.lead_warmth]}
			`}
			>
				<div
					className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
				>{`${lead?.first_name}${lead?.last_name ? ` ${lead?.last_name}` : ``} is now a ${
					reason?.lead_warmth
				} lead`}</div>
				<div className={styles.description}>
					{reason?.Activity?.name || ENUMS[reason?.reason]?.name}
				</div>
			</div>
		);
	}
	const renderComponent = ({ reason }) => {
		switch (reason?.reason) {
			case REASON_TYPES.DEMO_BOOKED:
				return (
					<div className={`${styles.activityPreview} ${styles?.[reason?.reason]}`}>
						<div
							className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
						>
							{reason?.Activity?.name || ENUMS[reason?.reason]?.name}
						</div>
						<div className={styles.description}>
							{reason?.Activity
								? reason?.Activity?.status.replace(
										/\d/.test(
											reason?.Activity?.status.split(" ")[
												reason?.Activity?.status.split(" ").length - 1
											]
										)
											? reason?.Activity?.status.split(" ")[
													reason?.Activity?.status.split(" ").length - 1
											  ]
											: null,
										match => moment(match, "x").format("hh:mm A, MMM D YYYY")
								  )
								: reason?.metadata ?? "Activity was not recorded for this score"}
						</div>
					</div>
				);
			case REASON_TYPES.EMAIL_CLICKED:
			case REASON_TYPES.EMAIL_OPENED:
			case REASON_TYPES.EMAIL_REPLIED:
			case REASON_TYPES.SMS_CLICKED:
			case REASON_TYPES.INCOMING_CALL:
			case REASON_TYPES.OUTGOING_CALL:
			case REASON_TYPES?.BOUNCED_MAIL:
			case REASON_TYPES?.UNSUBSCRIBE:
				return (
					<div className={`${styles.activityPreview} ${styles?.[reason?.reason]}`}>
						<div
							className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
						>
							{reason?.Activity?.name || ENUMS[reason?.reason]?.name}
						</div>
						<div className={styles.description}>
							{reason?.Activity?.status ??
								reason?.metadata ??
								"Activity was not recorded for this score"}
						</div>
					</div>
				);
			case REASON_TYPES?.STATUS_UPDATE:
				return (
					<div
						className={`${styles.activityPreview} ${styles?.[reason?.Activity?.status]}`}
					>
						<div
							className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
						>
							{ENUMS[reason?.reason]?.name}
						</div>
						<div className={styles.description}>
							{reason?.metadata ?? "Activity was not recorded for this score"}
						</div>
					</div>
				);
			case REASON_TYPES.CRON_RESET:
			case REASON_TYPES.SETTINGS_RESET:
			case REASON_TYPES.MANUAL_RESET:
				return (
					<div className={styles.activityPreview}>
						<div
							className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
						>
							{ENUMS[reason?.reason]?.name}
						</div>
						<div className={styles.description}>
							{reason?.has_warmth_changed
								? `Lead was changed to ${reason?.lead_warmth} lead`
								: `Lead score was changed`}
						</div>
					</div>
				);
			default:
				return (
					<div className={`${styles.activityPreview} ${styles?.[reason?.reason]}`}>
						<div
							className={`
							${styles.title}
							${
								reason?.has_warmth_changed
									? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
										? styles.hot
										: styles.cold
									: ""
							}
							${reason?.score_delta >= 0 ? styles.positive : styles.negative}
						`}
						>
							{reason?.Activity?.name || ENUMS[reason?.reason]?.name}
						</div>
						<div className={styles.description}>
							{reason?.Activity?.status ??
								reason?.metadata ??
								"Activity was not recorded for this score"}
						</div>
					</div>
				);
		}
	};
	return renderComponent({ reason });
};

export default RenderReasonPreview;
