import {
	Caution2,
	MailClick,
	Message,
	Reply,
	Unsubscribe,
	View,
	Calendar,
	Fire,
	Cross,
	Network,
	CallIncoming,
	CallOutgoing,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
export const REASON_TYPES = {
	EMAIL_CLICKED: "email_clicked",
	EMAIL_OPENED: "email_opened",
	EMAIL_REPLIED: "email_replied",
	INCOMING_CALL: "incoming_call_received",
	SMS_CLICKED: "sms_clicked",
	UNSUBSCRIBE: "unsubscribe",
	BOUNCED_MAIL: "bounced_mail",
	OUTGOING_CALL: "outgoing_call",
	DEMO_BOOKED: "demo_booked",
	MANUAL_RESET: "manual_reset",
	CRON_RESET: "cron_reset",
	STATUS_UPDATE: "status_update",
	SETTINGS_RESET: "settings_reset",
};

export const WARMTH = {
	icon: {
		hot: <Fire />,
		cold: <Cross />,
	},
};

export const ENUMS = {
	[REASON_TYPES.MANUAL_RESET]: {
		name: "Lead score was manually reset",
		icon: {
			default: <Cross />,
		},
	},
	[REASON_TYPES.SETTINGS_RESET]: {
		name: "Lead warmth was reset via settings change",
		icon: {
			default: <Fire />,
			cold: <Cross />,
		},
	},
	[REASON_TYPES.CRON_RESET]: {
		name: "Lead score has expired",
		icon: {
			default: <Cross />,
		},
	},
	// MAIL
	[REASON_TYPES.EMAIL_CLICKED]: {
		name: "Lead clicked mail",
		icon: {
			default: <MailClick />,
		},
	},
	[REASON_TYPES.EMAIL_OPENED]: {
		name: "Lead viewed mail",
		icon: {
			default: <View />,
		},
	},
	[REASON_TYPES.EMAIL_REPLIED]: {
		name: "Lead replied to your mail",
		icon: {
			default: <Reply />,
		},
	},
	[REASON_TYPES.BOUNCED_MAIL]: {
		name: "Mail Bounced",
		icon: {
			default: <Caution2 />,
			white: <Caution2 color={Colors.white} />,
		},
	},
	[REASON_TYPES.UNSUBSCRIBE]: {
		name: "Lead Unsubscribed",
		icon: {
			default: <Unsubscribe color={Colors.red} />,
		},
	},
	// CALL / SMS
	[REASON_TYPES.SMS_CLICKED]: {
		name: "Lead clicked an sms link",
		icon: {
			default: <Message />,
		},
	},
	[REASON_TYPES.INCOMING_CALL]: {
		name: "Incoming Call",
		icon: {
			default: <CallIncoming />,
		},
	},
	[REASON_TYPES.OUTGOING_CALL]: {
		name: "Outgoing Call",
		icon: {
			default: <CallOutgoing />,
		},
	},
	[REASON_TYPES.DEMO_BOOKED]: {
		name: "Demo Booked",
		icon: {
			default: <Calendar />,
		},
	},
	// Status Update
	[REASON_TYPES.STATUS_UPDATE]: {
		name: "Status Update",
		icon: {
			default: <Network />,
		},
	},
};
