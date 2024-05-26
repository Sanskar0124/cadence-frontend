import {
	INTEGRATION_TYPE,
	SESSION_STORAGE_KEYS,
	SETTING_PRIORITY,
} from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import ActivityLogs from "./components/ActivityLogs/ActivityLogs";
import AdminRules from "./components/AdminRules/AdminRules";
import ConnectIntegration from "./components/ConnectIntegration/ConnectIntegration";
import EmailSetup from "./components/EmailSetup/EmailSetup";
import General from "./components/General/General";
import MatchFields from "../Settings/components/Crm/components/FieldMapping/MatchFields/MatchFields";
import PhoneSystem from "./components/PhoneSystem/PhoneSystem";
import TeamSetup from "./components/TeamSetup/TeamSetup";

export const LEVEL_TO_NAME = {
	[SETTING_PRIORITY.USER]: TASKS_TRANSLATION.USER,
	[SETTING_PRIORITY.SUB_DEPARTMENT]: TASKS_TRANSLATION.GROUP,
};

export const getHomepageSteps = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.DYNAMICS:
			return [
				{
					val: integration_type,
					label: COMMON_TRANSLATION[integration_type.toUpperCase()],
				},
				{
					val: "match_fields",
					label: COMMON_TRANSLATION.MATCH_FIELDS,
				},
				{
					val: "admin_rules",
					label: COMMON_TRANSLATION.ADMIN_RULES,
				},
				{
					val: "team_setup",
					label: COMMON_TRANSLATION.GROUP_SETUP,
				},
			];

		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			return [
				{
					val: "phone_system",
					label: COMMON_TRANSLATION.PHONE_SYSTEM,
				},
				{
					val: "email_setup",
					label: COMMON_TRANSLATION.EMAIL_SET_UP,
				},
				{
					val: "admin_rules",
					label: COMMON_TRANSLATION.ADMIN_RULES,
				},
				{
					val: "team_setup",
					label: COMMON_TRANSLATION.GROUP_SETUP,
				},
			];
	}
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
					val: "email_setup",
					label: COMMON_TRANSLATION.EMAIL_SET_UP,
				},
				{
					val: "activity_logs",
					label: COMMON_TRANSLATION.ACTIVITY_SYNC,
				},
				{
					val: "match_fields",
					label: COMMON_TRANSLATION.MATCH_FIELDS,
				},
				{
					val: "admin_rules",
					label: COMMON_TRANSLATION.ADMIN_RULES,
				},
				{
					val: "team_setup",
					label: COMMON_TRANSLATION.GROUP_SETUP,
				},
				{
					val: "general",
					label: COMMON_TRANSLATION.GENERAL,
				},
			];

		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			return [
				{
					val: "email_setup",
					label: COMMON_TRANSLATION.EMAIL_SET_UP,
				},
				{
					val: "phone_system",
					label: COMMON_TRANSLATION.PHONE_SYSTEM,
				},
				{
					val: "admin_rules",
					label: COMMON_TRANSLATION.ADMIN_RULES,
				},
				{
					val: "team_setup",
					label: COMMON_TRANSLATION.GROUP_SETUP,
				},
				{
					val: "general",
					label: COMMON_TRANSLATION.GENERAL,
				},
			];
	}
};

export const renderView = (currentStep, props, user) => {
	sessionStorage.setItem(SESSION_STORAGE_KEYS.ONBOARDING_CS, currentStep);
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
					return <EmailSetup {...props} />;
				case 2:
					return <ActivityLogs {...props} type="onboarding" />;
				case 3:
					return <MatchFields {...props} isOnboarding />;
				case 4:
					return <AdminRules {...props} />;
				case 5:
					return <TeamSetup {...props} />;
				case 6:
					return <General {...props} />;
			}
			break;
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			switch (currentStep) {
				case 0:
					return <EmailSetup {...props} />;
				case 1:
					return <PhoneSystem {...props} />;
				case 2:
					return <AdminRules {...props} />;
				case 3:
					return <TeamSetup {...props} />;
				case 4:
					return <General {...props} />;
			}
			break;
	}
};

export const generateDocsLink = (integration_type, currentStep, lang) => {
	if (lang === "english") {
		if (integration_type === INTEGRATION_TYPE.SALESFORCE) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044321-salesforce-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044321-salesforce-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.ZOHO) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/support/solutions/articles/103000054436-zoho-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/support/solutions/articles/103000054436-zoho-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.BULLHORN) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107270-bullhorn-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107270-bullhorn-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.HUBSPOT) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044337-hubspot-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044337-hubspot-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.SELLSY) {
			switch (currentStep) {
				case 2:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-sellsy-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-sellsy-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.DYNAMICS) {
			switch (currentStep) {
				case 2:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-dynamics-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-dynamics-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (
			integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS ||
			integration_type === INTEGRATION_TYPE.EXCEL ||
			integration_type === INTEGRATION_TYPE.SHEETS
		) {
			switch (currentStep) {
				case 2:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.PIPEDRIVE) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044329-pipedrive-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000044329-pipedrive-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		}
	} else if (lang === "french") {
		if (integration_type === INTEGRATION_TYPE.SALESFORCE) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044321-int%C3%A9gration-salesforce";
				case 3:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044321-int%C3%A9gration-salesforce";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.ZOHO) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/support/solutions/articles/103000054436-zoho-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/support/solutions/articles/103000054436-zoho-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.BULLHORN) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107270-bullhorn-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107270-bullhorn-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.HUBSPOT) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044337-int%C3%A9gration-hubspot";
				case 3:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044337-int%C3%A9gration-hubspot";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.SELLSY) {
			switch (currentStep) {
				case 2:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-sellsy-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-sellsy-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.DYNAMICS) {
			switch (currentStep) {
				case 2:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-dynamics-onboarding";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000097703-dynamics-onboarding";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (
			integration_type === INTEGRATION_TYPE.GOOGLE_SHEETS ||
			integration_type === INTEGRATION_TYPE.EXCEL ||
			integration_type === INTEGRATION_TYPE.SHEETS
		) {
			switch (currentStep) {
				case 0:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 3:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		} else if (integration_type === INTEGRATION_TYPE.PIPEDRIVE) {
			switch (currentStep) {
				case 2:
				case 1:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044329-int%C3%A9gration-pipedrive";
				case 3:
					return "https://ringovercadence.freshdesk.com/fr/support/solutions/articles/103000044329-int%C3%A9gration-pipedrive";
				case 4:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043592-settings";
				case 5:
					return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000043583-groups";
				default:
					return "";
			}
		}
	}
};
