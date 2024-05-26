import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";

const useCompanyIntegration = () => {
	const changeCompanyIntegrationApi = body =>
		AuthorizedApi.put(`/v2/company/integration`, body).then(res => res?.data?.data);

	const { isLoading: changeCompanyIntegrationLoading, mutate: changeCompanyIntegration } =
		useMutation(changeCompanyIntegrationApi);

	const updateCompanyStatusApi = body =>
		AuthorizedApi.put(`/v2/company/status`, body).then(res => res?.data?.data);

	const { isLoading: updateCompanyStatusLoading, mutate: updateCompanyStatus } =
		useMutation(updateCompanyStatusApi);

	return {
		changeCompanyIntegration,
		changeCompanyIntegrationLoading,
		updateCompanyStatus,
		updateCompanyStatusLoading,
	};
};
export default useCompanyIntegration;
