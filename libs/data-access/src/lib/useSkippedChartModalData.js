import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";
import db from "../../../features/src/lib/Statistics/components/SkippedchartCard/db.json";

const useSkippedChartModalData = () => {
	const sendId = body => {
		if (body?.user_ids === []) delete body?.user_ids;

		const URL = "/statistics/v2/skipped-tasks";
		return AuthorizedApi.post(URL, body).then(res => {
			let resData = res?.data.data;
			resData = [
				...resData.map(task => ({
					value: task.skipped_count,
					name:
						task.skip_reason === "Other" || task.skip_reason === null
							? "Other"
							: task.skip_reason === "already_completed"
							? "alreadydone"
							: task.skip_reason === "no_mails"
							? "nomails"
							: task.skip_reason === "duplicated_lead"
							? "duplicatelead"
							: task.skip_reason,
				})),
			]
				.reduce((acc, curr) => {
					const isPresent = acc.findIndex(prev => {
						return prev.name === curr.name;
					});
					if (isPresent >= 0) {
						acc[isPresent].value += curr.value;
						return acc;
					} else {
						return [...acc, curr];
					}
				}, [])
				.sort((a, b) => {
					let fa = a.name.toLowerCase(),
						fb = b.name.toLowerCase();

					if (fa < fb) {
						return -1;
					}
					if (fa > fb) {
						return 1;
					}
					return 0;
				});
			return resData;
		});
	};

	const {
		mutate: getSkippedChartModalData,
		data,
		isLoading: loading,
		isSuccess: success,
	} = useMutation(sendId);
	return {
		getSkippedChartModalData,
		data,
		loading,
		success,
	};
};
export default useSkippedChartModalData;
