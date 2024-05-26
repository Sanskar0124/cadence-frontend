import { userInfo } from "@cadence-frontend/atoms";
import { InputThemes } from "@cadence-frontend/themes";
import { Input, Select } from "@cadence-frontend/widgets";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./OutgoingCall.module.scss";

import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { LEAD_SCORE_PANELS, TIME_OPTIONS } from "../../constants";

function OutgoingCall({
	exception = false,
	rubrikName,
	leadScoreSettings,
	setLeadScoreSettings,
	...rest
}) {
	const user = useRecoilValue(userInfo);
	const [input, setInput] = useState({
		duration: leadScoreSettings
			? leadScoreSettings?.outgoing_call_duration > 60
				? leadScoreSettings?.outgoing_call_duration / 60
				: leadScoreSettings?.outgoing_call_duration
			: 0,
		unit: leadScoreSettings
			? leadScoreSettings?.outgoing_call_duration > 60
				? "MINUTES"
				: "SECONDS"
			: "SECONDS",
		score: leadScoreSettings?.outgoing_call ?? 0,
	});

	useEffect(() => {
		let duration =
			input.unit?.toLowerCase() === TIME_OPTIONS.MINUTES?.toLowerCase()
				? input.duration * 60
				: input.duration;
		duration = duration === "" ? 0 : duration;
		let score = input.score === "" ? 0 : input.score;
		setLeadScoreSettings(prev => ({
			...prev,
			outgoing_call: score,
			outgoing_call_duration: duration,
		}));
	}, [input]);

	return (
		<div className={`${styles.setting} ${exception ? styles.exceptionElement : ""}`}>
			<div className={`${styles.rubrik} ${exception ? styles.exception : ""}`}>
				<div className={styles.left}>
					<span className={styles.rubrikName}>
						{LEAD_SCORE_PANELS[rubrikName][user?.language.toUpperCase()]}
					</span>
					<span className={styles.duration}>
						<Input
							// value={"00"}
							value={input}
							setValue={setInput}
							name="duration"
							className={styles.input}
							width="56px"
							height="40px"
							type="integer"
							placeholder={"00"}
							min={"0"}
							theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						/>
						<Select
							options={TIME_OPTIONS}
							value={input}
							setValue={setInput}
							name="unit"
						/>
					</span>
				</div>

				<div className={styles.rubrikScore}>
					<Input
						value={input}
						setValue={setInput}
						name="score"
						className={styles.input}
						width="56px"
						height="40px"
						type="number"
						placeholder={"00"}
						min={"0"}
						theme={exception ? InputThemes.WHITE : InputThemes.GREY}
					/>
					<p> {COMMON_TRANSLATION.POINTS[user?.language?.toUpperCase()]}</p>
				</div>
			</div>
		</div>
	);
}

export default OutgoingCall;
