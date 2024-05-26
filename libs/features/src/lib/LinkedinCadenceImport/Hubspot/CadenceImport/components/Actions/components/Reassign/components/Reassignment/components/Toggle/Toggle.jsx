import React from "react";
import styles from "./Toggle.module.scss";

const Toggle = ({ name, checked, onChange, disabled = false, className }) => {
	return (
		<label className={`${styles.toggle} ${className ?? ""}`}>
			<input
				type="checkbox"
				name={name}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
			/>
			<span className={styles.checkmark}></span>
		</label>
	);
};

export default Toggle;
