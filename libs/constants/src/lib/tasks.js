import React from "react";
import {
	AtrManualEmail,
	AtrAutoEmail,
	AtrAutoEmailGradient,
	PhoneGradient,
	LinkedinGradient,
	Call,
	AutoSms,
	Voicemail,
	Linkedin,
	Message,
	MailOutgoing,
	CallOutgoing,
	MailGradient,
	MessageGradient,
	Note,
	AtrEmailIncoming,
	AtrEmailIncomingUnread,
	CallIncoming,
	CallMissed,
	MessageSent,
	MessageReceived,
	MessageReceivedUnread,
	Cadences,
	Leads,
	LeadDisqualified,
	Unsubscribe,
	Meeting,
	Wrench,
	DataCheck,
	MoveCadence,
	LinkedinInteract,
	LinkedinProfile,
	LinkedinMessage,
	LinkedinConnection,
	LinkedinConnectionIndividual,
	LinkedinProfileIndividual,
	LinkedinMessageIndividual,
	LinkedinInteractIndividual,
	CurvedArrowRight,
	EndCadence,
	Pause,
	Play,
	RoundedTick,
	Rocket,
	Person,
	ClickGradient,
	Click,
	MailClick,
	View,
	Bounced,
	Caution2,
	AutomatedReply,
	Reply,
	ReplyGradient,
	Whatsapp,
	WhatsappGradient,
	AutomatedReplyGradient,
	WrenchGradient,
	DataCheckGradient,
	EndCadenceGradient,
	LinkedinConnectionGradient,
	LinkedinMessageGradient,
	LinkedinProfileGradient,
	LinkedinInteractGradient,
	MessageGradient2,
	AutoSmsGradient,
	Fire,
	Callback,
	CallbackGradient,
	Export,
	TeamChange,
} from "@cadence-frontend/icons";
import {
	Tasks as TASKS_TRANSLATION,
	Email as EMAIL_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";
export const MANUAL_EMAIL = EMAIL_TRANSLATION.SEMI_AUTOMATIC_EMAIL;
export const AUTOMATED_EMAIL = EMAIL_TRANSLATION.AUTOMATIC_EMAIL;
export const REPLY_TO = COMMON_TRANSLATION.SEND_REPLY;
export const LINKED_IN = COMMON_TRANSLATION.LINKEDIN;
export const LINKEDIN_CONNECTION = COMMON_TRANSLATION.LINKEDIN_CONNECTION;
export const LINKEDIN_PROFILE = COMMON_TRANSLATION.LINKEDIN_VIEW_PROFILE;
export const LINKEDIN_INTERACT = COMMON_TRANSLATION.LINKEDIN_INTERACT;
export const LINKEDIN_MESSAGE = COMMON_TRANSLATION.LINKEDIN_MESSAGE;
export const CALL = TASKS_TRANSLATION.CALL;
export const CALLBACK = TASKS_TRANSLATION.CALLBACK;
export const WHATSAPP = COMMON_TRANSLATION.WHATSAPP;
export const AUTOMATED_SMS = COMMON_TRANSLATION.AUTOMATIC_SMS;
export const MANUAL_SMS = COMMON_TRANSLATION.SEMI_AUTOMATIC_SMS;
export const VOICEMAIL = COMMON_TRANSLATION.VOICEMAIL_DROP;
export const NOTE = COMMON_TRANSLATION.NOTE;
export const CADENCE_CUSTOM = TASKS_TRANSLATION.CUSTOM_TASK;
export const OTHER = COMMON_TRANSLATION.OTHER;
export const DATA_CHECK = TASKS_TRANSLATION.DATA_CHECK;
export const END = COMMON_TRANSLATION.END;
export const OUT_OF_OFFICE = COMMON_TRANSLATION.OUT_OF_OFFICE;
export const BOUNCED_MAIL = EMAIL_TRANSLATION.BOUNCED_MAIL;
export const HOT_LEAD = "hot lead";
//here keys in ENUMS are as same as in backend

const LINKEDIN_TYPES = {
	linkedin_connection: {
		name: "Linkedin Connection",
		task_name: "Send Connection Request",
		task_name_in_quickview: "Linkedin Connection Request",
	},
	linkedin_message: {
		name: "Linkedin Message",
		task_name: "Send Linkedin message",
		task_name_in_quickview: "Linkedin Message",
	},
	linkedin_profile: {
		name: "Linkedin Profile",
		task_name: "View Profile",
		task_name_in_quickview: "Linkedin View Profile",
	},
	linkedin_interact: {
		name: "Linkedin interact with post",
		task_name: "Interact with post",
		task_name_in_quickview: "Linkedin Interact with Post",
	},
	default: {
		name: "Linkedin unknown",
		task_name: "Unknown Linkedin task",
		task_name_in_quickview: "Linkedin Task",
	},
};

export const ENUMS = {
	automated_mail: {
		is_task: true,
		name: AUTOMATED_EMAIL,
		task_name_in_quickview: "Automated Mail",
		activity_name: "You sent an email",
		icon: {
			default: <AtrAutoEmail />,
			white: <AtrAutoEmail color={Colors.white} />,
			gradient: <AtrAutoEmailGradient />,
			outgoing: <MailOutgoing />,
			incoming: <AtrEmailIncoming />,
			unread: <AtrEmailIncomingUnread />,
			ongoing: <AtrAutoEmail color={Colors.mainPurple} />,
			notdone: <AtrAutoEmail color={Colors.veryLightBlue} />,
		},
	},
	automated_message: {
		is_task: true,
		name: AUTOMATED_SMS,
		task_name_in_quickview: "Automated Message",
		activity_name: "You sent a message",
		icon: {
			default: <AutoSms />,
			white: <AutoSms color={Colors.white} />,
			outgoing: <MessageSent />,
			gradient: <AutoSmsGradient />,
			incoming: <MessageReceived />,
			unread: <MessageReceivedUnread />,
			ongoing: <AutoSms color={Colors.mainPurple} />,
			notdone: <AutoSms color={Colors.veryLightBlue} />,
		},
	},
	mail: {
		is_task: true,
		name: MANUAL_EMAIL,
		task_name_in_quickview: "Mail",
		activity_name: "You sent an email",
		icon: {
			default: <AtrManualEmail />,
			white: <AtrManualEmail color={Colors.white} />,
			outgoing: <MailOutgoing />,
			gradient: <MailGradient />,
			incoming: <AtrEmailIncoming />,
			unread: <AtrEmailIncomingUnread />,
			ongoing: <AtrManualEmail color={Colors.mainPurple} />,
			notdone: <AtrManualEmail color={Colors.veryLightBlue} />,
		},
	},
	bounced_mail: {
		is_task: false,
		name: BOUNCED_MAIL,
		icon: {
			default: <Caution2 />,
			white: <Caution2 color={Colors.white} />,
		},
	},
	out_of_office: {
		is_task: false,
		name: OUT_OF_OFFICE,
		activity_name: "Out Of Office",
		icon: {
			default: <AtrEmailIncoming />,
			white: <AtrEmailIncoming color={Colors.white} />,
			outgoing: <AtrEmailIncoming />,
			gradient: <AtrEmailIncoming />,
			incoming: <AtrEmailIncoming />,
			unread: <AtrEmailIncomingUnread />,
			ongoing: <AtrEmailIncoming color={Colors.mainPurple} />,
			notdone: <AtrEmailIncoming color={Colors.veryLightBlue} />,
		},
	},
	hot_lead: {
		is_task: false,
		name: HOT_LEAD,
		activity_name: "Out Of Office",
		icon: {
			default: <Fire />,
			white: <Fire color={Colors.white} />,
			outgoing: <Fire />,
			gradient: <Fire />,
			incoming: <Fire />,
			unread: <Fire />,
			ongoing: <Fire color={Colors.mainPurple} />,
			notdone: <Fire color={Colors.veryLightBlue} />,
		},
	},
	reply_to: {
		is_task: false,
		name: REPLY_TO,
		task_name_in_quickview: "Reply Mail",
		activity_name: "You replied to a message",
		icon: {
			default: <Reply />,
			white: <Reply color={Colors.white} />,
			outgoing: <Reply />,
			gradient: <ReplyGradient />,
			incoming: <Reply />,
			unread: <Reply />,
			ongoing: <Reply color={Colors.mainPurple} />,
			notdone: <Reply color={Colors.veryLightBlue} />,
		},
	},
	automated_reply_to: {
		is_task: false,
		name: [REPLY_TO],
		task_name_in_quickview: "Automated Reply Mail",
		activity_name: "You replied to a message",
		icon: {
			default: <AutomatedReply />,
			white: <AutomatedReply color={Colors.white} />,
			outgoing: <AutomatedReply />,
			gradient: <AutomatedReplyGradient />,
			incoming: <AutomatedReply />,
			unread: <AutomatedReply />,
			ongoing: <AutomatedReply color={Colors.mainPurple} />,
			notdone: <AutomatedReply color={Colors.veryLightBlue} />,
		},
	},
	linkedin: {
		is_task: false,
		name: LINKED_IN,
		type: LINKEDIN_TYPES,
		icon: {
			default: <Linkedin color="#0077B5" />,
			gradient: <LinkedinGradient />,
			white: <Linkedin color={Colors.white} />,
			ongoing: <Linkedin color={Colors.mainPurple} />,
			notdone: <Linkedin color={Colors.veryLightBlue} />,
		},
	},
	whatsapp: {
		is_task: true,
		name: WHATSAPP,
		task_name_in_quickview: "Whatsapp",
		icon: {
			default: <Whatsapp color="#25D366" />,
			gradient: <WhatsappGradient />,
			white: <Whatsapp color={Colors.white} />,
			ongoing: <Whatsapp color={Colors.mainPurple} />,
			notdone: <Whatsapp color={Colors.veryLightBlue} />,
		},
	},
	call: {
		is_task: true,
		name: CALL,
		task_name_in_quickview: "Call",
		activity_name: "You made a call",
		icon: {
			default: <Call />,
			gradient: <PhoneGradient />,
			white: <Call color={Colors.white} />,
			outgoing: <CallOutgoing />,
			incoming: <CallIncoming />,
			missed: <CallMissed />,
			ongoing: <Call color={Colors.mainPurple} />,
			notdone: <Call color={Colors.veryLightBlue} />,
		},
	},
	callback: {
		is_task: true,
		name: CALLBACK,
		task_name_in_quickview: "Callback",
		activity_name: "You made a callback",
		icon: {
			default: <Callback />,
			gradient: <CallbackGradient />,
			white: <Callback color={Colors.white} />,
			ongoing: <Callback color={Colors.mainPurple} />,
			notdone: <Callback color={Colors.veryLightBlue} />,
		},
	},
	message: {
		is_task: true,
		name: MANUAL_SMS,
		task_name_in_quickview: "SMS",
		activity_name: "You sent a message",
		icon: {
			default: <Message />,
			white: <Message color={Colors.white} />,
			gradient: <MessageGradient2 />,
			outgoing: <MessageSent />,
			incoming: <MessageReceived />,
			unread: <MessageReceivedUnread />,
			ongoing: <Message color={Colors.mainPurple} />,
			notdone: <Message color={Colors.veryLightBlue} />,
		},
	},
	custom_task: {
		is_task: false,
		name: CADENCE_CUSTOM,
		icon: {
			default: <Wrench />,
			white: <Wrench color={Colors.white} />,
			gradient: <WrenchGradient />,
			ongoing: <Wrench color={Colors.mainPurple} />,
			notdone: <Wrench color={Colors.veryLightBlue} />,
		},
	},
	cadence_custom: {
		is_task: true,
		name: CADENCE_CUSTOM,
		task_name_in_quickview: "Cadence Custom task",
		activity_name: "You completed a custom task",
		icon: {
			default: <Wrench />,
			white: <Wrench color={Colors.white} />,
			gradient: <WrenchGradient />,
			ongoing: <Wrench color={Colors.mainPurple} />,
			notdone: <Wrench color={Colors.veryLightBlue} />,
		},
	},
	other: {
		is_task: false,
		name: OTHER,
		activity_name: "You completed a custom task",
		icon: {
			default: <Wrench />,
			white: <Wrench color={Colors.white} />,
			gradient: <WrenchGradient />,
			ongoing: <Wrench color={Colors.mainPurple} />,
			notdone: <Wrench color={Colors.veryLightBlue} />,
		},
	},
	custom_task_for_other: {
		is_task: false,
		icon: {
			default: <Person />,
		},
	},
	data_check: {
		is_task: true,
		name: DATA_CHECK,
		task_name_in_quickview: "Data Check",
		activity_name: "You completed a custom task",
		icon: {
			default: <DataCheck />,
			white: <DataCheck color={Colors.white} />,
			gradient: <DataCheckGradient />,
			ongoing: <DataCheck color={Colors.mainPurple} />,
			notdone: <DataCheck color={Colors.veryLightBlue} />,
		},
	},
	end: {
		is_task: false,
		name: END,
		activity_name: "You ended a custom task",
		icon: {
			default: <EndCadence />,
			white: <EndCadence color={Colors.white} />,
			gradient: <EndCadenceGradient />,
			notdone: <EndCadence color={Colors.veryLightBlue} />,
		},
	},
	note: {
		is_task: false,
		name: NOTE,
		activity_name: "You left a note",
		icon: {
			default: <Note />,
		},
	},
	meeting: {
		is_task: false,
		activity_name: "You attended a meeting",
		icon: {
			default: <Meeting />,
		},
	},
	pause_cadence: {
		is_task: false,
		activity_name: "You paused Cadence",
		icon: {
			default: <Pause />,
			yellow: <Pause color={Colors.yellow} />,
		},
	},
	stop_cadence: {
		is_task: false,
		activity_name: "You stopped Cadence",
		icon: {
			default: <Cadences />,
		},
	},
	resume_cadence: {
		is_task: false,
		activity_name: "You resumed Cadence",
		icon: {
			default: <Play />,
		},
	},
	completed_cadence: {
		is_task: false,
		activity: "Cadence completed",
		icon: {
			default: <RoundedTick />,
		},
	},
	lead_converted: {
		is_task: false,
		activity_name: "You converted a lead",
		icon: {
			default: <Leads />,
		},
	},
	lead_disqualified: {
		is_task: false,
		activity_name: "You disqualified a lead",
		icon: {
			default: <LeadDisqualified />,
		},
	},
	contact_disqualified: {
		is_task: false,
		activity_name: "You disqualified a contact",
		icon: {
			default: <LeadDisqualified />,
		},
	},
	launch_cadence: {
		is_task: false,
		activity_name: "You launched Cadence",
		icon: {
			default: <Rocket />,
		},
	},
	unsubscribe: {
		is_task: false,
		activity_name: "Lead Unsubscribed",
		icon: {
			default: <Unsubscribe color={Colors.red} />,
		},
	},
	clicked_mail: {
		is_task: false,
		activity_name: "Lead clicked mail",
		icon: {
			default: <MailClick />,
		},
	},
	clicked_message: {
		is_task: false,
		activity_name: "Lead clicked message",
		icon: {
			default: <Message />,
		},
	},
	viewed_mail: {
		is_task: false,
		activity_name: "You viewed mail",
		icon: {
			default: <View />,
		},
	},
	move_cadence: {
		is_task: false,
		activity_name: "You moved Cadence",
		icon: {
			default: <MoveCadence />,
		},
	},
	task_skipped: {
		is_task: false,
		activity_name: "You skipped a task",
		icon: {
			default: <CurvedArrowRight />,
			red: <CurvedArrowRight color={Colors.redShade3} />,
		},
	},
	linkedin_connection: {
		is_task: true,
		name: LINKEDIN_CONNECTION,
		task_name_in_quickview: "Linkedin Connection Request",
		icon: {
			default: <LinkedinConnection color="#0077B5" />,
			white: <LinkedinConnection color={Colors.white} />,
			gradient: <LinkedinConnectionGradient />,
			ongoing: <LinkedinConnection />,
			notdone: <LinkedinConnection />,
		},
	},
	linkedin_message: {
		is_task: true,
		name: LINKEDIN_MESSAGE,
		task_name_in_quickview: "Linkedin Message",
		icon: {
			default: <LinkedinMessage color="#0077B5" />,
			white: <LinkedinMessage color={Colors.white} />,
			gradient: <LinkedinMessageGradient />,
			ongoing: <LinkedinMessage />,
			notdone: <LinkedinMessage />,
		},
	},
	linkedin_profile: {
		is_task: true,
		name: LINKEDIN_PROFILE,
		task_name_in_quickview: "Linkedin View Profile",
		icon: {
			default: <LinkedinProfile color="#0077B5" />,
			white: <LinkedinProfile color={Colors.white} />,
			gradient: <LinkedinProfileGradient />,
			ongoing: <LinkedinProfile />,
			notdone: <LinkedinProfile />,
		},
	},
	linkedin_interact: {
		is_task: true,
		name: LINKEDIN_INTERACT,
		task_name_in_quickview: "Linkedin Interact with Post",
		icon: {
			default: <LinkedinInteract color="#0077B5" />,
			white: <LinkedinInteract color={Colors.white} />,
			gradient: <LinkedinInteractGradient />,
			ongoing: <LinkedinInteract />,
			notdone: <LinkedinInteract />,
		},
	},
	owner_change: {
		is_task: false,
		icon: {
			default: <Cadences />,
			white: <Cadences color={Colors.white} />,
		},
	},
	exported_lead: {
		is_task: false,
		activity_name: "Lead Exported",
		icon: {
			default: <Export />,
		},
	},
	unlinked_lead: {
		is_task: false,
		activity_name: "Team Changed",
		icon: {
			default: <TeamChange />,
		},
	},
};
