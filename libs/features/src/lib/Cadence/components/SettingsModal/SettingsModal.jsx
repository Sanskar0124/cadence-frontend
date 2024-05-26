import { useContext, useEffect, useState } from "react";
import { Modal } from "@cadence-frontend/components";
import styles from "./SettingsModal.module.scss";
import {
	CollapseContainer,
	Input,
	InputDate,
	InputTime,
	Label,
	Select,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { PRIORITY_OPTIONS, TAG_OPTIONS } from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { defaultPauseStateFields } from "../CreateCadenceModal/constants";
import moment from "moment-timezone";
import { CadenceEmpty } from "@cadence-frontend/icons";
import { CADENCE_STATUS } from "../../constants";

function SettingsModal({ modal, setModal, dataAccess }) {
	const [input, setInput] = useState({
		name: "",
		description: "",
	});
	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields);
	const user = useRecoilValue(userInfo);
	const { updateCadence, updateLoading } = dataAccess;
	const { addError, addSuccess } = useContext(MessageContext);
	const [disableBtn, setDisableBtn] = useState(false);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (modal?.Cadence_Schedule?.launch_at) {
			setChecked(true);
			const date = new Date(parseInt(modal?.Cadence_Schedule?.launch_at));
			pauseTime.DD = date.getDate();
			pauseTime.MM = date.getMonth();
			pauseTime.YYYY = moment().format("YYYY");
			pauseTime.time = `${moment(date).format("HH:mm")}`;
			setPauseTime(pauseTime);
		}
	}, [modal?.Cadence_Schedule?.launch_at]);

	useEffect(() => {
		if (modal) {
			setInput(prev => ({
				...prev,
				name: modal?.name,
				description: modal?.description,
			}));
		}
	}, [modal]);

	const handleClose = () => {
		setModal(null);
	};

	const handleSubmit = () => {
		if (!input.name.trim()) return addError({ text: "Cadence Name can't be empty" });

		if (input.description?.trim() && input.description.trim().length > 1000) {
			return addError({ text: "Please Enter description below 1000 characters." });
		}

		const body = {
			cadence_id: modal.cadence_id,
			name: input.name.trim(),
			description: input.description?.trim(),
			scheduled: checked,
		};

		const unixPauseTime = new Date([
			pauseTime.YYYY,
			pauseTime.MM,
			pauseTime.DD,
			pauseTime.time,
		]).getTime();

		if (!(/^\d/.test(unixPauseTime) && new Date() <= unixPauseTime) && checked)
			return addError({ text: "Invalid Time" });
		if (checked) body["launch_at"] = unixPauseTime;

		updateCadence(body, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
			onSuccess: () => {
				addSuccess("Cadence updated Successfully");
				handleClose();
			},
		});
	};

	// disable button
	useEffect(() => {
		if (input?.name.trim().length === 0) {
			setDisableBtn(true);
		} else if (modal?.priority === input.priority && modal?.name === input.name)
			setDisableBtn(true);
		else setDisableBtn(false);
	}, [input]);

	const onUpdate = e => setChecked(e.target.checked);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3>
						{CADENCE_TRANSLATION.EDIT_CADENCE_DETAILS[user?.language?.toUpperCase()]}
					</h3>
				</div>

				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label required>
							{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}
						</Label>
						<Input
							value={input}
							setValue={setInput}
							name="name"
							theme={InputThemes.WHITE}
						/>
					</div>

					<div className={styles.inputGroup}>
						<Label>
							{CADENCE_TRANSLATION.CADENCE_DESCRIPTION[user?.language?.toUpperCase()]}
						</Label>

						<Input
							type="textarea"
							placeholder={
								CADENCE_TRANSLATION.ADD_A_QUICK_NOTE[user?.language?.toUpperCase()]
							}
							className={styles.inputDescription}
							value={input.description}
							setValue={val => setInput(prev => ({ ...prev, description: val }))}
						/>
						{input.description?.trim() && (
							<div className={styles.wordCounter}>
								<span
									style={
										input.description.length <= 1000
											? { color: "#567191" }
											: { color: "#f77272" }
									}
								>
									{input.description.trim().length}
								</span>
								/1000
							</div>
						)}
					</div>

					{modal &&
						[CADENCE_STATUS.NOT_STARTED, CADENCE_STATUS.PAUSED].includes(modal?.status) &&
						Boolean(modal?.Nodes?.length ?? modal?.steps ?? modal?.sequence?.length) && (
							<div className={`${styles.inputGroup} ${styles.launchCadence}`}>
								<p className={styles.launchTitle}>
									{
										CADENCE_TRANSLATION?.SCHEDULE_LAUNCH_FOR_CADENCE?.[
											user?.language?.toUpperCase()
										]
									}
								</p>
								<Toggle theme="PURPLE" checked={checked} onChange={onUpdate} />
							</div>
						)}

					{checked &&
					Boolean(modal?.Nodes?.length ?? modal?.steps ?? modal?.sequence?.length) ? (
						<CollapseContainer
							title={
								<div className={styles.titleSelector + " " + styles.headText}>
									{
										CADENCE_TRANSLATION?.CADENCE_LAUNCH_SCHEDULED_FOR?.[
											user?.language?.toUpperCase()
										]
									}
								</div>
							}
							className={styles.collapseContainer}
						>
							<div className={styles.duration}>
								<div className={styles.scheduleGroup}>
									<Label className={styles.label}>
										{COMMON_TRANSLATION?.DATE?.[user?.language?.toUpperCase()]}
									</Label>
									<InputDate
										value={pauseTime}
										aheadOfDate={true}
										setValue={setPauseTime}
										numberOfOptionsVisible={"3"}
										style={{
											width: "95%",
											margin: "auto",
										}}
									/>
								</div>
								<div className={styles.scheduleGroup}>
									<Label className={styles.label}>
										{" "}
										{COMMON_TRANSLATION?.TIME?.[user?.language?.toUpperCase()]}
									</Label>
									<InputTime
										input={pauseTime}
										name="time"
										setInput={setPauseTime}
										theme={InputThemes.WHITE}
										type="select"
										justify="left"
										style={{ padding: "0 20px", paddingBottom: "10px" }}
										className={styles.inputTime}
									/>
								</div>
							</div>
						</CollapseContainer>
					) : (
						""
					)}
					{/* <div className={styles.inputGroup}>
						<Label>Priority</Label>
						<Select
							dropdownarrow={"triangularDropDown"}
							options={PRIORITY_OPTIONS}
							value={input}
							setValue={setInput}
							name="priority"
							borderRadius="15px"
							borderColor="#DADCE0"
							height="44px"
							defaultValue={PRIORITY_OPTIONS.find(p => p.value === modal?.priority)}
						/>
					</div> */}
					{/* <div className={styles.inputGroup}>
						<Label>Tags</Label>
						<Select
							dropdownarrow={"triangularDropDown"}
							options={TAG_OPTIONS}
							value={input}
							setValue={setInput}
							name="tag"
							borderRadius="15px"
							borderColor="#DADCE0"
							height="44px"
							defaultValue={TAG_OPTIONS.find(t => t.value === modal?.Tags[0].tag_name)}
							menuOnTop
						/>
					</div> */}
				</div>
				<div className={styles.footer}>
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.PRIMARY}
						disabled={disableBtn}
						loading={updateLoading}
						onClick={handleSubmit}
					>
						{COMMON_TRANSLATION?.SAVE?.[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
}

export default SettingsModal;
