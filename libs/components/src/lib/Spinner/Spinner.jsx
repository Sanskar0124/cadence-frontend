import React from "react";
import styles from "./Spinner.module.scss";

//Note: Size must not be integer

function Spinner({ className, size, color }) {
	return (
		<div className={styles.container}>
			<div
				className={`${styles["lds-ring"]} ${className}`}
				style={{
					...(size && { width: `calc(${size} + 2px)`, height: `calc(${size} + 2px)` }),
				}}
			>
				<div
					style={{
						...(color && { borderTopColor: color }),
						...(size && { width: size, height: size }),
					}}
				></div>
				<div
					style={{
						...(color && { borderTopColor: color }),
						...(size && { width: size, height: size }),
					}}
				></div>
				<div
					style={{
						...(color && { borderTopColor: color }),
						...(size && { width: size, height: size }),
					}}
				></div>
				<div
					style={{
						...(color && { borderTopColor: color }),
						...(size && { width: size, height: size }),
					}}
				></div>
			</div>
		</div>
	);
}

export default Spinner;
