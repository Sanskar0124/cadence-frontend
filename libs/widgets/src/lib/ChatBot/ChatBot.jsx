import { useEffect, useState } from "react";
import ChatModal from "./components/ChatModal/ChatModal";
import styles from "./ChatBot.module.scss";
import { Chat } from "@cadence-frontend/icons";

const ChatBot = () => {
	const [modal, setModal] = useState(false);
	const [unread, setUnread] = useState(0);

	const handleChatModal = () => {
		setModal(true);
	};

	useEffect(() => {
		if (unread !== 0) setUnread(0);
	}, [modal]);

	return (
		<div className={styles.chatBotWrapper}>
			{!modal && (
				<div className={styles.chatBotContainer} onClick={handleChatModal}>
					{unread !== 0 && <p class={styles.badgeIconNumber}>{unread}</p>}
					<Chat size="2rem" />
				</div>
			)}
			<ChatModal modal={modal} setModal={setModal} setUnread={setUnread} />
		</div>
	);
};

export default ChatBot;
