import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export const COMPANY_CONTACT_REASSIGNMENT_OPTIONS = {
	CONTACT_ONLY: "change_only_contact_owner",
	CONTACT_AND_ACCOUNT: "change_contact_and_account_owner",
	CONTACT_ACCOUNT_AND_OTHER_CONTACTS: "change_contact_account_and_other_contacts_owner",
};

export const IS_LEAD = lead => {
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
			return true;
		default:
			return false;
	}
};

export const IS_CONTACT = lead => {
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
		case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT:
			return true;
		default:
			return false;
	}
};
