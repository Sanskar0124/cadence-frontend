import React, { useState } from "react";
import styles from "./LeadUrlModal.module.scss";
import { Modal, Tooltip } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Goto, CopyBlank, Bullhorn } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
const LeadUrlModal = ({ modal, setModal, url }) => {
	const [copy, setCopy] = useState("Copy");
	const onClose = () => {
		setModal(false);
	};

	return (
		<Modal
			showCloseButton
			leftCloseIcon
			isModal={modal}
			onClose={onClose}
			className={styles.leadUrlModal}
		>
			<div className={styles.header}>
				<div className={styles.salesForce}>
					{" "}
					<Bullhorn size={"50px"} />
				</div>
				<div className={styles.msg}>Form successfully completed</div>
				<p className={styles.headTo}>Head over to Bullhorn to see the changes</p>
			</div>
			<div className={styles.btn}>
				<Tooltip text={"Go to Lead"}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="144px"
						height="40px"
						onClick={() => window.open(url)}
					>
						<Goto color={Colors.lightBlue} />
						<span>Go to lead</span>
					</ThemedButton>
				</Tooltip>
				<Tooltip text={copy}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="144px"
						height="40px"
						onClick={() => {
							navigator.clipboard.writeText(url);
							setCopy("Copied");
						}}
					>
						<CopyBlank color={Colors.lightBlue} />
						<span>Copy URL</span>
					</ThemedButton>
				</Tooltip>
			</div>
		</Modal>
	);
};

export default LeadUrlModal;
