/* eslint-disable no-unreachable */
/* eslint-disable no-console */
import { useState, useContext, useEffect } from "react";
import styles from "./CustomTaskModal.module.scss";
import moment from "moment-timezone";
//components
import { Modal, Div } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";

import {
	ThemedButton,
	Label,
	Input,
	Select,
	InputTime,
	Toggle,
	Checkbox,
} from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	AtrManualEmail,
	Call,
	MessageOutline,
	Linkedin,
	Whatsapp,
	WhatsappGradient,
	Bell,
} from "@cadence-frontend/icons";

import {
	ACTIONS,
	REMINDER_TIME_OPTIONS,
	getUserDropdownByIntegration,
} from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { defaultPauseStateFields, defaultTime, formatDateTime } from "./constants";
import { useTasks } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import {
	People as PEOPLE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Notifications as NOTIFICATIONS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Colors } from "@cadence-frontend/utils";

const InputController = ({
	value,
	setValue,
	type,
	options,
	title,
	compulsory,
	name,
	showErrorMsg,
	titileColor,
	...rest
}) => {
	const renderInput = type => {
		switch (type) {
			case "select":
				return <Select value={value} setValue={setValue} options={options} {...rest} />;
			// case "date":
			// 	return (
			// 		<InputDate
			// 			value={value}
			// 			height="40px"
			// 			borderRadius="15px"
			// 			borderColor="#DADCE0"
			// 			setValue={setValue}
			// 		/>
			// 	);
			case "time":
				return (
					<InputTime
						input={value}
						name="time"
						setInput={setValue}
						theme="GREY"
						type="slider"
					/>
				);
			default:
				return (
					<Input
						type={type}
						value={value}
						setValue={setValue}
						theme={InputThemes.WHITE}
						name={name}
						{...rest}
					/>
				);
		}
	};
	return (
		<div className={type !== "time" ? styles.container : styles.containerSmall}>
			<Label
				className={styles.label}
				required={compulsory ? true : false}
				style={{
					color: titileColor,
				}}
			>
				{title}
			</Label>
			{renderInput(type)}
		</div>
	);
};

const CustomTaskModal = ({
	//types
	children,
	className,
	// isOpen,
	accountStatus,
	setAccountStatus,
	onCancel,
	onSave,
	header,
	lead,
	cadence,
	calendarDisplay,
	setCalendarDisplay,
	data,
	...props
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		addAgendaAsTask,
		employees,
		getCustomTask,
		getCustomTaskLoading,
		updateCustomTask,
		updateCustomTaskLoading,
	} = useTasks({
		employees: true,
	});

	const [selectedAction, setSelectedAction] = useState("");
	const [reminderData, setReminderData] = useState({
		reminderToggle: true,
		reminder_time: 10,
		send_reminder_email: 1,
	});
	const [eventName, setEventName] = useState("");
	const [salesPerson, setSalesPerson] = useState();
	const user = useRecoilValue(userInfo);
	// const [description, setDescription] = useState("");

	const [startTime, setStartTime] = useState(
		data?.event_id || data?.task_id
			? {}
			: {
					date: defaultPauseStateFields,
					time: defaultTime,
			  }
	);

	const [duration, setDuration] = useState();
	const durationMap = ["15 min", "30 min", "45 min", "60 min", "90 min"];
	const [error, setError] = useState(false);

	const [loading, setLoading] = useState(false);
	const [selectedFields, setSelectedFields] = useState({
		action: true,
		salesPerson: true,
		lead: true,
		cadence: true,
		eventName: true,
		duration: true,
		date: true,
		time: true,
		remindBefore: true,
	});

	const user_id = useRecoilValue(userInfo).user_id;

	const [allEmployees, setAllEmployees] = useState();

	useEffect(() => {
		if (!employees) return;

		setAllEmployees(
			employees.map(employee => ({
				value: employee.user_id,
				label: employee.first_name + " " + employee.last_name,
			}))
		);
	}, [employees]);

	useEffect(() => {
		setSalesPerson(user_id);
	}, []);

	const onClose = () => {
		setStartTime({ date: defaultPauseStateFields });
		setEventName("");
		setSelectedAction("");
		setDuration();
		setError(false);
		setLoading(false);
		props.onClose();
	};

	const handleSave = async () => {
		const { DD, MM, YYYY } = startTime.date;
		const time = startTime.time;

		let start_time;
		try {
			if (!DD || !MM || !YYYY || !time) throw new Error();
			start_time = Math.floor(
				moment(`${DD}${MM}${YYYY}${time}`, "DDMMYYYYHHmm").format("x")
			);
		} catch (err) {
			// addError("Please select a valid date and time");

			setSelectedFields({
				...selectedFields,
				date: false,
				time: false,
			});
		}

		setLoading(true);
		setError(false);

		if (
			!selectedAction ||
			selectedAction === "" ||
			!salesPerson ||
			salesPerson === "" ||
			(data?.task_id
				? data?.event_id && (eventName === "" || !eventName)
				: eventName === "" || !eventName) || // when modal is in editing mode then eventName is not received therefore eventName will always be "" because its not sent from server hence will result in failure of updation
			(data?.task_id
				? data?.event_id && (duration === "" || !duration)
				: duration === "" || !duration) ||
			!start_time ||
			start_time < moment().format("x") ||
			(reminderData.reminderToggle && !reminderData.reminder_time)
		) {
			setSelectedFields({
				action: !selectedAction || selectedAction === "" ? false : true,
				salesPerson: !salesPerson || salesPerson === "" ? false : true,
				lead: true,
				cadence: true,
				eventName: (
					data?.task_id
						? data?.event_id && (eventName === "" || !eventName)
						: eventName === "" || !eventName
				)
					? false
					: true,
				duration: (
					data?.task_id
						? data?.event_id && (duration === "" || !duration)
						: duration === "" || !duration
				)
					? false
					: true,
				date: !start_time || start_time < moment().format("x") ? false : true,
				time: !start_time || start_time < moment().format("x") ? false : true,
				remindBefore:
					reminderData.reminderToggle && !reminderData.reminder_time ? false : true,
			});
			setLoading(false);
			console.log("here");
			return;
		}

		const body = {
			user_id: salesPerson,
			event_name: eventName,
			name: selectedAction,
			duration: parseInt(duration.split(" ")[0]),
			lead_id: lead?.lead_id,
			start_time: start_time,
			instance_url: user?.instance_url,
		};
		if (cadence) {
			body.cadence_id = cadence?.cadence_id;
		}
		if (reminderData.reminderToggle) {
			body.reminder_time = reminderData.reminder_time;
			body.send_reminder_email = reminderData.send_reminder_email ? 1 : 0;
		} else {
			body.reminder_time = null;
		}

		if (data?.event_id || data?.task_id) {
			const updateApiBody = {
				task_id: data?.task_id,
				body: {
					event_id: data?.event_id,
					start_time: start_time,
					duration: parseInt(duration.split(" ")[0]),
					name: selectedAction,
					event_name: eventName,
					user_id: salesPerson,
				},
			};
			if (reminderData.reminderToggle) {
				updateApiBody.body.reminder_time = reminderData.reminder_time;
				updateApiBody.body.send_reminder_email = reminderData.send_reminder_email ? 1 : 0;
			} else {
				updateApiBody.body.reminder_time = null;
			}
			console.log("updateApiBody", updateApiBody);
			updateCustomTask(updateApiBody, {
				onError: err => {
					addError({
						text: err?.response?.data?.msg || "Error while updating custom task",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					setLoading(false);
				},
				onSuccess: res => {
					console.log(res.data);
					addSuccess("Task updated successfully");
					setLoading(false);
					onClose();
				},
			});
			return;
		}

		addAgendaAsTask(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg || "Error while creating custom task",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				setLoading(false);
			},
			onSuccess: res => {
				addSuccess("Task created");
				setLoading(false);
				onClose();
			},
		});
	};
	useEffect(() => {
		if (data) handleUpdateEventFlow(data?.event_id, data?.task_id);
	}, []);

	const handleUpdateEventFlow = (event_id, task_id) => {
		if (!task_id) {
			setTimeout(() => {
				onClose();
			}, 500);
			setTimeout(() => {
				addError({ text: "Custom task cannot be updated" });
			}, 800);

			return;
		}
		const body = {
			task_id: task_id,
		};

		if (event_id) {
			body.event_id = event_id;
		}

		getCustomTask(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg || "Error while fetching custom task",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				setLoading(false);
				onClose();
			},
			onSuccess: res => {
				setEventName(res?.data?.event_name);
				setSelectedAction(res?.data?.name);
				setDuration(`${res?.data?.duration} min`);
				setSalesPerson(res?.data?.user_id);
				setStartTime(formatDateTime(res?.data?.start_time));
				setReminderData({
					reminderToggle: res?.data?.reminder_time ? true : false,
					reminder_time: res?.data?.reminder_time,
					send_reminder_email: res?.data?.send_reminder_email,
				});
			},
		});
	};

	return (
		<Div
			loading={getCustomTaskLoading}
			className={`${styles.customTaskModal}  ${styles.overflowHide}   ${className ?? ""}`}
		>
			<h2 className={styles.header}>
				{TASKS_TRANSLATION.CREATE_REMINDER[user?.language?.toUpperCase()]}
			</h2>
			<div className={styles.bodyContainer}>
				<div className={styles.body}>
					<div>
						<Label
							className={styles.actionLabel}
							required
							style={{
								color: selectedFields.action === true ? "" : "red",
							}}
						>
							{TASKS_TRANSLATION.TASK_ACTION[user?.language?.toUpperCase()]}
						</Label>

						<div className={styles.taskActionContainer}>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.CALL ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.CALL)}
							>
								<Call />
								<p>{TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()]}</p>
							</div>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.MESSAGE ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.MESSAGE)}
							>
								<MessageOutline size="18px" />
								<p>{TASKS_TRANSLATION.SMS[user?.language?.toUpperCase()]}</p>
							</div>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.MAIL ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.MAIL)}
							>
								<AtrManualEmail />
								<p>{NOTIFICATIONS_TRANSLATION.MAIL[user?.language?.toUpperCase()]}</p>
							</div>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.LINKEDIN_CONNECTION ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.LINKEDIN_CONNECTION)}
							>
								<Linkedin size="24px" />
								<p>{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}</p>
							</div>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.WHATSAPP ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.WHATSAPP)}
							>
								{selectedAction === ACTIONS.WHATSAPP ? (
									<Whatsapp size="18px" color="#f5f6f7" />
								) : (
									<WhatsappGradient size="18px" />
								)}
								<p
								// style={{
								// 	color: selectedAction === ACTIONS.WHATSAPP ? "#f5f6f7" : "#5b6be1",
								// }}
								>
									Whatsapp
								</p>
							</div>
							<div
								className={`${styles.icon} ${
									selectedAction === ACTIONS.OTHER ? styles.active : ""
								}`}
								onClick={() => setSelectedAction(ACTIONS.OTHER)}
							>
								<p>{COMMON_TRANSLATION.OTHER[user?.language?.toUpperCase()]}</p>
							</div>
						</div>
					</div>
					{getUserDropdownByIntegration(user.integration_type) && (
						<div className={styles.salesPerson}>
							<InputController
								type="select"
								title={PEOPLE_TRANSLATION.USER_NAME[user?.language?.toUpperCase()]}
								value={salesPerson}
								setValue={setSalesPerson}
								placeholder="Select"
								titileColor={selectedFields.salesPerson ? "" : "red"}
								options={allEmployees}
								isSearchable
								numberOfOptionsVisible="8"
							/>
						</div>
					)}
					<div className={styles.timeInputs}>
						<InputController
							type="input"
							title={COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]}
							value={lead?.first_name + " " + lead?.last_name}
							disabled
							titileColor={selectedFields.lead ? "" : "red"}
							showErrorMsg={selectedFields.lead ? false : true}
						/>

						{cadence && (
							<InputController
								type="input"
								title={COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase()]}
								value={cadence?.name}
								disabled
								titileColor={selectedFields.cadence ? "" : "red"}
								showErrorMsg={selectedFields.cadence ? false : true}
							/>
						)}
					</div>
					{/* if not of event name and task id is present remove event name and duration */}
					{!(!data?.event_id && data?.task_id) && (
						<InputController
							type="input"
							title={COMMON_TRANSLATION.EVENT_NAME[user?.language?.toUpperCase()]}
							value={eventName}
							setValue={setEventName}
							compulsory={
								data?.event_id ? true : !data?.event_id && data?.task_id ? false : true
							}
							titileColor={selectedFields.eventName ? "" : "red"}
							showErrorMsg={selectedFields.eventName ? false : true}
						/>
					)}

					{!(!data?.event_id && data?.task_id) && (
						<>
							<Label
								className={styles.durLabel}
								required={
									data?.event_id ? true : !data?.event_id && data?.task_id ? false : true
								}
								style={{
									color: selectedFields.duration ? "" : "red",
								}}
							>
								{TASKS_TRANSLATION.DURATION_OF_EVENT[user?.language?.toUpperCase()]}
							</Label>
							<div>
								<div className={styles.duration}>
									{durationMap.map(dur => (
										<div
											key={dur}
											className={duration === dur ? styles.durActive : styles.dur}
											onClick={() => setDuration(dur)}
										>
											{dur}
										</div>
									))}
								</div>
							</div>
						</>
					)}

					<div>
						<div className={styles.timeInputs}>
							<InputController
								type="date"
								title={COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}
								value={startTime}
								compulsory={true}
								name="date"
								setValue={setStartTime}
								titileColor={selectedFields.date ? "" : "red"}
								showErrorMsg={selectedFields.date ? false : true}
								top
							/>

							<InputController
								type="time"
								title={COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]}
								value={startTime}
								compulsory={true}
								setValue={setStartTime}
								titileColor={selectedFields.time ? "" : "red"}
								showErrorMsg={selectedFields.time ? false : true}
							/>
						</div>
					</div>
					<div
						className={styles.reminderSettings}
						style={{ marginBottom: !reminderData.reminderToggle ? "0.8em" : "" }}
					>
						<div>
							<Label className={styles.reminderLabel} required>
								<Bell color={Colors.lightBlue} size="1rem" className={styles.bellIcon} />
								&nbsp;&nbsp;
								{TASKS_TRANSLATION.SEND_ME_A_REMINDER[user?.language?.toUpperCase()]}
							</Label>
							<div className={styles.reminderToggle}>
								<Toggle
									checked={reminderData.reminderToggle}
									onChange={() =>
										setReminderData(prev => ({
											...prev,
											reminderToggle: !prev.reminderToggle,
											// reminder_time: !prev.reminderToggle ? 10 : prev.reminder_time, // default value
											send_reminder_email: 1, // default value whenever switch is turned on
										}))
									}
									theme={"PURPLE"}
								/>
							</div>
						</div>
						{reminderData.reminderToggle && (
							<>
								<div className={styles.reminderToggle}>
									<InputController
										type="select"
										title={
											TASKS_TRANSLATION.REMIND_ME_BEFORE[user?.language?.toUpperCase()]
										}
										value={reminderData.reminder_time}
										setValue={val =>
											setReminderData(prev => ({ ...prev, reminder_time: val }))
										}
										placeholder="Select"
										titileColor={selectedFields.remindBefore ? "" : "red"}
										options={REMINDER_TIME_OPTIONS}
										isSearchable
										numberOfOptionsVisible="3"
										menuOnTop
									/>
								</div>
								<div className={styles.reminderEmailSettings}>
									<br />
									<Checkbox
										checked={reminderData.send_reminder_email}
										onChange={() =>
											setReminderData(prev => ({
												...prev,
												send_reminder_email: !prev.send_reminder_email,
											}))
										}
									/>
									&nbsp;&nbsp;&nbsp; Send me an email for the reminder
								</div>
							</>
						)}
					</div>
					{salesPerson !== user_id && (
						<div className={styles.message}>
							<p className={styles.astrix}>*</p>
							{lead?.salesforce_lead_id
								? COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]
								: lead?.salesforce_contact_id
								? COMMON_TRANSLATION.CONTACT[user?.language?.toUpperCase()]
								: COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]}{" "}
							{
								COMMON_TRANSLATION.OWNERSHIP_WILL_BE_REASSIGNED[
									user?.language?.toUpperCase()
								]
							}
						</div>
					)}
				</div>
			</div>
			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					className={styles.btnSave}
					onClick={handleSave}
					loading={loading}
				>
					{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
				<div
					className={styles.error}
					style={{
						display: error ? "" : "none",
						transition: "0.25s ease-in-out",
					}}
				>
					{
						COMMON_TRANSLATION.FILL_ALL_THE_REQUIRED_DETAILS[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
		</Div>
	);
};

export default CustomTaskModal;
