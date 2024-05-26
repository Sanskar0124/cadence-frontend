import { Button } from "@cadence-frontend/components";
import THEMES from "./themes";

import styles from "./TabNavBtn.module.scss";

const TabNavBtn = ({
	width,
	onClick,
	active,
	children,
	className,
	bordered,
	theme = "PRIMARY_GRADIENT",
	noAnimation,
}) => {
	return (
		<Button
			onClick={onClick}
			className={`${styles.tabNavBtn} ${styles[THEMES[theme]]} ${
				active ? styles.active : ""
			} ${noAnimation ? styles.noAnimation : ""} ${bordered && styles.bordered} ${
				className ?? ""
			}`}
			style={{ width }}
		>
			{children}
		</Button>
	);
};

export default TabNavBtn;
