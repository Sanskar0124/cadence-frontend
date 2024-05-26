import { userInfo } from "@cadence-frontend/atoms";
import { Button, Div, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCalendar, useGoogle, useOutlook } from "@cadence-frontend/data-access";
import {
	CalendarWithDates,
	ChevronRoundedLeft,
	ChevronRoundedRight,
	CloseBold,
	Plus,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Home as HOME_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { Colors, StripHtml } from "@cadence-frontend/utils";
import {
	CalendarEventsModal,
	EventDetailsModal,
	ThemedButton,
} from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { rrulestr } from "rrule";
import styles from "./Calendar.module.scss";

const parseTime = s => {
	const c = s.split(":");
	return parseInt(c[0]) * 60 + parseInt(c[1]);
};

const Calendar = ({ onSidebarClose: onClose }) => {
	const user = useRecoilValue(userInfo);
	const today = moment();
	const { addError } = useContext(MessageContext);
	const current = moment().startOf("month").utc(true);
	const [copyAtConfirm, setCopyAtConfirm] = useState("Copy");
	const [eventDetails, setEventDetails] = useState(null);
	const [events, setEvents] = useState([]);
	const [eventShown, setEventShown] = useState({
		date: null,
		events: [],
	});
	const [activeWeek, setActiveWeek] = useState(moment());
	const [eventsEachDay, setEventsEachDay] = useState([]);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const {
		events: data,
		refetchEvents,
		eventsLoading,
		error,
	} = useCalendar({ enabled: true });

	const { signIn: googleSignIn } = useGoogle();
	const { signIn: outlookSignIn } = useOutlook();

	const onSignIn = () => {
		setGoogleLoading(true);
		user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE
			? googleSignIn()
			: outlookSignIn();
		setTimeout(() => {
			setGoogleLoading(false);
		}, 3000);
	};

	useEffect(() => {
		if (data) {
			setEvents(() => {
				let events = [];
				for (const calendar of data) {
					events = [...events, ...processEvents(calendar.events, calendar.calendarName)];
				}
				return events;
			});
		}

		if (error) {
			addError({
				text:
					(typeof error.response?.data?.msg === "string" && error.response?.data?.msg) ||
					"Could not fetch events. Try again",
				desc: error?.response?.data?.error || "Please contact support",
				cId: error?.response?.data?.correlationId,
			});
		}
	}, [data]);

	useEffect(() => {
		const eventIds = new Set();
		const filteredEvents = events.filter(e => {
			if (eventIds.has(e.id)) return false;
			else {
				eventIds.add(e.id);
				return true;
			}
		});

		setEventsEachDay(getRenderEvents(filteredEvents, current));
		setEventShown({
			date: moment(current).date(today.date()).toISOString(),
			events: getRenderEvents(filteredEvents, current)[today.date() - 1].sort(
				(first, second) => {
					return (
						parseTime(moment(first.props.startTime).format("HH:mm")) -
						parseTime(moment(second.props.startTime).format("HH:mm"))
					);
				}
			),
		});
	}, [events]);

	const processEvents = (items, calendarName, color) => {
		const singleEvents = [];
		const changed = [];
		const cancelled = [];

		// console.log(items)

		items.forEach(event => {
			if (event.originalStartTime) {
				//cancelled or changed events
				if (event.status === "cancelled") {
					//cancelled events
					cancelled.push({
						recurringEventId: event.recurringEventId,
						originalStartTime: event.originalStartTime.dateTime
							? moment(event.originalStartTime.dateTime)
							: moment.parseZone(event.originalStartTime.date),
					});
				} else if (event.status === "confirmed") {
					//changed events
					changed.push({
						recurringEventId: event.recurringEventId,
						name: event.summary,
						description: event.description,
						location: event.location,
						leadId: event?.extendedProperties?.private?.ringover_crm_lead_id,
						originalStartTime: event.originalStartTime.dateTime
							? moment(event.originalStartTime.dateTime)
							: moment.parseZone(event.originalStartTime.date),
						newStartTime: event.start.dateTime
							? moment(event.start.dateTime)
							: moment.parseZone(event.start.date),
						newEndTime: event.end.dateTime
							? moment(event.end.dateTime)
							: moment.parseZone(event.end.date),
					});
				}
			} else if (event.status === "confirmed") {
				//normal events
				const newEvent = {
					id: event.id,
					name: event.summary,
					startTime: event.start.dateTime
						? moment(event.start.dateTime)
						: moment.parseZone(event.start.date),
					endTime: event.end.dateTime
						? moment(event.end.dateTime)
						: moment.parseZone(event.end.date),
					description: event.description,
					location: event.location,
					hangoutLink: event.hangoutLink,
					recurrence: event.recurrence,
					changedEvents: [],
					cancelledEvents: [],
					calendarName,
					color,
					leadId: event?.extendedProperties?.private?.ringover_crm_lead_id,
				};

				singleEvents.push(newEvent);
			}
		});

		singleEvents.forEach((event, idx, arr) => {
			if (event.recurrence) {
				//push changed events
				changed
					.filter(change => change.recurringEventId === event.id)
					.forEach(change => {
						arr[idx].changedEvents.push(change);
					});

				//push cancelled events
				cancelled
					.filter(cancel => cancel.recurringEventId === event.id)
					.forEach(cancel => {
						arr[idx].cancelledEvents.push(cancel.originalStartTime);
					});
			}
		});

		// console.log(singleEvents)

		return singleEvents;
	};

	//renders the blocks for the days of each month
	const renderDates = () => {
		return (
			<>
				{[3, 2, 1].map(date => (
					<div
						className={`${styles.date} ${
							eventShown.date === moment(activeWeek).subtract(date, "day").toISOString()
								? styles.active
								: ""
						}`}
						onClick={() => {
							setEventShown({
								date: moment(activeWeek).subtract(date, "day").toISOString(),
								events: getRenderEvents(
									events,
									moment(activeWeek).subtract(date, "day").startOf("month").utc(true)
								)[moment(activeWeek).subtract(date, "day").format("D") - 1],
							});
						}}
					>
						<span>
							{`${moment(activeWeek).subtract(date, "day").format("dd")}`.slice(0, 1)}
						</span>
						<span>{moment(activeWeek).subtract(date, "day").format("D")}</span>
					</div>
				))}
				<div
					className={`${styles.date} ${
						moment(eventShown.date).format("D MMM YYYY") ===
						moment(activeWeek).format("D MMM YYYY")
							? styles.active
							: moment(activeWeek).format("D MMM YYYY") === moment().format("D MMM YYYY")
							? styles.current
							: ""
					}`}
					onClick={() => {
						setEventShown({
							date: moment(activeWeek).toISOString(),
							events: getRenderEvents(
								events,
								moment(activeWeek).startOf("month").utc(true)
							)[moment(activeWeek).format("D") - 1],
						});
					}}
				>
					<span>{`${moment(activeWeek).format("dd")}`.slice(0, 1)}</span>
					<span>{moment(activeWeek).format("D")}</span>
				</div>
				{[1, 2, 3].map(date => (
					<div
						className={`${styles.date} ${
							eventShown.date === moment(activeWeek).add(date, "day").toISOString()
								? styles.active
								: ""
						}`}
						onClick={() => {
							setEventShown({
								date: moment(activeWeek).add(date, "day").toISOString(),
								events: getRenderEvents(
									events,
									moment(activeWeek).add(date, "day").startOf("month").utc(true)
								)[moment(activeWeek).add(date, "day").format("D") - 1],
							});
						}}
					>
						<span>
							{`${moment(activeWeek).add(date, "day").format("dd")}`.slice(0, 1)}
						</span>
						<span>{moment(activeWeek).add(date, "day").format("D")}</span>
					</div>
				))}
			</>
		);
	};

	const getRenderEvents = (singleEvents, current) => {
		const eventsEachDay = [...Array(current.daysInMonth())].map(e => []); //create array of empty arrays of length daysInMonth
		singleEvents.forEach(event => {
			if (event.recurrence) {
				const duration = moment.duration(event.endTime.diff(event.startTime));

				//get recurrences using RRule
				const dates = getDatesFromRRule(
					event.recurrence[0],
					event.startTime,
					moment(current),
					moment(current).add(1, "month")
				);

				//render recurrences
				dates.forEach(date => {
					//check if it is in cancelled
					let props;
					if (
						event.cancelledEvents.some(cancelledMoment =>
							cancelledMoment.isSame(date, "day")
						)
					) {
						return;
					}

					//if event has changed
					const changedEvent = event.changedEvents.find(changedEvent =>
						changedEvent.originalStartTime.isSame(date, "day")
					);
					if (changedEvent) {
						props = {
							name: changedEvent.name,
							startTime: changedEvent.newStartTime,
							endTime: changedEvent.newEndTime,
							description: changedEvent.description,
							location: changedEvent.location,
							hangoutLink: changedEvent.hangoutLink,
							calendarName: event.calendarName,
							color: event.color,
						};
					} else {
						const eventStart = moment.utc(date); //avoid bad timezone conversions
						const eventEnd = moment(eventStart).add(duration);
						props = {
							name: event.name,
							startTime: eventStart,
							endTime: eventEnd,
							description: event.description,
							location: event.location,
							hangoutLink: event.hangoutLink,
							calendarName: event.calendarName,
							color: event.color,
						};
					}
					renderSingleEvent(eventsEachDay, moment(props.startTime).date(), { ...props });
				});
			} else {
				//check if event is in current month
				if (
					event.startTime.month() != current.month() ||
					event.startTime.year() != current.year()
				) {
					return;
				}
				renderSingleEvent(eventsEachDay, moment(event.startTime).date(), { ...event });
			}
		});

		return eventsEachDay;
	};

	//attempts to render in a placeholder then at the end
	const renderSingleEvent = (eventsEachDay, date, props) => {
		eventsEachDay[date - 1].push(
			<div
				className={`event ${
					eventShown.date === moment(current).date(date).utc().format("Do MMM YYYY")
						? "active"
						: ""
				}`}
				tabIndex="0"
				key={`single-event-${Math.random()}`}
				{...props}
			/>
		);
	};

	//get dates based on rrule string between dates
	const getDatesFromRRule = (str, eventStart, betweenStart, betweenEnd) => {
		//get recurrences using RRule
		const rstr = `DTSTART:${moment(eventStart)
			.utc(true)
			.format("YYYYMMDDTHHmmss")}Z\n${str}`;
		const rruleSet = rrulestr(rstr, { forceset: true });

		//get dates
		const begin = moment(betweenStart).utc(true).toDate();
		const end = moment(betweenEnd).utc(true).toDate();
		const dates = rruleSet.between(begin, end);
		return dates;
	};
	const handleCalendarModal = () => {
		setShowCalendarModal(prev => !prev);
	};

	return (
		<ErrorBoundary>
			<>
				<div className={styles.calendar}>
					<div className={styles.top}>
						<ThemedButton
							onClick={onClose}
							className={styles.closeBtn}
							theme={ThemedButtonThemes.ICON}
						>
							<Tooltip text="Close" theme={TooltipThemes.RIGHT} span>
								<CloseBold color={Colors.lightBlue} />
							</Tooltip>
						</ThemedButton>
						<p>{COMMON_TRANSLATION.CALENDAR[user?.language?.toUpperCase()]}</p>
						<Button
							className={styles.addBtn}
							onClick={handleCalendarModal}
							btnwidth="40px"
						>
							<Plus />
						</Button>
					</div>
					<div className={styles.header}>
						<div className={styles.date}>
							<span>{moment(eventShown.date).format("D")}</span>
							<span>{moment(eventShown.date).format("ddd MMM YYYY")}</span>
						</div>
						<div className={styles.buttons}>
							{moment().format("D MMM YYYY") !==
								moment(eventShown.date).format("D MMM YYYY") && (
								<Button
									btnwidth="fit-content"
									onClick={() => {
										setEventShown({
											date: moment().toISOString(),
											events: eventsEachDay[moment().format("D") - 1],
										});
										setActiveWeek(moment().toISOString());
									}}
									className={styles.todayBtn}
								>
									<span>{COMMON_TRANSLATION.TODAY[user?.language?.toUpperCase()]}</span>
								</Button>
							)}
							<div className={styles.moveButtons}>
								<Button
									btnwidth="fit-content"
									onClick={() => {
										setEventShown(prev => ({
											date: moment(prev.date).subtract(7, "day").toISOString(),
											events: getRenderEvents(
												events,
												moment(prev.date).subtract(7, "day").startOf("month").utc(true)
											)[moment(prev.date).subtract(7, "day").format("D") - 1],
										}));
										setActiveWeek(prev => moment(prev).subtract(7, "day").toISOString());
									}}
								>
									<Tooltip text="Previous" theme={TooltipThemes.TOP}>
										<ChevronRoundedLeft color={Colors.lightBlue} />
									</Tooltip>
								</Button>
								<Button
									btnwidth="fit-content"
									onClick={() => {
										setEventShown(prev => ({
											date: moment(prev.date).add(7, "day").toISOString(),
											events: getRenderEvents(
												events,
												moment(prev.date).add(7, "day").startOf("month").utc(true)
											)[moment(prev.date).add(7, "day").format("D") - 1],
										}));
										setActiveWeek(prev => moment(prev).add(7, "day").toISOString());
									}}
								>
									<Tooltip text="Next" theme={TooltipThemes.TOP}>
										<ChevronRoundedRight color={Colors.lightBlue} />
									</Tooltip>
								</Button>
							</div>
						</div>
					</div>
					<div className={styles.datesContainer}>
						<div className={styles.dates}>{renderDates()}</div>
					</div>
					<div className={styles.events}>
						{eventsLoading ? (
							<>
								{[...Array(4).keys()].map(() => (
									<div className={styles.placeholder}>
										<Div loading />
									</div>
								))}
							</>
						) : eventShown.events.length > 0 ? (
							eventShown.events.map(e => {
								return (
									<div
										key={e.key}
										onClick={() => {
											setEventDetails({
												title: e?.props?.name,
												startTime: e?.props?.startTime?.format("HH:mm"),
												endTime: e?.props?.endTime?.format("HH:mm"),
												date: moment(eventShown?.date),
												ringoverMeetLink: e?.props?.location || e?.props?.hangoutLink,
												id: e?.props?.id,
												lead_id: e?.props?.leadId,
											});
										}}
									>
										<div>
											<span>{e.props.startTime.format("HH:mm")}</span>
											<span>{e.props.endTime.format("HH:mm")}</span>
										</div>
										<div>
											<span className={styles.eventName}>{e.props.name}</span>
											{e.props.description && (
												<span
													title={
														StripHtml(e.props.description).length > 70
															? StripHtml(e.props.description)
															: ""
													}
													className={styles.eventDesc}
												>
													{StripHtml(e.props.description).length > 70
														? `${StripHtml(e.props.description).slice(0, 70)}...`
														: StripHtml(e.props.description)}
												</span>
											)}
										</div>
									</div>
								);
							})
						) : (
							<div className={styles.noEvents}>
								<CalendarWithDates />
								<span>
									{HOME_TRANSLATION.NO_EVENTS_FOUND[user?.language?.toUpperCase()]}
								</span>
								{error?.response?.data?.msg?.toLowerCase().includes("sign in") && (
									<ThemedButton
										width="fit-content"
										loading={googleLoading}
										onClick={onSignIn}
										spinnerClassName={styles.spinner}
										theme={ThemedButtonThemes.GREY}
									>
										<div>
											{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
												COMMON_TRANSLATION.SIGN_IN_WITH_GOOGLE[
													user?.language?.toUpperCase()
												]}
											{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK &&
												COMMON_TRANSLATION.SIGN_IN_WITH_OUTLOOK[
													user?.language?.toUpperCase()
												]}
										</div>
									</ThemedButton>
								)}
							</div>
						)}
					</div>
				</div>
				{eventDetails && (
					<EventDetailsModal
						setEventDetails={setEventDetails}
						eventDetails={eventDetails}
						setCopyAtConfirm={setCopyAtConfirm}
						copyAtConfirm={copyAtConfirm}
						edit={
							eventDetails.lead_id &&
							user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
							true
						}
						lead={{ lead_id: eventDetails.lead_id }}
						events={eventShown?.events}
						refetchEvents={refetchEvents}
					/>
				)}
				{showCalendarModal && (
					<CalendarEventsModal
						isOpen={showCalendarModal}
						onClose={handleCalendarModal}
						refetchEvents={refetchEvents}
						defaultDate={eventShown?.date}
					/>
				)}
			</>
		</ErrorBoundary>
	);
};

export default Calendar;
