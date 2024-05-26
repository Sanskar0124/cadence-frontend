import { useMutation } from "react-query";
import { PublicApi } from "./api";

const useUnsubscribe = () => {
	const unsubscribeApi = async ({ id, node }) => {
		let URL = "";
		if (node) URL = `/v1/sales/lead/unsubscribe/${id}/${node}`;
		else URL = `/v1/sales/lead/unsubscribe/${id}`;

		return await PublicApi.get(URL).then(res => res.data.data);
	};

	const { mutate: unsubscribe, isLoading: unsubscribeLoading } =
		useMutation(unsubscribeApi);

	return {
		unsubscribe,
		unsubscribeLoading,
	};
};

export default useUnsubscribe;
