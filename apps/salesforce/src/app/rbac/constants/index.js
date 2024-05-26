import { ROLES } from "@cadence-frontend/constants";

import SUPER_ADMIN_ROUTES from "./lib/super_admin";
import ADMIN_ROUTES from "./lib/admin";
import SALES_MANAGER_ROUTES from "./lib/sales_manager";
import SALESPERSON_ROUTES from "./lib/sales_person";

export const ROLE_ROUTES = {
	[ROLES.SUPER_ADMIN]: SUPER_ADMIN_ROUTES,
	[ROLES.ADMIN]: ADMIN_ROUTES,
	[ROLES.SALESPERSON]: SALESPERSON_ROUTES,
	[ROLES.SALES_MANAGER]: SALES_MANAGER_ROUTES,
};
