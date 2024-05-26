import {
	ENRICHMENT_SERVICES,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
} from "@cadence-frontend/constants";
import { KasprLogo, LushaLogo } from "@cadence-frontend/icons";

export const USER_TYPE = { ZOHO_USER: "zoho_user" };

export const COMPANY_SIZE_OPTIONS = [
	{ label: "1-10", value: "1-10" },
	{ label: "11-50", value: "11-50" },
	{ label: "51-200", value: "51-200" },
	{ label: "201-500", value: "201-500" },
	{ label: "501-1000", value: "501-1000" },
	{ label: "1001-5000", value: "1001-5000" },
	{ label: "5000-10 000", value: "5000-10 000" },
	{ label: "+10 000", value: "10,000+" },
];
export const COMPANY_SIZE_OPTIONS_SELLSY = [
	{ label: "None", value: "0" },
	{ label: "1 to 5", value: "1" },
	{ label: "6 to 10", value: "6" },
	{ label: "11 to 49", value: "11" },
	{ label: "50 or more", value: "51" },
];

export const ENRICH_LOGO_MAP = {
	[ENRICHMENT_SERVICES.LUSHA]: <LushaLogo size="1.7rem" />,
	[ENRICHMENT_SERVICES.KASPR]: <KasprLogo size="1.7rem" />,
	[ENRICHMENT_SERVICES.HUNTER]: (
		<img
			src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/hunter_logo.png"
			alt=""
		/>
	),
	[ENRICHMENT_SERVICES.DROPCONTACT]: (
		<img src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/dropcontact_logo.png" />
	),
};

export const getCompanySizeOptionsByIntegration = (
	integration_type,
	lead,
	fieldMap,
	setCompanySizeOptions,
	addError
) => {
	const itMap = fieldMap?.Company_Setting?.Integration_Field_Map;

	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			if (lead?.integration_id) {
				if (lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT) {
					if (typeof itMap?.account_map?.size === "string") {
						setCompanySizeOptions(itMap?.account_map?.size);
					} else {
						setCompanySizeOptions(itMap?.account_map?.size?.picklist_values ?? []);
					}
				} else if (
					lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD ||
					lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD ||
					lead?.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD
				) {
					if (typeof itMap?.lead_map?.size === "string") {
						setCompanySizeOptions(itMap?.lead_map?.size);
					} else {
						setCompanySizeOptions(itMap?.lead_map?.size?.picklist_values ?? []);
					}
				} else addError({ text: "Failed to get company size options" });
			} else addError({ text: "Failed to get company size options" });
			break;

		case INTEGRATION_TYPE.PIPEDRIVE:
			if (lead?.integration_id) {
				if (typeof itMap?.organization_map?.size === "string") {
					setCompanySizeOptions(itMap?.organization_map?.size);
				} else {
					setCompanySizeOptions(
						itMap?.organization_map?.size?.picklist_values.map(opt => ({
							label: opt.label,
							value: opt.label,
						})) ?? []
					);
				}
			} else {
				addError({ text: `Failed to get company size options` });
			}
			break;

		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS:
			setCompanySizeOptions(COMPANY_SIZE_OPTIONS);
			break;
		case INTEGRATION_TYPE.SELLSY:
			setCompanySizeOptions(COMPANY_SIZE_OPTIONS_SELLSY);
			break;
		case INTEGRATION_TYPE.DYNAMICS:
			if (lead?.integration_id) {
				if (lead?.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT) {
					if (typeof itMap?.account_map?.size === "string") {
						setCompanySizeOptions(itMap?.account_map?.size);
					} else {
						setCompanySizeOptions(itMap?.account_map?.size?.picklist_values ?? []);
					}
				} else if (lead?.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD) {
					if (typeof itMap?.lead_map?.size === "string") {
						setCompanySizeOptions(itMap?.lead_map?.size);
					} else {
						setCompanySizeOptions(itMap?.lead_map?.size?.picklist_values ?? []);
					}
				} else addError({ text: "Failed to get company size options" });
			} else addError({ text: "Failed to get company size options" });
			break;

		default:
			return;
	}
};

export const sellsyCompanySize = size => {
	if (size?.includes(" "))
		return size?.split(" ")?.[0] === "50" || size?.split(" ")?.[0] === "51"
			? "51"
			: size?.split(" ")?.[1] ?? "0";
	else return size;
};

export const getLeadVariables = (lead, fieldMap, info) => {
	let integrationFieldMap = fieldMap?.Company_Setting?.Integration_Field_Map;
	let leadVariables = [];
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD: {
			{
				if (!info?.lead) break;
				leadVariables = integrationFieldMap?.lead_map?.variables?.map(
					(variable, index) => ({
						var_id: `__variable_${index}`,
						name: variable.target_value.value,
						label: variable.target_value.label,
						value: info?.lead?.[variable.target_value.value],

						...(variable?.target_value?.picklist_values && {
							picklist_values: variable?.target_value?.picklist_values,
						}),
					})
				);
				break;
			}
		}
		case LEAD_INTEGRATION_TYPES.ZOHO_LEAD:
		case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD: {
			if (!info?.lead) break;
			leadVariables = integrationFieldMap?.lead_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.lead?.[variable.target_value.value],
				})
			);
			break;
		}
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON: {
			if (!info?.person) break;
			leadVariables = integrationFieldMap?.lead_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.person?.[variable.target_value.value],
				})
			);
			break;
		}
	}
	return leadVariables;
};

export const getContactVariables = (lead, fieldMap, info) => {
	let integrationFieldMap = fieldMap?.Company_Setting?.Integration_Field_Map;
	let contactVariables = [];
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
		case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT: {
			if (!info?.contact) break;
			contactVariables = integrationFieldMap?.contact_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.contact?.[variable.target_value.value],
					// picklist_values: variable?.target_value?.picklist_values ?? [],
					...(variable?.target_value?.picklist_values && {
						picklist_values: variable?.target_value?.picklist_values,
					}),
				})
			);
			break;
		}
		case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT: {
			if (!info?.contact) break;
			contactVariables = integrationFieldMap?.contact_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.contact?.[variable.target_value.label],
				})
			);
			break;
		}
	}
	return contactVariables;
};

export const getCandidateVariables = (lead, fieldMap, info) => {
	let integrationFieldMap = fieldMap?.Company_Setting?.Integration_Field_Map;
	let candidateVariables = [];
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE: {
			if (!info?.candidate) break;
			candidateVariables = integrationFieldMap?.candidate_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.candidate?.[variable.target_value.value],
				})
			);
			break;
		}
	}
	return candidateVariables;
};

export const getAccountVariables = (lead, fieldMap, info) => {
	let integrationFieldMap = fieldMap?.Company_Setting?.Integration_Field_Map;
	let accountVariables = [];
	switch (lead?.integration_type) {
		case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
		case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
		case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD:
		case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT: {
			if (!info?.account) break;
			accountVariables = integrationFieldMap?.account_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.account?.[variable.target_value.value],
					// picklist_values: variable?.target_value?.picklist_values ?? [],
					...(variable?.target_value?.picklist_values && {
						picklist_values: variable?.target_value?.picklist_values,
					}),
				})
			);
			break;
		}
		case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT: {
			if (!info?.company) break;
			accountVariables = integrationFieldMap?.company_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.company?.[variable.target_value.value],
				})
			);
			break;
		}
		case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON: {
			if (!info?.organization) break;
			accountVariables = integrationFieldMap?.organization_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.organization?.[variable.target_value.value],
				})
			);
			break;
		}
		case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT: {
			if (!info?.company) break;
			accountVariables = integrationFieldMap?.company_map?.variables?.map(
				(variable, index) => ({
					var_id: `__variable_${index}`,
					name: variable.target_value.value,
					label: variable.target_value.label,
					value: info?.company?.[variable.target_value.label],
				})
			);
			break;
		}
	}
	return accountVariables;
};

export const CUSTOM_VARS_NAMES_BY_INTEGRATION = {
	[INTEGRATION_TYPE.SALESFORCE]: {
		lead: "Leads",
		account: "Account",
	},
	[INTEGRATION_TYPE.HUBSPOT]: {
		lead: "Contact",
		account: "Company",
	},
	[INTEGRATION_TYPE.PIPEDRIVE]: {
		lead: "Person",
		account: "Organization",
	},
	[INTEGRATION_TYPE.ZOHO]: {
		lead: "Leads",
		account: "Account",
	},
	[INTEGRATION_TYPE.SELLSY]: {
		lead: "Contact",
		account: "Company",
	},
	[INTEGRATION_TYPE.BULLHORN]: {
		lead: "Leads",
		account: "Account",
	},
};

export const COMPANY_LINKEDIN_FIELD_AVAILABLE = [INTEGRATION_TYPE.PIPEDRIVE];

export const COMPANY_SIZE_FIELD_AVAILABLE = [
	INTEGRATION_TYPE.SALESFORCE,
	INTEGRATION_TYPE.SELLSY,
	INTEGRATION_TYPE.DYNAMICS,
	INTEGRATION_TYPE.PIPEDRIVE,
	INTEGRATION_TYPE.GOOGLE_SHEETS,
	INTEGRATION_TYPE.EXCEL,
	INTEGRATION_TYPE.SHEETS,
];
export const PHONE_OPTIONS = ["home", "work", "mobile", "other"];
export const EMAIL_OPTIONS = ["home", "work", "other"];
