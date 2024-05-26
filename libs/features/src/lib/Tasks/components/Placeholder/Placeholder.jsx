import { Skeleton } from "@cadence-frontend/components";
import styles from "./Placeholder.module.scss";

export const TASKS_LOADER = () => {
	return Array.from(Array(10).keys()).map((_, i) => (
		<Skeleton className={styles.task} key={i} />
	));
};
