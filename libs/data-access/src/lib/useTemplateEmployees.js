/* eslint-disable no-console */
import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";
import { ROLES, TEMPLATE_LEVELS } from "@cadence-frontend/constants";
import { useEffect } from "react";

const useTemplateEmployees = (role, sdId, templateLevel, enabled = true) => {
	//get all employees or get employees by subdepartment using sdId

	const getTemplateEmployees = async ({ queryKey }) => {
		const { role, templateLevel, sdId } = queryKey[1];

		let URL = "";
		switch (role) {
			case ROLES.SALESPERSON:
			case ROLES.SALES_MANAGER:
				{
					switch (templateLevel) {
						case TEMPLATE_LEVELS.USER:
						case TEMPLATE_LEVELS.SUB_DEPARTMENT:
							// All employees of that subd_id along with admins of dept departmentId
							URL = `/v2/sales/department/templatefilter/employees?sd_id=${sdId}`;
						case TEMPLATE_LEVELS.COMPANY:
							URL = `/v2/sales/department/templatefilter/employees`;
							break;
					}
				}
				break;
			case ROLES.ADMIN:
			case ROLES.SUPER_ADMIN:
				{
					if (sdId) {
						switch (templateLevel) {
							case TEMPLATE_LEVELS.USER:
							case TEMPLATE_LEVELS.SUB_DEPARTMENT:
							case TEMPLATE_LEVELS.COMPANY:
								URL = `/v2/sales/department/templatefilter/employees?sd_id=${sdId}`;
								break;
						}
					} else {
						switch (templateLevel) {
							case TEMPLATE_LEVELS.USER:
							case TEMPLATE_LEVELS.SUB_DEPARTMENT:
							case TEMPLATE_LEVELS.COMPANY:
								URL = `/v2/sales/department/templatefilter/employees`;
								break;
						}
					}
				}
				break;

			default:
				return;
		}
		return await AuthorizedApi.get(URL).then(res => {
			return res.data.data;
		});
	};

	const {
		data: employees,
		isLoading: employeesLoading,
		isRefetching: employeesRefetching,
		refetch,
	} = useQuery(
		["template-employees", { role, templateLevel, sdId }],
		getTemplateEmployees,
		{
			enabled,
		}
	);

	useEffect(() => {
		if (sdId) refetch();
	}, [sdId]);

	return {
		employees,
		employeesLoading: employeesLoading || employeesRefetching,
	};
};

export default useTemplateEmployees;
