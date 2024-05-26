import SendingCalendar from "./components/SendingCalendar/SendingCalendar";
import UnsubscribeRules from "./components/UnsubscribeRules/UnsubscribeRules";
import BouncedEmailRules from "./components/BouncedEmailRules/BouncedEmailRules";
import CustomDomain from "./components/CustomDomain/CustomDomain";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

export const EMAIL_SETTINGS = [
	{
		name: SETTINGS_TRANSLATION.SENDING_CALENDER,
		component: ({ params = {} }) => <SendingCalendar {...params} />,
	},
	{
		name: SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES,
		component: ({ params = {} }) => <UnsubscribeRules {...params} />,
	},
	{
		name: SETTINGS_TRANSLATION.BOUNCED_EMAIL_RULES,
		component: ({ params = {} }) => <BouncedEmailRules {...params} />,
	},
	{
		name: COMMON_TRANSLATION.DOMAIN_VERIFICATION,
		component: params => <CustomDomain {...params} />,
	},
];
