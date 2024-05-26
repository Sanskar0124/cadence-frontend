import { Skeleton } from "@cadence-frontend/components";

import styles from "./LoaderRow.module.scss";

export const LoaderRow = () => {
	return [...Array(5)].map((_, j) => (
		<tr>
			<td key={j}>
				<Skeleton className={styles.tableRowPlaceholder} />
			</td>
		</tr>
	));
};

export default LoaderRow;
