import { Skeleton } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

const Placeholder = ({ rows = 10 }) => {
	return (
		<>
			{[...Array(rows)].map((_, i) => (
				<Skeleton className={styles.placeholder} />
			))}
		</>
	);
};

export default Placeholder;
