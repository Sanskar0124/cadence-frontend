//icons
import {
	AtrManualEmail,
	Message,
	MissedCall,
	Reply,
	Unsubscribe,
	MailClick,
	View,
	MailsGradient,
	MissedcallGradient,
	UnsubscribeGradient,
	ReplyGradient,
	MessageGradient2,
	ViewGradient,
	ClickGradient,
	Caution2,
	HotLead,
	HotLead2,
	Fire,
	RejectedCalls,
	ReceivedCalls,
} from "@cadence-frontend/icons";

import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

export const Filters = [
	{
		value: "all",
		text: COMMON_TRANSLATION.ALL_FILTERS,
	},
	{
		value: "replied_mails",
		icon: <Reply color={Colors.veryLightBlue} size="15px" />,
		gradientIcon: <ReplyGradient size="15px" />,
		text: COMMON_TRANSLATION.REPLIED_MAILS,
	},
	{
		value: "viewed_mails",
		icon: <View color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <ViewGradient size="16px" />,
		text: COMMON_TRANSLATION.OPENDED_MAILS,
	},
	{
		value: "clicked_mails",
		icon: <MailClick color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <ClickGradient size="16px" />,
		text: COMMON_TRANSLATION.CLICKED_MAILS,
	},

	{
		value: "unsubscribed_mails",
		icon: <Unsubscribe color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <UnsubscribeGradient size="16px" />,
		text: COMMON_TRANSLATION.UNSUBSCRIBED,
	},
	{
		value: "received_mails",
		icon: <AtrManualEmail color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <MailsGradient size="16px" />,
		text: COMMON_TRANSLATION.RECEIVED_MAILS,
	},

	{
		value: "bounced_mails",
		icon: <Caution2 color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <Caution2 size="16px" />,
		text: COMMON_TRANSLATION.BOUNCED_MAILS,
	},
	{
		value: "received_sms",
		icon: <Message color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <MessageGradient2 size="16px" />,
		text: COMMON_TRANSLATION.RECEIVED_SMS,
	},

	// {
	// 	value: "voicemail",
	// 	icon: <Voicemail color={Colors.veryLightBlue} size="20px" />,
	// 	text: "Voicemails",
	// },
	{
		value: "missed_calls",
		icon: <MissedCall color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <MissedcallGradient size="16px" />,
		text: COMMON_TRANSLATION.MISSED_CALLS,
	},
	{
		value: "received_calls",
		icon: <ReceivedCalls color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <ReceivedCalls size="16px" />,
		text: COMMON_TRANSLATION.RECEIVED_CALLS,
	},
	{
		value: "rejected_calls",
		icon: <RejectedCalls color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <RejectedCalls size="16px" />,
		text: COMMON_TRANSLATION.REJECTED_CALLS,
	},
	{
		value: "hot_leads",
		icon: <Fire color={Colors.veryLightBlue} size="16px" />,
		gradientIcon: <Fire size="16px" />,
		text: COMMON_TRANSLATION.HOT_LEAD,
	},
];

// ViwedMails: (
//   <div className={styles.options}>
//     <View
//       color={filter === "ViwedMails" ? Colors.white : Colors.veryLightBlue}
//     />
//     <div className={styles.options_text}>Viewed mails</div>
//   </div>
// ),
// ClickedMails: (
//   <div className={styles.options}>
//     <MailClick
//       color={
//         filter === "ClickedMails" ? Colors.white : Colors.veryLightBlue
//       }
//     />
//     <div className={styles.options_text}>Clicked mails</div>
//   </div>
// ),
// RepliedMails: (
//   <div className={styles.options}>
//     <Reply
//       color={
//         filter === "RepliedMails" ? Colors.white : Colors.veryLightBlue
//       }
//       size="15px"
//     />
//     <div className={styles.options_text}>Viewed mails</div>
//   </div>
// ),
// UnsubsribedMails: (
//   <div className={styles.options}>
//     <Unsubscribe
//       color={
//         filter === "UnsubsribedMails" ? Colors.white : Colors.veryLightBlue
//       }
//       size="16px"
//     />
//     <div className={styles.options_text}>Unsubsribed mails</div>
//   </div>
// ),
// RecievedMails: (
//   <div className={styles.options}>
//     <AtrManualEmail
//       color={
//         filter === "RecievedMails" ? Colors.white : Colors.veryLightBlue
//       }
//     />
//     <div className={styles.options_text}>Received mails</div>
//   </div>
// ),
// ReceivedSms: (
//   <div className={styles.options}>
//     <Message
//       color={filter === "ReceivedSms" ? Colors.white : Colors.veryLightBlue}
//       size="16px"
//     />
//     <div className={styles.options_text}>Received SMS</div>
//   </div>
// ),
// Voicemails: (
//   <div className={styles.options}>
//     <Voicemail
//       color={filter === "Voicemails" ? Colors.white : Colors.veryLightBlue}
//       size="20px"
//     />
//     <div className={styles.options_text}>Voicemails</div>
//   </div>
// ),
// MissedCalls: (
//   <div className={styles.options}>
//     <MissedCall
//       color={filter === "MissedCalls" ? Colors.white : Colors.veryLightBlue}
//       size="16px"
//     />
//     <div className={styles.options_text}>Missed calls</div>
//   </div>
// ),
