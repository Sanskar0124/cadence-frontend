import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";
import moment from "moment-timezone";

const HOUR_CONSTANTS = {
	0: "12AM-1AM",
	1: "1AM-2AM",
	2: "2AM-3AM",
	3: "3AM-4AM",
	4: "4AM-5AM",
	5: "5AM-6AM",
	6: "6AM-7AM",
	7: "7AM-8AM",
	8: "8AM-9AM",
	9: "9AM-10AM",
	10: "10AM-11AM",
	11: "11AM-12PM",
	12: "12PM-1PM",
	13: "1PM-2PM",
	14: "2PM-3PM",
	15: "3PM-4PM",
	16: "4PM-5PM",
	17: "5PM-6PM",
	18: "6PM-7PM",
	19: "7PM-8PM",
	20: "8PM-9PM",
	21: "9PM-10PM",
	22: "10PM-11PM",
	23: "11PM-12AM",
};

const useCompareCadenceData = () => {
	const addCadenceReq = body => {
		const weekDays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const hours = [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"11",
			"12",
			"13",
			"14",
			"15",
			"16",
			"17",
			"18",
			"19",
			"20",
			"21",
			"22",
			"23",
		];

		const dayOfMonths = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
			24, 25, 26, 27, 28, 29, 30, 31,
		];

		const URL = "/statistics/v2/compare-cadence";
		let addCadence = AuthorizedApi.post(URL, body).then(res => {
			let resData = res?.data?.data;

			let newData = {};
			Object.values(resData).map(item => {
				let newItem = { ...item }; // Create a copy of the item

				body?.kpiObjects.forEach(taskobj => {
					if (item.hasOwnProperty(taskobj.type)) {
						if (
							(taskobj.filter === "last_month" || taskobj.filter === "this_month") &&
							taskobj.comparisonType === "value_over_time"
						) {
							let month;
							if (taskobj.filter === "last_month")
								month = moment().subtract(1, "months").format("MMM");
							else month = moment().format("MMM");

							// newItem[taskobj.type] = item[taskobj.type].map(entry => ({
							// 	...entry,
							// 	cadence_name: item.name,
							// }));
							newItem[taskobj.type] = dayOfMonths.flatMap(day => {
								let dayData = item[taskobj.type].find(
									d => dayOfMonths[d.day_of_month - 1] === day
								);
								if (dayData) {
									return {
										name: `${month} ${day}`,
										count: dayData.count,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								} else {
									return {
										name: `${month} ${day}`,
										count: 0,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								}
							});
						} else if (
							(taskobj.filter === "this_week" || taskobj.filter === "last_week") &&
							taskobj.comparisonType === "value_over_time"
						) {
							newItem[taskobj.type] = weekDays.flatMap(day => {
								let dayData = item[taskobj.type].find(
									d => weekDays[d.day_of_week - 1] === day
								);
								if (dayData) {
									return {
										name: day,
										count: dayData.count,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								} else {
									return {
										name: day,
										count: 0,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								}
							});
						} else if (
							(taskobj.filter === "today" || taskobj.filter === "yesterday") &&
							taskobj.comparisonType === "value_over_time"
						) {
							newItem[taskobj.type] = hours.flatMap(hour => {
								let dayData = item[taskobj.type].find(d => hours[d.hour - 1] === hour);
								if (dayData) {
									return {
										name: HOUR_CONSTANTS[hour],
										count: dayData.count,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								} else {
									return {
										name: HOUR_CONSTANTS[hour],
										count: 0,
										cadence_id: item.cadence_id,
										cadence_name: item.name,
									};
								}
							});
						} else if (taskobj.comparisonType === "total_value") {
							newItem[taskobj.type] =
								item[taskobj.type].length > 0
									? item[taskobj.type].map(task => {
											const updatedtask = {
												...task,
												cadence_name: item.name,
												count: task.count,
											};
											// if (
											// 	updatedtask.hasOwnProperty("percentage") &&
											// 	updatedtask.percentage === null
											// ) {
											// 	updatedtask.percentage = 0;
											// }

											if (
												updatedtask.hasOwnProperty("count") &&
												updatedtask.count === null
											) {
												updatedtask.count = 0;
											}
											if (!updatedtask.hasOwnProperty("count")) {
												updatedtask.count = 0;
											}

											return updatedtask;
									  })
									: [{ count: 0, cadence_name: item.name }];
						}
						//  else
						//  {
						// 	newItem[taskobj.type] = item[taskobj.type].map(task => {
						// 		const updatedtask = { ...task, cadence_name: item.name };
						// 		// if (
						// 		// 	updatedtask.hasOwnProperty("percentage") &&
						// 		// 	updatedtask.percentage === null
						// 		// ) {
						// 		// 	updatedtask.percentage = 0;
						// 		// }

						// 		if (updatedtask.hasOwnProperty("count") && updatedtask.count === null) {
						// 			updatedtask.count = 0;
						// 		}
						// 		if (!updatedtask.hasOwnProperty("count")) {
						// 			updatedtask.count = 0;
						// 		}

						// 		return updatedtask;
						// 	});
						// }
					} else {
						newItem[taskobj.type] = [];
					}
				});

				newData = newItem;
			});
			return newData;
		});
		const allreq = Promise.all([addCadence]);
		return allreq;
	};

	const {
		mutate: getCadenceData,
		data,
		isLoading: loading,
		isSuccess: success,
	} = useMutation(addCadenceReq);
	return {
		getCadenceData,
		data,
		loading,
		success,
	};
};
export default useCompareCadenceData;
