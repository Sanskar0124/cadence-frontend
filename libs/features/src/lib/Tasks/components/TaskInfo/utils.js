import { getTaskEnum } from "@cadence-frontend/utils";

export const handleReceivedActivity = ({
	latestActivityFromSocket,
	setTaskToBeRemoved,
	activeTaskInfo,
	changeToNextPowerTask,
}) => {
	switch (latestActivityFromSocket.type) {
		case "call":
			if (getTaskEnum(activeTaskInfo) === "call") {
				setTaskToBeRemoved({
					task_id: activeTaskInfo.task_id,
					lead_id: latestActivityFromSocket.lead_id,
					action: "task_completed",
				});
				changeToNextPowerTask();
			}
			return;
		case "task_skipped":
			if (latestActivityFromSocket.lead_id === activeTaskInfo.Lead.lead_id)
				setTaskToBeRemoved({
					task_id: activeTaskInfo.task_id,
					lead_id: latestActivityFromSocket.lead_id,
					action: "task_skipped",
				});
			return;
		case "pause_cadence":
		case "stop_cadence":
		case "lead_converted":
		case "lead_disqualified":
		case "contact_disqualified":
		case "owner_change":
			if (latestActivityFromSocket.lead_id === activeTaskInfo.Lead.lead_id)
				setTaskToBeRemoved({
					task_id: activeTaskInfo.task_id,
					lead_id: activeTaskInfo.Lead?.lead_id,
					action: "task_to_be_removed",
				});
			return;
	}
};
