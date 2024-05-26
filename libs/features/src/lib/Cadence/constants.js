import { ROLES } from "@cadence-frontend/constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

// key for storing active tab in localstorage
export const CADENCE_ACTIVE_TAB_KEY = "active-tab-cadence";

export const VIEW_MODES = {
	FILTER: "filter",
};

export const CADENCE_TAB_NAV_OPTIONS = [
	{
		label: CADENCE_TRANSLATION.PERSONAL,
		value: "personal",
	},
	{
		label: CADENCE_TRANSLATION.GROUP,
		value: "team",
	},
	{
		label: CADENCE_TRANSLATION.COMPANY,
		value: "company",
	},
];

export const CADENCE_TYPES = {
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

export const CREATE_CADENCE_ERRORS = {
	CADENCE_NAME: "cadence_name_error",
	CADENCE_TYPE: "cadence_type_error",
	CADENCE_SD_ID: "cadence_sd_id_error",
	CADENCE_DESC: "cadence_desc_error",
};

export const HEADERS = [
	{
		label: COMMON_TRANSLATION.PEOPLE,
		value: "people",
	},
	{
		label: CADENCE_TRANSLATION.CADENCE_NAME,
		value: "cadence_name",
	},
	{
		label: CADENCE_TRANSLATION.STEPS,
		value: "steps",
	},
	{
		label: CADENCE_TRANSLATION.CREATED_ON,
		value: "created_on",
	},
	{
		label: CADENCE_TRANSLATION.CREATED_BY,
		value: "created_by",
	},
	{
		label: CADENCE_TRANSLATION.STATUS,
		value: "status",
	},
	{
		label: CADENCE_TRANSLATION.ACTIONS,
		value: "actions",
	},
	// "people",
	// "cadence_name",
	// "steps",
	// "created_on",
	// "created_by",
	// "status",
	// "actions",
];

export const ADMIN_HEADERS = [
	// "people",
	// "cadence_name",
	// "steps",
	// "created_on",
	// "created_by",
	// "sub_department",
	// "status",
	// "actions",
	{
		label: COMMON_TRANSLATION.PEOPLE,
		value: "people",
	},
	{
		label: CADENCE_TRANSLATION.CADENCE_NAME,
		value: "cadence_name",
	},
	{
		label: CADENCE_TRANSLATION.STEPS,
		value: "steps",
	},
	{
		label: CADENCE_TRANSLATION.CREATED_ON,
		value: "created_on",
	},
	{
		label: CADENCE_TRANSLATION.CREATED_BY,
		value: "created_by",
	},
	{
		label: CADENCE_TRANSLATION.SUB_DEPARTMENT,
		value: "sub_department",
	},
	{
		label: CADENCE_TRANSLATION.STATUS,
		value: "status",
	},
	{
		label: CADENCE_TRANSLATION.ACTIONS,
		value: "actions",
	},
];

export const VIEW_MODE_DISABLED_HEADERS = [
	"steps",
	"created_on",
	"created_by",
	"sub_department",
];

export const STEPS_OPTIONS = {
	INCREASING: "increasing",
	DECREASING: "decreasing",
};

export const CADENCE_STATUS = {
	NOT_STARTED: "not_started",
	PROCESSING: "processing",
	PAUSED: "paused",
	IN_PROGRESS: "in_progress",
	STOPPED: "stopped",
	SCHEDULED: "scheduled",
	COMPLETED: "completed",
};

export const CADENCE_PRIORITY = {
	STANDARD: "standard",
	HIGH: "high",
};

export const CADENCE_TAGS = {
	INBOUND: "inbound",
	OUTBOUND: "outbound",
};

export const STATUS_LABELS_CL_NAMES = {
	not_started: "notStarted",
	paused: "paused",
	processing: "processing",
	in_progress: "inProgress",
	stopped: "stopped",
	completed: "completed",
	scheduled: "scheduled",
};

export const PRIORITY_LABELS_CL_NAMES = {
	standard: "standard",
	high: "high",
};

export const TAG_LABELS_CL_NAMES = {
	inbound: "inbound",
	outbound: "outbound",
};

export const CADENCE_INTEGRATIONS = {
	SALESFORCE: "salesforce",
};

export const ACTIONS = {
	CREATE: "create",
	READ: "read",
	UPDATE: "update",
	DELETE: "delete",
	DUPLICATE: "duplicate",
	SHARE: "share",
};

export const MORE_OPTION_ACTIONS = [ACTIONS.DUPLICATE, ACTIONS.DELETE, ACTIONS.SHARE];

const SALESPERSON_PERMISSONS = {
	[CADENCE_TYPES.PERSONAL]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[CADENCE_TYPES.TEAM]: [ACTIONS.READ],
	[CADENCE_TYPES.COMPANY]: [ACTIONS.READ],
};

const MANAGER_PERMISSIONS = {
	[CADENCE_TYPES.PERSONAL]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[CADENCE_TYPES.TEAM]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[CADENCE_TYPES.COMPANY]: [ACTIONS.READ],
};

const ADMIN_PERMISSIONS = {
	[CADENCE_TYPES.PERSONAL]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[CADENCE_TYPES.TEAM]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
	[CADENCE_TYPES.COMPANY]: [
		ACTIONS.CREATE,
		ACTIONS.READ,
		ACTIONS.UPDATE,
		ACTIONS.DELETE,
		ACTIONS.DUPLICATE,
		ACTIONS.SHARE,
	],
};

export const PERMISSIONS = {
	[ROLES.SALESPERSON]: SALESPERSON_PERMISSONS,
	[ROLES.SALES_MANAGER]: MANAGER_PERMISSIONS,
	[ROLES.ADMIN]: ADMIN_PERMISSIONS,
	[ROLES.SUPER_ADMIN]: ADMIN_PERMISSIONS,
};
