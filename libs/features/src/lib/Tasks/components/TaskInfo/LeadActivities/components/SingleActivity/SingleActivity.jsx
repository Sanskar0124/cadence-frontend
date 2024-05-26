import { useState } from "react";
import styles from "./SingleActivity.module.scss";
import moment from "moment-timezone";

//components
import { Div } from "@cadence-frontend/components";
import {
	Click,
	ClickGradient,
	View,
	ViewGradient,
	Wrench,
} from "@cadence-frontend/icons";
import RenderActivityPreview from "./components/RenderActivityPreview/RenderActivityPreview";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

//constants
import { ACTIVITY_TYPES, EMAIL_STATUS } from "./constants";
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
	setActiveModalParams,
	onActivityClick,
	renderActivityIcon,
	disabled,
}) => {
	const [read, setRead] = useState(activity.read);
	const user = useRecoilValue(userInfo);

	const [warningModal, setWarningModal] = useState(false);

	const handleActivityActions = ({ type }) => {
		onActivityClick({ ...activity, type: type }, setRead);
	};

	return (
		<>
			<Div
				className={`${styles.singleActivity} ${
					activity && ACTIVITY_TYPES.includes(activity?.type) && styles.cursor
				}
			 ${loading ? styles.loading : ""} ${disabled ? styles.disabled : ""}`}
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
				/>
				<div className={styles.trackInfo}>
					{activity.Email?.status === EMAIL_STATUS.CLICKED && (
						<>
							<span>
								<ViewGradient size="1.1rem" />{" "}
								{COMMON_TRANSLATION.OPENED[user?.language?.toUpperCase()]}
							</span>
							<span>
								<ClickGradient size="1rem" />{" "}
								{COMMON_TRANSLATION.CLICKED[user?.language?.toUpperCase()]}
							</span>
						</>
					)}
					{activity.Email?.status === EMAIL_STATUS.OPENED && (
						<span>
							<ViewGradient size="1.1rem" />{" "}
							{COMMON_TRANSLATION.OPENED[user?.language?.toUpperCase()]}
						</span>
					)}
				</div>
			</Div>

			<ScopeWarningModal modal={warningModal} setModal={setWarningModal} />
		</>
	);
};

export default SingleActivity;
