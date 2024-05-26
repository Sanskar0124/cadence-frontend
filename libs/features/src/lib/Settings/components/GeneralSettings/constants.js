import Email from "./components/Email/Email";
import TaskCadence from "./components/TaskCadence/TaskCadence";
import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";

export const SETTINGS_OPTIONS = [
	{
		name: COMMON_TRANSLATION.EMAILS,
		component: params => <Email {...params} />,
	},
	{
		name: SETTINGS_TRANSLATION.TASK_AND_CADENCE,
		component: params => <TaskCadence {...params} />,
	},
];

export const LEVEL_TO_NAME = {
	[SETTING_PRIORITY.USER]: TASKS_TRANSLATION.USER,
	[SETTING_PRIORITY.SUB_DEPARTMENT]: TASKS_TRANSLATION.GROUP,
};
