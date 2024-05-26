import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
};
export const LEADS_CONTACTS = [
	{ label: "Leads", value: VIEWS.LEAD },
	{ label: "Contacts", value: VIEWS.CONTACT },
];

export const companyContactReassignmentOptions = ({ integration_type }) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.SALESFORCE:
			return [
				{ label: "Change only contact owner", value: "change_only_contact_owner" },
				{
					label: "Change contact owner and account owner",
					value: "change_contact_and_account_owner",
				},
				{
					label:
						"Change contact owner, account owner and other contacts of the same account",
					value: "change_contact_account_and_other_contacts_owner",
				},
			];

		case INTEGRATION_TYPE.DYNAMICS:
			return [
				{ label: "Change only contact owner", value: "change_only_contact_owner" },
				{
					label:
						"Change contact owner, account owner and other contacts of the same account",
					value: "change_contact_account_and_other_contacts_owner",
				},
			];
	}
};
