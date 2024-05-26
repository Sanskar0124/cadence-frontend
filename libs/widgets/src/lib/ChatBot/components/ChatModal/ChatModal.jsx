import { Spinner } from "@cadence-frontend/components";
import { SOCKET_ON_EVENTS } from "@cadence-frontend/constants";
import { MessageContext, SocketContext } from "@cadence-frontend/contexts";
import { useChatBot } from "@cadence-frontend/data-access";
import {
	Chat,
	Close,
	Close2,
	DraftToolbarIcon,
	Send,
	VideoPlayer,
} from "@cadence-frontend/icons";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { nanoid } from "nanoid";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ATTACHMENTS_ALLOWED } from "../constants";
import TextComponent from "../TextComponent/TextComponent";
import styles from "./ChatModal.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const ChatModal = ({ modal, setModal, setUnread }) => {
	const { addError } = useContext(MessageContext);
	const [userInput, setUserInput] = useState("");
	const [userMsg, setUserMsg] = useState([]);
	const [files, setFiles] = useState(null);
	const [showResolved, setShowResolved] = useState(false);
	const [showAccessPermission, setShowAccessPermission] = useState(false);
	const chatBotDataAccess = useChatBot(modal);
	const { sendChat, messages, sendLoading } = chatBotDataAccess;
	const { addSocketHandler } = useContext(SocketContext);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		let message = messages?.map(msg => {
			if (msg?.bot_id && msg?.user === "U020RBC2WFP") {
				delete msg?.bot_id;
				return { ...msg, client_msg_id: "B04GTFL51SP" };
			} else {
				return msg;
			}
		});
		setUserMsg(message);
	}, [messages]);

	const handleFilesChange = e => {
		const file = e.target.files[0];
		e.target.value = null;
		const ext = file.type.split("/")[1];
		if (!ATTACHMENTS_ALLOWED.includes(ext))
			return addError({ text: "File type not supported" });
		if (file.size > 10000000)
			return addError({ text: "Cant upload it is exceeding size limit of 10MB" });

		setFiles(file);
	};

	const handleSendMessage = body => {
		body.userInput = body.userInput.trim();
		if (!body.userInput.length && !body.files) return;
		setUserInput("");
		setFiles(null);
		sendChat(body, {
			onSuccess: data => {
				setUserMsg(prev => [
					...prev,
					{ ...data[0], bot_id: uuidv4(), ts: moment().format("X") },
				]);
			},
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
		});
	};

	const handleKeyEvent = e => {
		let body = {
			files,
			userInput,
		};
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage(body);
		}
	};

	useEffect(() => {
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.CHATBOT_MESSAGE,
			key: "text",
			handler: handleSocketEvent,
		});
	}, []);

	const handleSocketEvent = msg => {
		if (!modal) setUnread(prev => prev + 1);
		if (msg) {
			if (msg.text === "#EndChat") return setShowResolved(true);
			if (msg.text === "#GrantAccess") return setShowAccessPermission(true);
			if (userMsg.find(m => m.client_msg_id === msg.client_msg_id)) return;
			if (msg.file) msg.files = [msg.file];
			setUserMsg(prev => [...prev, msg]);
		}
	};

	return (
		<div className={`${styles.chatModalOverlay} ${modal && styles.open}`}>
			<div className={styles.modalBox}>
				<div className={styles.header} onClick={() => setModal(false)}>
					<div className={styles.heading}>
						<Chat />
						{COMMON_TRANSLATION?.CADENCE_SUPPORT?.[user?.language?.toUpperCase()]}
					</div>
					<div className={styles.closeModal}>
						<Close />
					</div>
				</div>

				<TextComponent
					userMsg={userMsg}
					setUserMsg={setUserMsg}
					chatBotDataAccess={chatBotDataAccess}
					handleSendMessage={handleSendMessage}
					showResolved={showResolved}
					setShowResolved={setShowResolved}
					showAccessPermission={showAccessPermission}
					setShowAccessPermission={setShowAccessPermission}
				/>

				<div className={styles.ChatInputContainer}>
					<div className={styles.inputWrapper}>
						<Input
							value={userInput}
							setValue={setUserInput}
							type="textarea"
							placeholder={COMMON_TRANSLATION.WRITE_HERE[user?.language.toUpperCase()]}
							border="none"
							className={styles.inputContainer}
							onKeyPress={e => handleKeyEvent(e)}
						/>
						<div className={styles.actionBtn}>
							<input
								type="file"
								id="chatbot-file"
								hidden
								onChange={e => handleFilesChange(e)}
							/>
							<label className={styles.fileLabel} htmlFor="chatbot-file">
								<DraftToolbarIcon />
							</label>

							{sendLoading ? (
								<Spinner className={styles.sendLoading} />
							) : (
								<ThemedButton
									onClick={() =>
										handleSendMessage({
											files,
											userInput,
										})
									}
									width="fit-content"
								>
									<Send />
								</ThemedButton>
							)}
						</div>
					</div>

					{files?.name && (
						<div className={styles.attachmentsContainer}>
							<div className={styles.attachment} key={nanoid()}>
								<div className={styles.videoComponents}>
									<VideoPlayer />
									<div>
										<p>{files?.name}</p>
										<p>{Math.floor(files?.size / 1000000).toFixed(2)} MB</p>
									</div>
								</div>
								<div>
									<Close2 onClick={() => setFiles(null)} />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatModal;
