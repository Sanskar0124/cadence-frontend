import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const triggerOptions = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.ZOHO:
			return [
				{
					label: "When a lead is added to org.",
					value: "when_a_lead_is_added_to_org",
				},
				{
					label: "When a contact is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a lead is updated.",
					value: "when_a_lead_is_updated",
				},
				{
					label: "When a contact is updated.",
					value: "when_a_contact_is_updated",
				},
			];
		case INTEGRATION_TYPE.PIPEDRIVE:
			return [
				{
					label: "When a person is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a person is updated.",
					value: "when_a_contact_is_updated",
				},
			];
		case INTEGRATION_TYPE.HUBSPOT:
			return [
				{
					label: "When a contact is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a contact is updated.",
					value: "when_a_contact_is_updated",
				},
			];

		case INTEGRATION_TYPE.SELLSY:
			return [
				{
					label: "When a contact is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a contact is updated.",
					value: "when_a_contact_is_updated",
				},
			];
		case INTEGRATION_TYPE.BULLHORN:
			return [
				{
					label: "When a lead is added to org.",
					value: "when_a_lead_is_added_to_org",
				},
				{
					label: "When a contact is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a candidate is added to org.",
					value: "when_a_candidate_is_added_to_org",
				},
				{
					label: "When a lead is updated.",
					value: "when_a_lead_is_updated",
				},
				{
					label: "When a contact is updated.",
					value: "when_a_contact_is_updated",
				},
				{
					label: "When a candidate is updated.",
					value: "when_a_candidate_is_updated",
				},
			];

		case INTEGRATION_TYPE.DYNAMICS:
			return [
				{
					label: "When a lead is added to org.",
					value: "when_a_lead_is_added_to_org",
				},
				{
					label: "When a contact is added to org.",
					value: "when_a_contact_is_added_to_org",
				},
				{
					label: "When a lead is updated.",
					value: "when_a_lead_is_updated",
				},
				{
					label: "When a contact is updated.",
					value: "when_a_contact_is_updated",
				},
			];
	}
};

export const THEN = [
	{
		label: "Add to cadence",
		value: "add_to_cadence",
	},
	{
		label: "changing lead/contact/account status",
		value: "changing lead/contact/account status",
	},
];
export const SELECT_DATA_TYPE = [
	"picklist",
	"enum",
	"select",
	"radio",
	"booleancheckbox",
];
export const PIPEDRIVE_HUBSPOT_SELLSY_ID_FIELDS = [
	"id",
	"hs_created_by_user_id",
	"hs_updated_by_user_id",
	"role_id",
	"company_id",
	"userId",
	"hs_user_ids_of_all_owners",
	"hs_user_ids_of_all_notification_unfollowers",
	"hs_user_ids_of_all_notification_followers",
	"hs_pinned_engagement_id",
	"hs_object_id",
	"hs_merged_object_ids",
	"associatedcompanyid",
	"hs_twitterid",
	"hs_pinned_engagement_id",
	"hs_merged_object_ids",
	"hs_linkedinid",
	"hs_googleplusid",
	"hs_google_click_id",
	"hs_first_engagement_object_id",
	"hs_facebookid",
	"hs_facebook_click_id",
	//sellsy fields
	"invoicing_address_id",
	"delivery_address_id",
	"rate_category_id",
	"main_contact_id",
	"dunning_contact_id",
	"invoicing_contact_id",
	"invoicing_address_id",
	"delivery_address_id",
	"accounting_code_id",
	"accounting_purchase_code_id",
];
export const operators = type => {
	switch (type) {
		case "datetime":
		case "date":
			return [
				{
					label: "Equal",
					value: "equal",
				},
				{
					label: "Greater than",
					value: "greater_than",
				},

				{
					label: "Less than",
					value: "less_than",
				},
			];
		case "int":
		case "currency":
		case "double":
		case "integer":
		case "number":
		case "bigdecimal":
			return [
				{
					label: "Equal",
					value: "equal",
				},
			];
		default:
			return [
				{
					label: "Equal",
					value: "equal",
				},
				{
					label: "Includes",
					value: "includes",
				},
			];
	}
};

export const condtions = [
	{
		label: "add condition",
		value: "add condition",
	},

	{
		label: "add nested condition",
		value: "add nested condition",
	},
];

export const conditionAndOr = [
	{
		label: "AND",
		value: true,
	},

	{
		label: "OR",
		value: false,
	},
];

export const CONDITIONANDOR = {
	and: "And",
	or: "Or",
};
