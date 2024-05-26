import { Cadences } from "@cadence-frontend/icons";
import styles from "./CadenceCard.module.scss";
import { Colors, DEFAULT_FILTER_OPTIONS } from "@cadence-frontend/utils";
import { forwardRef } from "react";
import { ACTIVE_TAG_LABEL_ENUM } from "./constants";
import { CADENCE_TYPE_ENUM } from "./constants";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { TASK_TAG_ENUMS } from "../../../TaskCompletion/constants";
import { ACTIVE_TAG_ENUM } from "../../../../constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const CadenceCard = ({ cadence, activeTag }, ref) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	const redirectToTasksWithFilter = cadence_id => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.TASK_FILTERS,
			JSON.stringify({
				filters: {
					...DEFAULT_FILTER_OPTIONS,
					task_cadences: [cadence_id],
					...(activeTag !== ACTIVE_TAG_ENUM.all && {
						task_tag: [TASK_TAG_ENUMS[activeTag]],
					}),
				},
			})
		);
		navigate("/tasks");
	};

	return (
		<div
			className={styles.container}
			ref={ref}
			onClick={() => redirectToTasksWithFilter(cadence.cadence_id)}
		>
			<div className={styles.left}>
				<div className={styles.icon}>
					<Cadences color={Colors.lightBlue} size="1rem" />
				</div>
				<div className={styles.info}>
					<span>{cadence.name}</span>
					<span>
						<span>{cadence.node_count} steps</span>•
						<span>{cadence.total_lead_count} leads</span>•
						<span>{CADENCE_TYPE_ENUM[cadence.type]}</span>
					</span>
				</div>
			</div>
			<div className={`${styles.tag} ${styles[activeTag]}`}>
				<span>{ACTIVE_TAG_LABEL_ENUM[activeTag][user?.language.toUpperCase()]}</span>{" "}
				<span>({cadence.task_count})</span>
			</div>
		</div>
	);
};
export default forwardRef(CadenceCard);
