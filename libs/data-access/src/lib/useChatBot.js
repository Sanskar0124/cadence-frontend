import { useMutation, useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const useChatBot = (enabled = false) => {
	const sendChatApi = body => {
		const { files, userInput } = body;
		let form = new FormData();
		form.append("file", files);
		form.append("text", userInput);
		return AuthorizedApi.post("/v2/chatbot/send-message", form).then(
			res => res.data.data
		);
	};

	const { mutate: sendChat, isLoading: sendLoading } = useMutation(sendChatApi);

	const getBotChat = () => {
		return AuthorizedApi.get("/v2/chatbot/current-conversation").then(
			res => res.data.data
		);
	};
	const { data: messages, isLoading: msgLoading } = useQuery("messages", getBotChat, {
		enabled,
	});

	const resolveConversationApi = () =>
		AuthorizedApi.get("/v2/chatbot/resolve-issue").then(res => res.data.data);

	const { mutate: resolveConversation, isLoading: resolveLoading } =
		useMutation(resolveConversationApi);

	const grantAccessApi = () =>
		AuthorizedApi.get("/v2/chatbot/grant-access").then(res => res.data.data);
	const { mutate: grantAccess, isLoading: grantAccessLoading } =
		useMutation(grantAccessApi);

	const supportAgentLoginApi = async id => {
		return await AuthorizedApi.get(`/v2/chatbot/login-as-user?issue_id=${id}`).then(
			res => res.data.data
		);
	};
	const { mutate: supportAgentRedirect, isLoading: redirectLoading } =
		useMutation(supportAgentLoginApi);

	return {
		sendChat,
		sendLoading,
		messages,
		msgLoading,
		resolveConversation,
		resolveLoading,
		grantAccess,
		grantAccessLoading,
		supportAgentRedirect,
		redirectLoading,
	};
};

export default useChatBot;
