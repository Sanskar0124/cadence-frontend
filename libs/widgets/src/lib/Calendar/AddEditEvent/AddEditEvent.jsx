import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import { Calendar, CopyBlank } from "@cadence-frontend/icons";
import { MessageContext } from "@cadence-frontend/contexts";
import { getMeetOptions } from "../utils/constants";
import { useCalendar, useCalendarSettings } from "@cadence-frontend/data-access";
import {
	ThemedButton,
	Input,
	Label,
	Select,
	BackButton,
} from "@cadence-frontend/widgets";
import { generateVideoLink, calculateTimeSlots, parseTime } from "../utils/helper";
import { Tooltip, ErrorBoundary, Modal } from "@cadence-frontend/components";
import { DurationPlaceholder, SlotsPlaceholder } from "../Placeholder/Placeholder";

import styles from "./AddEditEvent.module.scss";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const EDIT = "edit";
const DEMO = "demo";
const CALL = "call";

const MEETING_DURATION = [15, 30, 45, 60];

const AddEditEvent = ({
	addEditEvent,
	closeAddEditEvent,
	lead,
	onClose,
	filter = false,
	refetchEvents = () => null,
}) => {
	const user = useRecoilValue(userInfo);
	const { data, date, type, events } = addEditEvent;
	const { addEvent, editEvent, addEditLoading, getFilteredEvents } = useCalendar({
		enabled: true,
	});
	const { calendarSettings, calendarSettingsLoader } = useCalendarSettings();
	const { addError, addSuccess } = useContext(MessageContext);

	//Events on selected date
	const eventsToday = events.map(e => ({
		name: e.props?.name,
		startTime: e.props?.startTime.format("HH:mm"),
		endTime: e.props?.endTime.format("HH:mm"),
		desc: e.props?.description || "No description",
		link: e.props?.hangoutLink || e.props?.location || "No link",
	}));

	//confirm modal state
	const [isConfirm, setIsConfirm] = useState(false);
	const [eventDetails, setEventDetails] = useState(false);

	const [input, setInput] = useState({
		title: data ? data.title : `Ringover meeting - ${lead.first_name} ${lead.last_name}`,
		finalTitle: "",
		startTime: data ? data.startTime : "",
		endTime: data ? data.endTime : "",
		date: {
			DD: moment(date).format("DD"),
			MM: moment(date).format("MM"),
			YYYY: moment(date).format("YYYY"),
		},
		meet: getMeetOptions(user.mail_integration_type)[0]?.value,
		ringoverMeetLink: data?.ringoverMeetLink ? data?.ringoverMeetLink : "",
	});

	const [durationActive, setDurationActive] = useState(
		type === EDIT ? data.endTime - data.startTime : null
	);
	const [timeSlots, setTimeSlots] = useState([]);

	useEffect(() => {
		//slots is an array of time slots between working hours depending upon duration selected by the user.
		if (calendarSettings) {
			const slots = calculateTimeSlots(
				parseTime(calendarSettings.start_hour), //starting time of slots
				parseTime(calendarSettings.end_hour), //ending time of slots
				parseInt(durationActive)
			);

			setTimeSlots(
				slots.map(slot => {
					const value = {
						startTime: slot.startTime,
						endTime: slot.endTime,
					};
					eventsToday.forEach(e => {
						//Disabled if there is a event in the slot time
						for (let i = parseTime(e.startTime); i <= parseTime(e.endTime); i++) {
							if (i > parseTime(slot.startTime) && i < parseTime(slot.endTime)) {
								value.event = e;
							}
						}
					});
					return value;
				})
			);
		}
	}, [durationActive, calendarSettings]);

	const setTime = time => {
		setInput(prev => ({
			...prev,
			startTime: time.startTime,
			endTime: time.endTime,
		}));
	};

	const confirmEvent = () => {
		if (!input.title) {
			addError({ text: "Enter a Title" });
			return;
		}
		if (!input.startTime || !input.endTime) {
			addError({ text: "Select a slot" });
			return;
		}
		let finalTitle;
		if (type !== EDIT) {
			finalTitle = input.title
				.replace("{{fullName}}", `${lead.first_name} ${lead.last_name}`)
				.replace("{{firstName}}", `${lead.first_name}`)
				.replace("{{lastName}}", `${lead.last_name}`);
		} else {
			finalTitle = input.title;
		}

		let ringoverMeetLink = "";
		if (lead.first_name && input.meet === "ringover") {
			ringoverMeetLink = generateVideoLink(lead);
		}
		setInput(prev => ({
			...prev,
			finalTitle,
			ringoverMeetLink,
		}));
		setIsConfirm(true);
	};

	const sendCalendarInvite = async () => {
		const parsedDate = moment(
			`${input.date.DD}/${input.date.MM}/${input.date.YYYY}`,
			"DD/MM/YYYY"
		);
		const start = moment(parsedDate)
			.set({
				hour: input.startTime.slice(0, 2),
				minute: input.startTime.slice(3, 5),
			})
			.format("x");

		const end = moment(parsedDate)
			.set({
				hour: input.endTime.slice(0, 2),
				minute: input.endTime.slice(3, 5),
			})
			.format("x");

		if (type === EDIT) {
			const body = {
				details: {
					startTime: parseInt(start),
					endTime: parseInt(end),
					conferenceName: input.finalTitle,
					lead_id: parseInt(lead.lead_id),
				},
				eventId: data?.id,
			};
			editEvent(body, {
				onSuccess: () => {
					addSuccess("Event saved");
					if (!filter) refetchEvents();
					else
						getFilteredEvents({
							offset: "pivot",
							timeFrame: "month",
							lead_only: "true",
							date: parseInt(moment().utc().format("x")),
						});
					onClose();
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		} else {
			const body = {
				startTime: parseInt(start),
				endTime: parseInt(end),
				conferenceName: input.finalTitle,
				meetType: input.meet,
				lead_id: lead.lead_id,
				ringoverMeetLink: input.ringoverMeetLink,
			};
			if (body.ringoverMeetLink === "") delete body.ringoverMeetLink;
			addEvent(body, {
				onSuccess: () => {
					addSuccess("Event created");
					closeAddEditEvent();
					if (!filter) refetchEvents();
					else
						getFilteredEvents({
							offset: "pivot",
							timeFrame: "month",
							lead_only: "true",
							date: parseInt(moment().utc().format("x")),
						});
					onClose();
				},

				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		}
	};
	// console.log(timeSlots)

	return (
		<ErrorBoundary>
			<div className={`${styles.addEditEvent} ${addEditEvent && styles.open}`}>
				{type !== EDIT && (
					<BackButton className={styles.back} onClick={closeAddEditEvent} />
				)}
				<div className={styles.header}>
					<div className={styles.pageHeading}>
						{type === CALL &&
							TASKS_TRANSLATION.BOOK_A_CALL[user?.language?.toUpperCase()]}
						{type === DEMO &&
							TASKS_TRANSLATION.BOOK_A_DEMO[user?.language?.toUpperCase()]}
						{type === EDIT && data?.title}
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.box}>
						<div className={styles.inputBox}>
							<Label required>
								{COMMON_TRANSLATION.TITLE[user?.language?.toUpperCase()]}
							</Label>
							<Input
								name="title"
								value={input}
								setValue={setInput}
								placeholder={COMMON_TRANSLATION.TYPE_HERE[user?.language?.toUpperCase()]}
								theme="WHITE"
							/>
						</div>
						{(type === DEMO || type === EDIT) && (
							<div className={styles.inputBox}>
								<Label>{COMMON_TRANSLATION.MEET[user?.language?.toUpperCase()]}</Label>
								<Select
									options={getMeetOptions(user.mail_integration_type)}
									name="meet"
									placeholder={"Search here"}
									value={input}
									setValue={setInput}
									disabled={type === EDIT}
								/>
							</div>
						)}
					</div>
					<div className={styles.box}>
						<div className={styles.inputBox}>
							<Label>{COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}</Label>
							<Input type="date" value={input} setValue={setInput} name="date" />
						</div>
						<div className={styles.inputBox}>
							<Label>{COMMON_TRANSLATION.DURATION[user?.language?.toUpperCase()]}</Label>
							<div className={styles.setDurationButtons}>
								{MEETING_DURATION.map(time => (
									<button
										key={time}
										onClick={() => setDurationActive(time)}
										className={`${styles.setBtn} ${
											durationActive === time ? styles.active : ""
										}`}
									>
										{time} min
									</button>
								))}
							</div>
						</div>
					</div>
					<div className={styles.slotHead}>
						<Label required>
							{COMMON_TRANSLATION.SET_TIME[user?.language?.toUpperCase()]}
						</Label>
						<div className={styles.slotBox}>
							{durationActive ? (
								<div className={styles.setSlotButtons}>
									{calendarSettingsLoader ? (
										<SlotsPlaceholder />
									) : (
										timeSlots.map((slot, ind) => (
											<button
												key={slot.startTime}
												onClick={() => setTime(slot)}
												className={`${styles.setBtn} ${styles.time} ${
													input.startTime === slot.startTime &&
													input.startTime !== data?.startTime
														? styles.active
														: ""
												} ${slot.selectable ? styles.selectable : ""} ${
													slot.event ? styles.event : ""
												}`}
												disabled={slot.event ? true : false}
											>
												{slot.event ? (
													<Tooltip
														text={`${moment(slot.startTime, ["HH.mm"]).format(
															"hh:mm a"
														)} -
													${moment(slot.endTime, ["HH.mm"]).format("hh:mm a")} : ${slot.event.name}`}
														className={`${
															ind % 4 === 0
																? styles.left
																: ind % 4 === 3
																? styles.right
																: styles.mid
														}`}
													>
														<p
															className={`${styles.booked} ${
																input.startTime === slot.startTime ? styles.active : ""
															}`}
														>
															{`${moment(slot.startTime, ["HH.mm"]).format(
																"hh:mm a"
															)} : ${slot.event.name}`}
														</p>
													</Tooltip>
												) : (
													<p className={styles.slot}>
														{`${moment(slot.startTime, ["HH.mm"]).format("hh:mm a")} -
												${moment(slot.endTime, ["HH.mm"]).format("hh:mm a")}`}
													</p>
												)}
												{slot.selectable && !slot.event && (
													<span className={styles.selectable}>{slot.selectable}</span>
												)}
											</button>
										))
									)}
								</div>
							) : (
								<div className={styles.selectDuration}>
									{
										COMMON_TRANSLATION.SELECT_DURATION_OF_METTING[
											user?.language?.toUpperCase()
										]
									}
								</div>
							)}
						</div>
					</div>
					<div className={styles.footer}>
						<div className={styles.buttons}>
							<ThemedButton
								theme={ThemedButtonThemes.PRIMARY}
								className={styles.button}
								onClick={confirmEvent}
							>
								{type === EDIT
									? COMMON_TRANSLATION.SAVE_CHANGES[user?.language?.toUpperCase()]
									: COMMON_TRANSLATION.SEND_INVITE[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
					</div>
				</div>
				<Modal
					isModal={isConfirm}
					showCloseButton
					closeColor={Colors.lightBlue}
					onClose={() => setIsConfirm(false)}
					className={styles.detailModal}
				>
					<div className={styles.headerConfirm}>
						<h2 className={styles.icon}>
							<Calendar className={styles.i} color={Colors.purpleShade1} />
						</h2>
						<div className={styles.heading}>
							{COMMON_TRANSLATION.INVITATION_CONFIRMATION[user?.language?.toUpperCase()]}
						</div>
						{type !== EDIT && (
							<div className={styles.subHeading}>
								{type === DEMO
									? COMMON_TRANSLATION.DEMO[user?.language?.toUpperCase()]
									: TASKS_TRANSLATION.CALL[user?.language?.toUpperCase()]}{" "}
								meeting with {`${lead.first_name} ${lead.last_name}`}
							</div>
						)}
					</div>
					<div className={styles.content}>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TITLE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>{input.finalTitle}</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DURATION[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{parseTime(input.endTime) - parseTime(input.startTime)} min
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{moment(
									`${input.date.DD}/${input.date.MM}/${input.date.YYYY}`,
									"DD/MM/YYYY"
								).format("Do MMMM YYYY")}
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{`${moment(input.startTime, ["HH.mm"]).format("hh:mm a")} - ${moment(
									input.endTime,
									["HH.mm"]
								).format("hh:mm a")}`}
							</div>
						</div>
						<div className={styles.linkBox}>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.MEET_LINK[user?.language?.toUpperCase()]}
							</div>
							<div className={`${styles.contentValueMeet}`}>
								{input.ringoverMeetLink?.replace("https://", "") || "Auto generated"}
							</div>

							{input.ringoverMeetLink && (
								<div
									className={styles.copy}
									onClick={() => {
										navigator.clipboard.writeText(input.ringoverMeetLink);
										addSuccess("Copied to clipboard!");
									}}
								>
									<Tooltip text={"Copy"} theme={TooltipThemes.RIGHT}>
										<CopyBlank
											color={Colors.verylightblue}
											className={styles.copyIcon}
											size="1.2rem"
										/>
									</Tooltip>
								</div>
							)}
						</div>
					</div>
					<div className={styles.confirmBtn}>
						<ThemedButton
							onClick={sendCalendarInvite}
							loading={addEditLoading}
							theme={ThemedButtonThemes.PRIMARY}
						>
							{type === EDIT
								? COMMON_TRANSLATION.SAVE_EVENT[user?.language?.toUpperCase()]
								: COMMON_TRANSLATION.CONFIRM_INVITE[user?.language?.toUpperCase()]}
						</ThemedButton>
					</div>
				</Modal>
				<Modal
					isModal={eventDetails ? true : false}
					showCloseButton
					closeColor={Colors.lightBlue}
					onClose={() => setEventDetails(false)}
					className={styles.detailModalEvent}
				>
					<div className={styles.headerConfirm}>
						<h2 className={styles.icon}>
							<Calendar className={styles.i} color={Colors.purpleShade1} />
						</h2>
						<div className={styles.heading}>
							{COMMON_TRANSLATION.EVENT_INFORMATION[user?.language?.toUpperCase()]}
						</div>
					</div>
					<div className={styles.content}>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TITLE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>{eventDetails.name}</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DURATION[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{eventDetails
									? parseTime(eventDetails?.endTime) - parseTime(eventDetails?.startTime)
									: 0}{" "}
								min
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{moment(date).format("Do MMM YYYY")}
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{`${moment(eventDetails.startTime, ["HH.mm"]).format(
									"hh:mm a"
								)} - ${moment(eventDetails.endTime, ["HH.mm"]).format("hh:mm a")}`}
							</div>
						</div>
						<div className={styles.linkBox}>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.MEET_LINK[user?.language?.toUpperCase()]}
							</div>
							<div className={`${styles.contentValueMeet}`}>
								{eventDetails.link?.replace("https://", "")}{" "}
							</div>
							{eventDetails.link !== "No link" && (
								<div
									className={styles.copy}
									onClick={() => {
										navigator.clipboard.writeText(eventDetails.link);
										addSuccess("Copied to clipboard!");
									}}
								>
									<Tooltip
										text={"Copy"}
										theme={TooltipThemes.RIGHT}
										className={styles.copyToolTip}
									>
										<CopyBlank
											color={Colors.verylightblue}
											className={styles.copyIcon}
											size="1.2rem"
										/>
									</Tooltip>
								</div>
							)}
						</div>
					</div>
				</Modal>
			</div>
		</ErrorBoundary>
	);
};

export default AddEditEvent;
