import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import { Title } from "@cadence-frontend/components";
import { Select, TaskStack } from "@cadence-frontend/widgets";
import React, { useState, useEffect } from "react";
import { LEVEL_TO_NAME } from "../../../../../../constants";
import styles from "./SingleSkipSettings.module.scss";
import AddReasons from "../AddReasons/AddReasons";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

const SingleSkipSettings = ({ data, setData, exception, users, subDepartments }) => {
	const [value, setValue] = useState(data);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		let reasons = data.skip_reasons;
		if (exception) setData({ ...value, skip_reasons: reasons });
		else
			setData(prev => ({
				...prev,
				...value,
				exceptions: prev.exceptions,
				skip_reasons: reasons,
			}));
	}, [value]);

	return (
		<div className={`${styles.singleBounceSetting} ${exception ? styles.exception : ""}`}>
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
							placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
						/>
					</div>
				</div>
			)}
			<div className={styles.setting}>
				<div>
					<AddReasons
						reasons={data?.skip_reasons}
						taskSettings={data}
						setTaskSettings={setData}
					/>
				</div>
				<div className={styles.taskOptions}>
					<TaskStack
						value={value}
						setValue={val => {
							setValue(val);
						}}
						name={["skip_allowed_tasks"]}
						className={exception ? styles.exceptionStack : ""}
					/>
				</div>
			</div>
		</div>
	);
};

export default SingleSkipSettings;
