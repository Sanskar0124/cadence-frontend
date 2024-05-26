import { LEAD_WARMTH } from "@cadence-frontend/constants";

export const removeCurrentHotLeadsFromTask = ({ tasks, activeTaskInfo, lead_id }) => {
	try {
		let activeLeadId = activeTaskInfo?.Lead?.lead_id || lead_id;
		let updatedTasks = tasks?.map((task, ind) => {
			if (task?.Lead?.lead_id === activeLeadId)
				return {
					...task,
					Lead: {
						...(task?.Lead ?? []),
						lead_score: 0,
						lead_warmth: LEAD_WARMTH.COLD_LEAD,
					},
				};
			return task;
		});
		return updatedTasks;
	} catch (err) {
		return tasks;
	}
};

export const setCurrentHotLeadsFromTask = ({ tasks, activeTaskInfo, lead_id }) => {
	try {
		let activeLeadId = activeTaskInfo?.Lead?.lead_id || lead_id;
		let updatedTasks = tasks?.map((task, ind) => {
			if (task?.Lead?.lead_id === activeLeadId)
				return {
					...task,
					Lead: {
						...(task?.Lead ?? []),
						lead_warmth: LEAD_WARMTH.HOT_LEAD,
					},
				};
			return task;
		});
		return updatedTasks;
	} catch (err) {
		return tasks;
	}
};
