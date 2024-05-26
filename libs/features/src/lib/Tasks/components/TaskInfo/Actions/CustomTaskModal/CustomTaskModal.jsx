/* eslint-disable no-unreachable */
/* eslint-disable no-console */
import { useState, useContext, useEffect } from "react";
import styles from "./CustomTaskModal.module.scss";
import moment from "moment";
//components
import { Modal } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";

import { ThemedButton, Label, Input, Select, InputTime } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	AtrManualEmail,
	Call,
	Linkedin,
	Whatsapp,
	MessageGradient2,
	WhatsappGradient,
	LinkedinGradient,
	AtrAutoEmailGradient,
	Message,
	MailGradient,
	CallGradient,
} from "@cadence-frontend/icons";

import { ACTIONS } from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { defaultPauseStateFields, defaultTime } from "./constants";
import { useTasks } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import {
	Common as COMMON_TRANSLATION,
	Notifications as NOTIFICATIONS_TRANSLATION,
	People as PEOPLE_TRANSLATION,
} from "@cadence-frontend/languages";

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
	children,
	className,
	isOpen,
	accountStatus,
	setAccountStatus,
	onCancel,
	onSave,
	header,
	lead,
	cadence,
	calendarDisplay,
	setCalendarDisplay,
	...props
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const { addAgendaAsTask, employees } = useTasks({ employees: isOpen });

	const [selectedAction, setSelectedAction] = useState("");
	const [eventName, setEventName] = useState("");
	const [salesPerson, setSalesPerson] = useState();
	const user = useRecoilValue(userInfo);

	// const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState({
		date: defaultPauseStateFields,
		time: defaultTime,
	});
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
	}, [isOpen]);

	// const handleSave = () => {
	// 	setAccountStatus(currStep);
	// 	onClose();
	// };

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

		let start_time, pause_for;
		try {
			if (!DD || !MM || !YYYY || !time) throw new Error();
			start_time = Math.floor(
				moment(`${DD}${MM}${YYYY}${time}`, "DDMMYYYYHHmm").local().format("x")
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
		// return;
		setError(false);

		if (
			!selectedAction ||
			selectedAction === "" ||
			!salesPerson ||
			salesPerson === "" ||
			eventName === "" ||
			!eventName ||
			duration === "" ||
			!duration ||
			!start_time ||
			start_time < moment().local().format("x")
		) {
			setSelectedFields({
				action: !selectedAction || selectedAction === "" ? false : true,
				salesPerson: !salesPerson || salesPerson === "" ? false : true,
				lead: true,
				cadence: true,
				eventName: eventName === "" || !eventName ? false : true,
				duration: duration === "" || !duration ? false : true,
				date: !start_time || start_time < moment().local().format("x") ? false : true,
				time: !start_time || start_time < moment().local().format("x") ? false : true,
			});
			setLoading(false);
			return;
		}

		// const pause_for = moment(`${resumeDate}T${resumeTime}:00`).local().valueOf();

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
		addAgendaAsTask(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg || "Error while creating custom task",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				setLoading(false);
			},
			onSuccess: res => {
				addSuccess(res?.data?.msg || "Created task and stopped cadence successfully.");
				setLoading(false);
				onClose();
			},
		});
	};

	const closeModal = () => {
		onClose();
		setError(false);
	};
	return (
		<Modal
			isModal={isOpen}
			onClose={closeModal}
			showCloseButton={true}
			className={`${styles.customTaskModal} ${className ?? ""}`}
		>
			<h2 className={styles.header}>
				{TASKS_TRANSLATION.CUSTOM_TASK_CREATION[user?.language?.toUpperCase()]}
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

						<div>
							<div
								className={
									selectedAction === ACTIONS.CALL ? styles.iconActive : styles.icon
								}
								onClick={() => setSelectedAction(ACTIONS.CALL)}
							>
								{selectedAction === ACTIONS.CALL ? (
									<Call size="18px" color="#f5f6f7" />
								) : (
									<CallGradient size="18px" />
								)}
								<p
									style={{
										color: selectedAction === ACTIONS.CALL ? "#f5f6f7" : "#5b6be1",
									}}
								>
									{TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()]}
								</p>
							</div>
							<div
								className={
									selectedAction === ACTIONS.MESSAGE ? styles.iconActive : styles.icon
								}
								onClick={() => setSelectedAction(ACTIONS.MESSAGE)}
							>
								{selectedAction === ACTIONS.MESSAGE ? (
									<Message size="18px" color="#f5f6f7" />
								) : (
									<MessageGradient2 size="18px" />
								)}
								<p
									style={{
										color: selectedAction === ACTIONS.MESSAGE ? "#f5f6f7" : "#5b6be1",
									}}
								>
									{TASKS_TRANSLATION.SMS[user?.language?.toUpperCase()]}
								</p>
							</div>
							<div
								className={
									selectedAction === ACTIONS.MAIL ? styles.iconActive : styles.icon
								}
								onClick={() => setSelectedAction(ACTIONS.MAIL)}
							>
								{selectedAction === ACTIONS.MAIL ? (
									<AtrManualEmail size="18px" color="#f5f6f7" />
								) : (
									<MailGradient size="18px" />
								)}
								<p
									style={{
										color: selectedAction === ACTIONS.MAIL ? "#f5f6f7" : "#5b6be1",
										textTransform: "capitalize",
									}}
								>
									{NOTIFICATIONS_TRANSLATION.MAIL[user?.language?.toUpperCase()]}
								</p>
							</div>
							<div
								className={
									selectedAction === ACTIONS.LINKEDIN_CONNECTION
										? styles.iconActive
										: styles.icon
								}
								onClick={() => setSelectedAction(ACTIONS.LINKEDIN_CONNECTION)}
							>
								{selectedAction === ACTIONS.LINKEDIN_CONNECTION ? (
									<Linkedin size="21px" color="#f5f6f7" />
								) : (
									<LinkedinGradient size="18px" />
								)}
								<p
									style={{
										color:
											selectedAction === ACTIONS.LINKEDIN_CONNECTION
												? "#f5f6f7"
												: "#5b6be1",
										textTransform: "capitalize",
									}}
								>
									{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}
								</p>
							</div>
							<div
								className={
									selectedAction === ACTIONS.WHATSAPP ? styles.iconActive : styles.icon
								}
								onClick={() => setSelectedAction(ACTIONS.WHATSAPP)}
							>
								{selectedAction === ACTIONS.WHATSAPP ? (
									<Whatsapp size="18px" color="#f5f6f7" />
								) : (
									<WhatsappGradient size="18px" />
								)}
								<p
									style={{
										color: selectedAction === ACTIONS.WHATSAPP ? "#f5f6f7" : "#5b6be1",
									}}
								>
									Whatsapp
								</p>
							</div>
						</div>
						{/* <div
							className={styles.errorMsg}
							style={{
								display: selectedFields.action ? "none" : "flex",
								// color: "red",
								// justifyContent: "left",
								// width: "100%",
							}}
						>
							Please select an Action
						</div> */}
					</div>

					<div className={styles.salesPerson}>
						{/* <div
					styles={{
						width: "100%",
					}}
				> */}
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

						{/* <div
							className={styles.errorMsg}
							style={{
								display: selectedFields.salesPerson ? "none" : "flex",
							}}
						>
							This field is Required.
						</div> */}
					</div>

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
					<InputController
						type="input"
						title={COMMON_TRANSLATION.EVENT_NAME[user?.language?.toUpperCase()]}
						value={eventName}
						setValue={setEventName}
						compulsory={true}
						titileColor={selectedFields.eventName ? "" : "red"}
						showErrorMsg={selectedFields.eventName ? false : true}
					/>

					<Label
						className={styles.durLabel}
						required
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
						{/* <div
							className={styles.errorMsg}
							style={{
								display: selectedFields.duration ? "none" : "flex",
							}}
						>
							This field is Required.
						</div> */}
					</div>
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

						{/* <span
							className={styles.errorMsg}
							style={{
								display: selectedFields.time && selectedFields.date ? "none" : "flex",
								color: "red",
								justifyContent: "left",
								width: "100%",
								marginTop: "0",
							}}
						>
							Please provide a valid date and time for future.
						</span> */}
					</div>
					{salesPerson !== user_id && (
						<div className={styles.message}>
							<p className={styles.astrix}>*</p>
							{lead?.salesforce_lead_id
								? COMMON_TRANSLATION.LEAD[user?.language?.toUpperCase()]
								: lead?.salesforce_contact_id
								? COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase()]
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
		</Modal>
	);
};

export default CustomTaskModal;
