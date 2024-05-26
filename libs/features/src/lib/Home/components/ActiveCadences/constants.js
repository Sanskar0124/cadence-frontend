import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

export const CADENCE_TYPES_OPTIONS = [
	{
		label: CADENCE_TRANSLATION.ALL_CADENCES,
		value: "all_cadences",
	},
	{
		label: CADENCE_TRANSLATION.PERSONAL,
		value: "personal",
	},
	{
		label: CADENCE_TRANSLATION.GROUP,
		value: "team",
	},
	{
		label: CADENCE_TRANSLATION.COMPANY,
		value: "company",
	},
];

export const TEMP = [
	{
		task_count: 47,
		Task: {
			cadence_id: 30005,
			Cadence: {
				cadence_id: 30005,
				name: "Schedule_Start_3",
				type: "team",
				node_count: 3,
				total_lead_count: 52,
			},
		},
	},
	{
		task_count: 16,
		Task: {
			cadence_id: 120190,
			Cadence: {
				cadence_id: 120190,
				name: "agadg",
				type: "team",
				node_count: 4,
				total_lead_count: 33,
			},
		},
	},
	{
		task_count: 52,
		Task: {
			cadence_id: 150043,
			Cadence: {
				cadence_id: 150043,
				name: "team owner change 1",
				type: "team",
				node_count: 1,
				total_lead_count: 54,
			},
		},
	},
	{
		task_count: 10,
		Task: {
			cadence_id: 150044,
			Cadence: {
				cadence_id: 150044,
				name: "team owner change 2",
				type: "team",
				node_count: 2,
				total_lead_count: 21,
			},
		},
	},
	{
		task_count: 159,
		Task: {
			cadence_id: 150045,
			Cadence: {
				cadence_id: 150045,
				name: "team owner change 3",
				type: "team",
				node_count: 3,
				total_lead_count: 176,
			},
		},
	},
].map(cad => ({ task_count: cad.task_count, ...cad.Task.Cadence }));
