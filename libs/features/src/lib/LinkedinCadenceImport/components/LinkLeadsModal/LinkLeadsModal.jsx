import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal, Title } from "@cadence-frontend/components";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import styles from "./LinkLeadsModal.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const LinkLeadsModal = ({ modal, setModal, onAdd }) => {
	const [stopPreviousCadences, setStopPreviousCadences] = useState(false);
	const user = useRecoilValue(userInfo);

	const onClose = () => setModal(false);
	return (
		<Modal
			isModal={Boolean(modal)}
			onClose={onClose}
			className={styles.linkLeadsModal}
			showCloseButton
		>
			<Title size="1.1rem" className={styles.title}>
				{COMMON_TRANSLATION.CURRENTLY_PRESENT_LEADS[user?.language?.toUpperCase()]}
			</Title>
			<br></br>
			<span className={styles.subtitle}>
				{
					COMMON_TRANSLATION.SOME_LEADS_ARE_ALREADY_PART_OF_CADENCE[
						user?.language?.toUpperCase()
					]
				}
			</span>
			<div className={styles.inputBox}>
				<InputRadio
					checked={stopPreviousCadences}
					onChange={() => setStopPreviousCadences(true)}
				/>{" "}
				<span>
					{COMMON_TRANSLATION.STOP_THEIR_CURRENT_CADENCE[user?.language?.toUpperCase()]} (
					{COMMON_TRANSLATION.OLD_CADENCES_WILL_BE_STOPEED[user?.language?.toUpperCase()]}
					)
				</span>
			</div>
			<div className={styles.inputBox}>
				<InputRadio
					checked={!stopPreviousCadences}
					onChange={() => setStopPreviousCadences(false)}
				/>{" "}
				<span>
					{
						COMMON_TRANSLATION.KEEP_THEM_IN_THEIR_CURRENT_CADENCE[
							user?.language?.toUpperCase()
						]
					}{" "}
					(old cadences will continue to run)
				</span>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.startBtn}
				onClick={() => onAdd(stopPreviousCadences)}
			>
				<div>{COMMON_TRANSLATION.START_IMPORTING[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default LinkLeadsModal;
