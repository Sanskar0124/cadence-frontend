import { useEffect, useRef } from "react";

import styles from "./Warning.module.scss";

//component
import { Close, Clock } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

const Warning = ({ warning, remove }) => {
	const handleClose = e => {
		e.preventDefault();
		remove();
	};

	return (
		<div className={`${styles.warningBox} ${styles.isActive}`}>
			<span
				className={styles.closeIcon}
				onClick={e => {
					handleClose(e);
				}}
			>
				<Close />
			</span>
			<div className={styles.warningText}>
				<Clock color={Colors.white} />
				{warning.text}
			</div>
		</div>
	);
};

export default Warning;
