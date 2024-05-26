/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import Webhooks from "./components/Webhooks/Webhooks";
import styles from "./TaskCadence.module.scss";
import LeadScoring from "./components/LeadScoring/LeadScoring";
import MaximumTasks from "./components/MaximumTasks/MaximumTasks";
import SkipSettings from "./components/SkipSettings/SkipSettings";
import {
	AUTOMATED_WORKFLOWS_AVAILABLE,
	WEBHOOKS_AVAILABLE,
	WORKFLOWS_AVAILABLE,
} from "./constants";
import AutomatedWorkflow from "./components/AutomatedWorkflow/AutomatedWorkflow";
import Workflows from "./components/Workflows/Workflows";

const TaskCadence = ({ ...rest }) => {
	const integration_type = useRecoilValue(userInfo).integration_type;
	return (
		<div>
			<MaximumTasks {...rest} />
			<div className={styles.divider} />
			<SkipSettings {...rest} />
			<div className={styles.divider} />
			<LeadScoring {...rest} />
			{rest.isAdmin && (
				<>
					{WORKFLOWS_AVAILABLE.includes(integration_type) && (
						<>
							<div className={styles.divider} />
							<Workflows {...rest} />
						</>
					)}
					{AUTOMATED_WORKFLOWS_AVAILABLE.includes(integration_type) && (
						<>
							<div className={styles.divider} />
							<AutomatedWorkflow {...rest} />
						</>
					)}
					{WEBHOOKS_AVAILABLE.includes(integration_type) && (
						<>
							<div className={styles.divider} />
							<Webhooks {...rest} />
						</>
					)}
				</>
			)}
		</div>
	);
};

export default TaskCadence;
