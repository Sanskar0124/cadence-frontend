import { Button } from "@cadence-frontend/components";
import THEMES from "./themes";

import styles from "./TabNavSliderBtn.module.scss";

const TabNavSliderBtn = ({
	width,
	onClick,
	active,
	children,
	className,
	bordered,
	theme = "PRIMARY_GRADIENT",
	noAnimation,
	id,
}) => {
	return (
		<Button
			id={id}
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

export default TabNavSliderBtn;
