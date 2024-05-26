import React, { useContext } from "react";

import styles from "./DeleteLeadsModal.module.scss";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Modal } from "@cadence-frontend/components";
import { ErrorGradient } from "@cadence-frontend/icons";

const DeleteLeadsModal = ({
	modal,
	deleteLeadsOption,
	setDeleteLeadsOption,
	setModal,
	handleClose,
	onDelete,
	loading,
}) => {
	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
		else handleClose();
		setDeleteLeadsOption({
			cadence_option: "selected",
		});
	};

	const onDeleteClick = () => {
		onDelete();
		onClose();
	};

	const user = useRecoilValue(userInfo);
	return (
		<Modal
			isModal={modal ? true : false}
			onClose={onClose}
			className={styles.deleteModal}
			showCloseButton
		>
			{/* <div className={styles.icon}>!</div> */}
			<div className={styles.title}>Delete lead</div>
			<div className={styles.warning}>
				{COMMON_TRANSLATION.LEAD_DELETE[user?.language?.toUpperCase()]}
				<div className={styles.leadDeleteOptions}>
					<div>
						<InputRadio
							checked={deleteLeadsOption?.cadence_option === "selected"}
							onChange={() => {
								setDeleteLeadsOption(prev => ({
									...prev,
									cadence_option: "selected",
								}));
							}}
						/>
						<span>
							{COMMON_TRANSLATION.LEAD_DELETE_FROM_CADENCE[
								user?.language?.toUpperCase()
							] ?? ""}{" "}
						</span>
					</div>
					<div>
						<InputRadio
							checked={deleteLeadsOption?.cadence_option === "all"}
							onChange={() => {
								setDeleteLeadsOption(prev => ({ ...prev, cadence_option: "all" }));
							}}
						/>
						<span>
							{COMMON_TRANSLATION.LEAD_DELETE_FROM_ALL_CADENCES[
								user?.language?.toUpperCase()
							] ?? ""}
						</span>{" "}
						{deleteLeadsOption?.cadence_option === "all" && (
							<div className={styles.dfacw}>
								<div>
									<ErrorGradient size="1rem" />
									&nbsp; Warning
								</div>
								{COMMON_TRANSLATION.LEADS_DELETE_WARNING[user?.language?.toUpperCase()] ??
									""}
							</div>
						)}
					</div>
				</div>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.RED}
				onClick={onDeleteClick}
				className={styles.deleteBtn}
				loading={loading}
			>
				<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default DeleteLeadsModal;
