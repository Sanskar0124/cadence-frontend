import { useState, forwardRef, useEffect } from "react";
import THEMES from "./themes";

import { TriangleArrow } from "@cadence-frontend/icons";

import styles from "./CollapseContainer.module.scss";

const CollapseContainer = (
	{
		collapse,
		setCollapse,
		children,
		className,
		theme = "PRIMARY",
		openByDefault = true,
		title,
		onCollapse,
	},
	ref
) => {
	const [isOpen, setIsOpen] = useState(openByDefault ?? collapse ?? false);

	useEffect(() => {
		if (typeof setCollapse === "function") setCollapse(isOpen);
	}, [isOpen]);

	if (typeof onCollapse === "function") onCollapse(isOpen);

	return (
		<div
			className={`${styles.collapseContainer} ${className ?? ""} ${
				styles[THEMES[theme]]
			} ${isOpen && styles.expanded}`}
		>
			<div
				ref={ref}
				className={styles.collapseHeader}
				onClick={() => setIsOpen(prev => !prev)}
			>
				{title}
				<button className={`${styles.arrow} ${isOpen && styles.arrowDown}`}>
					<TriangleArrow size="0.8rem" />
				</button>
			</div>
			<div className={`${styles.collapseChildren} ${isOpen && styles.open} `}>
				{children}
			</div>
		</div>
	);
};

export default forwardRef(CollapseContainer);
