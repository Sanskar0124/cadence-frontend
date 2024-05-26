import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const USER_DELETE_OPTIONS = {
	REASSIGN: "reassign",
	// UNASSIGN: "unassign",
	DELETE_ALL: "delete_all",
};

export const COMPANY_CONTACT_REASSIGNMENT_OPTIONS = {
	CONTACT_ONLY: "change_only_contact_owner",
	CONTACT_AND_ACCOUNT: "change_contact_and_account_owner",
	CONTACT_ACCOUNT_AND_OTHER_CONTACTS: "change_contact_account_and_other_contacts_owner",
};

export const isReassignmentAvailable = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return true;
		default:
			return false;
	}
};

export const getTypesByIntegration = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return true;
		default:
			return false;
	}
};

export const PEOPLE_TYPES = {
	LEADS: "leads",
	CONTACTS: "contacts",
	CANDIDATE: "candidate",
};

export const AVAILABLE_TYPES = {
	[INTEGRATION_TYPE.SALESFORCE]: [PEOPLE_TYPES.LEADS, PEOPLE_TYPES.CONTACTS],
	[INTEGRATION_TYPE.SELLSY]: [PEOPLE_TYPES.CONTACTS],
	[INTEGRATION_TYPE.HUBSPOT]: [PEOPLE_TYPES.CONTACTS],
	[INTEGRATION_TYPE.PIPEDRIVE]: [PEOPLE_TYPES.LEADS],
	[INTEGRATION_TYPE.GOOGLE_SHEETS]: [PEOPLE_TYPES.LEADS],
	[INTEGRATION_TYPE.EXCEL]: [PEOPLE_TYPES.LEADS],
	[INTEGRATION_TYPE.SHEETS]: [PEOPLE_TYPES.LEADS],
	[INTEGRATION_TYPE.ZOHO]: [PEOPLE_TYPES.LEADS, PEOPLE_TYPES.CONTACTS],
	[INTEGRATION_TYPE.DYNAMICS]: [PEOPLE_TYPES.LEADS, PEOPLE_TYPES.CONTACTS],
	[INTEGRATION_TYPE.BULLHORN]: [
		PEOPLE_TYPES.LEADS,
		PEOPLE_TYPES.CONTACTS,
		PEOPLE_TYPES.CANDIDATE,
	],
};
