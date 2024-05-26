import { userInfo } from "@cadence-frontend/atoms";
import styles from "./AutomatedWorkflow.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import AutomatedWorkflowRules from "./components/Rules/AutomatedWorkflowRules";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const AutomatedWorkflow = ({ setDeleteModal }) => {
	const user = useRecoilValue(userInfo);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.WORKFLOWS}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.WORKFLOW[user?.language?.toUpperCase()]}</h2>
				<p>
					{SETTINGS_TRANSLATION.CONFIGURE_YOUR_ACTIONS[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.setting}>
					<h2>
						{COMMON_TRANSLATION.SET_TRIGGER_AND_ACTION[user?.language?.toUpperCase()]}
					</h2>
					<p>{COMMON_TRANSLATION.ADD_A_NEW_TRIGGER[user?.language?.toUpperCase()]}</p>

					<AutomatedWorkflowRules setDeleteModal={setDeleteModal} />
				</div>
			</div>
		</div>
	);
};

export default AutomatedWorkflow;
