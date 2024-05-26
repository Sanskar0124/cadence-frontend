import { useContext, useState } from "react";

import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title, Button } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { CollapseContainer } from "@cadence-frontend/widgets";
import SingleUnsubscribeSetting from "./components/SingleUnsubscribeSetting/SingleUnsubscribeSetting";

import { SETTING_PRIORITY, SETTING_TYPES } from "@cadence-frontend/constants";
import { getTempTeamExceptionData, getTempUserExceptionData } from "./constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./UnsubscribeRules.module.scss";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

const SETTING_TYPE = SETTING_TYPES.UNSUBSCRIBED_MAIL_SETTING;

const UnsubscribeRules = ({
	unsubscribeMailSettings: data,
	setUnsubscribeMailSettings: setData,
}) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.settingsTypeContainer} id="unsubscribe_rules">
			<div className={styles.header}>
				<Title size="1.3rem" className={styles.title}>
					{SETTINGS_TRANSLATION.UNSUBSCRIBE_RULES[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{
						SETTINGS_TRANSLATION.SETUP_RULES_WHEN_LEAD_UNSUBSCRIBES[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<Title size="1.1rem" className={styles.title}>
				{
					SETTINGS_TRANSLATION.TASK_TO_BE_SKIPPED_IF_UNSUBSCRIBE[
						user?.language?.toUpperCase()
					]
				}
			</Title>
			<div className={styles.description}>
				{SETTINGS_TRANSLATION.TASK_SKIPPED_IF_UNSUBSCRIBE[user?.language?.toUpperCase()]}
			</div>
			{data && <SingleUnsubscribeSetting data={data} setData={setData} />}
		</div>
	);
};

export default UnsubscribeRules;
