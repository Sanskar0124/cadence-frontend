import { ArrowDown, ArrowUp } from "@cadence-frontend/icons";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

export const SORT_TYPES = {
	task_creation_date: TASKS_TRANSLATION.TASK_CREATION_DATE,
	company_name: TASKS_TRANSLATION.COMPANY_NAME,
	company_size: TASKS_TRANSLATION.COMPANY_SIZE,
	steps: TASKS_TRANSLATION.STEPS,
	tag: TASKS_TRANSLATION.TAG,
};

export const SORT_ORDERS = {
	task_creation_date: {
		old_to_new: TASKS_TRANSLATION.OLD_TO_NEW,
		new_to_old: TASKS_TRANSLATION.NEW_TO_OLD,
	},
	company_name: {
		a_z: (
			<>
				<ArrowDown /> A - Z
			</>
		),
		z_a: (
			<>
				<ArrowUp /> Z - A
			</>
		),
	},
	company_size: {
		small_to_big: (
			<>
				<ArrowDown /> Smallest to Biggest
			</>
		),
		big_to_small: (
			<>
				<ArrowUp /> Bigest to smallest
			</>
		),
	},
	steps: {
		low_to_high: (
			<>
				<ArrowDown />
				Lower to Highest (in %)
			</>
		),
		high_to_low: (
			<>
				<ArrowUp /> Highest to lowest (in %)
			</>
		),
	},
	tag: {
		inbound_first: "Inbound first",
		outbound_first: "Outbound first",
	},
};
