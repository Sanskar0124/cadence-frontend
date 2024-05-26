import { forwardRef, useState } from "react";
import moment from "moment-timezone";

// components
import { Div } from "@cadence-frontend/components";
import { ClickGradient, ViewGradient } from "@cadence-frontend/icons";
import renderReasonIcon from "./renderReasonIcon";

import RenderReasonPreview from "../RenderReason/RenderReasonPreview";

// constants
import { EMAIL_STATUS, REASON_TYPES } from "../../constants";

import styles from "./SingleReason.module.scss";
import { LEAD_WARMTH } from "@cadence-frontend/constants";
import { formatNumber } from "@cadence-frontend/utils";

const SingleReason = ({ reason, loading, lead }, ref) => {
	return (
		<Div
			className={`${styles.singleActivity} ${
				reason && Object.values(REASON_TYPES).includes(reason?.type) && styles.cursor
			} ${loading ? styles.loading : ""}`}
			loading={loading}
			ref={ref}
		>
			<div className={styles.date}>
				<div>{moment(reason?.created_at).format("MMM DD")}</div>
				<div>{moment(reason?.created_at).format("HH:mm")}</div>
			</div>
			<div
				className={`
				${styles.icon}
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
				{renderReasonIcon(reason)}
			</div>
			<RenderReasonPreview lead={lead} reason={reason} />
			<div
				className={`
				${styles.score} 
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
				<p
					className={`
					${
						reason?.has_warmth_changed
							? reason?.lead_warmth === LEAD_WARMTH.HOT_LEAD
								? styles.hot
								: styles.cold
							: ""
					}
					${reason?.score_delta >= 0 ? styles.positive : styles.negative}}`}
				>
					{/* For All Reset Purposes, score delta is > 0, however for the Rubriks with negative marking, we have negative numbers */}
					{reason?.score_delta >= 0
						? reason?.has_warmth_changed && reason?.lead_warmth === LEAD_WARMTH.COLD_LEAD
							? `-`
							: `+`
						: reason?.score_delta < 0
						? `-`
						: `+`}
					{reason?.reason === REASON_TYPES?.SETTINGS_RESET
						? `0 pts`
						: `${formatNumber(parseInt(Math.abs(reason?.score_delta)), 2)} pts`}
				</p>
			</div>
		</Div>
	);
};

export default forwardRef(SingleReason);
