import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useLinkedin = () => {
	const sendConnectionRequestApi = body =>
		AuthorizedApi.post("/v2/linkedin/conn-request", body).then(res => res.data);

	const {
		mutate: sendConnectionRequest,
		isLoading: sendConnRequestLoading,
		error: sendConnRequestError,
	} = useMutation(sendConnectionRequestApi);

	const sendMessageApi = body =>
		AuthorizedApi.post("/v2/linkedin/message", body).then(res => res.data);

	const {
		mutate: sendMessage,
		isLoading: sendMessageLoading,
		error: sendMessageError,
	} = useMutation(sendMessageApi);

	const viewLinkedinProfileApi = lead_id =>
		AuthorizedApi.get(`/v2/linkedin/view-profile/${lead_id}`).then(res => res.data);

	const {
		mutate: viewProfile,
		isLoading: viewProfileLoading,
		error: viewProfileError,
	} = useMutation(viewLinkedinProfileApi);

	return {
		sendConnectionRequest,
		sendConnRequestLoading,
		sendConnRequestError,
		sendMessage,
		sendMessageLoading,
		sendMessageError,
		viewProfile,
		viewProfileLoading,
		viewProfileError,
	};
};

export default useLinkedin;
