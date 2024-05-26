import { CollapseContainer } from "@cadence-frontend/widgets";
import { Label, ThemedButton, InputDate, InputTime } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { useCadenceForLead } from "@cadence-frontend/data-access";
import styles from "./Duration.module.scss";

const Duration = ({ pauseTime, setPauseTime }) => {
	return (
		<CollapseContainer
			title={
				<div className={`${styles.titleSelector} ${styles.headText}`}>
					Automatically Resume Cadence On :
				</div>
			}
			className={styles.collapseContainer}
		>
			<div className={styles.duration}>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label className={styles.label}>Date</Label>
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
						<Label className={styles.label}>Time</Label>
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
