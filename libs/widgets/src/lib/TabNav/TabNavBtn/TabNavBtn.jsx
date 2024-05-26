import { Button } from "@cadence-frontend/components";
import THEMES from "./themes";

import styles from "./TabNavBtn.module.scss";

const TabNavBtn = ({
	onClick,
	active,
	children,
	className,
	bordered,
	theme = "PRIMARY_GRADIENT",
}) => {
	return (
		<Button
			onClick={onClick}
			className={`${styles.tabNavBtn} ${styles[THEMES[theme]]} ${
				active ? styles.active : ""
			} ${className ?? ""}`}
		>
			{children}
		</Button>
	);
};

export default TabNavBtn;
