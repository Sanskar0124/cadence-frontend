import { Skeleton } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

const ActivityPlaceholder = ({ rows }) => {
	return (
		<>
			{[...Array(rows)].map((_, i) => (
				<div className={styles.activityPlaceholder}>
					<Skeleton className={styles.activitySkeleton} />
				</div>
			))}
		</>
	);
};

export default ActivityPlaceholder;
