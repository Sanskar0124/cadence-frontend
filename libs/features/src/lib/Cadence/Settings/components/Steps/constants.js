// import { ENUMS } from "@cadence-frontend/constants";
// import { Reply } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
// export const STEP_TYPES = {
// 	mail: "mail",
// 	automated_mail: "automated_mail",
// 	reply_to: "reply_to",
// 	message: "message",
// 	automated_message: "automated_message",
// 	call: "call",
// 	linkedin_connection: "linkedin_connection",
// 	linkedin_message: "linkedin_message",
// 	linkedin_profile: "linkedin_profile",
// 	linkedin_interact: "linkedin_interact",
// 	cadence_custom: "cadence_custom",
// 	data_check: "data_check",
// 	end: "end",
// };

// export const STEP_NAME_MAP = {
// 	mail: "Mail",
// 	automated_mail: "Mail",
// 	reply_to: "Reply to",
// 	automated_reply_to: "Reply to",
// 	message: "SMS",
// 	automated_message: "SMS",
// 	call: "Call",
// 	linkedin: "Linkedin",
// 	linkedin_connection: "Linkedin Connection Request",
// 	linkedin_message: "Linkedin Message",
// 	linkedin_profile: "Linkedin View Profile",
// 	linkedin_interact: "Linkedin Interact with Post",
// 	cadence_custom: "Custom Task",
// 	data_check: "Data Check",
// 	end: "End Cadence",
// };

// export const LINKEDIN_STEP_NAME_MAP = {
// 	linkedin_connection: "Connection Request",
// 	linkedin_message: "Linkedin Message",
// 	linkedin_profile: "View Profile",
// 	linkedin_interact: "Interact with Post",
// };

// export const STEP_ICONS = {
// 	mail: ENUMS.mail.icon.white,
// 	// automated_mail: ENUMS.automated_mail.icon.white,
// 	reply_to: <Reply />,
// 	message: ENUMS.message.icon.white,
// 	// automated_message: ENUMS.automated_message.icon.white,
// 	call: ENUMS.call.icon.white,
// 	linkedin: ENUMS.linkedin.icon.default,
// 	linkedin_connection: ENUMS.linkedin_connection.icon.default,
// 	linkedin_message: ENUMS.linkedin_message.icon.default,
// 	linkedin_profile: ENUMS.linkedin_profile.icon.default,
// 	linkedin_interact: ENUMS.linkedin_interact.icon.default,
// 	cadence_custom: ENUMS.cadence_custom.icon.default,
// 	data_check: ENUMS.data_check.icon.default,
// 	end: ENUMS.end.icon.default,
// };

// export const LINKEDIN_INDIVIDUAL_ICONS = {
// 	linkedin_connection: ENUMS.linkedin_connection.icon.individual,
// 	linkedin_message: ENUMS.linkedin_message.icon.individual,
// 	linkedin_profile: ENUMS.linkedin_profile.icon.individual,
// 	linkedin_interact: ENUMS.linkedin_interact.icon.individual,
// };

// export const STEP_DATA = {
// 	mail: {
// 		subject: "",
// 		body: "",
// 		attachments: [],
// 		aBTestEnabled: false,
// 		templates: [],
// 	},
// 	automated_mail: [
// 		{
// 			id: Math.floor(Math.random() * 100 + 1),
// 			name: "New mail",
// 			subject: "",
// 			body: "",
// 			attachments: [],
// 			aBTestEnabled: false,
// 			templates: [],
// 		},
// 	],
// 	reply_to: {
// 		replied_node_id: "",
// 		body: "",
// 		attachments: [],
// 		subject: "Re: ",
// 		aBTestEnabled: false,
// 		templates: [],
// 	},
// 	call: {
// 		script: "",
// 	},
// 	message: {
// 		message: "",
// 	},
// 	automated_message: {
// 		message: "",
// 	},
// 	data_check: {
// 		message: "",
// 	},
// 	cadence_custom: {
// 		message: "",
// 	},
// 	linkedin_connection: { message: "" },
// 	linkedin_message: { message: "" },
// 	linkedin_profile: { message: "" },
// 	linkedin_interact: { message: "" },
// 	end: {
// 		cadence_id: "",
// 		account_status: "",
// 		lead_status: "",
// 		lead_reason: "",
// 		account_reason: "",
// 		to_user_id: "",
// 	},
// };

// export const WAIT_TIME_OPTIONS = {
// 	mins: "min(s)",
// 	hours: "hour(s)",
// 	days: "Day(s)",
// };

// export const ADD_STEP_TYPES = [
// 	"mail",
// 	"reply_to",
// 	"message",
// 	"call",
// 	"linkedin",
// 	"cadence_custom",
// 	"data_check",
// 	"end",
// ];
export const getWaitTimeOptions = user => {
	return {
		mins: "mins",
		hours: [COMMON_TRANSLATION.HOURS[user?.language?.toUpperCase()]],
		days: [COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()]],
	};
};
