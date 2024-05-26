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
