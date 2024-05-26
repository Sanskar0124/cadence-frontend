import { userInfo } from "@cadence-frontend/atoms";
import { InputThemes } from "@cadence-frontend/themes";
import { Input, Toggle } from "@cadence-frontend/widgets";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./ResetScore.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { LEAD_SCORE_KEYS, LEAD_SCORE_PANELS } from "../../constants";

function ResetScore({ exception, rubrikName, leadScoreSettings, setLeadScoreSettings }) {
	const user = useRecoilValue(userInfo);
	const [input, setInput] = useState(
		leadScoreSettings?.[LEAD_SCORE_KEYS?.[rubrikName]] ?? 0
	);
	const [toggle, setToggle] = useState(false);

	useEffect(() => {
		setLeadScoreSettings(prev => ({
			...prev,
			[LEAD_SCORE_KEYS?.[rubrikName]]: input ?? 0,
		}));

		if (input > 0) setToggle(true);
	}, [input]);

	const handleToggle = () => {
		if (toggle) setInput(0);
		setToggle(prev => !prev);
	};

	return (
		<div className={`${styles.setting} ${exception ? styles.exceptionElement : ""}`}>
			<div className={`${styles.rubrik} ${exception ? styles.exception : ""}`}>
				<div className={styles.left}>
					<span className={styles.rubrikName}>
						{LEAD_SCORE_PANELS[rubrikName][user?.language?.toUpperCase()]}
					</span>
				</div>
				{toggle && (
					<div className={styles.bottom}>
						<div className={styles.rubrikScore}>
							<Input
								value={input}
								setValue={setInput}
								className={styles.input}
								width="56px"
								height="40px"
								type="number"
								name={LEAD_SCORE_KEYS?.[rubrikName]}
								placeholder={"00"}
								minValue={0}
								maxValue={1000000}
								theme={exception ? InputThemes.WHITE : InputThemes.GREY}
							/>
							<p>{COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()]}</p>
						</div>
					</div>
				)}
				<Toggle theme="PURPLE" onChange={handleToggle} checked={toggle} />
			</div>
		</div>
	);
}

export default ResetScore;
