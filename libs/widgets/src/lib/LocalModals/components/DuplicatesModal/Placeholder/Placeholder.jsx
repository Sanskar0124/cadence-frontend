import { Skeleton } from "@cadence-frontend/components";

import styles from "./Placeholder.module.scss";

const Placeholder = () => {
	return (
		<div className={styles.container}>
			{[...Array(3)].map(_ => (
				<div className={styles.card}>
					<Skeleton className={styles.name} />
					<div className={styles.round}>
						<Skeleton className={styles.skeleton} />
					</div>
				</div>
			))}
		</div>
	);
};

Placeholder.propTypes = {};

export default Placeholder;
