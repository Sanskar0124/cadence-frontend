import { useEffect, useState } from "react";

import { Tabs, TaskStack, Select } from "@cadence-frontend/widgets";
import { Title } from "@cadence-frontend/components";
import { TabNavThemes, TabNavBtnThemes } from "@cadence-frontend/themes";

import { MAIL_TYPES } from "../../constants";
import { LEVEL_TO_NAME } from "../../../../../../constants";
import { SETTING_PRIORITY } from "@cadence-frontend/constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
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
		else setData(prev => ({ ...prev, ...value, exceptions: prev.exceptions }));
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
					<div className={styles.description}></div>
					<div>
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
				{/* <div className={styles.switchMailTypes}>
					<Tabs
						btnBordered={true}
						theme={exception ? TabNavThemes.WHITE : TabNavThemes.GREY}
						btnTheme={
							exception
								? TabNavBtnThemes.PRIMARY_AND_WHITE
								: TabNavBtnThemes.PRIMARY_AND_GREY
						}
						tabs={MAIL_TYPES}
						value={switchValue}
						setValue={setSwitchValue}
						radio={true}
						btnWidth={"150px"}
						btnClassName={styles.dayBtn}
					/>
				</div> */}
				<div className={styles.taskOptions}>
					<TaskStack
						value={value}
						setValue={setValue}
						name={["automatic_unsubscribed_data", "semi_automatic_unsubscribed_data"]}
					/>
				</div>
			</div>
		</div>
	);
};

export default SingleUnsubscribeSetting;
