import { Skeleton } from "@cadence-frontend/components";
import styles from "./Placeholder.module.scss";

export const SingleSkeleton = ({ className = "" }) => (
	<Skeleton className={`${styles.singleSkeleton} ${className}`} />
);

const FormPlaceholder = ({ row }) => {
	return (
		<div className={styles.formPlaceholder}>
			{Array.from(Array(row).keys()).map((j, i) => (
				<div className={styles.formRow}>
					<SingleSkeleton /> <SingleSkeleton /> <SingleSkeleton />
				</div>
			))}
		</div>
	);
};
export default FormPlaceholder;
