import { ENUMS, SETTING_PRIORITY } from "@cadence-frontend/constants";
import {
	AtrManualEmail,
	Cadences,
	TaskCadenceGradient,
	Tasks,
} from "@cadence-frontend/icons";
import Email from "./components/Email/Email";
import TaskCadence from "./components/TaskCadence/TaskCadence";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import {
	Settings as SETTINGS_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";

// import TaskCadence from "./components/TaskCadence/TaskCadence";

export const NAV_SIDEBAR_OPTIONS = {
	email: {
		name: COMMON_TRANSLATION.EMAIL,
		icon: <AtrManualEmail color={Colors.veryLightBlue} />,
		activeIcon: ENUMS.mail.icon.gradient,
		component: (props = {}) => <Email {...props} />,
	},
	task_cadence: {
		name: SETTINGS_TRANSLATION.TASK_AND_CADENCE,
		icon: <Cadences color={Colors.veryLightBlue} />,
		activeIcon: <TaskCadenceGradient size="25px" />,
		component: (props = {}) => <TaskCadence {...props} />,
	},
};

export const LEVEL_TO_NAME = {
	[SETTING_PRIORITY.USER]: TASKS_TRANSLATION.USER,
	[SETTING_PRIORITY.SUB_DEPARTMENT]: TASKS_TRANSLATION.GROUP,
};
