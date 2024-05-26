import styles from "./ChatInput.module.scss";
import { DraftToolbarIcon, Send } from "@cadence-frontend/icons";
import { useState } from "react";
import { Editor, ThemedButton, Input } from "@cadence-frontend/widgets";

const ChatInput = ({ userInput, setUserInput }) => {
	// const [userInput, setUserInput] = useState("");
	const [userMsg, setUserMsg] = useState([]);

	const msgHandler = () => {
		const value = [...userMsg, userInput];
		setUserMsg(value);
	};

	return (
		<div className={styles.ChatInputContainer}>
			<Input
				value={userInput}
				setValue={setUserInput}
				type="textarea"
				placeholder="Write here..."
				border="none"
				className={styles.inputContainer}
			/>
			<div className={styles.actionBtn}>
				<ThemedButton>
					<DraftToolbarIcon />
					{/* <Editor
								files={files}
								value={files}
								setFiles={setFiles}
								width="100%"
							/> */}
				</ThemedButton>
				<ThemedButton
					onClick={() => {
						msgHandler();
					}}
				>
					<Send />
				</ThemedButton>
			</div>
		</div>
	);
};

export default ChatInput;
