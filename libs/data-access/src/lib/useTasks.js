/* eslint-disable no-console */
import { ROLES } from "@cadence-frontend/constants";
import { DEFAULT_FILTER_OPTIONS, FILTER_ENUMS_BACKEND } from "@cadence-frontend/utils";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const ENABLED_DEFAULT = {
	tasks: false,
	taskActivity: false,
	cadences: false,
	employees: false,
	timezones: false,
};

const useTasks = (enabled, role) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };
	const [filters, setFilters] = useState(DEFAULT_FILTER_OPTIONS);

	const [userId, setUserId] = useState(null);
	const [nextTaskId, setNextTaskId] = useState(null);
	const getTasks = async ({ queryKey }) => {
		const filters = queryKey[1];

		const newFilters = { ...filters };

		newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP] =
			newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" ||
			newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== 0
				? parseInt(filters[FILTER_ENUMS_BACKEND.CADENCE_STEP])
				: [];
		if (
			isNaN(newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP]) ||
			newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP] === 0
		)
			newFilters[FILTER_ENUMS_BACKEND.CADENCE_STEP] = [];

		const userId = queryKey[2];
		let body = {
			filters: newFilters,
		};

		let URL = "v2/sales/department/task";
		if (userId) {
			body.user_id = userId;
			switch (role) {
				case ROLES.ADMIN:
				case ROLES.SUPER_ADMIN:
					URL = "/v2/admin/tasks/user";
					break;
				case ROLES.MANAGER:
				case ROLES.SALESPERSON_MANAGER:
					URL = "/v2/sales/sub-department/manager/tasks/user";
					break;
			}
		}

		// console.log(typeof filters[FILTER_ENUMS_BACKEND.CADENCE_STEP]);
		// filters[FILTER_ENUMS_BACKEND.CADENCE_STEP]
		return await AuthorizedApi.post(URL, body).then(res => {
			return res.data;
		});
	};

	const {
		data: tasks,
		refetch: refetchTasks,
		isLoading: taskLoading,
	} = useQuery(["tasks", filters, userId], getTasks, {
		select: data => data?.data?.map(task => ({ ...task?.Task, Node: task?.Node })),
		enabled: enabled.tasks,
	});

	const templateApi = nodeId => {
		return AuthorizedApi.get(`/mail/v2/getAbtemplate/${nodeId}`).then(
			res => res?.data?.data
		);
	};
	const { mutate: fetchTemplate, isLoading: fetchTemplateLoading } =
		useMutation(templateApi);

	// get all data

	const getTaskActivity = async () => {
		let URL = `v2/sales/department/task/count/summary`;
		if (userId) {
			switch (role) {
				case ROLES.ADMIN:
				case ROLES.SUPER_ADMIN:
					URL = `/v2/admin/tasks/user/count/summary/${userId}`;
					break;
				case ROLES.MANAGER:
				case ROLES.SALESPERSON_MANAGER:
					URL = `/v2/sales/sub-department/manager/tasks/user/count/summary/${userId}`;
					break;
			}
		}
		return await AuthorizedApi.get(URL).then(res => res.data);
	};

	const {
		data: taskActivity,
		refetch: refetchTaskStats,
		isLoading: taskActivityLoading,
	} = useQuery(["tasksActivity"], getTaskActivity, {
		enabled: enabled.taskActivity,
		select: data => data?.data,
	});

	useEffect(() => {
		if (userId !== null) {
			refetchTasks();
			refetchTaskStats();
		}
	}, [userId]);

	//task Completion
	const [taskCompletionError, setTaskCompletionError] = useState();

	// const markTaskAsComplete = async (task_id, cb) => {
	// 	setTaskCompletionError("");
	// 	// setNextTaskId(null);
	// 	try {
	// 		var url = `v1/sales/department/task/complete/${task_id}`;
	// 		const res = await AuthorizedApi.get(url);
	// 		const data = await res.data;
	// 		if (res.status !== 200) {
	// 			if (cb && typeof cb === "function") cb();
	// 			throw new Error(
	// 				data.msg || "Some taskCompletionError occured, please try again."
	// 			);
	// 		}
	// 		if (res.status === 200 && data?.data?.data?.task_id)
	// 			localStorage.setItem("next_task_id", data?.data?.data?.task_id);
	// 		if (cb && typeof cb === "function") cb(task_id);
	// 	} catch (err) {
	// 		if (err.message.includes("already completed")) {
	// 			if (cb && typeof cb === "function") cb();
	// 		}
	// 		setTaskCompletionError(err.message);
	// 	}
	// };

	const markTaskAsCompleteApi = async ({ task_id, body }) => {
		const { data } = await AuthorizedApi.post(
			`v2/sales/department/task/complete/${task_id}`,
			body
		);
		return data;
	};

	const { mutate: markTaskAsComplete, isLoading: markTaskAsCompleteLoading } =
		useMutation(markTaskAsCompleteApi, {
			onSuccess: data => {
				if (data?.data?.data?.task_id)
					localStorage.setItem("next_task_id", data?.data?.data?.task_id);
			},
			onError: err => {
				setTaskCompletionError(err?.response?.data?.msg);
			},
		});

	const getCustomTaskApi = async ({ event_id, task_id }) => {
		if (event_id) {
			const { data } = await AuthorizedApi.get(
				`/v2/sales/department/task/custom/${task_id}/${event_id}`
			);
			return data;
		} else {
			const { data } = await AuthorizedApi.get(
				`/v2/sales/department/task/custom/${task_id}`
			);
			return data;
		}
	};

	const { mutate: getCustomTask, isLoading: getCustomTaskLoading } =
		useMutation(getCustomTaskApi);

	const updateCustomTaskApi = async ({ task_id, body }) => {
		const { data } = await AuthorizedApi.patch(
			`/v2/sales/department/task/custom/${task_id}`,
			body
		);
		return data;
	};

	const { mutate: updateCustomTask, isLoading: updateCustomTaskLoading } =
		useMutation(updateCustomTaskApi);

	const addAgendaAsTaskApi = body =>
		AuthorizedApi.post(`v2/sales/department/task/custom`, body);

	const { mutate: addAgendaAsTask } = useMutation(addAgendaAsTaskApi);

	const skipTaskApi = body =>
		AuthorizedApi.post(`/v2/sales/department/task/skip-task/`, body);

	const { mutate: skipTask, isLoading: skipLoading } = useMutation(skipTaskApi, {
		onSuccess: data => {
			if (data?.data?.data?.data?.task_id)
				localStorage.setItem("next_task_id", data?.data.data.data.task_id);
		},
	});

	const FetchReasonsApi = async task_id => {
		const res = await AuthorizedApi.get(
			`/v2/sales/department/task/skip-task-reasons/${task_id}`
		);
		return res;
	};

	const { mutate: fetchReasons, isLoading: fetchReasonsLoading } = useMutation(
		FetchReasonsApi,
		{
			onSuccess: res => {
				if (res?.data?.data?.task_id)
					localStorage.setItem("next_task_id", res?.data?.data?.task_id);
				return res;
			},
			onError: err => {
				setTaskCompletionError(err?.response?.data?.msg);
			},
		}
	);

	const readActivityApi = activityId =>
		AuthorizedApi.get(`v1/sales/lead/activity/read/${activityId}`);

	const { mutate: readActivity } = useMutation(readActivityApi);

	const getEmployees = async () =>
		AuthorizedApi.get("/v2/sales/department/company/employees").then(
			res => res.data.data
		);

	const { data: employees, isLoading: employeesLoading } = useQuery(
		"employees-for-custom",
		getEmployees,
		{
			enabled: enabled.employees,
		}
	);

	const getLeadTimezonesApi = () => {
		return AuthorizedApi.get("/v2/sales/department/cadence/timezone-filter").then(
			res => res.data.data
		);
	};

	const { data: timeszones, isLoading: timezonesLoading } = useQuery(
		"lead_timezone",
		getLeadTimezonesApi,
		{
			enabled: enabled.timezones,
		}
	);

	return {
		tasks,
		taskLoading,
		refetchTasks,
		fetchTemplate,
		fetchTemplateLoading,
		taskActivity,
		filters,
		setFilters,
		userId,
		setUserId,
		taskActivityLoading,
		nextTaskId,
		setNextTaskId,
		markTaskAsComplete,
		markTaskAsCompleteLoading,
		// markTaskAsCompleteNew,
		taskCompletionError,
		setTaskCompletionError,
		addAgendaAsTask,
		refetchTaskStats,
		skipTask,
		skipLoading,
		readActivity,
		employees,
		employeesLoading,
		fetchReasons,
		fetchReasonsLoading,
		getCustomTask,
		getCustomTaskLoading,
		updateCustomTask,
		updateCustomTaskLoading,

		//lead timezone
		timeszones,
		timezonesLoading,
	};
};
export default useTasks;
