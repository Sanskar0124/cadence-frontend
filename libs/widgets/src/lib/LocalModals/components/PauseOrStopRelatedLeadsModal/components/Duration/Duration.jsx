import { CollapseContainer } from "@cadence-frontend/widgets";
import { Label, ThemedButton, InputDate, InputTime } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { useCadenceForLead } from "@cadence-frontend/data-access";
import styles from "./Duration.module.scss";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Duration = ({ pauseTime, setPauseTime }) => {
	const user = useRecoilValue(userInfo);
	return (
		<CollapseContainer
			title={
				<div className={`${styles.titleSelector} ${styles.headText}`}>
					{
						TASKS_TRANSLATION.AUTOMATICALLY_RESUME_CADENCE_ON[
							user?.language?.toUpperCase()
						]
					}
				</div>
			}
			className={styles.collapseContainer}
		>
			<div className={styles.duration}>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label className={styles.label}>
							{COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}
						</Label>
						<InputDate
							value={pauseTime}
							setValue={setPauseTime}
							aheadOfDate
							numberOfOptionsVisible={"3"}
							style={{
								width: "95%",
								margin: "auto",
							}}
						/>
					</div>
					<div className={styles.inputGroup}>
						<Label className={styles.label}>
							{COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]}
						</Label>
						<InputTime
							input={pauseTime}
							name="time"
							setInput={setPauseTime}
							theme={InputThemes.WHITE}
							height="50px"
							type="slider"
							justify="left"
							style={{ padding: "0 20px", paddingBottom: "10px" }}
							className={styles.inputTime}
						/>
					</div>
				</div>
			</div>
		</CollapseContainer>
	);
};

export default Duration;
