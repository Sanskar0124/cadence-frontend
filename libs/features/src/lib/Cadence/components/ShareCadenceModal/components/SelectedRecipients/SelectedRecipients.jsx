import React from "react";
import styles from "./SelectedRecipients.module.scss";
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { Minus } from "@cadence-frontend/icons";
function SelectedRecipients({
	selectedRecipients,
	setSelectedRecipients,
	type,
	...rest
}) {
	const getId = () => {
		if (type === CADENCE_TYPES.PERSONAL) {
			return `user_id`;
		} else if (type === CADENCE_TYPES.TEAM) {
			return `sd_id`;
		}
	};
	const getName = recipient => {
		if (type === CADENCE_TYPES.PERSONAL) {
			return recipient?.first_name + ` ${recipient?.last_name}`;
		} else if (type === CADENCE_TYPES.TEAM) {
			return recipient?.name;
		}
	};
	return (
		<div className={styles.list}>
			{selectedRecipients?.length > 0 &&
				selectedRecipients?.slice(0, 5)?.map(recipient => (
					<div className={styles.tag}>
						<span className={styles.selectedRecipient}>{getName(recipient)}</span>
						<Minus
							onClick={() =>
								setSelectedRecipients(prev =>
									prev?.filter(rec_id => rec_id?.[getId()] !== recipient?.[getId()])
								)
							}
						/>
					</div>
				))}
			{selectedRecipients?.length > 5 && (
				<div className={styles.tag}>
					<span className={styles.selectedRecipient}>
						+{`${selectedRecipients.length - 5}`} more
					</span>
				</div>
			)}
		</div>
	);
}

export default SelectedRecipients;
