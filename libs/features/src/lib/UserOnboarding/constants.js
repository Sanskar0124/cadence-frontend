import {
	INTEGRATION_TYPE,
	SESSION_STORAGE_KEYS,
	SETTING_PRIORITY,
} from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import ConnectIntegration from "./components/ConnectIntegration/ConnectIntegration";
import CompanyOnboardingEmailSetup from "../CompanyOnboarding/components/EmailSetup/EmailSetup";
import CompanyOnboardingGeneral from "../CompanyOnboarding/components/General/General";
import { capitalize } from "@cadence-frontend/utils";

export const LEVEL_TO_NAME = {
	[SETTING_PRIORITY.USER]: "user",
	[SETTING_PRIORITY.SUB_DEPARTMENT]: "group",
};

export const getHomepageSteps = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.BULLHORN:
			return [
				{
					val: "email_setup",
					label: COMMON_TRANSLATION.EMAIL_SET_UP,
				},
				{
					val: integration_type,
					label: COMMON_TRANSLATION[integration_type.toUpperCase()],
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
					val: "general",
					label: COMMON_TRANSLATION.GENERAL,
				},
			];
	}
};

export const getStepperSteps = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.BULLHORN:
			return [
				{
					val: "email_setup",
					label: COMMON_TRANSLATION.EMAIL_SET_UP,
				},
				{
					val: `connect_${integration_type}`,
					label: COMMON_TRANSLATION[`CONNECT_${integration_type.toUpperCase()}`],
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
					val: "general",
					label: COMMON_TRANSLATION.GENERAL,
				},
			];
	}
};

export const renderView = (currentStep, props, integration_type) => {
	sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_ONBOARDING_CS, currentStep);
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.BULLHORN:
			switch (currentStep) {
				case 0:
					return <CompanyOnboardingEmailSetup {...props} />;
				case 1:
					return <ConnectIntegration {...props} />;
				case 2:
					return <CompanyOnboardingGeneral {...props} />;
			}
			break;
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			switch (currentStep) {
				case 0:
					return <CompanyOnboardingEmailSetup {...props} />;
				case 1:
					return <CompanyOnboardingGeneral {...props} />;
			}
			break;
	}
};
