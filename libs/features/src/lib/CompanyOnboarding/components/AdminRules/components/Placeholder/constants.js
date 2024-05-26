import Email from "./components/Email/Email";
import TaskCadence from "./components/TaskCadence/TaskCadence";

export const PLACEHOLDER_OPTIONS = {
	email: {
		name: "Email",
		component: (props = {}) => <Email {...props} />,
	},
	task_cadence: {
		name: "Task and Cadence",
		component: (props = {}) => <TaskCadence {...props} />,
	},
};
