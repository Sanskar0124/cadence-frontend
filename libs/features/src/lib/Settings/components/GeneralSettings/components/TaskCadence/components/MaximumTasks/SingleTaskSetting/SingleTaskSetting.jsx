import { useEffect, useState } from "react";

import { Title } from "@cadence-frontend/components";
import { Input, Select } from "@cadence-frontend/widgets";

import { userInfo } from "@cadence-frontend/atoms";
import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { LEVEL_TO_NAME } from "../../../../../constants";
import { LINKEDIN, TASK_OPTIONS } from "./constants";

import Duration from "./Duration/Duration";
import styles from "./SingleTaskSetting.module.scss";

const SingleTaskSetting = ({
	data,
	setData,
	forceUpdate,
	setForceUpdate,
	exception,
	users,
	subDepartments,
}) => {
	const [value, setValue] = useState(data);
	const user = useRecoilValue(userInfo);

	const [lateSettings, setLateSettings] = useState({});

	useEffect(() => {
		const lateSettingsValues = Object.values(value.late_settings);
		Object.keys(value.late_settings).forEach((keys, index) => {
			const time = lateSettingsValues[index] / 1000 / 60;
			setLateSettings(prev => ({ ...prev, [keys]: time }));
		});
		if (!value.late_settings.whatsapp) {
			const time = 86400000 / 1000 / 60;
			setLateSettings(prev => ({ ...prev, whatsapp: time }));
		}
		if (exception) {
			setData(value);
		} else {
			setData(prev => ({ ...prev, ...value, exceptions: prev.exceptions }));
		}
	}, [value]);

	useEffect(() => {
		let lateSettingsObj = {};
		const settingsValue = Object.values(lateSettings);
		Object.keys(lateSettings).forEach((key, i) => {
			lateSettingsObj[key] = settingsValue[i] * 60 * 1000;
		});

		if (exception) setData({ ...value, late_settings: lateSettingsObj });
		else setData(prev => ({ ...prev, late_settings: lateSettingsObj }));
	}, [lateSettings]);

	useEffect(() => {
		if (forceUpdate) {
			setValue(data);
			setForceUpdate(false);
		}
	}, [data, forceUpdate]);

	return (
		<div className={`${styles.singleTaskSetting} ${exception ? styles.exception : ""}`}>
			{exception && (
				<div className={styles.setting}>
					<Title className={styles.title} size="1rem">
						{CADENCE_TRANSLATION.SELECT_A[user?.language?.toUpperCase()]}{" "}
						{LEVEL_TO_NAME[value?.priority][user?.language?.toUpperCase()]}
					</Title>
					<div style={{ marginTop: "15px" }}>
						<Select
							width={"80%"}
							value={value}
							setValue={setValue}
							name={value.priority === SETTING_PRIORITY.USER ? "user_id" : "sd_id"}
							options={value.priority === SETTING_PRIORITY.USER ? users : subDepartments}
							isSearchable
						/>
					</div>
				</div>
			)}
			<div className={styles.setting}>
				<h2>{SETTINGS_TRANSLATION.MAXIMUM_TASKS[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.USER_DAILY_LIMIT_TASK[user?.language?.toUpperCase()]}</p>
				<Input
					type="number"
					value={value}
					setValue={setValue}
					name="max_tasks"
					className={styles.input}
					width="120px"
				/>
			</div>
			<div className={styles.setting}>
				<h2>{SETTINGS_TRANSLATION.LATE_TASK_DURATION[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.SET_DURATION[user?.language?.toUpperCase()]}</p>
				<div className={styles.taskOptions}>
					{TASK_OPTIONS.map(taskOption => (
						<div className={styles.task} key={taskOption.fieldName}>
							<div className={styles.left}>
								<span className={styles.icon}>{taskOption.icon}</span>
								<span className={styles.taskName}>
									{taskOption.name[user?.language?.toUpperCase()]}
								</span>
							</div>

							{taskOption.fieldName in lateSettings && (
								<div className={styles.right}>
									<Duration
										mins={lateSettings[taskOption.fieldName]}
										setValue={value =>
											setLateSettings(prev => {
												return taskOption.fieldName.startsWith("linkedin")
													? {
															...prev,
															[LINKEDIN.LINKEDIN_CONNECTIONS_PER_DAY]: value,
															[LINKEDIN.LINKEDIN_MESSAGES_PER_DAY]: value,
															[LINKEDIN.LINKEDIN_PROFILES_PER_DAY]: value,
															[LINKEDIN.LINKEDIN_INTERACTS_PER_DAY]: value,
													  }
													: {
															...prev,
															[taskOption.fieldName]: value,
													  };
											})
										}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SingleTaskSetting;
