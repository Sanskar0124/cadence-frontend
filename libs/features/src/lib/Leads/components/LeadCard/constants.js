import {
	LinkedinGradient,
	MailGradient,
	MessageOutline,
	PhoneGradient,
} from "@cadence-frontend/icons";
import { LEAD_STATUS } from "@cadence-frontend/constants";
import { People as PEOPLE_TRANSLATION } from "@cadence-frontend/languages";

export const ICONS_MAP = {
	mail: <MailGradient />,
	call: <PhoneGradient />,
	linkedin: <LinkedinGradient />,
	message: <MessageOutline />,
};

export const LEAD_STATUS_LABELS = {
	[LEAD_STATUS.NEW_LEAD]: PEOPLE_TRANSLATION.NEW_LEAD,
	[LEAD_STATUS.CONVERTED]: PEOPLE_TRANSLATION.CONVERTED,
	[LEAD_STATUS.ONGOING]: PEOPLE_TRANSLATION.ONGOING,
	[LEAD_STATUS.PAUSED]: PEOPLE_TRANSLATION.PAUSED,
	[LEAD_STATUS.STOPPED]: PEOPLE_TRANSLATION.STOPPED,
	[LEAD_STATUS.TRASH]: PEOPLE_TRANSLATION.DISQUALIFIED,
	[LEAD_STATUS.UNASSIGNED]: PEOPLE_TRANSLATION.UNASSIGNED,
};
