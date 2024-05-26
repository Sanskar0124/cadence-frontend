/* eslint-disable no-console */
import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";
import { ROLES } from "@cadence-frontend/constants";
import { useEffect } from "react";

const useEmployees = (enabled = true, role, sdId) => {
	//get all employees or get employees by subdepartment using sdId
	const getEmployees = async () => {
		let URL = "";
		switch (role) {
			case ROLES.ADMIN:
			case ROLES.SUPER_ADMIN:
				sdId
					? (URL = `/v2/sales/department/employees?sd_id=${sdId}`)
					: (URL = "/v2/sales/department/employees");
				break;
			case ROLES.SALESPERSON:
			case ROLES.MANAGER:
			case ROLES.SALESPERSON_MANAGER:
			case ROLES.SALES_MANAGER:
				sdId
					? (URL = `/v2/sales/department/employees?sd_id=${sdId}`)
					: (URL = "/v2/sales/department/employees");
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
	} = useQuery("employees", getEmployees, {
		enabled,
	});

	useEffect(() => {
		if (sdId) refetch();
	}, [sdId]);

	return {
		employees,
		employeesLoading: employeesLoading || employeesRefetching,
	};
};

export default useEmployees;
