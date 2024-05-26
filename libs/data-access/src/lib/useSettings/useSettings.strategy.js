/* eslint-disable no-console */

import {
	INTEGRATION_TYPE,
	SHEETS_TRANSFORMATION_TABLE,
} from "@cadence-frontend/constants";

import { deepMapKeys } from "@cadence-frontend/utils";
import {
	SALESFORCE_TRANSFORMATION_TABLE,
	PIPEDRIVE_TRANSFORMATION_TABLE,
	GOOGLE_SHEETS_TRANSFORMATION_TABLE,
	HUBSPOT_TRANSFORMATION_TABLE,
	ZOHO_TRANSFORMATION_TABLE,
	BULLHORN_TRANSFORMATION_TABLE,
	SELLSY_TRANSFORMATION_TABLE,
	DYNAMICS_TRANSFORMATION_TABLE,
} from "@cadence-frontend/constants";
/**
 * data: Lead Data
 *
 */

export const fieldMapStrategy = ({ data: fieldMap, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return deepMapKeys(fieldMap, key => SALESFORCE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.PIPEDRIVE:
				return deepMapKeys(fieldMap, key => PIPEDRIVE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return deepMapKeys(
					fieldMap,
					key => GOOGLE_SHEETS_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.SHEETS:
				return deepMapKeys(fieldMap, key => SHEETS_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.HUBSPOT:
				return deepMapKeys(fieldMap, key => HUBSPOT_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.SELLSY:
				return deepMapKeys(fieldMap, key => SELLSY_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.DYNAMICS:
				return deepMapKeys(fieldMap, key => DYNAMICS_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.ZOHO:
				return deepMapKeys(fieldMap, key => ZOHO_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.BULLHORN:
				return deepMapKeys(fieldMap, key => BULLHORN_TRANSFORMATION_TABLE[key] || key);
		}
	} catch (err) {
		return fieldMap;
	}
};

/**
 * Lead Object for frontend:
 * 1. Salesforce lead is a lead
 * 2. Pipedrive person will also be treated as a lead
 * 3. Hubspot Contact will also be treated as a lead
 */

const getFetchLeadURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
			case INTEGRATION_TYPE.PIPEDRIVE:
				return `/v2/admin/company-settings/company-field-map/describe/person`;
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
			case INTEGRATION_TYPE.HUBSPOT:
				return `/v2/admin/company-settings/company-field-map/describe/contact`;
			case INTEGRATION_TYPE.ZOHO:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
			case INTEGRATION_TYPE.BULLHORN:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
			case INTEGRATION_TYPE.SELLSY:
				return `/v2/admin/company-settings/company-field-map/describe/contact`;
			case INTEGRATION_TYPE.DYNAMICS:
				return [
					"/v2/admin/company-settings/company-field-map/describe/lead",
					"/v2/admin/company-settings/company-field-map/describePicklist/lead",
				];
			default:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
		}
	} catch (err) {
		console.log("An error occured while fetching lead url", err);
		return `/v2/admin/company-settings/company-field-map/describe/lead`;
	}
};

/**
 * Account Object:
 * 1. Salesforce Accounts
 * 2. Pipedrive Organizations
 * 3. Hubspot Companies
 */
const getFetchAccountURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return `/v2/admin/company-settings/company-field-map/describe/account`;
			case INTEGRATION_TYPE.PIPEDRIVE:
				return `/v2/admin/company-settings/company-field-map/describe/organization`;
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return `/v2/admin/company-settings/company-field-map/describe/account`;
			case INTEGRATION_TYPE.HUBSPOT:
				return `/v2/admin/company-settings/company-field-map/describe/company`;
			case INTEGRATION_TYPE.ZOHO:
				return `/v2/admin/company-settings/company-field-map/describe/account`;
			case INTEGRATION_TYPE.BULLHORN:
				return `/v2/admin/company-settings/company-field-map/describe/clientCorporation`;
			case INTEGRATION_TYPE.SELLSY:
				return `/v2/admin/company-settings/company-field-map/describe/company`;
			case INTEGRATION_TYPE.DYNAMICS:
				return [
					"/v2/admin/company-settings/company-field-map/describe/account",
					"/v2/admin/company-settings/company-field-map/describePicklist/account",
				];
			default:
				return `/v2/admin/company-settings/company-field-map/describe/account`;
		}
	} catch (err) {
		console.log("An error occured while fetching lead url", err);
		return `/v2/admin/company-settings/company-field-map/describe/account`;
	}
};

const fetchIntegrationObjectStrategy = ({ integration_type, res }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE: {
				let result = res.data?.data?.map(item => {
					const obj = { name: item.name, label: item.label, type: "string" }; //setting defaultType to string
					if (item.type === "picklist") obj.type = item.type;
					if (obj.type === "picklist")
						obj.picklist_values = item.picklistValues.map(pv => ({
							label: pv?.label,
							value: pv?.value,
						}));
					return obj;
				});
				return result;
			}
			case INTEGRATION_TYPE.PIPEDRIVE: {
				let result = res.data?.data?.data?.map(item => {
					const obj = { name: item.key, label: item.name, type: item.field_type }; //setting defaultType to string
					if (obj.type === "enum")
						obj.picklist_values = item.options.map(pv => ({
							label: pv?.label,
							value: JSON.stringify(pv?.id),
						}));
					return obj;
				});
				return result;
			}

			case INTEGRATION_TYPE.HUBSPOT: {
				let result = res.data?.data?.results?.map(item => {
					const obj = { name: item.name, label: item.label, type: item.type }; //setting defaultType to string
					if (obj.type === "enum")
						obj.picklist_values = item.options.map(pv => ({
							label: pv?.label,
							value: JSON.stringify(pv?.id),
						}));
					return obj;
				});
				return result;
			}
			case INTEGRATION_TYPE.SELLSY: {
				let result = res.data?.data?.contact_fields
					?.filter(item => item?.type !== "object")
					?.map(item => {
						const obj = { name: item.value, label: item.label, type: item.type }; //setting defaultType to string
						if (obj.type === "enumeration")
							obj.picklist_values = item.options.map(pv => ({
								label: pv?.label,
								value: pv?.value,
							}));
						return obj;
					});

				return result;
			}
			case INTEGRATION_TYPE.DYNAMICS: {
				let result = res[0]?.data.data
					.filter(
						item => item.AttributeType !== "Virtual" && item.AttributeType !== "Lookup"
					)
					.map(item => {
						const obj = {
							name: item.LogicalName,
							label: item.DisplayName.LocalizedLabels?.[0]?.Label ?? item.SchemaName,
							type: item.AttributeType.toLowerCase(),
						};
						if (obj.type === "picklist")
							obj.picklist_values = res[1]?.data?.data
								.find(i => i.LogicalName === item.LogicalName)
								.OptionSet.Options.map(pv => ({
									label: pv?.Label.LocalizedLabels?.[0]?.Label,
									value: (pv?.Value).toString(),
								}));
						return obj;
					});
				return result;
			}
			case INTEGRATION_TYPE.ZOHO: {
				let result = res.data?.data?.map(item => {
					const obj = {
						name: item.api_name,
						label: item.display_label,
						type: "string",
						editable:
							!item.field_read_only &&
							item.view_type.edit &&
							item.api_name !== "Reporting_To",
					}; //setting defaultType to string
					if (item.data_type === "picklist") obj.data_type = item.data_type;
					if (obj.data_type === "picklist")
						obj.picklist_values = item.pick_list_values.map(pv => ({
							label: pv?.display_value,
							value: pv?.actual_value,
						}));
					return obj;
				});
				return result;
			}

			case INTEGRATION_TYPE.BULLHORN: {
				let result = res.data.data.fields
					?.filter(
						item =>
							Object.keys(item).includes("dataType") &&
							item.dataType !== "Address" &&
							item.dataType !== "SecondaryAddress" &&
							item.dataType !== "OnboardingReceivedSent" &&
							item.dataType !== "BillingAddress"
					)
					.filter(l =>
						l.dataType === "Timestamp"
							? Object.keys(l).includes("dataSpecialization") &&
							  l.dataSpecialization !== "SYSTEM"
							: true
					)
					.map(item => {
						const obj = {
							name: item.name,
							label: item.label,
							type:
								Object.keys(item).includes("inputType") &&
								Object.keys(item).includes("options")
									? "picklist"
									: "string",
							...(Object.keys(item).includes("inputType") &&
								Object.keys(item).includes("options") && {
									picklist_values: item.options?.map(item => ({
										value: item.value,
										label: item.label,
									})),
								}),
							dataType:
								item.dataType === "Timestamp" ? item.dataSpecialization : item.dataType,
							editable: item.readOnly === false,
						};

						return obj;
					});

				return result;
			}

			default:
				return;
		}
	} catch (err) {
		console.log("An error occured while fetching lead url", err);
		return {};
	}
};

const fetchUserWithActiveTokenStrategy = ({ data, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return deepMapKeys(data, key => SALESFORCE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.PIPEDRIVE:
				return deepMapKeys(data, key => PIPEDRIVE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.HUBSPOT:
				return deepMapKeys(data, key => HUBSPOT_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.SELLSY:
				return deepMapKeys(data, key => SELLSY_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.ZOHO:
				return deepMapKeys(data, key => ZOHO_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.BULLHORN:
				return deepMapKeys(data, key => BULLHORN_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.DYNAMICS:
				return deepMapKeys(data, key => DYNAMICS_TRANSFORMATION_TABLE[key] || key);
		}
	} catch (err) {
		return data;
	}
};

export {
	getFetchLeadURL,
	fetchIntegrationObjectStrategy,
	getFetchAccountURL,
	fetchUserWithActiveTokenStrategy,
};
