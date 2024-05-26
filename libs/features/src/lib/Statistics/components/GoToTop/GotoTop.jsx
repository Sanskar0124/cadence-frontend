import { ArrowUp, ArrowUpNew } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton, themeStyles } from "@cadence-frontend/widgets";
import React, { useState, useEffect } from "react";
import styles from "./Gototop.module.scss";

function GotoTop({ divRef, scrollposition }) {
	const goToBtn = () => {
		divRef?.current.scrollIntoView({ top: 0, behavior: "smooth" });
	};

	return (
		<div className={styles.scrolltotop}>
			{scrollposition > 600 && (
				<ThemedButton
					onClick={goToBtn}
					className={styles.topbutton}
					theme={ThemedButtonThemes.PINK}
				>
					{" "}
					<ArrowUpNew />
					To the top
				</ThemedButton>
			)}
		</div>
	);
}

export default GotoTop;

export const GotoTop1 = divRef => {
	return (
		<div className={styles.scrolltotop1}>
			<ThemedButton
				className={styles.topbutton1}
				theme={ThemedButtonThemes.PINK}
				height="50px"
				width="50px"
			>
				<ArrowUp className={styles.icon} />
			</ThemedButton>
		</div>
	);
};
