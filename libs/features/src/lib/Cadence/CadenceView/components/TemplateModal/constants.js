import { UkFlag, FranceFlag, SpainFlag } from "@cadence-frontend/icons";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
export const LANGUAGES_CONSTANTS = [
	{
		name: "english",
		icon: <UkFlag />,
	},
	{
		name: "french",
		icon: <FranceFlag />,
	},
	{
		name: "spanish",
		icon: <SpainFlag />,
	},
];
export const TEMPLATE_TYPE = {
	all_templates: CADENCE_TRANSLATION.ALL_TEMPLATES,
	outbound: CADENCE_TRANSLATION.OUTBOUND,
	inbound: CADENCE_TRANSLATION.INBOUND,
	events: CADENCE_TRANSLATION.EVENTS,
};
