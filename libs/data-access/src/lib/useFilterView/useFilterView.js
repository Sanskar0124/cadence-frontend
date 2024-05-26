import { useRecoilValue } from "recoil";
import { AuthorizedApi } from "../api";
import { useMutation } from "react-query";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const LEAD_TYPE = {
	LEAD: "lead",
	CONTACT: "contact",
};

const useFilterView = (type = LEAD_TYPE.LEAD) => {
	const user = useRecoilValue(userInfo);
	// Salesforce

	const getFilterViewApi = leadType => {
		switch (user?.integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return AuthorizedApi.get(
					`/v2/sales/department/cadence/import/salesforce/custom-views?module_name=${leadType}`
				).then(res => res.data.data);
			case INTEGRATION_TYPE.ZOHO:
				return AuthorizedApi.get(
					`/v2/sales/department/cadence/import/zoho/custom-views?module_name=${leadType}`
				).then(res => res.data.data);

			case INTEGRATION_TYPE.PIPEDRIVE:
				return AuthorizedApi.get(
					`/v2/sales/department/cadence/import/pipedrive/custom-views?module_name=${leadType}`
				).then(res => res?.data?.data);

			case INTEGRATION_TYPE.HUBSPOT:
				return AuthorizedApi.get(
					`/v2/sales/department/cadence/import/hubspot/custom-views?module_name=${leadType}`
				).then(res => res.data.data);

			case INTEGRATION_TYPE.BULLHORN:
				return AuthorizedApi.get(
					`/v2/sales/department/cadence/import/bullhorn/saved-search?module_name=${leadType}`
				).then(res => res.data.data);
		}
	};

	const { mutate: getFilterView, isLoading: getFilterViewLoading } =
		useMutation(getFilterViewApi);

	return { getFilterView, getFilterViewLoading };
};

export default useFilterView;
