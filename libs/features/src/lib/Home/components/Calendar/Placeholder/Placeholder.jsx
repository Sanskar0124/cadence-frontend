import { Skeleton } from "@cadence-frontend/components";
import styles from "./Placeholder.module.scss";

export const EventsPlaceholder = () => {
	return (
		<div className={styles.calendarEventsPlaceholder}>
			<div>
				<Skeleton className={styles.time} />
				<Skeleton className={styles.event} />
			</div>
			<div>
				<Skeleton className={styles.time} />
				<Skeleton className={styles.event} />
			</div>
			<div>
				<Skeleton className={styles.time} />
				<Skeleton className={styles.event} />
			</div>
			<div>
				<Skeleton className={styles.time} />
				<Skeleton className={styles.event} />
			</div>
		</div>
	);
};
