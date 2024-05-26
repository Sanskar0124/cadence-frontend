import React from "react";

import { Modal } from "@cadence-frontend/widgets";
import styles from "./EmailModal.module.scss";
import { Leads } from "@cadence-frontend/icons";
import { Pause, Stop } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

const EmailModal = ({ isOpen, onClose, ...props }) => {
	const closeModel = () => {
		onClose();
	};
	return (
		<Modal
			isModal={isOpen}
			onClose={closeModel}
			showCloseButton={true}
			className={styles.customTaskModal}
			leftCloseIcon={true}
		>
			{/* <EmailIMC preview={true} /> */}
			<div className={styles.heading}>
				<span className={styles.title}>Subject </span>
				company_name // full_name
			</div>
			<div className={styles.email_container}>
				<div className={styles.email}>
					<div className={styles.email_heading}>
						<div className={styles.user}>
							<div className={styles.pic}>
								<Leads />
							</div>
							<div className={styles.details}>
								<div className={styles.user_name}>Michael Scott</div>
								<div className={styles.user_email}>michaelscott@ringover.com</div>
							</div>
						</div>
						<div className={styles.date}>Sent on 21st May 2022, 5:38 PM</div>
					</div>
					<div className={styles.email_body}>
						Bonjour Michael Scott, <br />I am currenlty travelling and unavailable to
						initiate any business transactions. We can talk ince I get back.Yours
						sincerelyLorenza CleementasCreative Team Director, Walt Disney
					</div>
				</div>
				<div className={styles.cadence}>
					<div className={styles.pause}>
						<Pause color={Colors.lightBlue} size="16px" />
						<span>Pause cadence</span>
					</div>
					<div className={styles.stop}>
						<Stop color={Colors.lightBlue} size="16px" />
						<span>Stop cadence</span>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EmailModal;
