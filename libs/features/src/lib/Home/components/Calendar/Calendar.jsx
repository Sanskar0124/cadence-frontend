import { userInfo } from "@cadence-frontend/atoms";
import { Button, Div, ErrorBoundary, Tooltip } from "@cadence-frontend/components";
import { LANGUAGES, MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useHomePage,
	useGoogle,
	useUser,
	useOutlook,
} from "@cadence-frontend/data-access";
import {
	CalendarWithDates,
	Google,
	GoogleCalendar,
	GoogleWithColor,
	Outlook,
	OutlookWithColor,
	Plus,
	Tasks,
} from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Home as HOME_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { StripHtml } from "@cadence-frontend/utils";
import {
	CalendarEventsModal,
	EventDetailsModal,
	ThemedButton,
} from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./Calendar.module.scss";
import { CUSTOM_TASK_NODE_ID_MAP } from "./constants";
import { EventsPlaceholder } from "./Placeholder/Placeholder";

const CALENDAR_TYPES = {
	INTEGRATION: "integration",
	REMINDER: "reminder",
};

const CALENDAR_TYPE_NAME = {
	google: "Google events",
	outlook: "Outlook events",
	reminder: "Cadence events",
};

const EMAIL_TOKEN_EXPIRED_ENUM = {
	google: "is_google_token_expired",
	outlook: "is_outlook_token_expired",
};

const Calendar = () => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [copyAtConfirm, setCopyAtConfirm] = useState("Copy");
	const [eventDetails, setEventDetails] = useState(null);
	const [events, setEvents] = useState([]);
	const [activeCalendar, setActiveCalendar] = useState(null);
	const [mainSigninLoading, setMailSigninLoading] = useState(false);
	const [showCalendarModal, setShowCalendarModal] = useState(false);

	const {
		events: data,
		refetchEvents,
		eventsLoading,
		eventsError: error,
	} = useHomePage({ calendar: true }, {});

	const { user: fetchedUser } = useUser({ user: true });
	const { signIn: googleSignIn } = useGoogle();
	const { signIn: outlookSignIn } = useOutlook();

	const onSignIn = () => {
		setMailSigninLoading(true);
		user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE
			? googleSignIn()
			: outlookSignIn();
		setTimeout(() => {
			setMailSigninLoading(false);
		}, 3000);
	};

	useEffect(() => {
		if (data) {
			const processedEvents = processEvents(data);
			setEvents(processedEvents);
		}

		if (
			error &&
			error.response?.data?.msg !==
				`Please connect with ${user?.mail_integration_type} to fetch single event`
		) {
			addError({
				text:
					(typeof error.response?.data?.msg === "string" && error.response?.data?.msg) ||
					"Could not fetch events. Try again",
				desc: error?.response?.data?.error ?? "Please contact support",
				cId: error?.response?.data?.correlationId,
			});
		}
	}, [data]);

	const processEvents = items => {
		const singleEvents = [];

		items.forEach(event => {
			if (event.status === "confirmed") {
				//normal events
				const newEvent = {
					props: {
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
						leadId: event?.extendedProperties?.private?.ringover_crm_lead_id,
						type: CALENDAR_TYPES.INTEGRATION,
					},
				};
				singleEvents.push(newEvent);
			} else if (event.node_id) {
				//ringover events
				const newEvent = {
					props: {
						id: event.event_id,
						name: `${CUSTOM_TASK_NODE_ID_MAP[event.node_id]} ${
							event.Lead?.first_name || ""
						} ${event.Lead?.last_name || ""}`,
						startTime: moment(event.start_time),
						endTime: moment(event.start_time + event.duration * 60000),
						leadId: event?.lead_id,
						type: CALENDAR_TYPES.REMINDER,
					},
				};
				singleEvents.push(newEvent);
			}
		});
		return singleEvents;
	};
	const handleCalendarModal = () => setShowCalendarModal(prev => !prev);

	return (
		<ErrorBoundary>
			<div className={styles.calendar}>
				<div className={styles.header}>
					<div
						className={`${styles.date} ${
							user?.language === LANGUAGES.SPANISH ? styles.isSpanish : ""
						}`}
					>
						{user?.language === LANGUAGES.SPANISH ? (
							<>
								<span>{moment().format("dddd")}</span>,
								<span className={styles.date}>{moment().format("DD")}</span>
								<span>{moment().format("MMMM")}</span>
							</>
						) : (
							<>
								<span className={styles.date}>{moment().format("DD")}</span>
								<span>{moment().format("MMMM")}</span>,
								<span>{moment().format("dddd")}</span>
							</>
						)}
					</div>
					<div className={styles.buttons}>
						<Tooltip text={CALENDAR_TYPE_NAME[user?.mail_integration_type]}>
							<Button
								btnwidth="28px"
								btnheight="28px"
								className={`${styles.calendarTypeBtn} ${
									activeCalendar === CALENDAR_TYPES.INTEGRATION ? styles.active : ""
								}`}
								onClick={() =>
									activeCalendar !== CALENDAR_TYPES.INTEGRATION
										? setActiveCalendar(CALENDAR_TYPES.INTEGRATION)
										: setActiveCalendar(null)
								}
							>
								{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE && (
									<GoogleWithColor size="1.1rem" />
								)}
								{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK && (
									<OutlookWithColor size="2.2rem" />
								)}
							</Button>
						</Tooltip>
						<Tooltip
							text={CALENDAR_TYPE_NAME[CALENDAR_TYPES.REMINDER]}
							className={
								events.filter(e =>
									activeCalendar ? e.props?.type === activeCalendar : true
								).length === 0
									? styles.reminderTooltip
									: ""
							}
						>
							<Button
								btnwidth="28px"
								btnheight="28px"
								className={`${styles.calendarTypeBtn} ${styles.reminder} ${
									activeCalendar === CALENDAR_TYPES.REMINDER ? styles.active : ""
								}`}
								onClick={() =>
									activeCalendar !== CALENDAR_TYPES.REMINDER
										? setActiveCalendar(CALENDAR_TYPES.REMINDER)
										: setActiveCalendar(null)
								}
							>
								<Tasks size="1.1rem" />
							</Button>
						</Tooltip>
						{events.filter(e =>
							activeCalendar ? e.props?.type === activeCalendar : true
						).length > 0 && (
							<ThemedButton
								className={styles.addBtn}
								theme={ThemedButtonThemes.GREY}
								onClick={handleCalendarModal}
								width="40px"
								height="35px"
							>
								<Plus />
							</ThemedButton>
						)}
					</div>
				</div>
				<div className={styles.events}>
					{eventsLoading ? (
						<EventsPlaceholder />
					) : events.filter(e =>
							activeCalendar ? e.props?.type === activeCalendar : true
					  ).length > 0 ? (
						events
							.filter(e => (activeCalendar ? e.props?.type === activeCalendar : true))
							.map(e => {
								return (
									<div
										className={styles.event}
										key={e.key}
										onClick={() => {
											setEventDetails({
												title: e?.props?.name,
												startTime: e?.props?.startTime?.format("HH:mm"),
												endTime: e?.props?.endTime?.format("HH:mm"),
												date: moment(),
												ringoverMeetLink: e?.props?.location || e?.props?.hangoutLink,
												id: e?.props?.id,
												lead_id: e?.props?.leadId,
												type: e?.props?.type,
											});
										}}
									>
										<div>
											<span>{e.props?.startTime.format("HH:mm")}</span>
											<span>{e.props?.endTime.format("HH:mm")}</span>
										</div>
										<div>
											<div className={styles.info}>
												<span className={styles.eventName}>{e.props?.name}</span>
												{e.props?.description && (
													<span
														title={
															StripHtml(e.description).length > 70
																? StripHtml(e.description)
																: ""
														}
														className={styles.eventDesc}
													>
														{StripHtml(e.props?.description).length > 70
															? `${StripHtml(e.props?.description).slice(0, 70)}...`
															: StripHtml(e.props?.description)}
													</span>
												)}
											</div>
											{e?.props?.type === CALENDAR_TYPES.INTEGRATION ? (
												<>
													{user?.mail_integration_type ===
														MAIL_INTEGRATION_TYPES.OUTLOOK && <Outlook size="2.1rem" />}
													{user?.mail_integration_type ===
														MAIL_INTEGRATION_TYPES.GOOGLE && <GoogleCalendar />}
												</>
											) : (
												<div className={styles.reminderIcon}>
													<Tasks size="0.85rem" />
												</div>
											)}
										</div>
									</div>
								);
							})
					) : (
						<div className={styles.noEvents}>
							<CalendarWithDates />
							{fetchedUser?.[EMAIL_TOKEN_EXPIRED_ENUM[user?.mail_integration_type]] ? (
								<>
									<span>
										{HOME_TRANSLATION.NO_EVENTS_FOUND[user?.language?.toUpperCase()]}
									</span>
									<ThemedButton
										width="fit-content"
										loading={mainSigninLoading}
										onClick={onSignIn}
										spinnerClassName={styles.spinner}
										theme={ThemedButtonThemes.GREY}
									>
										{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE && (
											<>
												<Google />
												<div>
													{
														COMMON_TRANSLATION.SIGN_IN_WITH_GOOGLE[
															user?.language?.toUpperCase()
														]
													}
												</div>
											</>
										)}
										{user?.mail_integration_type === MAIL_INTEGRATION_TYPES.OUTLOOK && (
											<>
												<Outlook size="2.4rem" />
												<div>
													{
														COMMON_TRANSLATION.SIGN_IN_WITH_OUTLOOK[
															user?.language?.toUpperCase()
														]
													}
												</div>
											</>
										)}
									</ThemedButton>
								</>
							) : (
								<>
									<span>
										{
											HOME_TRANSLATION.NO_EVENTS_BOOKED_TODAY[
												user?.language?.toUpperCase()
											]
										}
									</span>
									<ThemedButton
										width="fit-content"
										theme={ThemedButtonThemes.GREY}
										onClick={handleCalendarModal}
									>
										<Plus />
										<div className={styles.capitalize}>
											{HOME_TRANSLATION.DEMO_BOOKING[user?.language.toUpperCase()]}
										</div>
									</ThemedButton>
								</>
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
						eventDetails.type === CALENDAR_TYPES.INTEGRATION &&
						user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
						true
					}
					lead={{ lead_id: eventDetails.lead_id }}
					events={events}
					refetchEvents={refetchEvents}
				/>
			)}
			<CalendarEventsModal
				isOpen={showCalendarModal}
				onClose={handleCalendarModal}
				refetchEvents={refetchEvents}
			/>
		</ErrorBoundary>
	);
};

export default Calendar;
