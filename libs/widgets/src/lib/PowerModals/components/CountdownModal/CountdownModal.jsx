import { useEffect, useState } from "react";

// components
import { Modal } from "@cadence-frontend/components";
import { Power } from "@cadence-frontend/icons";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./CountdownModal.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const CountdownModal = ({ modal, setModal, onCountdown }) => {
	const user = useRecoilValue(userInfo);

	const [seconds, setSeconds] = useState(3);
	const handleClose = () => setModal(null);

	const startTimer = () => {
		setTimeout(() => {
			setSeconds(prev => prev - 1);
			startTimer();
		}, 1000);
	};

	useEffect(() => {
		if (modal) startTimer();
	}, [modal]);

	useEffect(() => {
		if (seconds === 0) {
			onCountdown();
			handleClose();
		}
	}, [seconds]);

	return (
		<Modal isModal={modal} onClose={handleClose} disableOutsideClick>
			<div className={styles.modal}>
				<h3>{TASKS_TRANSLATION.GET_READY[user?.language?.toUpperCase()]} !!</h3>
				<span>
					{TASKS_TRANSLATION.YOUR[user?.language?.toUpperCase()]}
					<Power />
					{TASKS_TRANSLATION.BEGINS_IN[user?.language?.toUpperCase()]}
				</span>
				<div className={styles.timer}>{seconds}</div>
			</div>
		</Modal>
	);
};

export default CountdownModal;
