import { useState } from "react";
import moment from "moment-timezone";

// components
import { Div } from "@cadence-frontend/components";
import { ClickGradient, ViewGradient, Wrench } from "@cadence-frontend/icons";
import { renderActivityIcon } from "@cadence-frontend/utils";
import RenderActivityPreview from "./components/RenderActivityPreview/RenderActivityPreview";

// constants
import { EMAIL_STATUS } from "./constants";

import styles from "./SingleActivity.module.scss";
import { Tooltip } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { AVAILABLE_WARNING_MODAL } from "libs/features/src/lib/Home/components/Feeds/components/LiveFeeds/components/SingleFeed/constants";
import { ScopeWarningModal } from "@cadence-frontend/widgets";
import { EMAIL_SCOPE_TYPES, MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const SingleActivity = ({
	activity,
	after,
	before,
	loading,
	onActivityClick,
	cadenceList,
}) => {
	const [read, setRead] = useState(activity.read);
	const [warningModal, setWarningModal] = useState(false);
	const handleActivityActions = ({ type }) => {
		onActivityClick({ ...activity, type: type }, setRead);
	};
	const user = useRecoilValue(userInfo);
	const ACTIVITY_TYPES = [
		"whatsapp",
		"mail",
		"linkedin",
		"message",
		"note",
		"custom_task",
		"custom_task_for_other",
	];

	return (
		<>
			<Div
				className={`${styles.singleActivity} ${
					activity && ACTIVITY_TYPES.includes(activity?.type) && styles.cursor
				} ${loading ? styles.loading : ""}`}
				loading={loading}
				onClick={() =>
					user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
					AVAILABLE_WARNING_MODAL.includes(activity?.type) &&
					user?.email_scope_level === EMAIL_SCOPE_TYPES.STANDARD
						? setWarningModal(true)
						: onActivityClick(activity, setRead)
				}
			>
				<div className={styles.date}>
					<div>{moment(activity?.created_at).format("MMM DD")}</div>
					<div>{moment(activity?.created_at).format("HH:mm")}</div>
				</div>
				<div
					className={`${styles.icon} ${after ? styles.after : ""} ${
						before ? styles.before : ""
					}`}
				>
					{renderActivityIcon(activity, read)}
					{activity?.type === "custom_task" && activity.task_type !== "other" && (
						<div className={styles.custom}>
							<Wrench />
						</div>
					)}
				</div>
				<RenderActivityPreview
					activity={activity}
					handleActivityActions={handleActivityActions}
					cadence={
						cadenceList?.filter(
							cadence => cadence?.Cadences?.[0]?.cadence_id === activity?.cadence_id
						)?.[0]
					}
				/>
				<div className={styles.trackInfo}>
					{activity.Email?.status === EMAIL_STATUS.CLICKED ||
						(activity.type.includes("clicked") && (
							<>
								<Tooltip text="Opened">
									<span className={styles.otherIcon}>
										<ViewGradient size="1.1rem" />
									</span>
								</Tooltip>
								<Tooltip text="Clicked">
									<span className={styles.otherIcon}>
										<ClickGradient size="1.1rem" />
									</span>
								</Tooltip>
							</>
						))}
					{activity.Email?.status === EMAIL_STATUS.OPENED && (
						<Tooltip text="Opened">
							<span className={styles.otherIcon}>
								<ViewGradient size="1.1rem" />
							</span>
						</Tooltip>
					)}
				</div>
			</Div>

			<ScopeWarningModal modal={warningModal} setModal={setWarningModal} />
		</>
	);
};

export default SingleActivity;
