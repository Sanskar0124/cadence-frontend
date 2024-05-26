import styles from "./Sidebar.module.scss";

//components
import { VIEW_MODES } from "../../constants";
import TaskInfo from "../TaskInfo/TaskInfo";
import Filters from "../Filters/Filters";
import Calendar from "../Calendar/Calendar";
import { ErrorBoundary } from "@cadence-frontend/components";

//constants

const Sidebar = ({
	viewMode,
	filterProps,
	className,
	onClose,
	activeTaskInfo,
	setTasks,
	userId,
	setUserId,
	tasks,
	stopPower,
	leadTimezones,
	leadTimezoneLoading,
	refetchTasks,
	...rest
}) => {
	const RenderView = viewMode => {
		switch (viewMode) {
			case VIEW_MODES.TASK:
				return (
					<TaskInfo
						{...filterProps}
						activeTaskInfo={activeTaskInfo}
						tasks={tasks}
						setTasks={setTasks}
						onSidebarClose={onClose}
						userId={userId}
						stopPower={stopPower}
						refetchTasks={refetchTasks}
					/>
				);
			case VIEW_MODES.FILTER:
				return (
					<Filters
						{...filterProps}
						onSidebarClose={onClose}
						userId={userId}
						setUserId={setUserId}
						tasks={tasks}
						leadTimezones={leadTimezones}
						leadTimezoneLoading={leadTimezoneLoading}
					/>
				);
			case VIEW_MODES.CALENDAR:
				return <Calendar onSidebarClose={onClose} />;
		}
	};

	return (
		<div
			className={`${styles.sidebar} ${styles[viewMode]} ${
				viewMode ? styles.open : styles.close
			} ${className ?? ""}`}
		>
			{RenderView(viewMode)}
		</div>
	);
};

export default Sidebar;
