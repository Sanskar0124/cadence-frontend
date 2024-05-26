import React from "react";
import styles from "./Label.module.scss";

const Label = ({ children, className, required = false, ...rest }) => {
	return (
		<label
			className={`${styles.label} ${required ? styles.required : ""} ${className}`}
			{...rest}
		>
			{children}
		</label>
	);
};

export default Label;
