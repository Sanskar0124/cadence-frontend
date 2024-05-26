import React from "react";
import styles from "./Title.module.scss";

const Title = ({ children, size = "2rem", className, ...rest }) => {
	return (
		<div
			className={styles.title + " " + className ?? ""}
			style={{ fontSize: size }}
			{...rest}
		>
			{children}
		</div>
	);
};

export default Title;
