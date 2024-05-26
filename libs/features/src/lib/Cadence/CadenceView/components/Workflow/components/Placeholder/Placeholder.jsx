import { Skeleton } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

const Placeholder = ({ rows = 10 }) => {
	return (
		<>
			{[...Array(rows)].map((_, i) => (
				<div>
					<Skeleton className={styles.placeholder} />
				</div>
			))}
		</>
	);
};

export default Placeholder;
