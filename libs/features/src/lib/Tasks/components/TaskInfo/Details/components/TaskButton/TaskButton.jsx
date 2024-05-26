/* eslint-disable no-console */
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { getTaskEnum } from "@cadence-frontend/utils";
import CallTB from "./components/CallTB/CallTB";
import MailTB from "./components/MailTB/MailTB";
import DefaultTB from "./components/DefaultTB/DefaultTB";
import { useState } from "react";
import { InsufficientDataModal } from "@cadence-frontend/widgets";
import { CADENCE_NODE_TYPES } from "@cadence-frontend/constants";

const TaskButton = ({
	handleActionClick,
	handleCallClick,
	validateTask,
	activeTaskInfo,
	lead,
	loading,
	callLoading,
	userId,
	primaryPhone,
	setPrimaryPhone,
}) => {
	const stepName = getTaskEnum(activeTaskInfo);

	const renderTaskButton = () => {
		switch (stepName) {
			case CADENCE_NODE_TYPES.CALL:
			case CADENCE_NODE_TYPES.CALLBACK:
				return (
					<CallTB
						lead={lead}
						activeTaskInfo={activeTaskInfo}
						stepName={stepName}
						primaryPhone={primaryPhone}
						setPrimaryPhone={setPrimaryPhone}
						userId={userId}
						handleCallClick={handleCallClick}
						validateTask={validateTask}
						callLoading={callLoading}
						loading={loading}
					/>
				);
			case CADENCE_NODE_TYPES.REPLY_TO:
			case CADENCE_NODE_TYPES.MAIL:
				return (
					<MailTB
						userId={userId}
						loading={loading}
						handleActionClick={handleActionClick}
						stepName={stepName}
						activeTaskInfo={activeTaskInfo}
						lead={lead}
					/>
				);
			default:
				return (
					<DefaultTB
						userId={userId}
						loading={loading}
						handleActionClick={handleActionClick}
						stepName={stepName}
						lead={lead}
						validateTask={validateTask}
						activeTaskInfo={activeTaskInfo}
					/>
				);
		}
	};

	return renderTaskButton();
};

export default TaskButton;
