import { Title } from "@cadence-frontend/components";
import styles from "./Workflows.module.scss";

import Triggers from "./components/Triggers/Triggers";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

const Workflows = ({ setDeleteModal }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.container} id={SEARCH_OPTIONS.WORKFLOWS}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.WORKFLOW[user?.language?.toUpperCase()]}</h2>
				<p>Configure your automated actions</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.setting}>
					<h2>
						{COMMON_TRANSLATION.SET_TRIGGER_AND_ACTION[user?.language?.toUpperCase()]}
					</h2>
					<p>{COMMON_TRANSLATION.ADD_A_NEW_TRIGGER[user?.language?.toUpperCase()]}</p>
					<Triggers setDeleteModal={setDeleteModal} />
				</div>
			</div>
		</div>
	);
};

export default Workflows;
