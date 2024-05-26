import {
	Email,
	Calendar,
	Message,
	Phone,
	Video,
	View,
	Caution,
	MailClick,
	Unsubscribe,
	AtrManualEmail,
	MissedCall,
	Fire,
	Tasks,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

const ICON_SIZE = "1.4rem";

export const ALERT_TYPES = {
	MAIL: "mail",
	MESSAGE: "message",
	MEETING: "meeting",
	MISSED_CALL: "missed_call",
	HOT_LEAD: "hot_lead",
	REMINDER: "reminder",
};

export const ICON_MAPPING = {
	mail: <AtrManualEmail size={ICON_SIZE} color={Colors.white} />,
	message: <Message size={ICON_SIZE} color={Colors.white} />,
	incoming_call: <Phone size={ICON_SIZE} color={Colors.white} />,
	meeting: <Calendar size="1.2rem" color={Colors.white} />,
	missed_call: <MissedCall size={ICON_SIZE} color={Colors.white} />,
	viewed_mail: <View size={ICON_SIZE} color={Colors.white} />,
	clicked_mail: <MailClick size={ICON_SIZE} color={Colors.white} />,
	bounced: <Caution size={ICON_SIZE} color={Colors.white} />,
	unsubscribed: <Unsubscribe size={ICON_SIZE} color={Colors.white} />,
	hot_lead: <Fire size={ICON_SIZE} color={Colors.white} />,
	reminder: <Tasks size={ICON_SIZE} color={Colors.white} />,
};

export const HEADING_TEXT = {
	mail: "Mail",
	meeting: "Event",
	message: "Message",
	incoming_call: "Incoming call",
	missed_call: "Missed call",
	hot_lead: "Hot Lead",
	reminder: "Reminder",
};

export const TestData = [
	{
		id: 1,
		type: "mail",
		title: "From: Aymeric Vanbock",
		caption: "Subject: Revert back ASAP",
	},
	{
		id: 2,
		type: "meeting",
		title: "Event created!",
		caption: "",
	},
	{
		id: 3,
		type: "clicked",
		title: "Message received!",
		caption: "",
		link: "/home",
	},
	{
		id: 4,
		type: "hot_lead",
		title: "Hot Lead",
		caption: "Your New Hot Lead is this individual",
	},
	{
		id: 5,
		type: "reminder",
		title: "Reminder",
		caption: "Event starting in 5 minutes",
	},
];
