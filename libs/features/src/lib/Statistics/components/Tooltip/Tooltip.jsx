import { useState } from "react";
import styles from "./Tooltip.module.scss";

const THEMES = {
	BOTTOM: "bottom",
};

const Tooltip = ({ children, text, theme = "BOTTOM" }) => {
	const [isVisible, setIsVisible] = useState(false);
	return (
		<div
			className={styles.tooltip_container}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}
			{isVisible && (
				<div className={`${styles.tooltipcard} ${styles[THEMES[theme]]}`}>
					<div className={styles.tooltipcard_title}>{text.title}</div>
					<div className={styles.tooltipcard_content}>{text.content}</div>
				</div>
			)}
		</div>
	);
};

export default Tooltip;
