import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const useCalendarSettings = () => {
	const fetchSettings = () => {
		return AuthorizedApi.get("/v2/user/calendar").then(res => res.data.data);
	};

	const { data: calendarSettings, isLoading: calendarSettingsLoader } = useQuery(
		"calendarSettings",
		fetchSettings
	);

	return {
		calendarSettings,
		calendarSettingsLoader,
	};
};

export default useCalendarSettings;
