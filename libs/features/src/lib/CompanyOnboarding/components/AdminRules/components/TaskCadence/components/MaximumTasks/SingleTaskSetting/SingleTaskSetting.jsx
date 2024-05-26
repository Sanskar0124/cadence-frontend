import { useEffect, useState } from "react";

import { Input } from "@cadence-frontend/widgets";
import { Title } from "@cadence-frontend/components";
import { InputThemes } from "@cadence-frontend/themes";

import { TASK_OPTIONS, LINKEDIN } from "./constants";

import styles from "./SingleTaskSetting.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const convertFromMinutes = mins => {
	let h = Math.floor(mins / 60);
	let d = Math.floor(h / 24);
	h = h - d * 24;
	let m = Math.floor(mins % 60);
	return { days: d, hours: h, mins: m };
};

const convertToUnixDuration = ({ days, hours, mins }) => {
	let h = hours + days * 24;
	let sec = (mins + h * 60) * 60 * 1000;
	return sec;
};

const SingleTaskSetting = ({ data, setData, forceUpdate, setForceUpdate }) => {
	const [value, setValue] = useState(data);
	const [lateSettings, setLateSettings] = useState({});
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		const lateSettingsValues = Object.values(value.late_settings);
		Object.keys(value.late_settings).forEach((keys, index) => {
			const time = convertFromMinutes(lateSettingsValues[index] / 1000 / 60);
			setLateSettings(prev => ({ ...prev, [keys]: time }));
		});
		if (!value.late_settings.whatsapp) {
			const time = convertFromMinutes(86400000 / 1000 / 60);
			setLateSettings(prev => ({ ...prev, whatsapp: time }));
		}
		setData(prev => ({ ...prev, ...value, exceptions: prev.exceptions }));
	}, [value]);

	useEffect(() => {
		let lateSettingsObj = {};
		const settingsValue = Object.values(lateSettings);
		Object.keys(lateSettings).forEach((key, i) => {
			lateSettingsObj[key] = convertToUnixDuration(settingsValue[i]);
		});
		setData(prev => ({ ...prev, late_settings: lateSettingsObj }));
	}, [lateSettings]);

	useEffect(() => {
		if (forceUpdate) {
			setValue(data);
			setForceUpdate(false);
		}
	}, [data, forceUpdate]);

	return (
		<div className={`${styles.singleTaskSetting}`}>
			<div className={styles.setting}>
				<Title size="1.1rem" className={styles.title}>
					{SETTINGS_TRANSLATION.MAXIMUM_TASKS[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{SETTINGS_TRANSLATION.USER_DAILY_LIMIT_TASK[user?.language?.toUpperCase()]}
				</div>
				<Input
					type="number"
					value={value}
					setValue={setValue}
					name="max_tasks"
					className={styles.input}
					theme={InputThemes.GREY}
					width="90px"
				/>
			</div>
			<Title size="1.1rem" className={styles.title}>
				{SETTINGS_TRANSLATION.LATE_TASK_DURATION[user?.language?.toUpperCase()]}
			</Title>
			<div className={styles.description}>
				{SETTINGS_TRANSLATION.SET_DURATION[user?.language?.toUpperCase()]}
			</div>
			<div className={styles.setting}>
				{TASK_OPTIONS.map(taskOption => (
					<div className={styles.taskOption} key={taskOption.fieldName}>
						<div className={styles.tasks}>
							<div className={styles.left}>
								<span className={styles.icon}>{taskOption.icon}</span>
								<span className={styles.taskName}>
									{taskOption.name[user?.language?.toUpperCase()]}
								</span>
							</div>

							<div className={styles.taskTime}>
								<Input
									value={lateSettings?.[taskOption.fieldName]?.days}
									setValue={value =>
										setLateSettings(prev => {
											const a = taskOption.fieldName.startsWith("linkedin")
												? {
														...prev,
														[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY],
															days: value,
														},

														[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY],
															days: value,
														},

														[LINKEDIN.LINKEDIN_PROFILES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_PROFILES_PER_DAY],
															days: value,
														},

														[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY],
															days: value,
														},
												  }
												: {
														...prev,
														[taskOption.fieldName]: {
															...prev[taskOption.fieldName],
															days: value,
														},
												  };

											return a;
										})
									}
									className={styles.input}
									width="40px"
									height="32px"
									type="number"
									minValue={0}
									theme={InputThemes.GREY}
								/>
								<p>{COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()]}</p>
								<Input
									value={lateSettings?.[taskOption.fieldName]?.hours}
									setValue={value =>
										setLateSettings(prev => {
											const a = taskOption.fieldName.startsWith("linkedin")
												? {
														...prev,
														[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY],
															hours: value,
														},

														[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY],
															hours: value,
														},

														[LINKEDIN.LINKEDIN_PROFILES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_PROFILES_PER_DAY],
															hours: value,
														},

														[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY],
															hours: value,
														},
												  }
												: {
														...prev,
														[taskOption.fieldName]: {
															...prev[taskOption.fieldName],
															hours: value,
														},
												  };

											return a;
										})
									}
									className={styles.input}
									width="40px"
									height="32px"
									type="number"
									maxValue={24}
									minValue={0}
									theme={InputThemes.GREY}
								/>
								<p> {COMMON_TRANSLATION.HOURS[user?.language?.toUpperCase()]}</p>
								<Input
									value={lateSettings?.[taskOption.fieldName]?.mins}
									setValue={value =>
										setLateSettings(prev => {
											const a = taskOption.fieldName.startsWith("linkedin")
												? {
														...prev,
														[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY],
															mins: value,
														},

														[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY],
															mins: value,
														},

														[LINKEDIN.LINKEDIN_PROFILES_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_PROFILES_PER_DAY],
															mins: value,
														},

														[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY]: {
															...prev[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY],
															mins: value,
														},
												  }
												: {
														...prev,
														[taskOption.fieldName]: {
															...prev[taskOption.fieldName],
															mins: value,
														},
												  };

											return a;
										})
									}
									className={styles.input}
									width="40px"
									height="32px"
									type="number"
									maxValue={60}
									minValue={0}
									theme={InputThemes.GREY}
								/>
								<p>{COMMON_TRANSLATION.MINUTES[user?.language?.toUpperCase()]}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SingleTaskSetting;
