import { Skeleton } from "@cadence-frontend/components";
import styles from "./Placeholder.module.scss";

//components

//constants

export const CadencesPlaceholder = () => {
	return (
		<div className={styles.cadencesPlaceholder}>
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
		</div>
	);
};

export const LiveFeedsPlaceholder = () => {
	return (
		<div className={styles.liveFeedsPlaceholder}>
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
			<Skeleton className={styles.sk} />
		</div>
	);
};

export const CalendarPlaceholder = () => {
	return (
		<div className={styles.calendarPlaceholder}>
			<Skeleton className={styles.sk} />
		</div>
	);
};
