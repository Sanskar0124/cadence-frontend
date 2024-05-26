import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ max, value }) => {
	return (
		<div className={styles.progress}>
			<div className={styles.completed} style={{ width: value }} />
		</div>
	);
};

export default ProgressBar;
