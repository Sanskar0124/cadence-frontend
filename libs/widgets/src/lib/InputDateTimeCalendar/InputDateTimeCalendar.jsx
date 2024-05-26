import { DAY_NAMES, MONTH_NAMES } from "@cadence-frontend/constants";
import { useCalendar } from "@cadence-frontend/data-access";
import { Close, TriangleDown } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { InputTime } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { rrulestr } from "rrule";
import { ARROW_ICON_SIZE, CLOSE_ICON_SIZE } from "./constant";
import styles from "./InputDateTimeCalendar.module.scss";
import THEMES from "./themes";
import { ErrorBoundary } from "@cadence-frontend/components";

const InputDateTimeCalendar = ({
	className,
	theme,
	setValue,
	name,
	value,
	setEventShown: setEveShown,
	calendarDisplay,
	setCalendarDisplay,
}) => {
	const { events: gevents } = useCalendar({ enabled: true });
	const monthNames = MONTH_NAMES;
	const days = DAY_NAMES;
	const [today, setToday] = useState(moment());
	const [current, setCurrent] = useState(moment().startOf("month").utc(true));
	const [events, setEvents] = useState([]);
	const [dateTime, setDateTime] = useState();
	const [time, setTime] = useState();
	const [eventsEachDay, setEventsEachDay] = useState([]);
	const [eventShown, setEventShown] = useState({
		date: null,
		events: [],
	});
	const parseTime = s => {
		const c = s.split(":");
		return parseInt(c[0]) * 60 + parseInt(c[1]);
	};

	useEffect(() => {
		setEvents([]);
		if (gevents) {
			for (const calendar of gevents) {
				const events = processEvents(calendar.events, calendar.calendarName);
				setEvents(prev => [...prev, ...events]);
			}
		}
	}, [gevents]);

	useEffect(() => {
		setEventsEachDay(getRenderEvents(events));
		setEventShown({
			date: moment(current).date(today.date()).toISOString(),
			events: getRenderEvents(events)[today.date() - 1]?.sort((first, second) => {
				return (
					parseTime(moment(first.props.startTime).format("HH:mm")) -
					parseTime(moment(second.props.startTime).format("HH:mm"))
				);
			}),
		});
	}, [events, current]);

	useEffect(() => {
		setEveShown && setEveShown(eventShown);
	}, [eventShown]);

	const processEvents = (items, calendarName, color) => {
		const singleEvents = [];
		const changed = [];
		const cancelled = [];

		items.forEach(event => {
			if (event.originalStartTime) {
				//cancelled or changed events
				if (event.status == "cancelled") {
					//cancelled events
					cancelled?.push({
						recurringEventId: event.recurringEventId,
						originalStartTime: event.originalStartTime.dateTime
							? moment(event.originalStartTime.dateTime)
							: moment.parseZone(event.originalStartTime.date),
					});
				} else if (event.status == "confirmed") {
					//changed events
					changed?.push({
						recurringEventId: event.recurringEventId,
						name: event.summary,
						description: event.description,
						location: event.location,
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
			} else if (event.status == "confirmed") {
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
				};

				singleEvents?.push(newEvent);
			}
		});

		singleEvents.forEach((event, idx, arr) => {
			if (event.recurrence) {
				//push changed events
				changed
					.filter(change => change.recurringEventId == event.id)
					.forEach(change => {
						arr[idx].changedEvents?.push(change);
					});

				//push cancelled events
				cancelled
					.filter(cancel => cancel.recurringEventId == event.id)
					.forEach(cancel => {
						arr[idx].cancelledEvents?.push(cancel.originalStartTime);
					});
			}
		});

		return singleEvents;
	};

	const dateHandle = x => {
		if (typeof value === "object")
			setDateTime(prev => ({
				...prev,
				DD: moment(current)
					.add(x - 1, "days")
					.format("DD"),
				MM: moment(current).format("MM"),
				YYYY: current.year(),
			}));
		else
			setDateTime(
				moment(current)
					.add(x - 1, "days")
					.startOf("day")
					.unix() * 1000
			);
	};

	//renders the day of week names
	const renderDays = () => {
		return days.map((x, i) => (
			<div className={styles.dayname} key={`day-of-week-${i}`}>
				{x}
			</div>
		));
	};

	//renders the blocks for the days of each month
	const renderDates = eventsEachDay => {
		const daysInMonth = [...Array(current.daysInMonth() + 1).keys()].slice(1); // create array from 1 to number of days in month

		const dayOfWeek = current.day() === 0 ? 6 : current.day() - 1;
		//get day of week of first day in the month
		const padDays = (((-current.daysInMonth() - dayOfWeek) % 7) + 7) % 7; //number of days to fill out the last row
		let a = dayOfWeek;

		return [
			[...Array(dayOfWeek)].map((x, i) => {
				a--;
				return (
					<div className={styles.outOfMonthDay} key={`empty-day-${i}`}>
						{moment(current).subtract(1, "month").daysInMonth() - a}
					</div>
				);
			}),
			daysInMonth.map(x => {
				eventsEachDay[x - 1]?.sort((first, second) => {
					return (
						parseTime(moment(first.props.startTime).format("HH:mm")) -
						parseTime(moment(second.props.startTime).format("HH:mm"))
					);
				});

				return x == today.date() && current.isSame(today, "month") ? (
					<div
						onClick={() => {
							if (THEMES.ARROW_MONTH_YEAR == theme) {
								dateHandle(x);
							}
							setEventShown({
								date: moment(current).date(x).toISOString(),
								events: eventsEachDay[x - 1],
							});
						}}
						className={`${styles.day} ${styles.today} ${
							eventShown.date === moment(current).date(x).toISOString() && styles.active
						}`}
						key={`day-${x}`}
					>
						<span>{x}</span>
						{eventsEachDay[x - 1]?.length >= 5 && (
							<div
								className={`${styles.event} ${
									eventShown.date === moment(current).date(x).toISOString() &&
									styles.active
								}`}
								tabIndex="0"
							/>
						)}
					</div>
				) : (
					<div
						onClick={() => {
							if (THEMES.ARROW_MONTH_YEAR == theme) {
								dateHandle(x);
							}
							setEventShown({
								date: moment(current).date(x).toISOString(),
								events: eventsEachDay[x - 1],
							});
						}}
						className={`${styles.day} ${
							eventShown.date === moment(current).date(x).toISOString() && styles.active
						}`}
						key={`day-${x}`}
					>
						<span>{x}</span>
						{eventsEachDay[x - 1]?.length >= 5 && (
							<div
								className={`${styles.event} ${
									eventShown.date === moment(current).date(x).toISOString() &&
									styles.active
								}`}
								tabIndex="0"
							/>
						)}
					</div>
				);
			}),

			[...Array(1 + padDays).keys()].slice(1).map((x, i) => {
				return (
					<div className={styles.outOfMonthDay} key={`empty-day-2-${i}`}>
						{x}
					</div>
				);
			}),
			...(!(current.day() === 6 && daysInMonth.length === 31) &&
			!(current.day() === 0 && daysInMonth.length >= 30)
				? [
						[...Array(8).keys()].slice(1).map((x, i) => {
							return (
								<div className={styles.outOfMonthDay} key={`empty-day-2-${i}`}>
									{x + padDays}
								</div>
							);
						}),
				  ]
				: []),
		];
	};

	const getRenderEvents = singleEvents => {
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
		eventsEachDay[date - 1]?.push(
			<div
				className={`${styles.event} ${
					eventShown.date === moment(current).date(date).utc().format("Do MMM YYYY")
						? styles.active
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

	const handleLeft = () => {
		setCurrent(moment(current).subtract(1, "month"));
	};
	const handleRight = () => {
		setCurrent(moment(current).add(1, "month"));
	};
	useEffect(() => {
		// if (!value || !value[name] || value[name]["DD"] === "dd") return;
		if (
			!value ||
			(typeof value === "object" && (!value[name] || value[name]["DD"] === "dd")) ||
			(typeof value === "string" && value === "")
		)
			return;
		if (typeof value[name] === "object") {
			setCurrent(
				moment(new Date(value[name]["YYYY"], value[name]["MM"] - 1, value[name]["DD"]))
					.startOf("month")
					.utc("true")
			);
			setToday(
				moment(new Date(value[name]["YYYY"], value[name]["MM"] - 1, value[name]["DD"]))
			);
			setDateTime(value[name]);
		} else {
			setCurrent(
				moment(
					new Date(
						new Date(value).getFullYear(),
						new Date(value).getMonth(),
						new Date(value).getDate(),
						0,
						0,
						0
					)
				)
					.startOf("month")
					.utc("true")
			);
			setToday(
				moment(
					new Date(
						new Date(value).getFullYear(),
						new Date(value).getMonth(),
						new Date(value).getDate(),
						0,
						0,
						0
					)
				).startOf("day")
			);
			setDateTime(
				new Date(
					new Date(value).getFullYear(),
					new Date(value).getMonth(),
					new Date(value).getDate(),
					0,
					0,
					0
				).getTime()
			);
			setTime(`${new Date(value).getHours()}:
						${new Date(value).getMinutes()}`);
		}
	}, []);
	useEffect(() => {
		if (typeof value === "object") {
			setValue(prev => ({
				...prev,
				[name]: dateTime,
			}));
		} else if (time && dateTime)
			setValue(
				new Date(
					new Date(dateTime).getFullYear(),
					new Date(dateTime).getMonth(),
					new Date(dateTime).getDate(),
					Number(time.split(":")[0]),
					Number(time.split(":")[1]),
					0
				).getTime()
			);
	}, [dateTime, time]);

	return (
		<ErrorBoundary>
			<div
				className={`${styles.calendar} ${
					THEMES.ARROW_MONTH_YEAR == theme && !calendarDisplay
						? styles.inactiveDisplay
						: ""
				}   ${className ?? ""}`}
			>
				<div className={styles.mainCalendar}>
					<div className={styles.calendarHeader}>
						<div className={styles.arrowleft} onClick={handleLeft}>
							<TriangleDown color={Colors.lightBlue} size={ARROW_ICON_SIZE} />
						</div>
						<div className={styles.arrowright} onClick={handleRight}>
							<TriangleDown color={Colors.lightBlue} size={ARROW_ICON_SIZE} />
						</div>
						<div className={styles.monthYear}>
							{monthNames[current.month()]} {current.year()}{" "}
						</div>
						{THEMES.ARROW_MONTH_YEAR == theme && (
							<div className={styles.close} onClick={() => setCalendarDisplay(false)}>
								<Close color={Colors.lightBlue} size={CLOSE_ICON_SIZE} />
							</div>
						)}
					</div>
					<div
						className={`${styles.division} ${
							THEMES.SELECT_MONTH_YEAR === theme
								? styles.divisionWidthSelect
								: styles.divisionWidthArrow
						}`}
					></div>

					{/* <div className={styles.calendarHeaderTwo}>
						<div className={styles.selectMonthYear}>
							<div>
								<Label>Month</Label>

								<ReactSelect
									styles={customStyles}
									components={{ Placeholder, DropdownIndicator }}
									placeholder={`${monthNames[current.month()]}`}
									onChange={handleMonth}
									options={monthNames.map(m => ({
										label: m,
										value: m,
									}))}
									// styles={normalStyles}
									isSearchable={false}
								/>
							</div>
							<div>
								<Label>Year</Label>

								<ReactSelect
									options={years.map(m => ({
										label: m,
										value: m,
									}))}
									styles={customStyles}
									components={{ Placeholder, DropdownIndicator }}
									placeholder={`${current.year()}`}
									onChange={handleYear}
									// styles={normalStyles}
									isSearchable={false}
								/>
							</div>
						</div>
					</div> */}

					<div
						className={`${styles.calendarBody} ${
							THEMES.SELECT_MONTH_YEAR == theme ? styles.calendarSide : ``
						}`}
					>
						{renderDays()}
						{renderDates(eventsEachDay)}
					</div>
					<div className={styles.inputTime}>
						<InputTime
							theme="GREY"
							type="slider"
							name="time"
							input={typeof value === "object" ? dateTime : time}
							setInput={typeof value === "object" ? setDateTime : setTime}
						/>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default InputDateTimeCalendar;
