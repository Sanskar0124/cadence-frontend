import { MailDeleted } from "@cadence-frontend/icons";

import styles from "./DeletedEmailIMC.module.scss";

const DeletedEmailIMC = () => {
	return (
		<div className={styles.deletedEmailIMC}>
			<div className={styles.icon}>
				<MailDeleted />
			</div>
			<h3 className={styles.title}>Sorry! This email does not exist</h3>
			<h4 className={styles.subTitle}>
				The email you are trying to access has been deleted.
			</h4>
		</div>
	);
};

export default DeletedEmailIMC;
