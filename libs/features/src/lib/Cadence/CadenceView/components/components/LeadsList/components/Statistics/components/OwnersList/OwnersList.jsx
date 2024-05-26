import { Image, Skeleton } from "@cadence-frontend/components";
import styles from "./OwnersList.module.scss";

export const OwnersList = ({ columns, className, children }) => {
	return (
		<div className={`${styles.listContainer} ${className ?? ""} `}>
			<div className={styles.listHeader}>
				{columns.map(column => (
					<span key={column}>{column}</span>
				))}
			</div>
			<div className={styles.listBody}>{children}</div>
		</div>
	);
};

export const Owner = ({
	ownerName,
	ownerRole,
	noOfLeads,
	className,
	imageURL = null,
	loading = false,
}) => {
	return (
		<div className={`${styles.listItem} ${className} `}>
			<div className={styles.owner}>
				{loading ? (
					<Skeleton className={styles.ownerImage} />
				) : (
					<Image
						className={styles.ownerImage}
						src={imageURL ?? "https://cdn.ringover.com/img/users/default.jpg"}
					/>
				)}
				<div className={styles.ownerInfo}>
					{loading ? (
						<>
							<Skeleton className={styles.blankPlaceholder} />
							<Skeleton className={styles.blankPlaceholder} />
						</>
					) : (
						<>
							<p className={styles.name}>{ownerName}</p>
							<p className={styles.role}>{ownerRole}</p>
						</>
					)}
				</div>
			</div>
			{loading ? (
				<Skeleton className={styles.placeholderLeads} />
			) : (
				<span className={styles.leadsNo}>{noOfLeads}</span>
			)}
		</div>
	);
};
