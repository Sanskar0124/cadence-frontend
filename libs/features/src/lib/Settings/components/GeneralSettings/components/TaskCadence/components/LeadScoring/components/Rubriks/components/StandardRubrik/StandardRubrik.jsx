import { userInfo } from "@cadence-frontend/atoms";
import { InputThemes } from "@cadence-frontend/themes";
import { Input } from "@cadence-frontend/widgets";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./StandardRubrik.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { LEAD_SCORE_KEYS, LEAD_SCORE_PANELS } from "../../constants";
import { HotLead2 } from "@cadence-frontend/icons";

function StandardRubrik({
	exception,
	rubrikName,
	leadScoreSettings,
	setLeadScoreSettings,
}) {
	const user = useRecoilValue(userInfo);
	const [input, setInput] = useState(
		leadScoreSettings?.[LEAD_SCORE_KEYS?.[rubrikName]] ?? 0
	);

	useEffect(() => {
		setLeadScoreSettings(prev => ({
			...prev,
			[LEAD_SCORE_KEYS?.[rubrikName]]: input ?? 0,
		}));
	}, [input]);

	return (
		<div className={`${styles.setting} ${exception ? styles.exceptionElement : ""}`}>
			<div
				className={`${styles.rubrik} ${
					rubrikName === LEAD_SCORE_KEYS.SCORE_THRESHOLD.toUpperCase()
						? styles.scoreThreshold
						: ""
				} ${exception ? styles.exception : ""}`}
			>
				<div className={styles.left}>
					<span className={styles.rubrikName}>
						{rubrikName === LEAD_SCORE_KEYS.SCORE_THRESHOLD.toUpperCase() && <HotLead2 />}
						{LEAD_SCORE_PANELS[rubrikName][user?.language.toUpperCase()]}
					</span>
				</div>

				<div className={styles.rubrikScore}>
					<Input
						value={input}
						setValue={setInput}
						className={styles.input}
						width="56px"
						height="40px"
						type="integer"
						name={LEAD_SCORE_KEYS?.[rubrikName]}
						placeholder={"00"}
						theme={exception ? InputThemes.WHITE : InputThemes.GREY}
					/>
					<p> {COMMON_TRANSLATION.POINTS[user?.language?.toUpperCase()]}</p>
				</div>
			</div>
		</div>
	);
}

export default StandardRubrik;
