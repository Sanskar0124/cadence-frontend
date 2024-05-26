import { useContext, useEffect, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import moment from "moment-timezone";
import { InputDateCalendar, Select, ThemedButton } from "@cadence-frontend/widgets";
import { Edit, Call, Calendar } from "@cadence-frontend/icons";
import { Label } from "@cadence-frontend/widgets";
import styles from "./CalendarEventsModal.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import AddEditEvent from "../AddEditEvent/AddEditEvent";
import { useCalendar, useLeads } from "@cadence-frontend/data-access";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import EventDetailsModal from "../EventDetailsModal/EventDetailsModal";
import { Modal } from "@cadence-frontend/components";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import SelectLead from "./SelectLead/SelectLead";

const CalendarEventsModal = ({
	isOpen,
	onClose,
	selectedLead,
	refetchEvents,
	defaultDate,
}) => {
	const [addEditEvent, setAddEditEvent] = useState(false);
	const [selectedDate, setSelectedDate] = useState(defaultDate); //to select date which is selected before opening calendar
	const [eventShown, setEventShown] = useState({
		date: null,
		events: [],
	});

	const [eventDetails, setEventDetails] = useState(null);
	const user = useRecoilValue(userInfo);
	const [lead, setLead] = useState();
	const { events: gevents } = useCalendar({ enabled: isOpen });
	const { addError } = useContext(MessageContext);

	useEffect(() => {
		if (isOpen && selectedLead) setLead(selectedLead);
	}, [isOpen, selectedLead]);

	//to maintain selected date after clicking book
	useEffect(() => {
		if (eventShown.date) setSelectedDate(eventShown.date);
	}, [eventShown.date]);

	return (
		<Modal
			isModal={isOpen}
			showCloseButton
			// leftCloseIcon
			closeColor={Colors.lightBlue}
			onClose={() => {
				onClose();
				setAddEditEvent(false);
			}}
			className={styles.calendarModal}
		>
			{!addEditEvent && (
				<>
					<div className={styles.heading}>
						{COMMON_TRANSLATION.CALENDAR[user?.language?.toUpperCase()]}
					</div>

					<div>
						<div className={styles.inputCalendar}>
							<div className={styles.calendarHeaderTwo}>
								<div>
									<Label className={styles.label}>
										{COMMON_TRANSLATION.SELECT_LEAD[user?.language?.toUpperCase()]}
									</Label>
									<div className={styles.selectSalesperson}>
										<SelectLead lead={lead} setLead={setLead} isEnabled={isOpen} />
									</div>
								</div>
							</div>
							<InputDateCalendar
								theme={"selectMonthYear"}
								setEventShown={setEventShown}
								gevents={gevents}
								value={selectedDate}
							/>
						</div>
						<div className={styles.viewEvents}>
							<div className={styles.viewEventDiv}>
								<span className={styles.date}>
									{eventShown.date
										? moment(eventShown.date).format("Do MMM YYYY")
										: "Events"}{" "}
								</span>
								<div className={styles.events}>
									{eventShown.events.length > 0 ? (
										eventShown.events.map(e => {
											return (
												<div className={styles.eventInfo} key={e.key}>
													<div>
														<span>{e.props.name}</span>
														<span>{`${e.props.startTime.format(
															"hh:mm a"
														)} - ${e.props.endTime.format("hh:mm a")}`}</span>
													</div>
													<div
														className={styles.editevent}
														onClick={() =>
															setEventDetails({
																title: e?.props?.name,
																startTime: e?.props?.startTime?.format("HH:mm"),
																endTime: e?.props?.endTime?.format("HH:mm"),
																date: moment(eventShown?.date),
																ringoverMeetLink:
																	e?.props?.location || e?.props?.hangoutLink,
																id: e?.props?.id,
																lead_id: e?.props?.leadId,
															})
														}
													>
														<Edit size="15px" color={Colors.veryLightBlue} />
													</div>
												</div>
											);
										})
									) : (
										<div className={styles.noEvents}>
											<span>
												{
													TASKS_TRANSLATION.NO_EVENTS_TO_SHOW[
														user?.language?.toUpperCase()
													]
												}
											</span>
										</div>
									)}
								</div>
							</div>
							<div className={styles.buttons}>
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									className={styles.button}
									onClick={() => {
										if (!lead) {
											addError({ text: "Choose a lead" });
											return;
										}
										setAddEditEvent({
											date: eventShown.date,
											type: "demo",
											events: eventShown.events,
										});
									}}
									disabled={
										new Date(eventShown.date).setHours(0, 0, 0, 0) <
										new Date().setHours(0, 0, 0, 0)
									}
								>
									<Calendar
										color={
											new Date(eventShown.date).setHours(0, 0, 0, 0) <
											new Date().setHours(0, 0, 0, 0)
												? Colors.blackShade8
												: Colors.lightBlue
										}
									/>{" "}
									<div className={styles.btndata}>
										{TASKS_TRANSLATION.BOOK_A_DEMO[user?.language?.toUpperCase()]}
									</div>
								</ThemedButton>
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									className={styles.button}
									onClick={() => {
										if (!lead) {
											addError({ text: "Choose a lead" });
											return;
										}
										setAddEditEvent({
											date: eventShown.date,

											type: "call",
											events: eventShown.events,
										});
									}}
									disabled={
										new Date(eventShown.date).setHours(0, 0, 0, 0) <
										new Date().setHours(0, 0, 0, 0)
									}
								>
									<Call
										color={
											new Date(eventShown.date).setHours(0, 0, 0, 0) <
											new Date().setHours(0, 0, 0, 0)
												? Colors.blackShade8
												: Colors.lightBlue
										}
									/>{" "}
									<div className={styles.btndata}>
										{TASKS_TRANSLATION.BOOK_A_CALL[user?.language?.toUpperCase()]}{" "}
									</div>
								</ThemedButton>
							</div>
						</div>
					</div>
				</>
			)}
			{addEditEvent && (
				<AddEditEvent
					addEditEvent={addEditEvent}
					closeAddEditEvent={() => setAddEditEvent(false)}
					lead={lead}
					onClose={onClose}
					refetchEvents={refetchEvents}
				/>
			)}
			{eventDetails && (
				<EventDetailsModal
					setEventDetails={setEventDetails}
					eventDetails={eventDetails}
					edit={
						eventDetails.lead_id &&
						user?.mail_integration_type === MAIL_INTEGRATION_TYPES.GOOGLE &&
						true
					}
					lead={{ lead_id: eventDetails.lead_id }}
					date={eventShown?.date}
					events={eventShown?.events}
					onClose={onClose}
					refetchEvents={refetchEvents}
				/>
			)}
		</Modal>
	);
};

export default CalendarEventsModal;
