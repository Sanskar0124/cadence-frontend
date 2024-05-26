import moment from "moment-timezone";
import { forwardRef, useState } from "react";
import styles from "./SingleFeed.module.scss";

//components
import { Div } from "@cadence-frontend/components";
import RenderFeedPreview from "./components/RenderFeedPreview/RenderFeedPreview";
//constants
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { AVAILABLE_WARNING_MODAL, EMAIL_STATUS } from "./constants";
import { ScopeWarningModal } from "@cadence-frontend/widgets";
import { EMAIL_SCOPE_TYPES, MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const SingleFeed = (
	{
		activity,
		after,
		before,
		loading,
		setActiveModalParams,
		onActivityClick,
		renderActivityIcon,
		disabled,
	},
	ref
) => {
	const user = useRecoilValue(userInfo);
	const [read, setRead] = useState(activity?.read);
	const [warningModal, setWarningModal] = useState(false);
	const handleActivityActions = ({ type }) => {
		onActivityClick({ ...activity, type: type }, setRead);
	};

	return (
		<>
			<div className={styles.Activity}>
				<Div
					className={`${styles.singleActivity} ${loading ? styles.loading : ""} ${
						disabled ? styles.disabled : ""
					}`}
					loading={loading}
					ref={ref}
					onClick={() =>
						user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
						AVAILABLE_WARNING_MODAL.includes(activity.type) &&
						user?.email_scope_level === EMAIL_SCOPE_TYPES.STANDARD
							? setWarningModal(true)
							: onActivityClick(activity, setRead)
					}
				>
					<div
						className={`${styles.icon} ${after ? styles.after : ""} ${
							before ? styles.before : ""
						}`}
					>
						{renderActivityIcon(activity, read)}
					</div>
					<div className={styles.info}>
						<RenderFeedPreview
							activity={activity}
							setActiveModalParams={setActiveModalParams}
							handleActivityActions={handleActivityActions}
							cadence={
								activity?.Lead?.LeadToCadences?.filter(
									cadence => cadence?.Cadences?.[0]?.cadence_id === activity?.cadence_id
								)?.[0]
							}
						/>
						<div className={styles.time}>
							{moment(activity?.created_at).format("HH:mm")}
						</div>
					</div>
				</Div>
			</div>
			<ScopeWarningModal modal={warningModal} setModal={setWarningModal} />
		</>
	);
};

export default forwardRef(SingleFeed);
