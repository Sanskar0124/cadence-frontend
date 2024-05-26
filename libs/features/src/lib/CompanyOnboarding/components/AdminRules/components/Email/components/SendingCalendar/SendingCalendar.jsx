/* eslint-disable no-alert */
import { useContext, useState } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title } from "@cadence-frontend/components";
import SingleCalendarSetting from "./components/SingleCalendarSetting";

import styles from "./SendingCalendar.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const SendingCalendar = ({
	automatedTaskSettings: data,
	setAutomatedTaskSettings: setData,
}) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.settingsTypeContainer} id="sending_calendar">
			<div className={styles.header}>
				<Title size="1.4rem" className={styles.title}>
					{SETTINGS_TRANSLATION.SENDING_CALENDER[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{SETTINGS_TRANSLATION.SETUP_THE_DAYS_AND_TIME[user?.language?.toUpperCase()]}
				</div>
			</div>
			{data && <SingleCalendarSetting data={data} setData={setData} exception={false} />}
		</div>
	);
};

export default SendingCalendar;
