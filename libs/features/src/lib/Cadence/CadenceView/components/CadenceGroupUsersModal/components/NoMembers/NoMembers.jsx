import { Users } from "@cadence-frontend/icons";
import styles from "./NoMembers.module.scss";

const NoMembers = () => {
	return (
		<div className={styles.noMembers}>
			<Users />
			<h3>No members found</h3>
			<p>This group currently has no members</p>
		</div>
	);
};

export default NoMembers;
