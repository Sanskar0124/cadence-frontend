import { Skeleton } from "@cadence-frontend/components";
import styles from "./Placeholders.module.scss";

export const SingleSkeleton = ({ className = "" }) => (
	<Skeleton className={`${styles.singleSkeleton} ${className}`} />
);

export const SellsyFieldsPlaceholder = () => {
	return (
		<div className={styles.sfPlaceholder}>
			{Array.from(Array(8).keys()).map((j, i) => (
				<SingleSkeleton />
			))}
		</div>
	);
};

export const FormEditorPlaceholder = ({ row }) => {
	return (
		<div className={styles.sfPlaceholder}>
			{Array.from(Array(row).keys()).map((j, i) => (
				<div className={styles.formRow}>
					<SingleSkeleton />
					<SingleSkeleton />
					<SingleSkeleton />
				</div>
			))}
		</div>
	);
};
