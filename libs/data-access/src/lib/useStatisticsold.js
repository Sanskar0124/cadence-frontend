import moment from "moment-timezone";
import { useState } from "react";
import { useQuery } from "react-query";
import { AuthorizedApi } from "./api";
import { WEEK_DAYS } from "../../../features/src/lib/Statisticsold/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

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

const useStatisticsold = (enabled, { cadenceSelected }) => {
	const user = useRecoilValue(userInfo);
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const [filters, setFilters] = useState({
		filter: "today",
		cadence_id: [],
		user_ids: [],
	});
	const [graphFilters, setGraphFilters] = useState({
		node_type: "call",
	});

	const getPendingTasks = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		let URL = "/v2/admin/statistics/pending-task-stats";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];
			let linkedin = { value: 0, urgent: 0, late: 0 };
			let mail = { value: 0, urgent: 0, late: 0 };
			data = data.filter(
				task => !task["Node.type"].includes("automated") && task["Node.type"] !== "end"
			);
			data.forEach(task => {
				if (task["Node.type"].includes("linkedin")) {
					linkedin.value += task.pending_task_count;
					linkedin.urgent += task["urgent_task_count"];
					linkedin.late += task["Node.late_count"];
				} else if (task["Node.type"] === "mail" || task["Node.type"] === "reply_to") {
					mail.value += task.pending_task_count;
					mail.urgent += task["urgent_task_count"];
					mail.late += task["Node.late_count"];
				}
			});
			data = data?.filter(
				task =>
					!task["Node.type"].includes("linkedin") &&
					task["Node.type"] !== "mail" &&
					task["Node.type"] !== "reply_to"
			);
			data = [
				{ ...linkedin, name: "linkedin" },
				{ ...mail, name: "email" },
				...data.map(task => ({
					value: task.pending_task_count,
					urgent: task["urgent_task_count"],
					late: task["Node.late_count"],
					name:
						task["Node.type"] === "cadence_custom"
							? "custom"
							: task["Node.type"] === "data_check"
							? "datacheck"
							: task["Node.type"],
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
	} = useQuery(["pendingTasks", filters], getPendingTasks, { enabled: enabled.stats });

	const getCompletedTasks = async ({ queryKey }) => {
		const filters = queryKey[1];
		let body = filters;
		let URL = "/v2/admin/statistics/completed-task-stats";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res?.data.data ?? [];
			let linkedin = { value: 0, skipped: 0 };
			let mail = { value: 0, skipped: 0 };

			data = data.filter(task => !task.Node.type.includes("automated"));
			data.forEach(task => {
				if (task.Node.type.includes("linkedin")) {
					linkedin.value += task.complete_task_count;
					linkedin.skipped += task.skipped_task_count;
				} else if (task.Node.type === "mail" || task.Node.type === "reply_to") {
					mail.value += task.complete_task_count;
					mail.skipped += task.skipped_task_count;
				}
			});
			data = data?.filter(
				task =>
					!task.Node.type.includes("linkedin") &&
					task.Node.type !== "mail" &&
					task.Node.type !== "reply_to"
			);
			data = [
				{ ...linkedin, name: "linkedin" },
				{ ...mail, name: "email" },
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

	const getHistoryGraph = async ({ queryKey }) => {
		const filters = queryKey[1];
		const body = filters;
		const URL = "/v2/admin/statistics/history-graph";
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

			let data = res.data.data;
			let time = { start: "12PM", end: "" };
			if (
				(filters.filter === "last_3_months" && Object.keys(data).length > 3) ||
				(filters.filter === "last_6_months" && Object.keys(data).length > 6)
			) {
				let limit =
					Object.keys(data).length - (filters.filter === "last_3_months" ? 3 : 6);
				for (let i = 0; i < limit; i++) delete data[Object.keys(data)[0]];
			}
			let newdata = Object.keys(data).map(key => {
				key = parseInt(key);
				let obj = {};

				if (filters.filter === "this_week" || filters.filter === "last_week") {
					obj.name = WEEK_DAYS[weekDays[key]][user?.language?.toUpperCase()];
				} else if (Object.keys(data).length === 24) {
					time.end = `${(key + 1) % 12 === 0 ? 12 : (key % 12) + 1}${
						key + 1 > 12 ? "PM" : "AM"
					}`;
					obj.name = `${time.start} - ${time.end}`;
					time.start = time.end;
				} else if (
					filters.filter === "last_3_months" ||
					filters.filter === "last_6_months"
				) {
					obj.name = moment().month(key).format("MMMM");
				} else {
					let month;
					if (filters.filter === "this_month") {
						month = moment().format("MMM");
					} else {
						month = moment().subtract(1, "months").format("MMM");
					}

					obj.name = `${month} ${key}`;
				}

				if (filters.node_type === "mail" || filters.node_type === "automated_mail") {
					obj.sent = 0;
					obj.bounced = 0;
					obj.unsubscribed = 0;

					data[key].forEach(task => {
						task.Lead.Emails.forEach(email => {
							if (
								email.status === EMAIL_STATUS.DELIVERED ||
								email.status === EMAIL_STATUS.OPENED ||
								email.status === EMAIL_STATUS.CLICKED
							) {
								obj.sent++;
							}
							if (email.status === "bounced") obj.bounced++;
							if (email.unsubscribed === true) obj.unsubscribed++;
						});
					});
				} else if (filters.node_type === "call") {
					obj.outgoing = data[key].length;
					obj.sent = data[key].length;
				} else if (
					filters.node_type === "cadence_custom" ||
					filters.node_type === "data_check"
				) {
					obj.completed = data[key].length;
					obj.sent = data[key].length;
				} else if (filters.node_type === "done_tasks") {
					obj.done = data[key].length;
				} else {
					obj.sent = data[key].length;
				}
				return obj;
			});

			return newdata;
		});
	};

	const { data: graphData, isLoading: graphDataLoading } = useQuery(
		["history-graph", { ...filters, ...graphFilters }],
		getHistoryGraph,
		{ enabled: enabled.stats }
	);

	const getTableData = async ({ queryKey }) => {
		const filters = queryKey[1];
		const body = filters;
		const URL = "/v2/admin/statistics/history-table-stats";
		return await AuthorizedApi.post(URL, body).then(res => {
			let data = res.data.data;
			const getOpportunityMetricsData = Object?.values(res.data.data)?.at(
				-1
			)?.cadence_repartition;

			let cadences = Object?.keys(data);
			cadences = cadences.slice(0, -1);

			for (let cadenceId of cadences) {
				for (const keyName of Object.keys(data[cadenceId])) {
					if (typeof data[cadenceId] === "object") {
						if (Object.keys(data[cadenceId][keyName]).includes("user_id")) {
							const matchingCadence = getOpportunityMetricsData?.filter(cadenceObj => {
								return +cadenceObj.cadence_id === +cadenceId;
							});

							if (matchingCadence?.length > 0) {
								matchingCadence[0]?.user_repartition.forEach(userData => {
									data[cadenceId] = {
										...data[cadenceId],
										[userData?.user_id]: {
											...data[cadenceId][userData.user_id],
											...matchingCadence[0],
										},
									};
								});
							}
						}
					}
				}
			}
			let newData = Object.values(data)
				?.filter(key => Object?.values(key)?.length !== 0 && "count_opp" in key === false)
				?.map(cadence => {
					const isCadence = getOpportunityMetricsData?.find(
						cadence1 => cadence1.cadence_id === cadence.cadence_id
					);

					if (isCadence) {
						return {
							name: cadence.name,
							no_of_users: cadence.total_user_count,
							tasks: {
								noOfTasksDone: cadence.total_done_task_count ?? 0,
								noOfCalls: cadence.total_call_count ?? 0,
								noOfMessages: cadence.total_message_count ?? 0,
								noOfEmails: cadence.total_email_count ?? 0,
								noOfLinkedinTasks: cadence.total_linkedin_count ?? 0,
								noOfDataChecks: cadence.total_data_check_count ?? 0,
								noOfCustomTasks: cadence.total_cadence_custom_count ?? 0,
								noOfPeople: isCadence.total_leads_contacts ?? 0,
								noOfOpp: isCadence.count_opp ?? 0,
								noOfCppWon: isCadence.count_opp_won ?? 0,
								noOfRevenue: isCadence.generated_revenue ?? 0,
							},
							users: Object.keys(cadence)
								?.filter(
									user =>
										!user.includes("total") && user !== "name" && user !== "cadence_id"
								)
								?.map(key => {
									const isUser = cadence[key]?.user_repartition?.find(
										user => user.user_id === cadence[key].user_id
									);

									return {
										user_id: cadence[key]?.user_id,
										first_name: cadence[key]?.user_first_name,
										last_name: cadence[key]?.user_last_name,
										role: cadence[key]?.user_role,
										profile_picture: cadence[key]?.user_profile_picture,
										is_profile_picture_present: cadence[key]?.is_profile_picture_present,
										tasks: {
											noOfTasksDone: cadence[key]?.done_task_count ?? 0,
											noOfCalls: cadence[key]?.call_count ?? 0,
											noOfMessages: cadence[key]?.message_count ?? 0,
											noOfEmails: cadence[key]?.email_count ?? 0,
											noOfLinkedinTasks: cadence[key]?.linkedin_count ?? 0,
											noOfDataChecks: cadence[key]?.data_check_count ?? 0,
											noOfCustomTasks: cadence[key]?.cadence_custom_count ?? 0,
											noOfPeople: isUser?.total_leads_contacts ?? 0,
											noOfOpp: isUser?.count_opp ?? 0,
											noOfCppWon: isUser?.count_opp_won ?? 0,
											noOfRevenue: isUser?.generated_revenue ?? 0,
										},
									};
								}),
						};
					} else {
						return {
							name: cadence.name,
							no_of_users: cadence.total_user_count,
							tasks: {
								noOfTasksDone: cadence.total_done_task_count ?? 0,
								noOfCalls: cadence.total_call_count ?? 0,
								noOfMessages: cadence.total_message_count ?? 0,
								noOfEmails: cadence.total_email_count ?? 0,
								noOfLinkedinTasks: cadence.total_linkedin_count ?? 0,
								noOfDataChecks: cadence.total_data_check_count ?? 0,
								noOfCustomTasks: cadence.total_cadence_custom_count ?? 0,
								noOfPeople: isCadence?.total_leads_contacts ?? 0,
								noOfOpp: isCadence?.count_opp ?? 0,
								noOfCppWon: isCadence?.count_opp_won ?? 0,
								noOfRevenue: isCadence?.generated_revenue ?? 0,
							},

							users: Object.keys(cadence)
								?.filter(
									user =>
										!user.includes("total") && user !== "name" && user !== "cadence_id"
								)
								?.map(key => {
									return {
										user_id: cadence[key]?.user_id,
										first_name: cadence[key]?.user_first_name,
										last_name: cadence[key]?.user_last_name,
										role: cadence[key]?.user_role,
										profile_picture: cadence[key]?.user_profile_picture,
										is_profile_picture_present: cadence[key]?.is_profile_picture_present,
										tasks: {
											noOfTasksDone: cadence[key]?.done_task_count ?? 0,
											noOfCalls: cadence[key]?.call_count ?? 0,
											noOfMessages: cadence[key]?.message_count ?? 0,
											noOfEmails: cadence[key]?.email_count ?? 0,
											noOfLinkedinTasks: cadence[key]?.linkedin_count ?? 0,
											noOfDataChecks: cadence[key]?.data_check_count ?? 0,
											noOfCustomTasks: cadence[key].cadence_custom_count ?? 0,
											noOfPeople: 0,
											noOfOpp: 0,
											noOfOppWon: 0,
											noOfRevenue: 0,
										},
									};
								}),
						};
					}
				});

			return newData;
		});
	};

	const { data: tableData, isLoading: tableDataLoading } = useQuery(
		["history-table", filters],
		getTableData,
		{ enabled: enabled.stats }
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

	return {
		pendingTasks,
		pendingTaskLoading,
		pendingTaskRefetching,
		refetchPendingTasks,
		completedTasks,
		completedTaskLoading,
		completedTaskRefetching,
		refetchCompletedTasks,
		graphData,
		graphDataLoading,
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
	};
};

export default useStatisticsold;
