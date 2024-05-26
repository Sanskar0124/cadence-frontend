import { Cadences, List, Leads, Building } from "@cadence-frontend/icons";
import styles from "./CadenceView.module.scss";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const TABS = {
	STEPS: "steps",
	LIST: "list",
	WORKFLOW: "workflow",
};

export const TABS_LABELS = {
	STEPS: {
		icon: <Cadences />,
		label: "Steps",
	},
	LIST: {
		icon: <List />,
		label: "List",
	},
};

export const VIEW_MODES = {
	STATS: "statistics",
	FILTER: "filters",
	CADENCE_STEP: "cadence_step",
	MAIL_STATISTICS: "mail_statistics",
	SMS_STATISTICS: "sms_statistics",
	CADENCE_WORKFLOW: "cadence_workflow",
};

export const LIST_DROPDOWN_VALUES = {
	LEADS: "leads",
	ACCOUNTS: "accounts",
};

export const LIST_DROPDOWN_OPTIONS = {
	[LIST_DROPDOWN_VALUES.LEADS]: (
		<span className={styles.dropdownLabels}>
			<Leads size="1.2rem" />
			Leads
		</span>
	),
	[LIST_DROPDOWN_VALUES.ACCOUNTS]: (
		<span className={styles.dropdownLabels}>
			<Building />
			Accounts
		</span>
	),
};

export const FILTERVIEW_AVAILABILITY = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.ZOHO,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.HUBSPOT,
	INTEGRATION_TYPE.BULLHORN,
];
