import { useEffect, useState } from "react";

import { Title } from "@cadence-frontend/components";
import { Tabs, Input, InputTime, Select } from "@cadence-frontend/widgets";
import { WEEKDAYS, SETTING_PRIORITY } from "@cadence-frontend/constants";
import { TabNavThemes, TabNavBtnThemes, InputThemes } from "@cadence-frontend/themes";

import { TIME_BETWEEN_EMAILS_TAB_OPTIONS } from "../constants";
import { LEVEL_TO_NAME } from "../../../../../constants";
import { UNIT_OPTIONS } from "./constants";
import { getDestructuredTime } from "./utils";

import styles from "./SingleCalendarSetting.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Email as EMAIL_TRANSLATION } from "@cadence-frontend/languages";

const SingleCalendarSetting = ({ data, setData, exception, users, subDepartments }) => {
	const [value, setValue] = useState({
		...data,
		delay: Math.ceil(data.delay / 60),
		end_hour: data.end_hour === "24:00" ? "00:00" : data.end_hour,
	});
	const user = useRecoilValue(userInfo);
	const [waitTime, setWaitTime] = useState(() => {
		const lowerTimeDestructured = getDestructuredTime(data.wait_time_lower_limit);
		const upperTimeDestructured = getDestructuredTime(data.wait_time_upper_limit);
		return {
			wait_time_lower_limit: lowerTimeDestructured.time,
			wait_time_upper_limit: upperTimeDestructured.time,
			lower_time_limit_unit: lowerTimeDestructured.unit,
			upper_time_limit_unit: upperTimeDestructured.unit,
		};
	});

	useEffect(() => {
		const numberRegex = /^\d+$/;
		const isValidDelay = numberRegex.test(value.delay);

		// if (exception)
		// 	setData({
		// 		...value,
		// 		delay: isValidDelay ? parseInt(value.delay) * 60 : value.delay,
		// 	});
		// else
		setData(prev => ({
			...prev,
			...value,
			delay: isValidDelay ? parseInt(value.delay) * 60 : value.delay,
			end_hour: value.end_hour === "00:00" ? "24:00" : value.end_hour,
			exceptions: prev.exceptions,
		}));
	}, [value]);

	useEffect(() => {
		const wait_time_lower_limit =
			parseInt(waitTime.wait_time_lower_limit) * waitTime.lower_time_limit_unit;
		const wait_time_upper_limit =
			parseInt(waitTime.wait_time_upper_limit) * waitTime.upper_time_limit_unit;
		setData({ ...value, wait_time_lower_limit, wait_time_upper_limit });
	}, [waitTime]);

	return (
		<div
			className={`${styles.singleCalendarSetting} ${exception ? styles.exception : ""}`}
		>
			{/* {exception && (
				<div className={styles.setting}>
					<Title className={styles.title} size="1.1rem">
						Select a {LEVEL_TO_NAME[value?.priority]}
					</Title>
					<div className={styles.description}></div>
					<div>
						<Select
							width={"70%"}
							value={value}
							setValue={setValue}
							name={value.priority === SETTING_PRIORITY.USER ? "user_id" : "sd_id"}
							options={value.priority === SETTING_PRIORITY.USER ? users : subDepartments}
							isSearchable
						/>
					</div>
				</div>
			)} */}
			<div className={styles.setting}>
				<Title className={styles.title} size="1.1rem">
					{COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}></div>
				<Tabs
					btnBordered={true}
					theme={TabNavThemes.PRIMARY_AND_WHITE}
					btnTheme={TabNavBtnThemes.PRIMARY_AND_WHITE}
					tabs={WEEKDAYS.map(opt => ({
						label: opt.label[user?.language?.toUpperCase()],
						value: opt.value,
					}))}
					value={value}
					setValue={setValue}
					btnClassName={styles.dayBtn}
					name="working_days"
				/>
				<div className={styles.timeSettings}>
					<InputTime
						type="slider"
						theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						input={value}
						setInput={setValue}
						name="start_hour"
					/>
					<span></span>
					<InputTime
						type="slider"
						theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						input={value}
						setInput={setValue}
						name="end_hour"
					/>
				</div>
			</div>
			<div className={styles.setting}>
				<Title className={styles.title} size="1.1rem">
					{
						EMAIL_TRANSLATION.MAXIMUM_AUTOMATED_MAIL_SENT_PER_DAY_PER_USER[
							user?.language?.toUpperCase()
						]
					}
				</Title>
				<div className={styles.description}></div>
				<Input
					type="number"
					className={styles.inputField}
					width="100px"
					value={value}
					setValue={setValue}
					name={"max_emails_per_day"}
					theme={exception ? InputThemes.WHITE : InputThemes.GREY}
				/>
			</div>
			<div className={styles.setting}>
				<Title className={styles.title} size="1.1rem">
					{SETTINGS_TRANSLATION.MAX_SMS_SENT[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}></div>
				<Input
					type="number"
					className={styles.inputField}
					width="100px"
					value={value}
					setValue={setValue}
					name={"max_sms_per_day"}
					theme={exception ? InputThemes.WHITE : InputThemes.GREY}
				/>
			</div>
			<div className={styles.setting}>
				<Title className={styles.title} size="1.1rem">
					{
						SETTINGS_TRANSLATION.TIME_BETWEEN_EMAILS_AND_SMS[
							user?.language?.toUpperCase()
						]
					}
				</Title>
				<div className={styles.description}></div>
				<Tabs
					className={styles.switchTab}
					tabs={TIME_BETWEEN_EMAILS_TAB_OPTIONS.map(opt => ({
						label: opt.label[user?.language?.toUpperCase()],
						value: opt.value,
					}))}
					value={value}
					setValue={setValue}
					btnBordered={false}
					theme={exception ? TabNavThemes.WHITE : TabNavThemes.GREY}
					btnTheme={
						exception
							? TabNavBtnThemes.PRIMARY_AND_WHITE
							: TabNavBtnThemes.PRIMARY_AND_GREY
					}
					name={"is_wait_time_random"}
					btnClassName={styles.timeBetweenBtn}
					radio={true}
				/>
				{!value?.is_wait_time_random ? (
					<div className={styles.inputBox}>
						<Input
							type="number"
							width="100px"
							height="44px"
							value={value}
							setValue={setValue}
							name="delay"
							theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						/>
						<span>{COMMON_TRANSLATION.MINUTES[user?.language?.toUpperCase()]}</span>
					</div>
				) : (
					<p className={styles.waitTime}>
						<span>
							{
								EMAIL_TRANSLATION.WAIT_TIME_IS_ANYWHERE_BETWEEN[
									user?.language?.toUpperCase()
								]
							}{" "}
						</span>
						<Input
							type="number"
							width="70px"
							value={waitTime}
							setValue={setWaitTime}
							name="wait_time_lower_limit"
							theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						/>{" "}
						<Select
							value={waitTime}
							setValue={setWaitTime}
							name="lower_time_limit_unit"
							options={UNIT_OPTIONS.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
							menuOnTop={exception}
							className={styles.select}
						/>
						<span>{COMMON_TRANSLATION.AND[user?.language?.toUpperCase()]} </span>
						<Input
							type="number"
							width="70px"
							value={waitTime}
							setValue={setWaitTime}
							name="wait_time_upper_limit"
							theme={exception ? InputThemes.WHITE : InputThemes.GREY}
						/>{" "}
						<Select
							value={waitTime}
							setValue={setWaitTime}
							name="upper_time_limit_unit"
							options={UNIT_OPTIONS.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
							menuOnTop={exception}
							className={styles.select}
						/>
					</p>
				)}
			</div>
		</div>
	);
};

export default SingleCalendarSetting;
