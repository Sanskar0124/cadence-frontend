import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { ParseRingoverFields as ParseRingoverFieldsSaleforce } from "./MatchFields/Salesforce/MatchFields/utils";

export const FIELD_MAPPING_AVAILABLE = {
	[INTEGRATION_TYPE.SALESFORCE]: {
		lead: "leads",
		contact: "accounts & contacts",
	},
	[INTEGRATION_TYPE.PIPEDRIVE]: {
		person: "person",
		organization: "organization",
	},
	[INTEGRATION_TYPE.HUBSPOT]: {
		contact: "contacts",
		company: "company",
	},
	[INTEGRATION_TYPE.ZOHO]: {
		lead: "leads",
		contact: "accounts & contacts",
	},
	[INTEGRATION_TYPE.SELLSY]: {
		contact: "contacts",
		company: "company",
	},
	[INTEGRATION_TYPE.DYNAMICS]: {
		lead: "leads",
		contact: "accounts & contacts",
	},
	[INTEGRATION_TYPE.BULLHORN]: {
		lead: "accounts & leads",
		contact: "accounts & contacts",
		candidate: "candidates",
	},
};

export const INTEGRATION_QUAL_KEYS = {
	[INTEGRATION_TYPE.SALESFORCE]: {
		lead: "lead_custom_object",
		contact: "contact_custom_object",
	},
	[INTEGRATION_TYPE.HUBSPOT]: {
		contact: "contact_custom_object",
	},
	[INTEGRATION_TYPE.PIPEDRIVE]: {
		person: "person_custom_object",
	},
	[INTEGRATION_TYPE.ZOHO]: {
		lead: "lead_custom_object",
		contact: "contact_custom_object",
	},
	[INTEGRATION_TYPE.SELLSY]: {
		contact: "contact_custom_object",
	},
	[INTEGRATION_TYPE.DYNAMICS]: {
		lead: "lead_custom_object",
		contact: "contact_custom_object",
	},
	[INTEGRATION_TYPE.BULLHORN]: {
		lead: "lead_custom_object",
		contact: "contact_custom_object",
		candidate: "candidate_custom_object",
	},
};

export const getQualificationButtonText = (
	field,
	ringoverFieldsFromServer,
	integration_type
) => {
	return (
		ringoverFieldsFromServer[INTEGRATION_QUAL_KEYS[integration_type][field]]?.[0]
			?.button_text || "qualification"
	);
};
