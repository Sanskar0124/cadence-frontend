import { ENUMS } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	Bounced,
	CheckCircle,
	ClickGradient,
	DataCheckGradient,
	EndCadence,
	LeadsGradient,
	MessageGradient2,
	MinusGradient2,
	PauseYellowGradient,
	Refresh,
	ReplyGradient,
	SkipGradient,
	TimeGradient,
	UnsubscribeRed,
	ViewGradient,
	WrenchGradient,
} from "@cadence-frontend/icons";

export const STEP_ICONS = {
	mail: ENUMS.mail.icon.gradient,
	automated_mail: ENUMS.automated_mail.icon.gradient,
	message: <MessageGradient2 />,
	automated_message: ENUMS.automated_message.icon.default,
	call: ENUMS.call.icon.gradient,
	callback: ENUMS.callback.icon.gradient,
	linkedin_connection: ENUMS.linkedin_connection.icon.default,
	linkedin_message: ENUMS.linkedin_message.icon.default,
	linkedin_profile: ENUMS.linkedin_profile.icon.default,
	linkedin_interact: ENUMS.linkedin_interact.icon.default,
	whatsapp: ENUMS.whatsapp.icon.default,
	cadence_custom: <WrenchGradient />,
	data_check: <DataCheckGradient />,
	end: <EndCadence />,
	reply_to: ENUMS.reply_to.icon.gradient,
	automated_reply_to: ENUMS.automated_reply_to.icon.gradient,
};
export const ALPHABETS = ["A", "B", "C", "D"];

export const getMailStats = (user, stats) => {
	const totalSent = (stats?.delivered_count ?? 0) + (stats?.bounced_count ?? 0);
	return [
		{
			label: COMMON_TRANSLATION?.BOUNCED[user?.language?.toUpperCase()],
			value: "BOUNCED",
			icon: <Bounced />,
			count: stats?.bounced_count ?? 0,
			total_sent: totalSent,
			percentage:
				totalSent > 0 ? Math.round((stats?.bounced_count * 100) / totalSent) : 0,
		},
		{
			label: COMMON_TRANSLATION?.UNSUBSCRIBED[user?.language?.toUpperCase()],
			value: "UNSUBSCRIBED",
			icon: <UnsubscribeRed />,
			count: stats?.unsubscribed_count ?? 0,
			total_sent: totalSent,
			percentage:
				totalSent > 0 ? Math.round((stats?.unsubscribed_count * 100) / totalSent) : 0,
		},
		{
			label: COMMON_TRANSLATION?.REPLIED[user?.language?.toUpperCase()],
			value: "REPLIED",
			icon: <ReplyGradient />,
			count: stats?.replied_count ?? 0,
			total_sent: totalSent,
			percentage:
				totalSent > 0 ? Math.round((stats?.replied_count * 100) / totalSent) : 0,
		},
		{
			label: COMMON_TRANSLATION?.OPENED[user?.language?.toUpperCase()],
			value: "OPENED",
			icon: <ViewGradient />,
			count: stats?.opened_count ?? 0,
			total_sent: totalSent,
			percentage: totalSent > 0 ? Math.round((stats?.opened_count * 100) / totalSent) : 0,
		},
		{
			label: COMMON_TRANSLATION?.CLICKED[user?.language?.toUpperCase()],
			value: "CLICKED",
			icon: <ClickGradient />,
			count: stats?.clicked_count ?? 0,
			total_sent: totalSent,
			percentage:
				totalSent > 0 ? Math.round((stats?.clicked_count * 100) / totalSent) : 0,
		},
	];
};

export const getStepStats = (user, stats) => {
	return [
		{
			className: "red",
			label: CADENCE_TRANSLATION.DISQUALIFIED_LEADS[user?.language?.toUpperCase()],
			value: "DISQUALIFIEDLEADS",
			icon: <MinusGradient2 size={16} />,
			count: stats?.disqualifiedLeadsCount,
		},
		{
			className: "pink",
			label: TASKS_TRANSLATION.SKIPPED_TASKS[user?.language?.toUpperCase()],
			value: "SKIPPEDTASKS",
			icon: <SkipGradient size={18} />,
			count: stats?.skippedTasksCount,
			percentage:
				stats?.skippedTasksCount + stats?.doneTasksCount > 0
					? Math.round(
							(stats?.skippedTasksCount * 100) /
								(stats?.skippedTasksCount + stats?.doneTasksCount)
					  )
					: 0,
		},
		{
			className: "orange",
			label: CADENCE_TRANSLATION.PAUSED_LEADS[user?.language?.toUpperCase()],
			value: "PAUSEDLEADS",
			icon: <PauseYellowGradient size={16} />,
			count: stats?.pausedLeads,
		},
		{
			className: "orange",
			label: TASKS_TRANSLATION.SCHEDULED_TASKS[user?.language?.toUpperCase()],
			value: "SCHEDULEDTASKS",
			icon: <TimeGradient size={16} />,
			count: stats?.scheduledLeadsCount,
		},
		{
			className: "green",
			label: CADENCE_TRANSLATION.CONVERTED_LEADS[user?.language?.toUpperCase()],
			value: "CONVERTEDLEADS",
			icon: <Refresh size={16} color="#00B3A8" />,
			count: stats?.convertedLeadsCount,
		},
		{
			className: "green",
			label: TASKS_TRANSLATION.DONE_TASKS[user?.language?.toUpperCase()],
			value: "DONETASKS",
			icon: <CheckCircle size={16} color="#00B3A8" />,
			count: stats?.doneTasksCount,
		},
		{
			label: CADENCE_TRANSLATION.ACTIVE_PEOPLE[user?.language?.toUpperCase()],
			value: "PEOPLE",
			icon: <LeadsGradient size={18} />,
			count: stats?.currentLeadsCount,
		},
	];
};
