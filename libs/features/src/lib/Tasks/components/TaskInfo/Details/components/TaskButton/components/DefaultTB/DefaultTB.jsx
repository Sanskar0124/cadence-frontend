import { useCallback, useEffect } from "react";

import {
	CADENCE_NODE_TYPES,
	ENUMS,
	PHONE_INTEGRATIONS,
	POWER_STATUS,
	POWER_TASK_STATUS,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { CustomTask } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";

//components

//constants

import styles from "../../../../Details.module.scss";
import { useRecoilValue } from "recoil";
import { powerInfo, tourInfo, userInfo } from "@cadence-frontend/atoms";
import { useCall } from "@cadence-frontend/data-access";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@cadence-frontend/utils";

const LINKEDIN_STEP_NAMES = [
	"linkedin", // custom task
	"linkedin_message",
	"linkedin_connection",
	"linkedin_profile",
	"linkedin_interact",
];

const DefaultTB = ({
	userId,
	loading,
	handleActionClick,
	stepName,
	lead,
	validateTask,
	activeTaskInfo,
}) => {
	const navigate = useNavigate();
	const query = useQuery();
	const task_modal = query.get("task_modal");
	const user = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);
	const tour = useRecoilValue(tourInfo);
	const { fetchMessageAbTemplate, fetchTemplateLoading } = useCall();

	const checkDisabled = useCallback(() => {
		if (userId) return true;
		else if (LINKEDIN_STEP_NAMES.includes(stepName) && !lead.linkedin_url) return true;
		else return false;
	}, [userId, stepName, lead]);

	const isCallAndSmsDisabled = useCallback(
		() => user?.phone_system === PHONE_INTEGRATIONS.NONE && stepName === "message",
		[user, stepName]
	);

	// power
	useEffect(() => {
		if (
			lead &&
			Object.keys(lead).length > 0 &&
			lead.lead_id === activeTaskInfo?.Lead?.lead_id &&
			power.status === POWER_STATUS.BOOSTED &&
			power.tasks.find(t => t.active)?.task_id === activeTaskInfo?.task_id &&
			power.tasks.find(t => t.active)?.status !== POWER_TASK_STATUS.COMPLETED
		) {
			!isCallAndSmsDisabled() && handleActionClick({});
		}
		if (
			lead &&
			Object.keys(lead).length > 0 &&
			lead.lead_id === activeTaskInfo?.Lead?.lead_id &&
			task_modal
		) {
			!isCallAndSmsDisabled() && handleActionClick({});
		}
	}, [lead, power]);

	const handleClick = () => {
		// Exception for message task
		if (
			activeTaskInfo?.Node?.type === CADENCE_NODE_TYPES.MESSAGE &&
			activeTaskInfo?.Node?.data?.aBTestEnabled
		) {
			fetchMessageAbTemplate(activeTaskInfo?.Node?.node_id, {
				onSuccess: data => {
					// setTemplateId(data?.ab_template_id);
					navigate(`?task_id=${activeTaskInfo?.task_id}&task_modal=true`);
					handleActionClick({
						customFields: {
							newMessage: data?.message,
							aBTemplateId: data?.ab_template_id,
						},
					});
				},
			});
		} else if (stepName === "linkedin") {
			// exception for linkedin custom task
			window.open(lead.linkedin_url, "_blank");
			return validateTask();
		} else {
			navigate(`?task_id=${activeTaskInfo?.task_id}&task_modal=true`);
			handleActionClick({});
		}
	};

	return (isCallAndSmsDisabled() &&
		tour?.status !== PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING) ||
		activeTaskInfo?.Node?.type === "other" ? (
		<div className={styles.btnContainer}>
			<ThemedButton
				width="50%"
				theme={ThemedButtonThemes.GREEN}
				loading={loading}
				className={styles.btn1}
				onClick={validateTask}
			>
				Validate Task
			</ThemedButton>
		</div>
	) : (
		<div className={styles.btnContainer}>
			<ThemedButton
				width="50%"
				disabled={checkDisabled()}
				theme={ThemedButtonThemes.GREEN}
				loading={loading}
				className={styles.btn1}
				onClick={handleClick}
				id={"default-task-cta"}
			>
				{ENUMS[stepName]?.icon?.white ?? <CustomTask />}
				<p>{ENUMS[stepName]?.name[user?.language?.toUpperCase()]}</p>
			</ThemedButton>
		</div>
	);
};

export default DefaultTB;
