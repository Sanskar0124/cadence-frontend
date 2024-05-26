import { useEffect, useState } from "react";

import { Title } from "@cadence-frontend/components";
import { Select, TaskStack } from "@cadence-frontend/widgets";

import { userInfo } from "@cadence-frontend/atoms";
import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { LEVEL_TO_NAME } from "../../../../../../constants";

import styles from "./SingleUnsubscribeSetting.module.scss";

const SingleUnsubscribeSetting = ({
	data,
	setData,
	exception,
	users,
	subDepartments,
}) => {
	const [value, setValue] = useState(data);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (exception) setData(value);
		else
			setData(prev => ({
				...prev,
				...value,
				exceptions: prev.exceptions,
			}));
	}, [value]);

	return (
		<div
			className={`${styles.singleUnsubscribeSetting} ${
				exception ? styles.exception : ""
			}`}
		>
			{exception && (
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
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
				<div className={styles.taskOptions}>
					<TaskStack
						value={value}
						setValue={setValue}
						name={["automatic_unsubscribed_data", "semi_automatic_unsubscribed_data"]}
						className={exception ? styles.exceptionStack : ""}
					/>
				</div>
			</div>
		</div>
	);
};

export default SingleUnsubscribeSetting;
