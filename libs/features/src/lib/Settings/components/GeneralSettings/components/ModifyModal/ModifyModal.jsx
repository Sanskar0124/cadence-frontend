import { useState, useEffect } from "react";
import styles from "./ModifyModal.module.scss";

//components
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

//constants

const ModifyModal = ({
	children,
	className,
	isOpen,
	onClose,
	onCancel,
	onSave,
	header,
}) => {
	const user = useRecoilValue(userInfo);

	return (
		<Modal
			isModal={isOpen}
			onClose={onClose}
			className={`${styles.modifyModal} ${className ?? ""}`}
		>
			<div className={styles.header}>{header}</div>
			<div className={styles.body}>{children}</div>
			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.WHITE}
					onClick={() => {
						onCancel();
					}}
				>
					{" "}
					<div>{COMMON_TRANSLATION.CANCEL[user?.language?.toUpperCase()]}</div>
				</ThemedButton>{" "}
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => {
						onSave();
					}}
				>
					<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default ModifyModal;
