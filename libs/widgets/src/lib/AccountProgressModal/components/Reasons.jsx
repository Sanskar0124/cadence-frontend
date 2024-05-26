import { InputRadio } from "@cadence-frontend/widgets";
import React, { useState } from "react";
import styles from "./Reasons.module.scss";

const Reasons = ({ picklistValue, showReasons, setReasons, reasons, isSelected }) => {
	const [check, setCheck] = useState(false);

	return (
		<div
			className={`${styles.reasonWrapper} ${
				showReasons ? styles.activeReasons : styles.unactiveReasons
			}`}
		>
			{picklistValue.map(reas => (
				<div className={styles.reasons}>
					<InputRadio
						checked={reasons === reas}
						onChange={val => {
							setReasons(reas);
							setCheck(val.target.checked);
						}}
						dimensions={{
							height: "30px",
							width: "30px",
						}}
						name={"reasons"}
						className={styles.checkReason}
					/>
					<p
						className={styles.reasonLabel}
						style={{
							fontWeight: reasons === reas ? "700" : "400",
						}}
					>
						{reas.label}
					</p>
				</div>
			))}
		</div>
	);
};

export default Reasons;
