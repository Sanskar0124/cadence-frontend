import { AuthorizedApi } from "./api";
import { useMutation, useQuery } from "react-query";

// const ENABLED_DEFAULT = {
// 	generate: false,
//   get: false
// };

const useActivityLogs = (enabled = false) => {
	// enabled = { ...ENABLED_DEFAULT, ...enabled };

	const updateActivityLogsApi = data =>
		AuthorizedApi.put("/v2/company/activities", data).then(res => res.data);

	const { mutate: updateActivityLogs, isLoading: updateLoading } =
		useMutation(updateActivityLogsApi);

	const getActivityLogs = () =>
		AuthorizedApi.get("/v2/company/activities").then(
			res => res.data.data.activity_to_log
		);

	const { data: activityLogs, isLoading: activityLogsLoading } = useQuery(
		"activity-logs",
		getActivityLogs,
		{
			enabled: enabled,
		}
	);

	return { activityLogs, activityLogsLoading, updateActivityLogs, updateLoading };
};

export default useActivityLogs;
