import styles from "./Sidebar.module.scss";

//components
import { VIEW_MODES } from "../../constants";
import Filters from "../Filters/Filters";
import Calendar from "../../../Tasks/components/Calendar/Calendar";
//constants

const Sidebar = ({
	viewMode,
	filterProps,
	className,
	onClose,
	activeTaskInfo,
	tasksDataAcess,
	addAgendaAsTask,
	setTasks,
	userId,
	setUserId,
	leads,
	...rest
}) => {
	const RenderView = viewMode => {
		switch (viewMode) {
			case VIEW_MODES.FILTER:
				return (
					<Filters
						{...filterProps}
						tasksDataAcess={tasksDataAcess}
						onSidebarClose={onClose}
						userId={userId}
						setUserId={setUserId}
					/>
				);
			case VIEW_MODES.CALENDAR:
				return <Calendar onSidebarClose={onClose} />;
		}
	};

	return (
		<div
			className={`${styles.sidebar} ${viewMode ? styles.open : styles.close} ${
				className ?? ""
			}`}
			{...rest}
		>
			{RenderView(viewMode)}
		</div>
	);
};

export default Sidebar;
