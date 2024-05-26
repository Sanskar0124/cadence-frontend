/* eslint-disable no-console */
import { useState, useEffect, useContext } from "react";
import styles from "./NoteIMC.module.scss";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";

//components
import { useNote } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
//constants

const NoteIMC = ({
	//typeSpecificProps
	activeTaskInfo,
	lead,
	disableEdit,
	data,
	//modalProps
	onClose: modalOnClose,
	...rest
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const [input, setInput] = useState({ title: "", note: "" });
	const { addNote, noteLoading } = useNote();
	const user = useRecoilValue(userInfo);
	const handleSubmit = async () =>
		addNote(
			{
				lead_id: lead.lead_id,
				...(input.title.length && { title: input.title }),
				note: input.note,
			},
			{
				onSuccess: () => {
					addSuccess("Note created");
					handleClose();
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	const handleClose = () => {
		setInput({ title: "", note: "" });
		modalOnClose();
	};

	useEffect(() => {
		if (disableEdit && data) {
			setInput({ title: "", note: data.status });
		}
	}, [data, disableEdit]);

	return (
		<div className={styles.noteIMC}>
			<div className={styles.header}>
				{/* {!disableEdit && COMMON_TRANSLATION.ADD[user?.language?.toUpperCase()]}{" "}
				{COMMON_TRANSLATION.NOTE[user?.language?.toUpperCase()]} */}
				{!disableEdit
					? TASKS_TRANSLATION.ADD_NOTE[user?.language?.toUpperCase()]
					: COMMON_TRANSLATION.NOTE[user?.language?.toUpperCase()]}
			</div>
			{!disableEdit && (
				<>
					<Input
						name="title"
						placeholder={COMMON_TRANSLATION.ADD_A_TITLE[user?.language?.toUpperCase()]}
						theme={InputThemes.TRANSPARENT}
						value={input}
						setValue={setInput}
						style={{
							backgroundColor: "white",
							paddingLeft: "3px",
						}}
					/>
					<div className={styles.divider} />
				</>
			)}
			<Input
				name="note"
				placeholder={COMMON_TRANSLATION.YOUR_NOTE[user?.language?.toUpperCase()]}
				type="textarea"
				theme={InputThemes.TRANSPARENT}
				disabled={disableEdit}
				rows="6"
				value={input}
				setValue={setInput}
				style={{
					backgroundColor: "white",
					paddingLeft: "3px",
				}}
			/>
			<div className={styles.footer}>
				<ThemedButton
					theme={ThemedButtonThemes.GREEN}
					style={{
						width: "100%",
						boxShadow: " 1.2px 8.2px 24px rgba(54, 205, 207, 0.3)",
						borderRadius: "1.5em",
						display: disableEdit ? "none" : "block",
					}}
					loading={noteLoading}
					onClick={handleSubmit}
				>
					<div>{TASKS_TRANSLATION.ADD_NOTE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</div>
	);
};

export default NoteIMC;
