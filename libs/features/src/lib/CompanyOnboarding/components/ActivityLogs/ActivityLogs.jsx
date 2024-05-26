import { useActivityLogs, usePhoneSystem } from "@cadence-frontend/data-access";
import { CopyBlank, ProgressClock } from "@cadence-frontend/icons";
import { capitalize, Colors } from "@cadence-frontend/utils";
import { Skeleton, Spinner } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputRadio, Toggle } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import styles from "./ActivityLogs.module.scss";
import { PHONE_OPTIONS, SYNC_DISABLED_INTEGRATIONS } from "./constants";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { useIntegrationTranslations } from "@cadence-frontend/languages";
import { INTEGRATION_TYPE, PHONE_INTEGRATIONS } from "@cadence-frontend/constants";

const getLOG_TYPES = TRANSLATIONS => {
	const LOGS_TYPES = {};
	LOGS_TYPES.CALENDAR = TRANSLATIONS.SYNC_YOUR_CALENDAR_ACTIVITIES;
	LOGS_TYPES.MAIL = TRANSLATIONS.SYNC_YOUR_EMAIL_ACTIVITIES;
	LOGS_TYPES.NOTE = TRANSLATIONS.SYNC_YOUR_NOTE_ACTIVITIES;
	return LOGS_TYPES;
};

const getNoteDoc = (user, TRANSLATIONS) => {
	switch (user.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<>
					{/* <p>{TRANSLATIONS.LOG_NOTE_ACTIVITIES[user?.language?.toUpperCase()]}</p> */}
					<div className={styles.helpLinks}>
						<a
							href={
								user?.language === "english"
									? "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044321-salesforce-onboarding"
									: "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044321-int%C3%A9gration-salesforce"
							}
							target="_blank"
							rel="noreferrer"
						>
							{
								SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
									user?.language?.toUpperCase()
								]
							}
						</a>
						<a
							href="https://www.loom.com/share/abcc7018b64b45caa9e435e915827f3b"
							target="_blank"
							rel="noreferrer"
						>
							{COMMON_TRANSLATION.WATCH_VIDEO[user?.language?.toUpperCase()]}
						</a>
					</div>
				</>
			);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <p>{TRANSLATIONS.LOG_NOTE_ACTIVITIES[user?.language?.toUpperCase()]}</p>;
		default:
			return "";
	}
};

const getSmsDoc = (user, TRANSLATIONS) => {
	switch (user.integration_type) {
		case INTEGRATION_TYPE.PIPEDRIVE:
			return (
				<p>
					{
						TRANSLATIONS.ENSURE_YOU_HAVE_GLOBAL_ACCESS_IN_PIPEDRIVE[
							user?.language?.toUpperCase()
						]
					}
				</p>
			);
		default:
			return "";
	}
};

const ActivityLogs = ({ type, postDataRef }) => {
	const save = ({ cb }) => {
		if (typeof cb === "function") cb();
	};
	const user = useRecoilValue(userInfo);
	const TRANSLATIONS = useIntegrationTranslations(user?.integration_type);
	const LOG_TYPES = getLOG_TYPES(TRANSLATIONS);

	useEffect(() => {
		postDataRef.current = save;
	}, []);

	const {
		activityLogs: activityLogsData,
		activityLogsLoading,
		updateActivityLogs,
		updateLoading,
	} = useActivityLogs(true);
	const { phone_system, updatePhoneSystem } = usePhoneSystem();

	const { addSuccess, addError } = useContext(MessageContext);

	const [activityLogs, setActivityLogs] = useState({
		CALENDAR: {
			enabled: true,
		},
		CALL: {
			enabled: false,
		},
		MAIL: {
			enabled: true,
		},
		NOTE: {
			enabled: true,
		},
		SMS: {
			enabled: false,
		},
	});
	const [phoneSystem, setPhoneSystem] = useState(PHONE_INTEGRATIONS.RINGOVER);

	useEffect(() => {
		if (phone_system) setPhoneSystem(phone_system);
	}, [phone_system]);

	useEffect(() => {
		if (
			!activityLogsData?.CALENDAR?.enabled &&
			!activityLogsData?.CALL?.enabled &&
			!activityLogsData?.MAIL?.enabled &&
			!activityLogsData?.NOTE?.enabled &&
			!activityLogsData?.SMS?.enabled
		) {
			const autoUpdateData = {
				CALENDAR: {
					enabled: true,
				},
				CALL: {
					enabled: true,
				},
				MAIL: {
					enabled: true,
				},
				NOTE: {
					enabled: true,
				},
				SMS: {
					enabled: true,
				},
			};

			setActivityLogs(autoUpdateData);
			updateActivityLogs(autoUpdateData, {
				onSuccess: res => addSuccess(res.msg || "Activity logs updated successfully"),
				onError: err => {
					addError({
						text: err.response.data.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					setActivityLogs({
						CALENDAR: {
							enabled: false,
						},
						CALL: {
							enabled: false,
						},
						MAIL: {
							enabled: false,
						},
						NOTE: {
							enabled: false,
						},
						SMS: {
							enabled: false,
						},
					});
				},
			});
		} else {
			setActivityLogs(activityLogsData);
		}
	}, [activityLogsData]);

	const handlePhoneSystemSelect = value => {
		setPhoneSystem(value);
		const body = {
			phone_system: value,
		};
		updatePhoneSystem(body, {
			onSuccess: () => {
				addSuccess("Phone system updated");
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

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
						desc: err?.response?.data?.error ?? "Please contact support",
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
		<div className={styles.activityLogs}>
			<div className={styles.inputBlock}>
				<div className={styles.heading}>
					{type === "onboarding" ? (
						<>
							<span className={styles.icon}>
								<ProgressClock />
							</span>{" "}
							{capitalize(user?.integration_type)}{" "}
							{COMMON_TRANSLATION.ACTIVITY_SYNC[user?.language?.toUpperCase()]}
						</>
					) : (
						<>
							<span className={styles.icon}>
								<ProgressClock />
							</span>
							{TRANSLATIONS.LOG_ACTIVITIES[user?.language?.toUpperCase()]}
						</>
					)}{" "}
					{updateLoading && <Spinner className={styles.loader} />}
				</div>
				<div className={styles.subheading}>
					{type === "onboarding"
						? TRANSLATIONS.SYNC_YOUR_CADENCE_ACTIVITIES_WITH[
								user?.language?.toUpperCase()
						  ]
						: TRANSLATIONS.LOG_YOUR_CADENCE_ACTIVITIES_WITH[
								user?.language?.toUpperCase()
						  ]}
				</div>
			</div>
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
			{type === "onboarding" && (
				<>
					<div className={`${styles.inputBlock} ${styles.phoneSystem}`}>
						<div className={styles.heading}>
							{COMMON_TRANSLATION.PHONE_SYSTEM[user?.language?.toUpperCase()]}
						</div>
						<div className={styles.subheading}>
							{
								SETTINGS_TRANSLATION.SELECT_PHONE_SYSTEM_USED_TO_PLACE_CALLS[
									user?.language?.toUpperCase()
								]
							}
						</div>
					</div>
					<p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
						{SETTINGS_TRANSLATION.SELECT_YOUR_PHONE_SYSTEM[user?.language?.toUpperCase()]}
					</p>
					<div className={styles.phoneOptions}>
						{PHONE_OPTIONS.map(opt => (
							<div className={styles.radioBox}>
								<div>
									<InputRadio
										checked={phoneSystem === opt.value}
										onChange={() => handlePhoneSystemSelect(opt.value)}
									/>{" "}
									{opt.label[user?.language?.toUpperCase()]}
								</div>
							</div>
						))}
					</div>
					{/* {user?.integration_type === INTEGRATION_TYPE.SELLSY && (
						<div className={styles.inputBox}>
							<div>
								<span>
									{
										SETTINGS_TRANSLATION.SYNC_YOUR_CALL_ACTIVITIES[
											user?.language?.toUpperCase()
										]
									}{" "}
									{capitalize(user?.integration_type)}
								</span>
								<br></br>
							</div>
							{activityLogsLoading ? (
								<Skeleton style={{ width: "40px", height: "25px" }} />
							) : (
								<div>
									<Toggle
										name={"CALL"}
										checked={activityLogs.CALL.enabled}
										onChange={e => onChange(e, "CALL")}
										theme="PURPLE"
									/>
								</div>
							)}
						</div>
					)} */}
					{phoneSystem !== PHONE_INTEGRATIONS.NONE &&
						!SYNC_DISABLED_INTEGRATIONS.includes(user?.integration_type) && (
							<div className={styles.inputBox}>
								<div>
									<span>
										{
											SETTINGS_TRANSLATION.SYNC_YOUR_SMS_ACTIVITIES[
												user?.language?.toUpperCase()
											]
										}{" "}
										{capitalize(user?.integration_type)}
									</span>
									<br></br>
									{getSmsDoc(user, TRANSLATIONS)}
								</div>
								{activityLogsLoading ? (
									<Skeleton style={{ width: "40px", height: "25px" }} />
								) : (
									<div>
										<Toggle
											name={"SMS"}
											checked={activityLogs.SMS.enabled}
											onChange={e => onChange(e, "SMS")}
											theme="PURPLE"
										/>
									</div>
								)}
							</div>
						)}
					{phoneSystem !== PHONE_INTEGRATIONS.NONE && (
						<div className={styles.smsHelp}>
							<p>
								{
									SETTINGS_TRANSLATION.KINDLY_VISIT_RINGOVER_DASHBOARD[
										user?.language?.toUpperCase()
									]
								}
							</p>
							<div>
								<span>
									{
										COMMON_TRANSLATION.ADD_LINK_IN_SMS_RECEIVED[
											user?.language?.toUpperCase()
										]
									}
								</span>
								<span>
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
								</span>
							</div>
							<div>
								<span>
									{COMMON_TRANSLATION.ADD_LINK_IN_SMS_SENT[user?.language?.toUpperCase()]}
								</span>
								<span>
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
								</span>
							</div>
							<div className={styles.docsLink}>
								<a
									href={
										"https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000090539"
									}
									target="_blank"
									rel="noreferrer"
								>
									{
										SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
											user?.language?.toUpperCase()
										]
									}
								</a>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ActivityLogs;
