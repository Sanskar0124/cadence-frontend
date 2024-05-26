import { ACTIVITY_TYPES } from "@cadence-frontend/constants";

export const FILTERS = {
	CALL: "missed_calls",
	RECIEVED_CALL: "received_calls",
	REJECTED_CALL: "rejected_calls",
	HOT_LEAD: "hot_leads",
	MESSAGE: "received_sms",
	MAIL: "received_mails",
	REPLY_TO: "replied_mails",
	UNSUBSCRIBE: "unsubscribed_mails",
	CLICKED_MAIL: "clicked_mails",
	VIEWED_MAIL: "viewed_mails",
	BOUNCED_MAIL: "bounced_mails",
};

export const ACTIVITY_TYPE_TO_FILTER = {
	[ACTIVITY_TYPES.CALL]: ["missed_calls", "received_calls", "rejected_calls"],
	[ACTIVITY_TYPES.HOT_LEAD]: "hot_leads",
	[ACTIVITY_TYPES.MESSAGE]: "received_sms",
	[ACTIVITY_TYPES.MAIL]: "received_mails",
	[ACTIVITY_TYPES.CLICKED_MAIL]: "clicked_mails",
	[ACTIVITY_TYPES.VIEWED_MAIL]: "viewed_mails",
	[ACTIVITY_TYPES.REPLY_TO]: "replied_mails",
	[ACTIVITY_TYPES.UNSUBSCRIBE]: "unsubscribe_mails",
	[ACTIVITY_TYPES.BOUNCED_MAIL]: "bounced_mails",
};
