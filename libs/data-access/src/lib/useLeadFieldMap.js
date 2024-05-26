import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useQuery } from "react-query";
import { AuthorizedApi } from "./api";
import { LeadDataStrategy } from "./useLead/useLead.strategy";

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const ENABLED_DEFAULT = {
	fieldMap: true,
};

const useLeadFieldMap = ({ enabled }) => {
	enabled = { ...ENABLED_DEFAULT, ...enabled };

	const getLeadFieldMap = async () => {
		if (user?.integration_type !== INTEGRATION_TYPE.SHEETS) {
			return await AuthorizedApi.get(`v2/sales/lead/field-map`).then(res => {
				return LeadDataStrategy({
					data: res.data?.data,
					integration_type: user.integration_type,
				});
			});
		} else return null;
	};

	const {
		data: fieldMap,
		refetch: fieldMapRefetch,
		isFetching: fieldMapLoading,
	} = useQuery(["lead-field-map"], getLeadFieldMap, {
		enabled: enabled.fieldMap,
	});

	return {
		fieldMap,
		fieldMapRefetch,
		fieldMapLoading,
	};
};
export default useLeadFieldMap;
