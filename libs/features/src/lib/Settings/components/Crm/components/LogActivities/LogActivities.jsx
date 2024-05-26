import styles from "./LogActivities.module.scss";
import { useActivityLogs, usePhoneSystem } from "@cadence-frontend/data-access";
import { CopyBlank, ProgressClock } from "@cadence-frontend/icons";
import { capitalize, Colors } from "@cadence-frontend/utils";
import { Skeleton, Spinner } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputRadio, Toggle } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import {
	getLOG_TYPES,
	getNoteDoc,
	PHONE_OPTIONS,
	SYNC_DISABLED_INTEGRATIONS,
} from "./constants";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useIntegrationTranslations } from "@cadence-frontend/languages";
import { INTEGRATION_TYPE, PHONE_INTEGRATIONS } from "@cadence-frontend/constants";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const LogActivities = () => {
	const { addSuccess, addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const TRANSLATIONS = useIntegrationTranslations(user?.integration_type);
	const LOG_TYPES = getLOG_TYPES(TRANSLATIONS);

	const [activityLogs, setActivityLogs] = useState({
		MAIL: {
			enabled: true,
		},
		CALENDAR: {
			enabled: true,
		},
		NOTE: {
			enabled: true,
		},
	});

	const {
		activityLogs: activityLogsData,
		activityLogsLoading,
		updateActivityLogs,
		updateLoading,
	} = useActivityLogs(true);

	useEffect(() => {
		if (activityLogsData) setActivityLogs(activityLogsData);
	}, [activityLogsData]);

	const onChange = (e, type) => {
		if (!updateLoading) {
			let updatedData = {
				...activityLogs,
				[type]: {
					enabled: e.target.checked,
				},
			};
			setActivityLogs(updatedData);
			updateActivityLogs(updatedData, {
				onSuccess: res => addSuccess(res.msg || "Activity logs updated successfully"),
				onError: err => {
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					//reverting back the toggle
					setActivityLogs(prev => ({
						...prev,
						[type]: {
							enabled: !prev[type].enabled,
						},
					}));
				},
			});
		}
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.LOG_ACTIVITIES}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.LOG_ACTIVITIES[user?.language?.toUpperCase()]}</h2>
				<p>
					{TRANSLATIONS.LOG_YOUR_CADENCE_ACTIVITIES_WITH[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.settings}>
				{Object.keys(LOG_TYPES).map(logType => (
					<div className={styles.inputBox}>
						<div>
							<span>{LOG_TYPES[logType][user?.language?.toUpperCase()]}</span>
							{logType === "NOTE" && getNoteDoc(user, TRANSLATIONS)}
						</div>
						{activityLogsLoading ? (
							<Skeleton style={{ width: "40px", height: "25px" }} />
						) : (
							<div>
								<Toggle
									name={logType}
									checked={activityLogs[logType].enabled}
									onChange={e => onChange(e, logType)}
									theme="PURPLE"
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default LogActivities;
