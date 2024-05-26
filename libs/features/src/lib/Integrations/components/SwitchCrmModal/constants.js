import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Cross, TickGreen, Warning } from "@cadence-frontend/icons";

export const SWITCH_OPTIONS = (from_integration_type, to_integration_type) => {
	let KEEP_EVERYTHING_LEADS_STATUS = "limited";
	if (
		from_integration_type === INTEGRATION_TYPE.DYNAMICS ||
		to_integration_type === INTEGRATION_TYPE.DYNAMICS
	)
		KEEP_EVERYTHING_LEADS_STATUS = false;

	return [
		{
			type: "start_from_scratch",
			title: "Start from scratch",
			desc: "You will need to set-up the tool from scratch and add new leads",
			changes_available: [
				{
					title: "Cadences",
					status: false,
				},
				{
					title: "Leads",
					status: false,
				},
				{
					title: "Settings",
					status: false,
				},
				{
					title: "Workflows",
					status: false,
				},
			],
		},
		{
			type: "keep_cadences_and_settings",
			title: "Keep cadences and settings",
			desc: "Only your leads and workflows will be deleted",
			changes_available: [
				{
					title: "Cadences",
					status: true,
				},
				{
					title: "Leads",
					status: false,
				},
				{
					title: "Settings",
					status: true,
				},
				{
					title: "Workflows",
					status: false,
				},
			],
		},
		{
			type: "keep_everything",
			title: "Keep everything",
			desc: "Only leads will be deleted",
			changes_available: [
				{
					title: "Cadences",
					status: true,
				},
				{
					title: "Leads",
					status: KEEP_EVERYTHING_LEADS_STATUS,
					...(KEEP_EVERYTHING_LEADS_STATUS === "limited" && {
						desc: "Only leads belonging to CSV/Google sheets will be preserved",
					}),
				},
				{
					title: "Settings",
					status: true,
				},
				{
					title: "Workflows",
					status: true,
				},
			],
		},
	];
};

export const STATUS_ICON_MAP = {
	true: <TickGreen />,
	false: <Cross />,
	limited: <Warning />,
};

export const CONFIRM_TEXT_MAP = {
	start_from_scratch: "leads, cadences, settings and workflows",
	keep_cadences_and_settings: "leads and workflows",
	keep_everything: "leads",
};
