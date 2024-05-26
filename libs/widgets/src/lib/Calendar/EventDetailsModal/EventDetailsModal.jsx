import { Colors } from "@cadence-frontend/utils";
import styles from "./EventDetailsModal.module.scss";
import { CadenceBox, Calendar, CopyBlank, Edit, Trash } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import moment from "moment-timezone";
import { parseTime } from "../utils/helper";
import { useRecoilValue } from "recoil";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { Tooltip } from "recharts";
import { userInfo } from "@cadence-frontend/atoms";
import { ThemedButton } from "@cadence-frontend/widgets";
import AddEditEvent from "../AddEditEvent/AddEditEvent";
import { useState, useContext } from "react";
import { useCalendar } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import { Modal } from "@cadence-frontend/components";

const EventDetailsModal = ({
	setEventDetails,
	eventDetails,
	edit = false,
	lead,
	events,
	onClose: closeCalendarModal,
	refetchEvents,
}) => {
	const user = useRecoilValue(userInfo);
	const [addEditEvent, setAddEditEvent] = useState(null);
	const { deleteEvent, deleteEventLoading } = useCalendar({ enabled: false });
	const { addError, addSuccess } = useContext(MessageContext);

	const handleDeleteEvent = () => {
		deleteEvent(
			{ eventId: eventDetails?.id },
			{
				onSuccess: () => {
					addSuccess("Event deleted");
					refetchEvents();
					setAddEditEvent(null);
					setEventDetails(null);
					closeCalendarModal && closeCalendarModal();
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};
	return (
		<Modal
			isModal={eventDetails}
			showCloseButton
			onClose={() => setEventDetails(null)}
			closeColor={Colors.lightBlue}
			className={addEditEvent ? styles.calendarModal : styles.detailModal}
		>
			{!addEditEvent && (
				<>
					<div className={styles.headerConfirm}>
						<h2 className={styles.icon}>
							<Calendar className={styles.i} color={Colors.purpleShade1} />
						</h2>
						<div className={styles.heading}>
							{lead.lead_id && (
								<CadenceBox
									size="2em"
									style={{ cursor: "pointer" }}
									onClick={e => {
										e.stopPropagation();
										e.preventDefault();
										window.open(`/crm/leads/${lead?.lead_id}`);
									}}
									color="white"
								/>
							)}
							{eventDetails?.title}
						</div>
					</div>
					<div className={styles.content}>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TITLE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>{eventDetails?.title}</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DURATION[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{parseTime(eventDetails?.endTime) - parseTime(eventDetails?.startTime)}{" "}
								min
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.DATE[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{moment(eventDetails.date).format("D MMM YYYY")}
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.TIME[user?.language?.toUpperCase()]}
							</div>
							<div className={styles.contentValue}>
								{`${moment(eventDetails?.startTime, ["HH.mm"]).format(
									"hh:mm a"
								)} - ${moment(eventDetails?.endTime, ["HH.mm"]).format("hh:mm a")}`}
							</div>
						</div>
						<div>
							<div className={styles.contentLabel}>
								{COMMON_TRANSLATION.MEET_LINK[user?.language?.toUpperCase()]}
							</div>
							<div className={`${styles.contentValueMeet}`}>
								{eventDetails?.ringoverMeetLink?.replace("https://", "") ||
									"Auto generated"}
							</div>
							{eventDetails?.ringoverMeetLink && (
								<div
									className={styles.copy}
									onClick={() => {
										navigator.clipboard.writeText(eventDetails?.ringoverMeetLink);
										addSuccess("Link copied to clipboard");
									}}
								>
									<CopyBlank
										color={Colors.veryLightBlue}
										className={styles.copyIcon}
										size="1.4rem"
									/>
								</div>
							)}
						</div>
					</div>
					{edit && (
						<div className={styles.editBtns}>
							<ThemedButton
								width="fit-content"
								height="40px"
								theme={ThemedButtonThemes.GREY}
								className={styles.btn}
								onClick={() => {
									setAddEditEvent({
										date: eventDetails?.date,
										type: "edit",
										events: events,
										data: eventDetails,
									});
								}}
							>
								<Edit size="16px" color={Colors.lightBlue} />
								Edit event
							</ThemedButton>
							<ThemedButton
								width="fit-content"
								height="40px"
								theme={ThemedButtonThemes.GREY}
								className={styles.btn}
								onClick={handleDeleteEvent}
								loading={deleteEventLoading}
								loadingText="deleting event..."
							>
								<Trash size="16px" color={Colors.red} />
								Delete event
							</ThemedButton>
						</div>
					)}
				</>
			)}
			{addEditEvent && (
				<AddEditEvent
					addEditEvent={addEditEvent}
					closeAddEditEvent={() => setAddEditEvent(false)}
					lead={lead}
					onClose={() => {
						setAddEditEvent(null);
						setEventDetails(null);
						closeCalendarModal && closeCalendarModal();
					}}
					refetchEvents={refetchEvents}
				/>
			)}
		</Modal>
	);
};

export default EventDetailsModal;
