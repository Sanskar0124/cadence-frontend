import { INTEGRATION_TYPE, ROLES } from "@cadence-frontend/constants";

import Crm from "./components/Crm/Crm";
import EmailSetup from "./components/EmailSetup/EmailSetup";
import GeneralSettings from "./components/GeneralSettings/GeneralSettings";
import GroupsAndMembers from "./components/GroupsAndMembers/GroupsAndMembers";
import MyAccount from "./components/MyAccount/MyAccount";
import MyConnections from "./components/MyConnections/MyConnections";
import PhoneSystem from "./components/PhoneSystem/PhoneSystem";
import IntegrationAddOns from "./components/IntegrationAddOns/IntegrationAddOns";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";

export const TABS = {
	//profile
	MY_ACCOUNT: "my_account",
	MY_CONNECTIONS: "my_connections",
	//integration
	CRM_AND_MF: "crm_and_mf",
	EMAIL_SETUP: "email_setup",
	PHONE_SYSTEM: "phone_system",
	GROUPS_AND_MEMBERS: "groups_and_members",
	GENERAL_SETTINGS: "general_settings",
	INTEGRATION_ADD_ONS: "integration_add_ons",
};

const getOptionsByIntegration = integration_type => {
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
					label: SETTINGS_TRANSLATION.CRM_SYNC_FIELD_MAPPING,
					value: TABS.CRM_AND_MF,
				},
				{
					label: COMMON_TRANSLATION.EMAIL_SETUP,
					value: TABS.EMAIL_SETUP,
				},
				{
					label: COMMON_TRANSLATION.PHONE_SYSTEM,
					value: TABS.PHONE_SYSTEM,
				},
				{
					label: SETTINGS_TRANSLATION.GROUP_AND_MEMBERS,
					value: TABS.GROUPS_AND_MEMBERS,
				},
				{
					label: SETTINGS_TRANSLATION.GENERAL_SETTINGS,
					value: TABS.GENERAL_SETTINGS,
				},
				{
					label: SETTINGS_TRANSLATION.ADDONS,
					value: TABS.INTEGRATION_ADD_ONS,
				},
			];
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			return [
				{
					label: COMMON_TRANSLATION.EMAIL_SETUP,
					value: TABS.EMAIL_SETUP,
				},
				{
					label: COMMON_TRANSLATION.PHONE_SYSTEM,
					value: TABS.PHONE_SYSTEM,
				},
				{
					label: SETTINGS_TRANSLATION.GROUP_AND_MEMBERS,
					value: TABS.GROUPS_AND_MEMBERS,
				},
				{
					label: SETTINGS_TRANSLATION.GENERAL_SETTINGS,
					value: TABS.GENERAL_SETTINGS,
				},
				{
					label: SETTINGS_TRANSLATION.ADDONS,
					value: TABS.INTEGRATION_ADD_ONS,
				},
			];
	}
};

const getOptionsByRole = integration_type => {
	return {
		[ROLES.MANAGER]: [TABS.GENERAL_SETTINGS, TABS.GROUPS_AND_MEMBERS],
		[ROLES.ADMIN]: [...getOptionsByIntegration(integration_type).map(t => t.value)],
		[ROLES.SUPER_ADMIN]: [...getOptionsByIntegration(integration_type).map(t => t.value)],
	};
};

export const getIntegrationOptions = (role, language, integration_type) => {
	if (!role) return [];
	let tabs = getOptionsByIntegration(integration_type);
	let options = tabs
		?.map(tabs => ({
			label: tabs.label[language?.toUpperCase()] ?? tabs.label,
			value: tabs.value,
		}))
		.filter(opt => getOptionsByRole(integration_type)[role].includes(opt.value));
	return options;
};

export const getProfileOptions = language => {
	return [
		{ label: PROFILE_TRANSLATION.MY_ACCOUNT, value: TABS.MY_ACCOUNT },
		{ label: PROFILE_TRANSLATION.MY_CONNECTIONS, value: TABS.MY_CONNECTIONS },
	];
};

export const renderView = ({ activeTab, ...props }) => {
	switch (activeTab) {
		case TABS.MY_ACCOUNT:
			return <MyAccount />;
		case TABS.MY_CONNECTIONS:
			return <MyConnections />;
		case TABS.EMAIL_SETUP:
			return <EmailSetup />;
		case TABS.PHONE_SYSTEM:
			return <PhoneSystem />;
		case TABS.GROUPS_AND_MEMBERS:
			return <GroupsAndMembers />;
		case TABS.CRM_AND_MF:
			return <Crm {...props} />;
		case TABS.GENERAL_SETTINGS:
			return <GeneralSettings {...props} />;
		case TABS.INTEGRATION_ADD_ONS:
			return <IntegrationAddOns {...props} />;
		default:
			return <MyAccount />;
	}
};
