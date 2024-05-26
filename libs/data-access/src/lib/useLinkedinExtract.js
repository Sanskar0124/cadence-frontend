import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useLinkedinExtract = () => {
	const extractLeadInfoApi = body =>
		AuthorizedApi.post("/lead-extension/extension/linkedin/url", body).then(
			res => res.data.data
		);

	const {
		mutate: extractLeadInfo,
		error: extractLeadInfoError,
		isLoading: extractLeadInfoLoading,
	} = useMutation(extractLeadInfoApi);

	const extractLeadsFromSearchApi = body =>
		AuthorizedApi.post("/lead-extension/extension/linkedin/search-url", body).then(
			res => res.data.data
		);

	const { mutate: extractLeadsFromSearch } = useMutation(extractLeadsFromSearchApi);

	return {
		extractLeadInfo,
		extractLeadInfoLoading,
		extractLeadInfoError,
		extractLeadsFromSearch,
	};
};

export default useLinkedinExtract;
