import { AuthorizedApi } from "./api";
import { useMutation } from "react-query";

const useReassign = () => {
	const ressigningApi = body => {
		return AuthorizedApi.post(`/v2/sales/lead/reassign`, body).then(res => res?.data);
	};
	const {
		mutate: reassign,
		isLoading: isReassigning,
		isError,
		error,
	} = useMutation(ressigningApi);

	return {
		reassign,
		isReassigning,
		isError,
		error,
	};
};

export default useReassign;
