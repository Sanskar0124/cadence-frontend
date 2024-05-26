import { Div } from "@cadence-frontend/components";
import React from "react";
import styles from "./Placeholder.module.scss";

const Placeholder = ({ rows }) => {
	return (
		<div>
			{[...Array(rows).keys()].map(() => (
				<Div loading className={styles.placeholder} />
			))}
		</div>
	);
};

export default Placeholder;
