import { userInfo } from "@cadence-frontend/atoms";
import { Skeleton } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useActivityLogs } from "@cadence-frontend/data-access";
import { CopyBlank } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { capitalize, Colors } from "@cadence-frontend/utils";
import { Toggle } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./SmsActivities.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const SmsActivities = () => {
	const user = useRecoilValue(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);

	const {
		activityLogs: activityLogsData,
		activityLogsLoading,
		updateActivityLogs,
		updateLoading,
	} = useActivityLogs(true);

	const [activityLogs, setActivityLogs] = useState({
		SMS: {
			enabled: false,
		},
	});

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
				onSuccess: res => addSuccess("SMS logs updated"),
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

	useEffect(() => {
		if (activityLogsData) setActivityLogs(activityLogsData);
	}, [activityLogsData]);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.SMS_ACTIVITES}>
			<div className={styles.title}>
				<h2>{SETTINGS_TRANSLATION.SMS_ACTIVITIES[user?.language?.toUpperCase()]}</h2>
				<p>{SETTINGS_TRANSLATION.SETUP_SMS_ACTIVITIES[user?.language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.syncSms}>
					<div>
						{SETTINGS_TRANSLATION.SYNC_YOUR_SMS_ACTIVITIES[user?.language?.toUpperCase()]}{" "}
						{capitalize(user.integration_type.replace("_", " "))}
					</div>
					{activityLogsLoading ? (
						<Skeleton style={{ width: "40px", height: "25px" }} />
					) : (
						<Toggle
							name="SMS"
							checked={activityLogs.SMS.enabled}
							onChange={e => onChange(e, "SMS")}
							theme="PURPLE"
						/>
					)}
				</div>

				<div className={styles.smsHelp}>
					<div>
						<p>
							{
								SETTINGS_TRANSLATION.KINDLY_VISIT_RINGOVER_DASHBOARD[
									user?.language?.toUpperCase()
								]
							}
						</p>
						<span>Developer {">"} Webhooks</span>
					</div>
					<div>
						<p>
							{COMMON_TRANSLATION.ADD_LINK_IN_SMS_RECEIVED[user?.language?.toUpperCase()]}
						</p>
						<div>
							https://cadence-api.ringover.com/call/v2/ringover/message/webhooks/received
							<CopyBlank
								size={18}
								color={Colors.lightBlue}
								onClick={() => {
									addSuccess("Copied to clipboard!");
									navigator.clipboard.writeText(
										"https://cadence-api.ringover.com/call/v2/ringover/message/webhooks/received"
									);
								}}
							/>
						</div>
					</div>
					<div>
						<p className={styles.lower}>
							{COMMON_TRANSLATION.ADD_LINK_IN_SMS_SENT[user?.language?.toUpperCase()]}
						</p>
						<div>
							https://cadence-api.ringover.com/call/v2/ringover/message/webhooks/sent
							<CopyBlank
								size={18}
								color={Colors.lightBlue}
								onClick={() => {
									addSuccess("Copied to clipboard!");
									navigator.clipboard.writeText(
										"https://cadence-api.ringover.com/call/v2/ringover/message/webhooks/sent"
									);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SmsActivities;
