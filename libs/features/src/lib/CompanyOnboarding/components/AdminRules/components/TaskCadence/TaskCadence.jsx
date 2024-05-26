/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Divider } from "@cadence-frontend/components";
import MaximumTasks from "./components/MaximumTasks/MaximumTasks";

import styles from "./TaskCadence.module.scss";

const TaskCadence = ({ ...rest }) => {
	return (
		<div>
			<MaximumTasks {...rest} />
		</div>
	);
};

export default TaskCadence;
