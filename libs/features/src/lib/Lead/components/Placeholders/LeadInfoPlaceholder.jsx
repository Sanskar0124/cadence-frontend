import { Skeleton } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

export const LeadNamePlaceholder = ({ rows }) => {
	return (
		<div className={styles.leadNamePlaceholder}>
			<Skeleton className={styles.leadNameSkeleton} />
			<Skeleton className={styles.timezoneSkeleton} />
		</div>
	);
};

export const LeadDetailsPlaceholder = ({ rows }) => {
	return (
		<div className={styles.leadDetailsPlaceholder}>
			<Skeleton className={styles.first} />
			<Skeleton className={styles.second} />
			<Skeleton className={styles.third} />
		</div>
	);
};

export const LeadCadencesPlaceholder = ({ rows }) => {
	return (
		<>
			{[...Array(rows)].map((_, i) => (
				<div className={styles.leadCadencesPlaceholder}>
					<Skeleton className={styles.leadCadencesSkeleton} />
				</div>
			))}
		</>
	);
};
