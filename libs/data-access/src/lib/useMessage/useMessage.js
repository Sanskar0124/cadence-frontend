import { useMutation, useQuery, useQueryClient } from "react-query";

import sendMessageApi from "./mutations/sendMessage";

const useMessage = () => {
	const { mutateAsync: sendMessage } = useMutation(sendMessageApi);

	return { sendMessage };
};

export default useMessage;
