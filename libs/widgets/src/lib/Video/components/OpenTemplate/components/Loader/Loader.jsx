import { Skeleton } from "@cadence-frontend/components";
import styles from "./Loader.module.scss";
const Loader = () => {
	return (
		<div className={styles.loader}>
			<Skeleton className={styles.left} />
			<Skeleton className={styles.right} />
		</div>
	);
};

export default Loader;
