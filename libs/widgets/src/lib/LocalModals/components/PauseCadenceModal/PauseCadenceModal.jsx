import { useContext } from "react";
import moment from "moment-timezone";

// components
import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Label, ThemedButton, InputDate, InputTime } from "@cadence-frontend/widgets";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { useCadenceForLead } from "@cadence-frontend/data-access";

// constants
import { defaultPauseStateFields } from "./constants";
import styles from "./PauseCadenceModal.module.scss";
import { useState } from "react";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const PauseCadenceModal = ({ modal, setModal, refetchLead }) => {
	const { addError, addSuccess } = useContext(MessageContext);

	const { pauseCadenceForLead, pauseLoading } = useCadenceForLead(
		{ cadenceId: modal?.cadence_id },
		false
	);
	const user = useRecoilValue(userInfo);

	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields);

	const handleClose = () => {
		setPauseTime(defaultPauseStateFields);
		setModal(null);
	};

	const handleSubmit = async () => {
		const { DD, MM, YYYY, time } = pauseTime;
		let selectedTime;

		try {
			if (!DD || !MM || !YYYY || !time) throw new Error();
			selectedTime = Math.floor(
				new Date(
					moment(`${DD}${MM}${YYYY}${time}`, "DDMMYYYYHHmm").toISOString()
				).getTime()
			);
		} catch (err) {
			addError({ text: "Please select a valid date and time" });
		}
		const body = {
			lead_id: modal.lead_id,
			cadence_ids: [modal?.cadence_id],
			pauseFor: selectedTime,
		};

		await pauseCadenceForLead(body, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: res => {
				addSuccess(res.msg || "Paused cadence for lead successfully");
				refetchLead();
				handleClose();
			},
		});
	};
	console.log("pauseTime");

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.pauseCadenceModal}>
				<div className={styles.heading}>
					<h3>{TASKS_TRANSLATION.PAUSE_CADENCE[user?.language?.toUpperCase()]}</h3>
				</div>
				<p className={styles.subTitle}>Automatically resume cadence on:</p>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label required className={styles.label}>
							Date
						</Label>
						<InputDate
							aheadOfDate={true}
							value={pauseTime}
							setValue={setPauseTime}
							numberOfOptionsVisible={"3"}
						/>
					</div>
					<div className={styles.inputGroup}>
						<Label required>Time</Label>
						<InputTime
							input={pauseTime}
							name="time"
							setInput={setPauseTime}
							theme={InputThemes.PRIMARY}
							type="select"
							hideMinutes
						/>
					</div>
				</div>
				<div className={styles.footer}>
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						className={styles.pauseBtn}
						onClick={handleSubmit}
						loading={pauseLoading}
					>
						{TASKS_TRANSLATION.PAUSE_CADENCE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

export default PauseCadenceModal;
