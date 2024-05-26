import { useState, useEffect } from "react";
import styles from "./HoverContainer.module.scss";

const HoverContainer = ({
	children,
	setCurrentlyHovered,
	currentlyHovered,
	hoverValue,
	disableHover,
	hoverStyles, //used to implement this style when some other element triggers this hover
	className = "",
	scrollIntoView = false,
	forceHover = false,
	...rest
}) => {
	useEffect(() => {
		if (scrollIntoView) {
			if (currentlyHovered?.includes(hoverValue.value)) {
				document
					.getElementsByClassName(hoverStyles)[0]
					.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [currentlyHovered, hoverValue]);

	return (
		<div
			className={`${styles.hoverContainer} ${className} ${
				forceHover || currentlyHovered?.includes(hoverValue.value) ? hoverStyles : ""
			} ${disableHover ? styles.disableHover : ""}`}
			onMouseEnter={() => {
				setCurrentlyHovered(hoverValue.hovers);
			}}
			onMouseLeave={() => {
				setCurrentlyHovered([]);
			}}
			{...rest}
		>
			{children}
		</div>
	);
};

export default HoverContainer;
