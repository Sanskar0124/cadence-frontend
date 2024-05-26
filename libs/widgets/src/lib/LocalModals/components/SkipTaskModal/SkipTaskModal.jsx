import React, { useContext, useEffect, useState } from "react";
import styles from "./SkipTaskModal.module.scss";
import { Modal, Skeleton } from "@cadence-frontend/components";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { useTasks } from "@cadence-frontend/data-access";
import { CadencesGradient } from "@cadence-frontend/icons";
import ThemedButton from "../../../ThemedButton/ThemedButton";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { AuthorizedApi } from "libs/data-access/src/lib/api";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SkipTaskModal = ({ modal, setModal, changeToNextPowerTask }) => {
	const { addError } = useContext(MessageContext);

	const [isNormal, setIsNormal] = useState(false);
	const [reasons, setReasons] = useState([]);
	const [selectedReason, setSelectedReason] = useState("");

	const user = useRecoilValue(userInfo);

	const { skipTask, skipLoading, fetchReasons, fetchReasonsLoading } = useTasks();

	useEffect(() => {
		fetchReasons(modal?.id, {
			onSuccess: res => {
				if (res && res.data.data.length > 0 && res.status === 200) {
					setReasons([...res?.data?.data]);
					setIsNormal(false);
				} else {
					setIsNormal(true);
				}
			},
			onError: err => {
				setIsNormal(true);
			},
		});
	}, []);

	const handleClose = () => {
		setModal(null);
	};

	const handleSubmit = type => {
		let body = {
			task_id: modal?.id,
		};
		if (type === "save") body.skip_reason = selectedReason;

		skipTask(body, {
			onSuccess: () => {
				changeToNextPowerTask();
				handleClose();
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				handleClose();
			},
		});
	};

	return fetchReasonsLoading ? (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={`${styles.loader}`}>
				<Skeleton className={`${styles.skeletonCircle}`} />
				<Skeleton className={`${styles.skeletonText}`} />
				<Skeleton className={`${styles.skeleton}`} />
			</div>
		</Modal>
	) : isNormal ? (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.skipTaskModal}>
				<CadencesGradient />
				<h3>
					{
						TASKS_TRANSLATION.ARE_YOU_SURE_YOU_WANT_TO_SKIP_TASK[
							user?.language?.toUpperCase()
						]
					}
				</h3>
				<ThemedButton
					loading={skipLoading}
					loadingText="Skipping Task"
					onClick={() => handleSubmit("submit")}
					className={styles.btn}
					theme={ThemedButtonThemes.PRIMARY}
				>
					{TASKS_TRANSLATION.SKIP_TASK[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	) : (
		<Modal
			isModal={modal}
			onClose={handleClose}
			showCloseButton
			disableCloseHover
			closeColor="white"
			className={`${styles.reasonModal}`}
		>
			<div className={styles.header}>
				Skip Task
				<p>Select a reason to skip the task</p>
			</div>
			<div className={styles.secondBody}>
				<div
					className={`${styles.selectReason} ${
						"Other" === selectedReason && styles.isActive
					}`}
					onClick={() => setSelectedReason("Other")}
				>
					Other
				</div>
				{reasons &&
					reasons.map(
						reason =>
							reason !== "Other" && (
								<div
									className={`${styles.selectReason} ${
										reason === selectedReason && styles.isActive
									}`}
									onClick={() => setSelectedReason(reason)}
								>
									{reason}
								</div>
							)
					)}
			</div>
			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					className={styles.btnSave}
					onClick={() => handleSubmit("save")}
					disabled={selectedReason === ""}
					loading={skipLoading}
					loadingText="Skipping task"
				>
					Save and skip task
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default SkipTaskModal;
