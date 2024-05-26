import {
	CADENCE_NODE_TYPES,
	EMAIL_SCOPE_TYPES,
	ENUMS,
	MAIL_INTEGRATION_TYPES,
	POWER_STATUS,
	POWER_TASK_STATUS,
} from "@cadence-frontend/constants";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { getMailData, useQuery } from "@cadence-frontend/utils";
import { ScopeWarningModal, ThemedButton } from "@cadence-frontend/widgets";
import styles from "../../../../Details.module.scss";
import { useTasks } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { powerInfo, userInfo } from "@cadence-frontend/atoms";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//constants

const MailTB = ({
	userId,
	loading,
	handleActionClick,
	stepName,
	activeTaskInfo,
	lead,
}) => {
	const navigate = useNavigate();
	const query = useQuery();
	const task_modal = query.get("task_modal");
	const { fetchTemplate, fetchTemplateLoading } = useTasks(false);
	const [warningModal, setWarningModal] = useState(false);
	const user = useRecoilValue(userInfo);
	const power = useRecoilValue(powerInfo);

	const onClick = () => {
		if (activeTaskInfo?.Node?.data?.aBTestEnabled) {
			fetchTemplate(activeTaskInfo?.Node?.node_id, {
				onSuccess: data => {
					navigate(`?task_id=${activeTaskInfo?.task_id}&task_modal=true`);
					handleActionClick({
						customFields: {
							mailData: getMailData({
								attachments: data?.attachments,
								body: data?.body,
								subject: data?.subject,
								cc: activeTaskInfo?.Node?.data?.cc,
								bcc: activeTaskInfo?.Node?.data?.bcc,
								et_id: activeTaskInfo?.Node?.data?.et_id,
								lead: lead, // to is set with the help of this
								cadence_id: activeTaskInfo?.Cadence?.cadence_id,
								node_id: activeTaskInfo?.Node?.node_id,
							}),
							replied_node_id: activeTaskInfo?.Node?.data?.replied_node_id,
							abTemplateId: data?.ab_template_id,
						},
					});
				},
			});
		} else {
			navigate(`?task_id=${activeTaskInfo?.task_id}&task_modal=true`);
			handleActionClick({
				customFields: {
					mailData: getMailData({
						attachments: activeTaskInfo?.Node?.data?.attachments,
						body: activeTaskInfo?.Node?.data?.body,
						subject: activeTaskInfo?.Node?.data?.subject,
						cc: activeTaskInfo?.Node?.data?.cc,
						bcc: activeTaskInfo?.Node?.data?.bcc,
						et_id: activeTaskInfo?.Node?.data?.et_id,
						lead: lead, // to is set with the help of this
						cadence_id: activeTaskInfo?.Cadence?.cadence_id,
						node_id: activeTaskInfo?.Node?.node_id,
					}),
					replied_node_id: activeTaskInfo?.Node?.data?.replied_node_id,
				},
			});
		}
	};

	const isInsufficientData = () =>
		lead?.Lead_emails?.filter(em => em.email_id.length).length === 0 || !!userId;

	// power
	useEffect(() => {
		if (
			lead &&
			Object.keys(lead).length > 0 &&
			lead.lead_id === activeTaskInfo.Lead?.lead_id &&
			power.status === POWER_STATUS.BOOSTED &&
			power.tasks.find(t => t.active)?.task_id === activeTaskInfo.task_id &&
			power.tasks.find(t => t.active)?.status !== POWER_TASK_STATUS.COMPLETED
		) {
			onClick();
		}
		if (
			lead &&
			Object.keys(lead).length > 0 &&
			lead.lead_id === activeTaskInfo.Lead?.lead_id &&
			task_modal
		)
			onClick();
	}, [lead, power]);

	return (
		<>
			<div className={styles.btnContainer}>
				<ThemedButton
					width="50%"
					disabled={isInsufficientData()}
					theme={ThemedButtonThemes.GREEN}
					className={styles.btn1}
					loading={loading || fetchTemplateLoading}
					onClick={() =>
						user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
						activeTaskInfo.Node.type === CADENCE_NODE_TYPES.REPLY_TO &&
						user?.email_scope_level === EMAIL_SCOPE_TYPES.STANDARD
							? setWarningModal(true)
							: onClick()
					}
					id="mail-task-cta"
				>
					{ENUMS[stepName].icon.white}
					<p>{ENUMS[stepName].name[user?.language?.toUpperCase()]}</p>
				</ThemedButton>
			</div>

			<ScopeWarningModal modal={warningModal} setModal={setWarningModal} />
		</>
	);
};

export default MailTB;
