import { useState } from "react";
import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";

const useHeatmap = (filters, role) => {
	const [heatmapFilter, setHeatmapFilter] = useState({
		node_type: "mail",
	});

	const getHeatmapData = async () => {
		// const filters = queryKey[1];

		const URL = "/statistics/v2/heatmap";
		// const URL = "/v2/admin/statistics/heatmap";
		const cadence_ids =
			Array.isArray(filters.cadence_id) && filters.cadence_id.length === 0
				? []
				: filters.cadence_id;
		const user_ids =
			Array.isArray(filters.user_ids) && filters.user_ids.length === 0
				? []
				: filters.user_ids;

		const body = {
			...filters,
			...heatmapFilter,
			cadence_id: cadence_ids,
			user_ids,
		};

		return AuthorizedApi.post(URL, body);
	};

	const {
		data: heatmapData,
		isLoading: heatmapDataLoading,
		isError: heatmapHasError,
	} = useQuery(
		["heatmap-data", { ...filters, ...heatmapFilter }, { ...filters }],
		getHeatmapData,
		{
			cacheTime: 1000,
			// cacheTime: 10,
			select: data => {
				const responseData = data?.data?.data;
				let days = Object.keys(responseData);
				days = days.map(day => +day);
				const heatmapGridData = new Array(7).fill("-").map((_, day) => {
					if (days.includes(day)) {
						let hoursData = new Array(24).fill(0);
						let hours = Object.keys(responseData[day]);
						hours = hours?.map(hour => +hour);
						for (let hour of hours) {
							hoursData[hour] = responseData[day][hour];
						}
						return hoursData;
					} else {
						return new Array(24).fill(-1);
					}
				});
				return heatmapGridData;
			},
			// cacheTime: 1000,
			// select: data => {
			// 	const responseData = data?.data?.data;

			// 	let days = Object.keys(responseData);

			// 	days = days.map(day => +day);

			// 	const heatmapGridData = new Array(7).fill("-").map((_, day) => {
			// 		if (days.includes(day)) {
			// 			let hoursData = new Array(24).fill(0);
			// 			let hours = Object.keys(responseData[day]);
			// 			hours = hours.map(hour => +hour);
			// 			for (let hour of hours) {
			// 				hoursData[hour] = responseData[day][hour].length;
			// 			}
			// 			return hoursData;
			// 		} else {
			// 			return new Array(24).fill(-1);
			// 		}
			// 	});

			// 	return heatmapGridData;
			// },
		}
	);

	return {
		heatmapData,
		heatmapDataLoading,
		heatmapFilter,
		heatmapHasError,
		setHeatmapFilter: setHeatmapFilter,
	};
};

export default useHeatmap;
