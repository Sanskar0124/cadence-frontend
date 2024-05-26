import { AuthorizedApi, CallApi } from "./api";
import { useMutation } from "react-query";

const useCall = () => {
	const fetchOutgoingCallInfoApi = body =>
		AuthorizedApi.post("/call/v2/ringover/call/outgoing", body).then(res => res.data);

	const { mutate: fetchOutgoingCallInfo, isLoading: outgoingCallLoading } = useMutation(
		fetchOutgoingCallInfoApi
	);

	const fetchIncomingCallInfoApi = body =>
		AuthorizedApi.post("/call/v2/ringover/call/incoming", body).then(res => res.data);

	const { mutate: fetchIncomingCallInfo, isLoading: incomingCallLoading } = useMutation(
		fetchIncomingCallInfoApi
	);

	const templateApi = nodeId => {
		// return CallApi.get(`/v2/ringover/message/getAbtemplate/${nodeId}`).then(
		return AuthorizedApi.get(`/call/v2/ringover/message/getAbtemplate/${nodeId}`).then(
			res => res?.data?.data
		);
	};
	const { mutate: fetchMessageAbTemplate, isLoading: fetchTemplateLoading } =
		useMutation(templateApi);

	return {
		fetchOutgoingCallInfo,
		fetchIncomingCallInfo,
		outgoingCallLoading,
		incomingCallLoading,
		loading: outgoingCallLoading || incomingCallLoading,
		fetchMessageAbTemplate,
		fetchTemplateLoading,
	};
};

export default useCall;
