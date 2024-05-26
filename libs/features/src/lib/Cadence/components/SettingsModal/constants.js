import { CADENCE_PRIORITY, CADENCE_TAGS } from "../../constants";

export const PRIORITY_OPTIONS = [
	{
		label: "High",
		value: CADENCE_PRIORITY.HIGH,
	},
	{ label: "Standard", value: CADENCE_PRIORITY.STANDARD },
];

export const TAG_OPTIONS = [
	{
		label: "Inbound (2 hours)",
		value: CADENCE_TAGS.INBOUND,
	},
	{
		label: "Outbound (12 hours)",
		value: CADENCE_TAGS.OUTBOUND,
	},
];
