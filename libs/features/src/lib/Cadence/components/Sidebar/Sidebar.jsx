//components
import { VIEW_MODES } from "../../constants";
import Filters from "../Filters/Filters";

//constants

import styles from "./Sidebar.module.scss";

const Sidebar = ({ viewMode, filterProps, className, onClose, ...rest }) => {
	const RenderView = viewMode => {
		switch (viewMode) {
			case VIEW_MODES.FILTER:
				return <Filters {...filterProps} onSidebarClose={onClose} />;
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
