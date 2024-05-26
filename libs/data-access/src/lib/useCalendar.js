import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const useCalendar = ({ enabled = false }) => {
	//Get all events
	const getCalendarData = () =>
		AuthorizedApi.get("/calendar/v2/events").then(res => res.data.data);
	const {
		data: events,
		isLoading: eventsLoading,
		error,
		refetch: refetchEvents,
	} = useQuery("calendar", getCalendarData, {
		cacheTime: Infinity,
		enabled,
	});

	const addEventApi = body => {
		return AuthorizedApi.post("/calendar/v2/event", body);
	};
	const {
		mutate: addEvent,
		isLoading: addEventLoading,
		reset: resetEvents,
	} = useMutation(addEventApi, {
		onSuccess: () => {
			if (enabled) refetchEvents();
			else getFilteredEvents();
		},
	});

	const getFilteredCalendarData = body =>
		AuthorizedApi.post("/calendar/v2/events", body).then(res => res.data.data);

	const {
		data: filteredEvents,
		isLoading: filteredEventsLoading,
		error: filteredEventsError,
		mutate: getFilteredEvents,
	} = useMutation(getFilteredCalendarData, {});

	const editEventApi = body => {
		return AuthorizedApi.put(`calendar/v2/event/${body.eventId}?i=google`, body?.details);
	};
	const { mutate: editEvent, isLoading: editEventLoading } = useMutation(editEventApi, {
		onSuccess: () => {
			if (enabled) refetchEvents();
			else getFilteredEvents();
		},
	});

	const deleteEventApi = body => {
		return AuthorizedApi.delete(`calendar/v2/event/${body.eventId}?i=google`);
	};
	const { mutate: deleteEvent, isLoading: deleteEventLoading } = useMutation(
		deleteEventApi,
		{
			onSuccess: () => {
				if (enabled) refetchEvents();
				else getFilteredEvents();
			},
		}
	);

	return {
		events,
		eventsLoading,
		error,
		addEvent,
		editEvent,
		refetchEvents,
		addEditLoading: addEventLoading || editEventLoading,
		getFilteredEvents,
		filteredEvents,
		filteredEventsLoading,
		filteredEventsError,
		resetEvents,
		deleteEvent,
		deleteEventLoading,
	};
};

export default useCalendar;
