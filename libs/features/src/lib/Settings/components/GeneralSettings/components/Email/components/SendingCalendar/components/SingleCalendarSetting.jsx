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
import { Search } from "@cadence-frontend/icons";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Email as EMAIL_TRANSLATION } from "@cadence-frontend/languages";

const SingleCalendarSetting = ({ data, setData, exception, users, subDepartments }) => {
	const [value, setValue] = useState({
		...data,
		delay: Math.ceil(data.delay / 60),
		end_hour: data.end_hour === "24:00" ? "00:00" : data.end_hour,
	});
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

	const user = useRecoilValue(userInfo);

	useEffect(() => {
		const numberRegex = /^\d+$/;
		const isValidDelay = numberRegex.test(value.delay);

		if (exception)
			setData({
				...value,
				delay: isValidDelay ? parseInt(value.delay) * 60 : value.delay,
				end_hour: value.end_hour === "00:00" ? "24:00" : value.end_hour,
			});
		else
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
			{exception && (
				<div className={styles.setting}>
					<h2>
						{CADENCE_TRANSLATION.SELECT_A[user?.language?.toUpperCase()]}{" "}
						{LEVEL_TO_NAME[value?.priority][user?.language?.toUpperCase()]}
					</h2>
					<div style={{ marginTop: "15px" }}>
						<Select
							width={"70%"}
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
				<h2 className={styles.title}>
					{SETTINGS_TRANSLATION.DAYS_AND_TIMING[user?.language.toUpperCase()]}
				</h2>
				<p className={styles.description}>
					{SETTINGS_TRANSLATION.SCHEDULE_FOR_OUTGOING_MAIL[user?.language.toUpperCase()]}
				</p>
				<Tabs
					btnBordered={true}
					btnTheme={
						exception
							? TabNavBtnThemes.PRIMARY_AND_WHITE
							: TabNavBtnThemes.PRIMARY_AND_GREY
					}
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
						className={styles.timeInput}
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
						className={styles.timeInput}
						input={value}
						setInput={setValue}
						name="end_hour"
					/>
				</div>
			</div>
			<div className={styles.setting}>
				<h2>{SETTINGS_TRANSLATION.EMAILS_PER_DAY[user?.language.toUpperCase()]}</h2>
				<p>
					{SETTINGS_TRANSLATION.MAXIMUM_VALUE_FOR_EMAILS[user?.language.toUpperCase()]}
				</p>
				<Input
					type="number"
					className={styles.inputField}
					width="100px"
					value={value}
					setValue={setValue}
					name={"max_emails_per_day"}
				/>
			</div>
			<div className={styles.setting}>
				<h2>{SETTINGS_TRANSLATION.SMS_PER_DAY[user?.language.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.MAXIMUM_VALUE_FOR_SMS[user?.language.toUpperCase()]}</p>
				<Input
					type="number"
					className={styles.inputField}
					width="100px"
					value={value}
					setValue={setValue}
					name={"max_sms_per_day"}
				/>
			</div>
			<div className={styles.setting}>
				<h2>
					{
						SETTINGS_TRANSLATION.TIME_BETWEEN_EMAILS_AND_SMS[
							user?.language?.toUpperCase()
						]
					}
				</h2>
				<p>
					{
						SETTINGS_TRANSLATION.DELAY_TIME_BETWEEN_MAILS_AND_SMS[
							user?.language.toUpperCase()
						]
					}
				</p>
				<Tabs
					tabs={TIME_BETWEEN_EMAILS_TAB_OPTIONS.map(opt => ({
						label: opt.label[user?.language?.toUpperCase()],
						value: opt.value,
					}))}
					value={value}
					setValue={setValue}
					theme={exception ? TabNavThemes.WHITE : TabNavThemes.GREY}
					btnTheme={
						exception
							? TabNavBtnThemes.PRIMARY_AND_WHITE
							: TabNavBtnThemes.PRIMARY_AND_GREY
					}
					name={"is_wait_time_random"}
					radio={true}
					className={styles.tabs}
					btnClassName={styles.tabBtns}
					activeBtnClassName={styles.tabBtnActive}
					activePillClassName={styles.activePill}
				/>
				{!value?.is_wait_time_random ? (
					<div className={styles.inputBox}>
						<Input
							type="number"
							width="100px"
							height="44px"
							className={styles.inputField}
							value={value}
							setValue={setValue}
							name="delay"
						/>
						<span className={styles.minuteTag}>
							{COMMON_TRANSLATION.MINUTES[user?.language?.toUpperCase()]}
						</span>
					</div>
				) : (
					<div className={styles.waitTime}>
						<span>
							{SETTINGS_TRANSLATION.DELAY_TIME_ANYWHERE[user?.language.toUpperCase()]}
						</span>
						<div>
							<Input
								type="number"
								width="70px"
								value={waitTime}
								setValue={setWaitTime}
								name="wait_time_lower_limit"
							/>
							<Select
								value={waitTime}
								setValue={setWaitTime}
								name="lower_time_limit_unit"
								options={UNIT_OPTIONS.map(opt => ({
									label: opt.label[user?.language?.toUpperCase()],
									value: opt.value,
								}))}
								menuOnTop={exception}
							/>
							<span>{COMMON_TRANSLATION.TO[user?.language?.toUpperCase()]}</span>
							<Input
								type="number"
								width="70px"
								value={waitTime}
								setValue={setWaitTime}
								name="wait_time_upper_limit"
							/>
							<Select
								value={waitTime}
								setValue={setWaitTime}
								name="upper_time_limit_unit"
								options={UNIT_OPTIONS.map(opt => ({
									label: opt.label[user?.language?.toUpperCase()],
									value: opt.value,
								}))}
								menuOnTop={exception}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SingleCalendarSetting;
