import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./ActiveTag.module.scss";
import { ACTIVE_TAG_COLORS, ACTIVE_TAG_OPTIONS } from "./constants";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { DEFAULT_FILTER_OPTIONS } from "@cadence-frontend/utils";
import { ACTIVE_TAG_ENUM } from "../../constants";
import { TASK_TAG_ENUMS } from "../TaskCompletion/constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Home as HOME_TRANSLATION } from "@cadence-frontend/languages";

const ActiveTag = ({ activeTag, setActiveTag }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	const onStartTasks = () => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.TASK_FILTERS,
			JSON.stringify({
				filters: {
					...DEFAULT_FILTER_OPTIONS,
					...(activeTag !== ACTIVE_TAG_ENUM.all && {
						task_tag: [TASK_TAG_ENUMS[activeTag]],
					}),
				},
			})
		);
		navigate("/tasks");
	};

	return (
		<div className={styles.container}>
			<TabNavSlider
				theme={TabNavThemes.SLIDER}
				buttons={ACTIVE_TAG_OPTIONS.map(opt => ({
					label: opt.label[user?.language.toUpperCase()],
					value: opt.value,
				}))}
				value={activeTag}
				setValue={setActiveTag}
				className={styles.tabNav}
				activeBtnClassName={`${styles.activeTab} ${styles[ACTIVE_TAG_COLORS[activeTag]]}`}
				btnClassName={styles.tabBtn}
				noAnimation
			/>
			<ThemedButton
				width="fit-content"
				theme={ThemedButtonThemes.PRIMARY}
				height="40px"
				onClick={onStartTasks}
			>
				{HOME_TRANSLATION.START_MY_TASK[user?.language.toUpperCase()]}
			</ThemedButton>
		</div>
	);
};
export default ActiveTag;
