import moment from "moment-timezone";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { AuthorizedApi } from "./api";
import resData from "../../../features/src/lib/Statistics/components/SkippedchartCard/data.json";
import db from "../../../features/src/lib/Statistics/components/SkippedchartCard/db.json";
// import { HOUR_CONSTANTS } from "../../../features/src/lib/Statistics/constants";

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

const ENABLED_DEFAULT = {
	stats: false,
	users: false,
	allUsers: false,
};

const EMAIL_STATUS = {
	CLICKED: "clicked",
	OPENED: "opened",
	DELIVERED: "delivered",
};

const useStatistics = (enabled, { cadenceSelected }, tablefor) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const [filters, setFilters] = useState({
		filter: "this_week",
		cadence_id: [],
		user_ids: [],
	});
	const [graphFilters, setGraphFilters] = useState({
		node_type: "call",
	});
	// TO_ASK

	const getCadenceData = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		let URL = "/statistics/v2/cadence-status";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data?.data;
			data = Object.entries(data).map(item => ({
				status: item[0],
				team: item[1]?.team ?? [],
				company: item[1]?.company ?? [],
				personal: item[1]?.personal ?? [],
				cadence_count:
					(item[1]?.team ? item[1]?.team.length : 0) +
					(item[1]?.personal ? item[1]?.personal?.length : 0) +
					(item[1]?.company ? item[1]?.company?.length : 0),
			}));
			const activeCadence = data?.filter(item => item.status === "in_progress");
			const pausedCadence = data?.filter(item => item.status === "paused");
			const idleCadence = data?.filter(item => item.status === "not_started");

			data = [...activeCadence, ...pausedCadence, ...idleCadence];
			return data;
		});
	};
	const {
		data: cadenceData,
		refetch: refetchCadenceData,
		isLoading: cadenceDataLoading,
		isRefetching: cadenceDataRefetching,
	} = useQuery(["cadenceData", filters], getCadenceData, { enabled: enabled.stats });

	const getLeadsCount = async ({ queryKey }) => {
		const filters = queryKey[1];
		const body = filters;
		const URL = "/statistics/v2/lead-status";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];
			let converted_count = data.reduce(
				(prevValue, curr) => prevValue + curr.converted_count,
				0
			);
			let disqualified_count = data.reduce(
				(prevValue, curr) => prevValue + curr.disqualified_count,
				0
			);
			let demobooked_count = data.reduce(
				(prevValue, curr) => prevValue + curr.demos_booked,
				0
			);
			let convertedData = [{ name: "converted", value: converted_count }];
			let disqualifiedData = [{ name: "disqualified", value: disqualified_count }];
			let demobookedData = [{ name: "demobooked", value: demobooked_count }];
			data = [...convertedData, ...disqualifiedData, ...demobookedData];

			return data;
		});
	};

	const {
		data: leadsCount,
		refetch: refetchLeadsCount,
		isLoading: leadsCountLoading,
		isRefetching: leadsCountRefetching,
	} = useQuery(["leadsCount", filters], getLeadsCount, {
		enabled: enabled.stats,
	});

	const getPendingTasks = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		// let URL = "/v2/admin/statistics2/pending-tasks";
		let URL = "/statistics/v2/pending-tasks";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];
			let linkedin = { value: 0, urgent: 0, late: 0 };
			let mail = { value: 0, urgent: 0, late: 0 };
			let call = { value: 0, urgent: 0, late: 0 };
			data = data.filter(
				task => !task.Node.type.includes("automated") && task.Node.type !== "end"
			);
			data.forEach(task => {
				if (task.Node.type.includes("linkedin")) {
					linkedin.value += task.pending_task_count;
					linkedin.urgent += task["urgent_task_count"];
					linkedin.late += task.Node.late_count;
				} else if (task.Node.type === "mail" || task.Node.type === "reply_to") {
					mail.value += task.pending_task_count;
					mail.urgent += task["urgent_task_count"];
					mail.late += task.Node.late_count;
				} else if (task.Node.type.includes("call")) {
					call.value += task.pending_task_count;
					call.urgent += task["urgent_task_count"];
					call.late += task.Node.late_count;
				}
			});
			data = data?.filter(
				task =>
					!task.Node.type.includes("linkedin") &&
					task.Node.type !== "mail" &&
					task.Node.type !== "reply_to" &&
					!task.Node.type.includes("call")
			);
			data = [
				{ ...linkedin, name: "linkedin" },
				{ ...mail, name: "email" },
				{ ...call, name: "call" },
				...data.map(task => ({
					value: task.pending_task_count,
					urgent: task["urgent_task_count"],
					late: task.Node.late_count,
					name:
						task.Node.type === "cadence_custom"
							? "custom"
							: task.Node.type === "data_check"
							? "datacheck"
							: task.Node.type,
				})),
			];

			data = data?.sort((a, b) => {
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

			return data;
		});
	};

	const {
		data: pendingTasks,
		refetch: refetchPendingTasks,
		isLoading: pendingTaskLoading,
		isRefetching: pendingTaskRefetching,
	} = useQuery(["pendingTasks", filters], getPendingTasks, {
		enabled: enabled.stats,
	});

	const getCompletedTasks = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		// let URL = "/v2/admin/statistics2/completed-tasks";
		let URL = "/statistics/v2/completed-tasks";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];
			let linkedin = { value: 0, skipped: 0 };
			let mail = { value: 0, skipped: 0 };
			let call = { value: 0, skipped: 0 };

			data = data.filter(task => !task.Node.type.includes("automated"));
			data.forEach(task => {
				if (task.Node.type.includes("linkedin")) {
					linkedin.value += task.complete_task_count;
					linkedin.skipped += task.skipped_task_count;
				} else if (task.Node.type === "mail" || task.Node.type === "reply_to") {
					mail.value += task.complete_task_count;
					mail.skipped += task.skipped_task_count;
				} else if (task.Node.type.includes("call")) {
					call.value += task.complete_task_count;
					call.skipped += task.skipped_task_count;
				}
			});
			data = data?.filter(
				task =>
					!task.Node.type.includes("linkedin") &&
					task.Node.type !== "mail" &&
					task.Node.type !== "reply_to" &&
					!task.Node.type.includes("call")
			);
			data = [
				{ ...linkedin, name: "linkedin" },
				{ ...mail, name: "email" },
				{ ...call, name: "call" },
				...data.map(task => ({
					value: task.complete_task_count,
					skipped: task.skipped_task_count,
					name:
						task.Node.type === "cadence_custom"
							? "custom"
							: task.Node.type === "data_check"
							? "datacheck"
							: task.Node.type,
				})),
			];

			data = data?.sort((a, b) => {
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
			return data;
		});
	};

	const {
		data: completedTasks,
		refetch: refetchCompletedTasks,
		isLoading: completedTaskLoading,
		isRefetching: completedTaskRefetching,
	} = useQuery(["completedTasks", filters], getCompletedTasks, {
		enabled: enabled.stats,
	});

	const getSkippedTasks = async ({ queryKey }) => {
		const filters = queryKey[1];
		const body = filters;
		// const URL = "/v2/admin/statistics2/skipped-tasks";
		const URL = "/statistics/v2/skipped-tasks";
		return await AuthorizedApi.post(URL, body).then(res => {
			let resData = res?.data.data ?? [];
			let reasonData = [...resData];
			// let resData=db?.data ?? [];
			// let reasonData=db?.data ??[];

			let linkedin = { value: 0 };
			let mail = { value: 0 };
			resData = resData.filter(task => !task.Node.type.includes("automated"));

			resData.forEach(task => {
				if (task.Node.type.includes("linkedin")) {
					linkedin.value += task.skipped_count;
				} else if (task.Node.type === "mail" || task.Node.type === "reply_to") {
					mail.value += task.skipped_count;
				}
			});
			// console.log(resData,"foreach")
			resData = resData?.filter(
				task =>
					!task.Node.type.includes("linkedin") &&
					task.Node.type !== "mail" &&
					task.Node.type !== "reply_to" &&
					task.Node.type !== "callback"
			);
			let newChartData = [
				{ ...linkedin, name: "linkedin" },
				{ ...mail, name: "email" },
				...resData.map(task => ({
					value: task.skipped_count,
					name:
						task.Node.type === "cadence_custom"
							? "custom"
							: task.Node.type === "data_check"
							? "datacheck"
							: task.Node.type === "message"
							? "SMS"
							: task.Node.type,
				})),
			];

			newChartData = newChartData.reduce((acc, curr) => {
				const isPresent = acc.findIndex(prev => {
					return prev.name === curr.name;
				});
				if (isPresent >= 0) {
					acc[isPresent].value += curr.value;
					return acc;
				} else {
					return [...acc, curr];
				}
			}, []);

			reasonData = [
				...reasonData.map(task => ({
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

			newChartData = newChartData?.sort((a, b) => {
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
			return { newChartData, reasonData };
		});
	};

	const {
		data: skippedTasks,
		refetch: refetchSkippedTasks,
		isLoading: skippedTaskLoading,
		isRefetching: skippedTaskRefetching,
	} = useQuery(["skippedTasks", filters], getSkippedTasks, { enabled: enabled.stats });

	const getHistoryGraphData = async ({ queryKey }) => {
		const filters = queryKey[1];
		const body = filters;
		// const URL = "/v2/admin/statistics2/history-graph";
		const URL = "/statistics/v2/history-graph";
		return await AuthorizedApi.post(URL, body).then(res => {
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

			let data = res?.data.data;
			// console.log(data, "data448");
			let time = { start: "12PM", end: "" };
			let newData;

			if (filters.filter === "this_week" || filters.filter === "last_week") {
				if (filters.node_type === "mail" || filters.node_type === "automated_mail") {
					newData = weekDays.map(day => {
						const obj = data.find(d => weekDays[d.day_of_week - 1] === day);
						if (obj) {
							return {
								name: day,
								bounced: obj.bounced_count,
								delivered: obj.delivered_count,
								unsubscribed: obj.unsubscribed_count,
								opened: obj.opened_count,
								clicked: obj.clicked_count,
							};
						} else {
							return {
								name: day,
								bounced: 0,
								delivered: 0,
								unsubscribed: 0,
								opened: 0,
								clicked: 0,
							};
						}
					});
				} else {
					newData = weekDays.map(day => {
						const obj = data.find(d => weekDays[d.day_of_week - 1] === day);
						if (obj) {
							return { name: day, done: obj.count };
						} else {
							return { name: day, done: 0 };
						}
					});
				}
			} else if (filters.filter === "today" || filters.filter === "yesterday") {
				if (filters.node_type === "mail" || filters.node_type === "automated_mail") {
					newData = hours.map(hour => {
						const obj = data.find(d => hours[d.hour] === hour);
						if (obj) {
							return {
								name: HOUR_CONSTANTS[hour],
								bounced: obj.bounced_count,
								delivered: obj.delivered_count,
								unsubscribed: obj.unsubscribed_count,
								opened: obj.opened_count,
								clicked: obj.clicked_count,
							};
						} else {
							return {
								name: HOUR_CONSTANTS[hour],
								bounced: 0,
								delivered: 0,
								unsubscribed: 0,
								opened: 0,
								clicked: 0,
							};
						}
					});
				} else {
					newData = hours.map(hour => {
						const obj = data.find(d => hours[d.hour] === hour);
						if (obj) {
							return { name: HOUR_CONSTANTS[hour], done: obj.count };
						} else {
							return { name: HOUR_CONSTANTS[hour], done: 0 };
						}
					});
				}
			} else if (filters.filter === "this_month" || filters.filter === "last_month") {
				let month;
				if (filters.filter === "this_month") {
					month = moment().format("MMM");
				} else {
					month = moment().subtract(1, "months").format("MMM");
				}
				if (filters.node_type === "mail" || filters.node_type === "automated_mail") {
					newData = dayOfMonths.map(day => {
						const obj = data.find(d => dayOfMonths[d.day_of_month - 1] === day);
						if (obj) {
							return {
								name: `${month} ${day}`,
								bounced: obj.bounced_count,
								delivered: obj.delivered_count,
								unsubscribed: obj.unsubscribed_count,
								opened: obj.opened_count,
								clicked: obj.clicked_count,
							};
						} else {
							return {
								name: `${month} ${day}`,
								bounced: 0,
								delivered: 0,
								unsubscribed: 0,
								opened: 0,
								clicked: 0,
							};
						}
					});
				} else {
					newData = dayOfMonths.map(day => {
						const obj = data.find(d => dayOfMonths[d.day_of_month - 1] === day);
						if (obj) {
							return { name: `${month} ${day}`, done: obj.count };
						} else {
							return { name: `${month} ${day}`, done: 0 };
						}
					});
				}
			}

			return newData;
		});
	};
	const { data: newgraphData, isLoading: newgraphDataLoading } = useQuery(
		["history-graphnew", { ...filters, ...graphFilters }],
		getHistoryGraphData,
		{ enabled: enabled.stats }
	);

	const getTableColumn = async () => {
		return await AuthorizedApi.get("/statistics/v2/table-columns").then(res => {
			let data = res?.data.data;

			let arrayOfObj = Object.entries(data).map(item => ({
				label: item[0],
				isVisible: item[1] === 0 ? false : true,
				order: item[1],
			}));
			return arrayOfObj;
		});
	};
	const { data: columnData, isLoading: columnDataLoading } = useQuery(
		["columndata"],
		getTableColumn,
		{ enabled: enabled.stats }
	);

	const getTableData = async ({ queryKey }) => {
		const filters = queryKey[1];
		const type = queryKey[2];

		const body = { ...filters, type: tablefor };
		const URL = "/statistics/v2/table";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data?.data;
			let dataCopy = { ...data };
			let headerRes = { ...data };
			headerRes = Object.keys(headerRes)
				.filter(key => key.includes("total"))
				.reduce((obj, key) => {
					return Object.assign(obj, {
						[key]: headerRes[key],
					});
				}, {});

			headerRes = {
				activeLeads: headerRes?.total_active_lead_count ?? 0,
				totalTasks: headerRes?.total_task_count ?? 0,
				doneTasks: headerRes?.total_done_task_count ?? 0,
				skippedTasks: headerRes?.total_skipped_task_count ?? 0,
				calls: headerRes?.total_call_count ?? 0,
				callback: headerRes?.total_callback_count ?? 0,
				mails: headerRes?.total_email_count ?? 0,
				semiAutomatedMails: headerRes?.total_mail_count ?? 0,
				semiAutomatedReplies:
					(headerRes?.total_email_count ?? 0) - (headerRes?.total_mail_count ?? 0),
				totalLeads: headerRes?.total_leads_in_cadence_sum ?? 0,
				disqualified: headerRes?.total_disqualified_count ?? 0,
				converted: headerRes?.total_converted_count ?? 0,
				automatedMails: headerRes?.total_automated_email_count ?? 0,
				automatedSms: headerRes?.total_automated_message_count ?? 0,
				// averageTime: !isNaN(
				// 	headerRes.total_done_time_count ?? 0 / headerRes.total_done_task_count ?? 0
				// )
				// 	? headerRes.total_done_time_count ?? 0 / headerRes.total_done_task_count ?? 0
				// 	: 0,

				customTask: headerRes?.total_cadence_custom_count ?? 0,
				dataCheck: headerRes?.total_data_check_count ?? 0,
				demosBooked: headerRes?.total_demos_booked ?? 0,
				linkedin: headerRes?.total_linkedin_count ?? 0,
				pendingTasks: headerRes?.total_pending_task_count ?? 0,
				semiAutomatedSms: headerRes?.total_message_count ?? 0,
				whatsapp: headerRes?.total_whatsapp_count ?? 0,
				lateTasks: headerRes?.total_late_task_count ?? 0,
				urgentTasks: headerRes?.total_urgent_task_count ?? 0,
			};

			const newData = Object.values(data)
				?.filter(key => typeof key === "object" && key !== null)
				?.map(cadence => {
					if (cadence?.name) {
						return {
							name: cadence?.name,
							no_of_users: cadence?.total_user_count,
							no_of_steps: cadence?.node_length,
							cadence_id: cadence?.cadence_id,
							tasks: {
								activeLeads: cadence?.total_active_lead_count ?? 0,
								automatedMails: cadence?.total_automated_email_count ?? 0,
								automatedSms: cadence?.total_automated_message_count ?? 0,

								// averageTime: isNaN(
								// 	Math.ceil(cadence.total_done_time_count / cadence.total_done_task_count)
								// )
								// 	? 0
								// 	: Math.ceil(
								// 			cadence.total_done_time_count / cadence.total_done_task_count
								// 	  ),
								calls: cadence?.total_call_count ?? 0,
								callback: cadence?.total_callback_count ?? 0,
								converted: cadence?.total_converted_count ?? 0,
								customTask: cadence?.total_cadence_custom_count ?? 0,
								dataCheck: cadence?.total_data_check_count ?? 0,
								demosBooked: cadence?.total_demos_booked ?? 0,
								disqualified: cadence?.total_disqualified_count ?? 0,
								doneTasks: cadence?.total_done_task_count ?? 0,
								linkedin: cadence?.total_linkedin_count ?? 0,
								pendingTasks: cadence?.total_pending_task_count ?? 0,
								semiAutomatedMails: cadence?.total_email_count ?? 0,
								semiAutomatedSms: cadence?.total_message_count ?? 0,
								skippedTasks: cadence?.total_skipped_task_count ?? 0,
								totalLeads: cadence?.total_leads_in_cadence_sum ?? 0,
								totalTasks: cadence?.total_task_count ?? 0,
								whatsapp: cadence?.total_whatsapp_count ?? 0,
								lateTasks: cadence?.total_late_task_count ?? 0,
								urgentTasks: cadence?.total_urgent_task_count ?? 0,
							},
							users: Object.keys(cadence)
								?.filter(
									user =>
										!user.includes("total") &&
										user !== "name" &&
										user !== "cadence_id" &&
										user !== "node_length"
								)
								?.map(key => {
									return {
										user_id: cadence[key]?.user_id,
										first_name: cadence[key]?.user_first_name,
										last_name: cadence[key]?.user_last_name,
										sub_department: cadence[key]?.sub_department,
										profile_picture: cadence[key]?.user_profile_picture,
										is_profile_picture_present: cadence[key]?.is_profile_picture_present,
										tasks: {
											activeLeads: {
												value: cadence[key]?.active_lead_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.active_lead_count /
															cadence?.total_active_lead_count) *
														100
													).toFixed()
												),
											},
											automatedMails: {
												value: cadence[key]?.automated_email_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.automated_email_count /
															cadence?.total_automated_email_count) *
														100
													).toFixed()
												),
											},
											automatedSms: {
												value: cadence[key]?.automated_message_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.automated_message_count /
															cadence?.total_automated_message_count) *
														100
													).toFixed()
												),
											},
											// averageTime: {
											// 	value: isNaN(
											// 		Math.ceil(
											// 			cadence[key].done_time_count / cadence[key].done_task_count
											// 		)
											// 	)
											// 		? 0
											// 		: Math.ceil(
											// 				cadence[key].done_time_count / cadence[key].done_task_count
											// 		  ),

											// },
											calls: {
												value: cadence[key]?.call_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.call_count / cadence?.total_call_count) *
														100
													).toFixed()
												),
											},
											callback: {
												value: cadence[key]?.callback_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.callback_count /
															cadence?.total_callback_count) *
														100
													).toFixed()
												),
											},
											converted: {
												value: cadence[key]?.converted_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.converted_count /
															cadence?.total_converted_count) *
														100
													).toFixed()
												),
											},
											customTask: {
												value: cadence[key]?.cadence_custom_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.cadence_custom_count /
															cadence?.total_cadence_custom_count) *
														100
													).toFixed()
												),
											},
											dataCheck: {
												value: cadence[key]?.data_check_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.data_check_count /
															cadence?.total_data_check_count) *
														100
													).toFixed()
												),
											},
											demosBooked: {
												value: cadence[key]?.demos_booked ?? 0,
												percentage: Number(
													(
														(cadence[key]?.demos_booked / cadence?.total_demos_booked) *
														100
													).toFixed()
												),
											},
											disqualified: {
												value: cadence[key]?.disqualified_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.disqualified_count /
															cadence?.total_disqualified_count) *
														100
													).toFixed()
												),
											},
											doneTasks: {
												value: cadence[key]?.done_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.done_task_count /
															cadence?.total_done_task_count) *
														100
													).toFixed()
												),
											},
											linkedin: {
												value: cadence[key]?.linkedin_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.linkedin_count /
															cadence?.total_linkedin_count) *
														100
													).toFixed()
												),
											},
											pendingTasks: {
												value: cadence[key]?.pending_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.pending_task_count /
															cadence?.total_pending_task_count) *
														100
													).toFixed()
												),
											},
											semiAutomatedMails: {
												value: cadence[key]?.email_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.email_count / cadence?.total_email_count) *
														100
													).toFixed()
												),
											},
											semiAutomatedSms: {
												value: cadence[key]?.message_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.message_count / cadence?.total_message_count) *
														100
													).toFixed()
												),
											},
											skippedTasks: {
												value: cadence[key]?.skipped_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.skipped_task_count /
															cadence?.total_skipped_task_count) *
														100
													).toFixed()
												),
											},
											totalLeads: {
												value: cadence[key]?.total_leads_in_cadence ?? 0,
												percentage: Number(
													(
														(cadence[key]?.total_leads_in_cadence /
															cadence?.total_leads_in_cadence_sum) *
														100
													).toFixed()
												),
											},
											totalTasks: {
												value: cadence[key]?.total_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.total_task_count / cadence?.total_task_count) *
														100
													).toFixed()
												),
											},
											whatsapp: {
												value: cadence[key]?.whatsapp_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.whatsapp_count /
															cadence?.total_whatsapp_count) *
														100
													).toFixed()
												),
											},
											lateTasks: {
												value: cadence[key]?.late_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.late_task_count /
															cadence?.total_late_task_count) *
														100
													).toFixed()
												),
											},
											urgentTasks: {
												value: cadence[key]?.urgent_task_count ?? 0,
												percentage: Number(
													(
														(cadence[key]?.urgent_task_count /
															cadence?.total_urgent_task_count) *
														100
													).toFixed()
												),
											},
										},
									};
								}),
						};
					} else {
						return {
							user_id: cadence?.user_id,
							first_name: cadence?.user_first_name,
							last_name: cadence?.user_last_name,
							sub_department: cadence?.sub_department,
							profile_picture: cadence?.user_profile_picture,
							is_profile_picture_present: cadence?.is_profile_picture_present,
							tasks: {
								activeLeads: {
									value: cadence?.active_lead_count ?? 0,
									percentage: Number(
										(
											(cadence?.active_lead_count / headerRes?.activeLeads) *
											100
										).toFixed()
									),
								},
								automatedMails: {
									value: cadence?.automated_email_count ?? 0,
									percentage: Number(
										(
											(cadence?.automated_email_count / headerRes?.automatedMails) *
											100
										).toFixed()
									),
								},
								automatedSms: {
									value: cadence?.automated_message_count ?? 0,
									percentage: Number(
										(
											(cadence?.automated_message_count / headerRes?.automatedSms) *
											100
										).toFixed()
									),
								},
								// averageTime: {
								// 	value: isNaN(
								// 		Math.ceil(
								// 			cadence[key].done_time_count / cadence[key].done_task_count
								// 		)
								// 	)
								// 		? 0
								// 		: Math.ceil(
								// 				cadence[key].done_time_count / cadence[key].done_task_count
								// 		  ),
								// },
								calls: {
									value: cadence?.call_count ?? 0,
									percentage: Number(
										((cadence?.call_count / headerRes?.calls) * 100).toFixed()
									),
								},
								callback: {
									value: cadence?.callback_count ?? 0,
									percentage: Number(
										((cadence?.callback_count / headerRes?.callback) * 100).toFixed()
									),
								},
								converted: {
									value: cadence?.converted_count ?? 0,
									percentage: Number(
										((cadence?.converted_count / headerRes?.converted) * 100).toFixed()
									),
								},
								customTask: {
									value: cadence?.cadence_custom_count ?? 0,
									percentage: Number(
										(
											(cadence?.cadence_custom_count / headerRes?.customTask) *
											100
										).toFixed()
									),
								},
								dataCheck: {
									value: cadence?.data_check_count ?? 0,
									percentage: Number(
										((cadence?.data_check_count / headerRes?.dataCheck) * 100).toFixed()
									),
								},
								demosBooked: {
									value: cadence?.demos_booked ?? 0,
									percentage: Number(
										((cadence?.demos_booked / headerRes?.demosBooked) * 100).toFixed()
									),
								},
								disqualified: {
									value: cadence?.disqualified_count ?? 0,
									percentage: Number(
										(
											(cadence?.disqualified_count / headerRes?.disqualified) *
											100
										).toFixed()
									),
								},
								doneTasks: {
									value: cadence?.done_task_count ?? 0,
									percentage: Number(
										((cadence?.done_task_count / headerRes?.doneTasks) * 100).toFixed()
									),
								},
								linkedin: {
									value: cadence?.linkedin_count ?? 0,
									percentage: Number(
										((cadence?.linkedin_count / headerRes?.linkedin) * 100).toFixed()
									),
								},
								pendingTasks: {
									value: cadence?.pending_task_count ?? 0,
									percentage: Number(
										(
											(cadence?.pending_task_count / headerRes?.pendingTasks) *
											100
										).toFixed()
									),
								},
								semiAutomatedMails: {
									value: cadence?.email_count ?? 0,
									percentage: Number(
										(
											(cadence?.email_count / headerRes?.semiAutomatedMails) *
											100
										).toFixed()
									),
								},
								semiAutomatedSms: {
									value: cadence?.message_count ?? 0,
									percentage: Number(
										(
											(cadence?.message_count / headerRes?.semiAutomatedSms) *
											100
										).toFixed()
									),
								},
								skippedTasks: {
									value: cadence?.skipped_task_count ?? 0,
									percentage: Number(
										(
											(cadence?.skipped_task_count / headerRes?.skippedTasks) *
											100
										).toFixed()
									),
								},
								totalLeads: {
									value: cadence?.total_leads_in_cadence ?? 0,
									percentage: Number(
										(
											(cadence?.total_leads_in_cadence / headerRes?.totalLeads) *
											100
										).toFixed()
									),
								},
								totalTasks: {
									value: cadence?.total_task_count ?? 0,
									percentage: Number(
										((cadence?.total_task_count / headerRes?.totalTasks) * 100).toFixed()
									),
								},
								whatsapp: {
									value: cadence?.whatsapp_count ?? 0,
									percentage: Number(
										((cadence?.whatsapp_count / headerRes?.whatsapp) * 100).toFixed()
									),
								},
								lateTasks: {
									value: cadence?.late_task_count ?? 0,
									percentage: Number(
										((cadence?.late_task_count / headerRes?.lateTasks) * 100).toFixed()
									),
								},
								urgentTasks: {
									value: cadence?.urgent_task_count ?? 0,
									percentage: Number(
										(
											(cadence?.urgent_task_count / headerRes?.urgentTasks) *
											100
										).toFixed()
									),
								},
							},
						};
					}
				});
			return { newData, headerRes };
		});
	};

	const { data: tableData, isLoading: tableDataLoading } = useQuery(
		["history-table", filters, tablefor],
		getTableData,
		{ enabled: enabled.stats, cacheTime: 0 }
	);

	//get all employees or get employees by subdepartment using sdId
	const getEmployeesApi = async ({ queryKey }) => {
		const cadenceSelected = queryKey[1];
		const body = {
			cadence_ids: cadenceSelected,
		};
		return await AuthorizedApi.post(
			"/v2/admin/statistics/fetch-cadence-users",
			body
		).then(res => res.data.msg);
	};

	const {
		data: employees,
		isLoading: employeesLoading,
		isRefetching: employeesRefetching,
	} = useQuery(["users", cadenceSelected], getEmployeesApi, {
		enabled: enabled.users,
	});

	//get all users in the company

	const fetchUsersApi = () =>
		AuthorizedApi.get("/v2/admin/statistics/fetch-all-users").then(res => res.data.data);

	const { data: users, isLoading: usersLoading } = useQuery(
		"users-for-statistics",
		fetchUsersApi,
		{
			enabled: enabled.allUsers,
		}
	);

	const getPendingEmailTasksData = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		let URL = "/statistics/v2/pending-tasks";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];

			data = data.filter(
				task => !task.Node.type.includes("automated") && task.Node.type !== "end"
			);

			data = data?.filter(
				task => task.Node.type === "mail" || task.Node.type === "reply_to"
			);
			data = [
				...data.map(task => ({
					value: task.pending_task_count,
					name:
						task.Node.type === "mail"
							? "semiAutomatedMails"
							: task.Node.type === "reply_to"
							? "semiAutomatedReplies"
							: null,
				})),
			].sort((a, b) => {
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
			// console.log(data,"pending statiscs");
			return data;
		});
	};
	const {
		data: pendingEmailTasks,
		refetch: refetchPendingEmailTasks,
		isLoading: pendingEmailTasksLoading,
		isRefetching: pendingEmailTasksRefetching,
	} = useQuery(["pendingEmailTasks", filters], getPendingEmailTasksData, {
		enabled: enabled.stats,
	});

	const getCompletedEmailTasksData = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		let URL = "/statistics/v2/completed-tasks";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];

			data = data.filter(
				task => !task.Node.type.includes("automated") && task.Node.type !== "end"
			);

			data = data?.filter(
				task => task.Node.type === "mail" || task.Node.type === "reply_to"
			);
			data = [
				...data.map(task => ({
					value: task.complete_task_count,
					name:
						task.Node.type === "mail"
							? "semiAutomatedMails"
							: task.Node.type === "reply_to"
							? "semiAutomatedReplies"
							: null,
				})),
			].sort((a, b) => {
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
			// console.log(data,"complted statiscs");
			return data;
		});
	};
	const {
		data: completedEmailTasks,
		refetch: refetchCompletedEmailTasks,
		isLoading: completedEmailTasksLoading,
		isRefetching: completedEmailTasksRefetching,
	} = useQuery(["completedEmailTasks", filters], getCompletedEmailTasksData, {
		enabled: enabled.stats,
	});

	return {
		completedEmailTasks,
		refetchCompletedEmailTasks,
		completedEmailTasksLoading,
		completedEmailTasksRefetching,
		columnData,
		columnDataLoading,
		cadenceData,
		cadenceDataLoading,
		cadenceDataRefetching,
		refetchCadenceData,
		leadsCount,
		leadsCountLoading,
		leadsCountRefetching,
		refetchLeadsCount,
		pendingTasks,
		pendingTaskLoading,
		pendingTaskRefetching,
		refetchPendingTasks,
		completedTasks,
		completedTaskLoading,
		completedTaskRefetching,
		refetchCompletedTasks,
		skippedTasks,
		skippedTaskLoading,
		skippedTaskRefetching,
		refetchSkippedTasks,
		tableData,
		tableDataLoading,
		filters,
		setFilters,
		graphFilters,
		setGraphFilters,
		employees,
		employeesLoading,
		employeesRefetching,
		users,
		usersLoading,
		pendingEmailTasks,
		pendingEmailTasksLoading,
		pendingEmailTasksRefetching,
		refetchPendingEmailTasks,
		newgraphData,
		newgraphDataLoading,
	};
};

export default useStatistics;

export const updateColumns = () => {
	const columns = body => {
		const URL = "/statistics/v2/update-table-columns";
		return AuthorizedApi.post(URL, body).then(res => {
			let resData = res?.data;
		});
	};

	const {
		mutate: getUpdatedColumns,
		data,
		isLoading: loading,
		isSuccess: success,
	} = useMutation(columns);

	return {
		getUpdatedColumns,
		data,
		loading,
		success,
	};
};
