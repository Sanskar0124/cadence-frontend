import {
	INTEGRATION_TYPE,
	SESSION_STORAGE_KEYS,
	SETTING_PRIORITY,
} from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import MatchFields from "../Settings/components/Crm/components/FieldMapping/MatchFields/MatchFields";
import ConnectIntegration from "../CompanyOnboarding/components/ConnectIntegration/ConnectIntegration";

export const LEVEL_TO_NAME = {
	[SETTING_PRIORITY.USER]: TASKS_TRANSLATION.USER,
	[SETTING_PRIORITY.SUB_DEPARTMENT]: TASKS_TRANSLATION.GROUP,
};

export const getStepperSteps = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.DYNAMICS:
			return [
				{
					val: `connect_${integration_type}`,
					label: COMMON_TRANSLATION[`CONNECT_${integration_type.toUpperCase()}`],
				},
				{
					val: "match_fields",
					label: COMMON_TRANSLATION.MATCH_FIELDS,
				},
			];
	}
};

export const renderView = (currentStep, props, user) => {
	sessionStorage.setItem(SESSION_STORAGE_KEYS.RECONFIGURE_CS, currentStep);
	switch (user.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.DYNAMICS:
			switch (currentStep) {
				case 0:
					return <ConnectIntegration {...props} />;
				case 1:
					return <MatchFields {...props} isOnboarding />;
			}
			break;
	}
};
