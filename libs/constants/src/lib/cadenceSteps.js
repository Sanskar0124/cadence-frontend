import React from "react";
import { ENUMS } from "@cadence-frontend/constants";
import {
	AtrAutoEmail,
	AtrAutoEmailGradient,
	MessageGradient2,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";

export const STEP_TYPES = {
	mail: "mail",
	automated_mail: "automated_mail",
	reply_to: "reply_to",
	message: "message",
	automated_message: "automated_message",
	call: "call",
	callback: "callback",
	linkedin_connection: "linkedin_connection",
	linkedin_message: "linkedin_message",
	linkedin_profile: "linkedin_profile",
	linkedin_interact: "linkedin_interact",
	whatsapp: "whatsapp",
	cadence_custom: "cadence_custom",
	data_check: "data_check",
	end: "end",
};

export const STEP_NAME_MAP = {
	mail: "Email",
	automated_mail: "Email",
	reply_to: "Reply to",
	automated_reply_to: "Reply to",
	message: "SMS",
	automated_message: "SMS",
	call: "Call",
	callback: "Callback",
	linkedin: "Linkedin",
	linkedin_connection: "Connection Request",
	linkedin_message: "Linkedin Message",
	linkedin_profile: "View Profile",
	linkedin_interact: "Interact with Post",
	whatsapp: "Whatsapp",
	cadence_custom: "Custom Task",
	data_check: "Data Check",
	end: "End Cadence",
};

export const ELONGATED_STEP_NAME_MAP = {
	mail: COMMON_TRANSLATION.SEMI_AUTOMATED_MAIL,
	automated_mail: COMMON_TRANSLATION.AUTOMATED_MAIL,
	reply_to: COMMON_TRANSLATION.REPLY_TO_SEMIAUTOMATED,
	automated_reply_to: COMMON_TRANSLATION.REPLY_TO_AUTOMATED,
	message: COMMON_TRANSLATION.SEMI_AUTOMATED_SMS,
	automated_message: COMMON_TRANSLATION.AUTOMATED_SMS,
	call: TASKS_TRANSLATION.CALL,
	callback: TASKS_TRANSLATION.CALLBACK,
	linkedin: COMMON_TRANSLATION.LINKEDIN,
	linkedin_connection: COMMON_TRANSLATION.LINKEDIN_CONNECTION_REQUEST,
	linkedin_message: COMMON_TRANSLATION.LINKEDIN_MESSAGE,
	linkedin_profile: COMMON_TRANSLATION.LINKEDIN_VIEW_PROFILE,
	linkedin_interact: COMMON_TRANSLATION.LINKEDIN_INTERACT_WITH_POST,
	whatsapp: COMMON_TRANSLATION.WHATSAPP,
	cadence_custom: COMMON_TRANSLATION.CUSTOM_TASK,
	data_check: COMMON_TRANSLATION.DATA_CHECK,
	end: COMMON_TRANSLATION.END_CADENCE,
};

export const STEP_ICONS = {
	mail: ENUMS.mail.icon.white,
	automated_mail: <AtrAutoEmail size={19} color={Colors.white} />,
	reply_to: ENUMS.reply_to.icon.white,
	automated_reply_to: ENUMS.automated_reply_to.icon.white,
	message: ENUMS.message.icon.white,
	automated_message: ENUMS.automated_message.icon.white,
	call: ENUMS.call.icon.white,
	callback: ENUMS.callback.icon.white,
	linkedin: ENUMS.linkedin.icon.white,
	linkedin_connection: ENUMS.linkedin_connection.icon.white,
	linkedin_message: ENUMS.linkedin_message.icon.white,
	linkedin_profile: ENUMS.linkedin_profile.icon.white,
	linkedin_interact: ENUMS.linkedin_interact.icon.white,
	whatsapp: ENUMS.whatsapp.icon.white,
	cadence_custom: ENUMS.cadence_custom.icon.white,
	data_check: ENUMS.data_check.icon.white,
	end: ENUMS.end.icon.white,
};

export const STEP_ICONS_GRADIENT = {
	mail: ENUMS.mail.icon.gradient,
	automated_mail: <AtrAutoEmailGradient size={19} />,
	reply_to: ENUMS.reply_to.icon.gradient,
	automated_reply_to: ENUMS.automated_reply_to.icon.gradient,
	message: <MessageGradient2 />,
	automated_message: ENUMS.automated_message.icon.gradient,
	call: ENUMS.call.icon.gradient,
	callback: ENUMS.callback.icon.gradient,
	linkedin: ENUMS.linkedin.icon.gradient,
	linkedin_connection: ENUMS.linkedin_connection.icon.gradient,
	linkedin_message: ENUMS.linkedin_message.icon.gradient,
	linkedin_profile: ENUMS.linkedin_profile.icon.gradient,
	linkedin_interact: ENUMS.linkedin_interact.icon.gradient,
	whatsapp: ENUMS.whatsapp.icon.gradient,
	cadence_custom: ENUMS.cadence_custom.icon.gradient,
	data_check: ENUMS.data_check.icon.gradient,
	end: ENUMS.end.icon.gradient,
};

export const STEP_DATA = {
	mail: {
		subject: "",
		body: "",
		attachments: [],
		aBTestEnabled: false,
		templates: [],
	},
	automated_mail: [
		{
			id: Math.floor(Math.random() * 100 + 1),
			name: "New mail",
			subject: "",
			body: "",
			attachments: [],
			aBTestEnabled: false,
			templates: [],
		},
	],
	reply_to: {
		replied_node_id: "",
		body: "",
		attachments: [],
		subject: "Re: ",
		aBTestEnabled: false,
		templates: [],
	},
	call: {
		script: "",
	},
	callback: {
		duration: 60,
		retries: 2,
		retry_after: 60,
		script: "",
	},
	message: {
		message: "",
		aBTestEnabled: false,
		templates: [],
		tcpa_policy_check: true,
	},
	automated_message: {
		aBTestEnabled: false,
		templates: [],
		message: "",
	},
	data_check: {
		message: "",
	},
	cadence_custom: {
		message: "",
	},
	linkedin_connection: { message: "" },
	linkedin_message: { message: "" },
	linkedin_profile: { message: "" },
	linkedin_interact: { message: "" },
	whatsapp: { message: "" },
	end: {
		cadence_id: "",
		lead_status: "",
		lead_reason: "",
		account_status: "",
		account_reason: "",
		contact_status: "",
		contact_reason: "",
		to_user_id: "",
		moved_leads: [],
	},
};

export const WAIT_TIME_OPTIONS = {
	mins: "min(s)",
	hours: "hour(s)",
	days: "Day(s)",
};

export const ADD_STEP_TYPES = [
	"mail",
	"reply_to",
	"message",
	"call",
	"callback",
	"linkedin",
	"whatsapp",
	"cadence_custom",
	"data_check",
	"end",
];

export const ADD_LINKEDIN_STEP_TYPES = [
	"linkedin_connection",
	"linkedin_message",
	"linkedin_profile",
	"linkedin_interact",
];
