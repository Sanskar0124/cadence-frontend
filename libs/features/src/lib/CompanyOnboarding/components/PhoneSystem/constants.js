import {
	PHONE_INTEGRATIONS,
	INTEGRATION_TYPE as CRM_INTEGRATIONS,
} from "@cadence-frontend/constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";

export const PHONE_OPTIONS = [
	{
		label: SETTINGS_TRANSLATION.RINGOVER_DEFAULT,
		value: PHONE_INTEGRATIONS.RINGOVER,
	},
	{
		label: SETTINGS_TRANSLATION.NO_PHONE_SYSTEM,
		value: PHONE_INTEGRATIONS.NONE,
	},
];

export const SYNC_DISABLED_INTEGRATIONS = [CRM_INTEGRATIONS.EXCEL];
