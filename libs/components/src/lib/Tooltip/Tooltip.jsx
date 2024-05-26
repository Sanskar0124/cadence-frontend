import React from "react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import styles from "./Tooltip.module.scss";

const THEMES = {
	TOP: "top",
	RIGHT: "right",
	LEFT: "left",
	BOTTOM: "bottom",
};

const Tooltip = ({
	text,
	children,
	theme = "BOTTOM",
	span = false,
	className,
	...rest
}) => {
	return span ? (
		<span
			tooltip={text}
			className={`${styles.tooltip} ${styles[THEMES[theme]]} ${className ?? ""}`}
			{...rest}
		>
			<ErrorBoundary>{children}</ErrorBoundary>
		</span>
	) : (
		<div
			tooltip={text}
			className={`${styles.tooltip} ${styles[THEMES[theme]]} ${className ?? ""}`}
			{...rest}
		>
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	);
};

export default Tooltip;
