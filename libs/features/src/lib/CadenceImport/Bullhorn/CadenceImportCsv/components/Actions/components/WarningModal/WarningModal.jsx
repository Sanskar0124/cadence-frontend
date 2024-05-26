import { Exclude } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal, Title } from "@cadence-frontend/components";
import { Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import React, { useState, useCallback } from "react";
import Collapse from "./CollapseContainer/Collapse";
import styles from "./WarningModal.module.scss";

const WarningModal = ({
	onClose,
	isModal,
	iessuesInLead,
	totalIssue,
	list,
	setCheckedIssueLead,
	checkedIssueLead,
	onRemoveSelected,
}) => {
	return (
		<Modal
			isModal={isModal ? true : false}
			onClose={onClose}
			className={styles.WarningModal}
			showCloseButton
		>
			<div className={styles.header}>
				<Title size={"1.1rem"}>Warnings</Title>

				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					className={styles.btnRemoveSelected}
					style={{ width: "fit-content", height: "39px", borderRadius: "15px" }}
					onClick={() => onRemoveSelected()}
					disabled={!checkedIssueLead.length}
				>
					Remove selected{" "}
				</ThemedButton>
			</div>

			<div className={styles.subHeader}>
				<Title size={".9rem"} className={styles.title}>
					{" "}
					<Exclude /> <span> {totalIssue} warnings found</span>{" "}
				</Title>
			</div>

			<div className={styles.issuesReports}>
				{Object?.keys(iessuesInLead).map((issue, i) => {
					if (!iessuesInLead[issue]?.leads?.length) {
						return null;
					} else {
						return (
							<Collapse
								iessuesInLead={iessuesInLead}
								issue={issue}
								styles={styles}
								checkedIssueLead={checkedIssueLead}
								setCheckedIssueLead={setCheckedIssueLead}
							/>
						);
					}
				})}
			</div>
		</Modal>
	);
};

export default WarningModal;
