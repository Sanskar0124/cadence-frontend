import React from "react";
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

export const DurationPlaceholder = () => {
	return (
		<div className={styles.calendarDurationPlaceholder}>
			<Skeleton className={styles.duration} />
			<Skeleton className={styles.duration} />
			<Skeleton className={styles.duration} />
			<Skeleton className={styles.duration} />
		</div>
	);
};

export const SlotsPlaceholder = () => {
	return (
		<div className={styles.calendarSlotsPlaceholder}>
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
			<Skeleton className={styles.slot} />
		</div>
	);
};
