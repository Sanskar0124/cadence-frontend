import { AuthorizedApi } from "./api";
import { useMutation, useQuery } from "react-query";

// const ENABLED_DEFAULT = {
// 	generate: false,
//   get: false
// };

const useApiToken = (enabled = false) => {
	// enabled = { ...ENABLED_DEFAULT, ...enabled };

	const generateApiToken = () =>
		AuthorizedApi.get("/v2/admin/generate-token").then(res => res.data.data);

	const { mutate: generateToken, isLoading: generateLoading } =
		useMutation(generateApiToken);

	const getApiToken = () =>
		AuthorizedApi.get("/v2/admin/fetch-api-token").then(res => res.data.data);

	const { data: token, isLoading: tokenLoading } = useQuery("token", getApiToken);

	return { token, tokenLoading, generateToken, generateLoading };
};

export default useApiToken;
