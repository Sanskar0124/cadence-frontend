import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { PHONE_INTEGRATIONS, INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useActivityLogs, usePhoneSystem } from "@cadence-frontend/data-access";
import { CopyBlank, Phone } from "@cadence-frontend/icons";
import { capitalize, Colors } from "@cadence-frontend/utils";

import { Skeleton } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { InputRadio, Toggle } from "@cadence-frontend/widgets";

import { PHONE_OPTIONS, SYNC_DISABLED_INTEGRATIONS } from "./constants";

import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";

import styles from "./PhoneSystem.module.scss";

const PhoneSystem = ({ showSmsActivityLogs = false }) => {
	const [user, setUser] = useRecoilState(userInfo);
	const {
		activityLogs: activityLogsData,
		activityLogsLoading,
		updateActivityLogs,
		updateLoading,
	} = useActivityLogs(showSmsActivityLogs);
	const { phone_system, updatePhoneSystem } = usePhoneSystem();

	const { addSuccess, addError } = useContext(MessageContext);

	const [activityLogs, setActivityLogs] = useState({
		SMS: {
			enabled: false,
		},
		CALL: {
			enabled: false,
		},
	});
	const [phoneSystem, setPhoneSystem] = useState(PHONE_INTEGRATIONS.RINGOVER);
	const [confirmModal, setConfirmModal] = useState(false);

	useEffect(() => {
		if (phone_system) setPhoneSystem(phone_system);
	}, [phone_system]);

	useEffect(() => {
		if (activityLogsData) {
			setActivityLogs(activityLogsData);
		}
	}, [activityLogsData]);

	const updatePhoneSystemCb = value => {
		setPhoneSystem(value);

		const body = {
			phone_system: value,
		};

		updatePhoneSystem(body, {
			onSuccess: () => {
				addSuccess("Phone system updated");
				setUser(prev => ({ ...prev, phone_system: value }));
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

	const handlePhoneSystemSelect = value => {
		setConfirmModal(value);
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
				onSuccess: res => addSuccess(` ${type} logs updated`),
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
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
		<div className={styles.phoneSystem}>
			<div className={styles.inputBlock}>
				<div className={styles.heading}>
					<div className={styles.icon}>
						<Phone size="18px" />
					</div>
					{SETTINGS_TRANSLATION.SELECT_YOUR_PHONE_SYSTEM[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.subheading}>
					{
						SETTINGS_TRANSLATION.SELECT_PHONE_SYSTEM_USED_TO_PLACE_CALLS[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
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
							{capitalize(user.integration_type)}
						</span>
					</div>
					{activityLogsLoading ? (
						<Skeleton style={{ width: "40px", height: "25px" }} />
					) : (
						<div>
							<Toggle
								name="CALL"
								checked={activityLogs.CALL.enabled}
								onChange={e => onChange(e, "CALL")}
								theme="PURPLE"
							/>
						</div>
					)}
				</div>
			)} */}
			{phoneSystem !== PHONE_INTEGRATIONS.NONE &&
				user?.integration_type !== INTEGRATION_TYPE.SELLSY && (
					<>
						{showSmsActivityLogs &&
							!SYNC_DISABLED_INTEGRATIONS.includes(user?.integration_type) && (
								<div className={styles.inputBox}>
									<div>
										<span>
											{
												SETTINGS_TRANSLATION.SYNC_YOUR_SMS_ACTIVITIES[
													user?.language?.toUpperCase()
												]
											}{" "}
											{capitalize(user.integration_type)}
										</span>
									</div>
									{activityLogsLoading ? (
										<Skeleton style={{ width: "40px", height: "25px" }} />
									) : (
										<div>
											<Toggle
												name="SMS"
												checked={activityLogs.SMS.enabled}
												onChange={e => onChange(e, "SMS")}
												theme="PURPLE"
											/>
										</div>
									)}
								</div>
							)}
						<div className={styles.smsHelp}>
							<p>
								{
									SETTINGS_TRANSLATION.KINDLY_VISIT_RINGOVER_DASHBOARD[
										user?.language?.toUpperCase()
									]
								}
							</p>
							<div>
								<p>
									{
										COMMON_TRANSLATION.ADD_LINK_IN_SMS_RECEIVED[
											user?.language?.toUpperCase()
										]
									}
								</p>
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
								<p className={styles.lower}>
									{COMMON_TRANSLATION.ADD_LINK_IN_SMS_SENT[user?.language?.toUpperCase()]}
								</p>
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
						</div>
					</>
				)}
			<ConfirmationModal
				modal={confirmModal}
				setModal={setConfirmModal}
				onConfirm={updatePhoneSystemCb}
			/>
		</div>
	);
};

export default PhoneSystem;
