/* eslint-disable no-console */

import {
	GOOGLE_SHEETS_TRANSFORMATION_TABLE,
	HUBSPOT_TRANSFORMATION_TABLE,
	INTEGRATION_TYPE,
	PIPEDRIVE_TRANSFORMATION_TABLE,
	SALESFORCE_TRANSFORMATION_TABLE,
	ZOHO_TRANSFORMATION_TABLE,
	BULLHORN_TRANSFORMATION_TABLE,
	ROLES,
} from "@cadence-frontend/constants";
import { deepMapKeys } from "@cadence-frontend/utils";
import { inputDataTypeDynamics } from "./constant";

const customObjStrategy = ({ data: customObjData, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return deepMapKeys(
					customObjData,
					key => SALESFORCE_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.PIPEDRIVE:
				return deepMapKeys(
					customObjData,
					key => PIPEDRIVE_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return deepMapKeys(
					customObjData,
					key => GOOGLE_SHEETS_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.HUBSPOT:
				return deepMapKeys(
					customObjData,
					key => HUBSPOT_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.ZOHO:
				return deepMapKeys(customObjData, key => ZOHO_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.BULLHORN:
				return deepMapKeys(
					customObjData,
					key => BULLHORN_TRANSFORMATION_TABLE[key] || key
				);
		}
	} catch (err) {
		return customObjData;
	}
};

const CIVILITY_SELLSY = [
	{
		label: "Mr.",
		value: "mr",
	},
	{
		label: "Ms.",
		value: "ms",
	},
	{
		label: "Mrs.",
		value: "mrs",
	},
];
const BOOLEAN_OPTIONS = [
	{
		label: "True",
		value: "true",
	},
	{
		label: "False",
		value: "false",
	},
];
const MARKETTING_CAMPAIGNS_SUBSCRIPTIONS = [
	{
		label: "SMS",
		value: "sms",
	},
	{
		label: "Phone",
		value: "phone",
	},
	{
		label: "Email",
		value: "email",
	},
	{
		label: "Postal mail",
		value: "postal_mail",
	},
	{
		label: "Custom",
		value: "custom",
	},
];
const NUMBER_OF_EMPLOYEES = [
	{ label: "None", value: 0 },
	{ label: "1 to 5", value: 1 },
	{ label: "6 to 10", value: 6 },
	{ label: "11 to 49", value: 11 },
	{ label: "50 or more", value: 51 },
];
/**
 * Lead Object for frontend:
 * 1. Salesforce lead is a lead
 * 2. Pipedrive person will also be treated as a lead
 * 3. Hubspot Contact will also be treated as a lead
 */

/**
 * Get URL for /describe/{frontend-lead-object} based on integration
 */
const getDescribeLeadURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "/v2/admin/company-settings/company-field-map/describe/lead";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return "/v2/admin/company-settings/company-field-map/describe/person";
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return "/v2/admin/company-settings/company-field-map/describe/lead";
			case INTEGRATION_TYPE.HUBSPOT:
				return "/v2/admin/company-settings/company-field-map/describe/contact";
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/admin/company-settings/company-field-map/describe/lead";
			case INTEGRATION_TYPE.SELLSY:
				return "/v2/admin/company-settings/company-field-map/describe/contact";
			case INTEGRATION_TYPE.BULLHORN:
				return `/v2/admin/company-settings/company-field-map/describe/lead`;
			case INTEGRATION_TYPE.DYNAMICS:
				return [
					"/v2/admin/company-settings/company-field-map/describe/lead",
					"/v2/admin/company-settings/company-field-map/describePicklist/lead",
				];
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return "/v2/admin/company-settings/company-field-map/describe/lead";
	}
};

/**
 * Get strategy for /describe/{frontend-lead-object} based on integration
 */
const describeLeadStrategy = ({ integration_type, res }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE: {
				let sf_lead = res?.data.data.map(item => {
					let obj = {
						name: item.name,
						label: item.label,
						type: item.type,
						editable: item.updateable,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.picklistValues;
					if (obj.type === "reference") {
						obj.reference_to = item.referenceTo;
					}
					return obj;
				});
				return sf_lead;
			}
			case INTEGRATION_TYPE.PIPEDRIVE: {
				let pd_lead = res?.data.data.data.map(item => {
					let obj = {
						name: item.key,
						label: item.name,
						type: item.field_type,
						editable: item.bulk_edit_allowed,
					};
					if (obj.type === "enum") obj.picklistValues = item.options;
					return obj;
				});
				return pd_lead;
			}
			case INTEGRATION_TYPE.GOOGLE_SHEETS: {
				let gs_lead = res?.data.data.map(item => {
					let obj = {
						name: item.name,
						label: item.label,
						type: item.type,
						editable: item.updateable,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.picklistValues;
					if (obj.type === "reference") {
						obj.reference_to = item.referenceTo;
					}
					return obj;
				});
				return gs_lead;
			}
			case INTEGRATION_TYPE.HUBSPOT: {
				let hs_lead = res.data?.data?.results?.map(item => {
					const obj = {
						name: item.name,
						label: item.label,
						editable: !item.modificationMetadata.readOnlyValue,
					}; //setting defaultType to string
					if (
						item?.type === "date" ||
						item?.type === "datetime" ||
						item?.type === "number"
					) {
						obj.type = item?.type;
					} else if (item?.fieldType === "phonenumber") {
						obj.type = "text";
					} else if (item?.type === "enumeration" || item?.type === "string") {
						obj.type = item?.fieldType;
					} else if (item?.type === "bool") {
						obj.type = "booleancheckbox";
					}
					if (
						obj.type === "select" ||
						obj.type === "checkbox" ||
						obj.type === "radio" ||
						obj.type === "booleancheckbox"
					)
						obj.picklist_values = item.options.map(pv => ({
							label: pv?.label,
							value: pv?.value,
						}));
					return obj;
				});
				return hs_lead;
			}
			case INTEGRATION_TYPE.SELLSY: {
				const { contact_fields, custom_fields } = res.data?.data;
				let sellsy_fields = [];
				contact_fields?.forEach(cField => {
					const obj = {
						name: cField?.value,
						label: cField?.label,
						editable: cField?.editable ?? true,
						type:
							cField.value === "civility"
								? "select"
								: cField.value === "marketing_campaigns_subscriptions"
								? "checkbox"
								: cField.value === "birth_date"
								? "date"
								: cField?.type,
					};
					if (cField.value === "civility") obj.picklist_values = CIVILITY_SELLSY;
					else if (cField.value === "marketing_campaigns_subscriptions")
						obj.picklist_values = MARKETTING_CAMPAIGNS_SUBSCRIPTIONS;
					else if (obj.type === "boolean") {
						obj.picklist_values = BOOLEAN_OPTIONS;
					}
					sellsy_fields.push(obj);
				});

				custom_fields?.forEach(cField => {
					const obj = {
						name: cField?.code,
						label: cField?.name,
						editable: true,
						type: cField?.type,
						sellsy_field_id: cField?.id,
						sellsy_mandatory: cField?.mandatory ?? false,
					};
					if (obj.type === "select" || obj.type === "checkbox" || obj.type === "radio")
						obj.picklist_values = cField?.parameters?.items?.map(pv => ({
							label: pv?.label,
							value: pv?.id,
						}));

					sellsy_fields.push(obj);
				});

				return sellsy_fields;
			}
			case INTEGRATION_TYPE.ZOHO: {
				let sf_lead = res?.data.data.map(item => {
					let obj = {
						name: item.api_name,
						label: item.display_label,
						type: item.data_type,
						editable: item.allowed_permissions_to_update.read_write,
						types: item.json_type,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.pick_list_values;
					// if (obj.type === "reference") {
					// 	obj.reference_to = item.referenceTo;
					// }
					return obj;
				});
				return sf_lead;
			}

			case INTEGRATION_TYPE.BULLHORN: {
				//  (item.dataType === "Timestamp" &&
				// 							!Object.keys(item).includes("dataSpecialization"))

				let bf_lead = res?.data.data.fields
					?.filter(
						item =>
							Object.keys(item).includes("dataType") &&
							item.dataType !== "Address" &&
							item.dataType !== "SecondaryAddress" &&
							item.dataType !== "OnboardingReceivedSent" &&
							item.dataType !== "BillingAddress" &&
							item.name !== "id"
					)
					?.filter(item =>
						item.dataType === "Timestamp"
							? Object.keys(item).includes("dataSpecialization")
							: true
					)
					?.map(item => {
						let obj = {
							name: item.name,
							label: item.label,
							type:
								Object.keys(item).includes("inputType") &&
								Object.keys(item).includes("options")
									? item.inputType
									: item.dataType,
							editable: item.readOnly,
						};

						if (
							Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options")
						) {
							obj.picklistValues = item.options;
							obj.multiValue = item.multiValue;
						}

						// if (obj.type === "picklist" || obj.type === "multipicklist")
						// 	obj.picklistValues = item.pick_list_values;

						if (
							obj.type === "Timestamp" &&
							Object.keys(item).includes("dataSpecialization")
						) {
							obj.dateType = item.dataSpecialization;
						}

						return obj;
					});
				return bf_lead;
			}
			case INTEGRATION_TYPE.DYNAMICS: {
				let d_lead = res[0]?.data.data
					.filter(
						item =>
							item.AttributeType !== "Virtual" &&
							item.AttributeType !== "Lookup" &&
							item.AttributeType !== "EntityName" &&
							item.AttributeType !== "Customer" &&
							item.AttributeType !== "Uniqueidentifier" &&
							item.AttributeType !== "Owner"
					)
					.map(item => {
						let obj = {
							name: item.LogicalName,
							label: item.DisplayName.LocalizedLabels?.[0]?.Label ?? item.SchemaName,
							type: inputDataTypeDynamics(
								item?.LogicalName === "estimatedclosedate"
									? "date"
									: item.AttributeType.toLowerCase()
							),
							editable: item.IsValidForUpdate,
						};
						if (obj.type === "picklist")
							obj.picklistValues = res[1]?.data?.data
								.find(i => i.LogicalName === item.LogicalName)
								.OptionSet.Options.map(pv => ({
									label: pv?.Label.LocalizedLabels?.[0]?.Label,
									value: pv?.Value,
								}));
						return obj;
					});
				return d_lead;
			}
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return res?.data.data;
	}
};

/**
 * Account Object for Frontend:
 * 1. Salesforce Account is an account
 * 2. Pipedrive Organization is an account
 * 4. Google Sheets Companies are also accounts
 * 3. Hubspot Company is an account
 */
/**
 * Get URL for /describe/{frontend-lead-object} based on integration
 */
const getDescribeAccountURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "/v2/admin/company-settings/company-field-map/describe/account";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return "/v2/admin/company-settings/company-field-map/describe/organization";
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return "/v2/admin/company-settings/company-field-map/describe/account";
			case INTEGRATION_TYPE.HUBSPOT:
				return "/v2/admin/company-settings/company-field-map/describe/company";
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/admin/company-settings/company-field-map/describe/account";
			case INTEGRATION_TYPE.SELLSY:
				return "/v2/admin/company-settings/company-field-map/describe/company";
			case INTEGRATION_TYPE.BULLHORN:
				return "/v2/admin/company-settings/company-field-map/describe/clientCorporation";
			case INTEGRATION_TYPE.DYNAMICS:
				return [
					"/v2/admin/company-settings/company-field-map/describe/account",
					"/v2/admin/company-settings/company-field-map/describePicklist/account",
				];
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return "/v2/admin/company-settings/company-field-map/describe/account";
	}
};

/**
 * Get strategy for /describe/{frontend-account-object} based on integration
 */
const describeAccountStrategy = ({ integration_type, res }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE: {
				let sf_account = res?.data.data.map(item => {
					let obj = {
						name: item.name,
						label: item.label,
						type: item.type,
						editable: item.updateable,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.picklistValues;

					if (obj.type === "reference") {
						obj.reference_to = item.referenceTo;
					}
					return obj;
				});
				return sf_account;
			}
			case INTEGRATION_TYPE.PIPEDRIVE: {
				let pd_account = res?.data.data.data.map(item => {
					let obj = {
						name: item.key,
						label: item.name,
						type: item.field_type,
						editable: item.bulk_edit_allowed,
					};
					if (obj.type === "enum") obj.picklistValues = item.options;

					return obj;
				});
				return pd_account;
			}
			case INTEGRATION_TYPE.GOOGLE_SHEETS: {
				let gs_lead = res?.data.data.map(item => {
					let obj = {
						name: item.name,
						label: item.label,
						type: item.type,
						editable: item.updateable,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.picklistValues;
					if (obj.type === "reference") {
						obj.reference_to = item.referenceTo;
					}
					return obj;
				});
				return gs_lead;
			}
			case INTEGRATION_TYPE.HUBSPOT: {
				let hs_account = res.data?.data?.results?.map(item => {
					const obj = {
						name: item.name,
						label: item.label,
						editable: !item.modificationMetadata.readOnlyValue,
					}; //setting defaultType to string
					if (
						item?.type === "date" ||
						item?.type === "datetime" ||
						item?.type === "number"
					) {
						obj.type = item?.type;
					} else if (item?.fieldType === "phonenumber") {
						obj.type = "text";
					} else if (item?.type === "enumeration" || item?.type === "string") {
						obj.type = item?.fieldType;
					} else if (item?.type === "bool") {
						obj.type = "booleancheckbox";
					}
					if (
						obj.type === "select" ||
						obj.type === "checkbox" ||
						obj.type === "radio" ||
						obj.type === "booleancheckbox"
					)
						obj.picklist_values = item.options.map(pv => ({
							label: pv?.label,
							value: pv?.value,
						}));
					return obj;
				});
				return hs_account;
			}
			case INTEGRATION_TYPE.SELLSY: {
				const { company_fields, custom_fields } = res.data?.data;
				let sellsy_fields = [];
				company_fields?.forEach(cField => {
					const obj = {
						name: cField?.value,
						label: cField?.label,
						editable: cField?.editable ?? true,
						type:
							cField.value === "marketing_campaigns_subscriptions"
								? "checkbox"
								: cField.value === "number_of_employees.label"
								? "select"
								: cField?.type,
					};
					if (cField.value === "marketing_campaigns_subscriptions")
						obj.picklist_values = MARKETTING_CAMPAIGNS_SUBSCRIPTIONS;
					else if (cField.value === "number_of_employees.label")
						obj.picklist_values = NUMBER_OF_EMPLOYEES;
					else if (obj.type === "boolean") {
						obj.picklist_values = BOOLEAN_OPTIONS;
					}
					sellsy_fields.push(obj);
				});

				custom_fields?.forEach(cField => {
					const obj = {
						name: cField?.code,
						label: cField?.name,
						editable: true,
						type: cField?.type,
						sellsy_field_id: cField?.id,
						sellsy_mandatory: cField?.mandatory,
					};
					if (obj.type === "select" || obj.type === "checkbox" || obj.type === "radio")
						obj.picklist_values = cField?.parameters?.items?.map(pv => ({
							label: pv?.label,
							value: pv?.id,
						}));

					sellsy_fields.push(obj);
				});

				return sellsy_fields;
			}
			case INTEGRATION_TYPE.ZOHO: {
				let sf_account = res?.data.data.map(item => {
					let obj = {
						name: item.api_name,
						label: item.display_label,
						type: item.data_type,
						editable: item.allowed_permissions_to_update.read_write,
						types: item.json_type,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.pick_list_values;
					return obj;
				});
				return sf_account;
			}

			case INTEGRATION_TYPE.BULLHORN: {
				let bf_account = res?.data.data.fields
					?.filter(
						item =>
							Object.keys(item).includes("dataType") &&
							item.dataType !== "Address" &&
							item.dataType !== "SecondaryAddress" &&
							item.dataType !== "OnboardingReceivedSent" &&
							item.dataType !== "BillingAddress" &&
							item.name !== "id"
					)
					?.filter(item =>
						item.dataType === "Timestamp"
							? Object.keys(item).includes("dataSpecialization")
							: true
					)
					?.map(item => {
						let obj = {
							name: item.name,
							label: item.label,
							type:
								Object.keys(item).includes("inputType") &&
								Object.keys(item).includes("options")
									? item.inputType
									: item.dataType,
							editable: item.readOnly,
						};

						if (
							Object.keys(item).includes("inputType") &&
							Object.keys(item).includes("options")
						) {
							obj.picklistValues = item.options;
							obj.multiValue = item.multiValue;
						}

						// if (obj.type === "picklist" || obj.type === "multipicklist")
						// 	obj.picklistValues = item.pick_list_values;

						if (
							obj.type === "Timestamp" &&
							Object.keys(item).includes("dataSpecialization")
						) {
							obj.dateType = item.dataSpecialization;
						}
						return obj;
					});
				return bf_account;
			}
			case INTEGRATION_TYPE.DYNAMICS: {
				let d_lead = res[0]?.data.data
					.filter(
						item =>
							item.AttributeType !== "Virtual" &&
							item.AttributeType !== "Lookup" &&
							item.AttributeType !== "EntityName" &&
							item.AttributeType !== "Customer" &&
							item.AttributeType !== "Uniqueidentifier" &&
							item.AttributeType !== "Owner"
					)
					.map(item => {
						let obj = {
							name: item.LogicalName,
							label: item.DisplayName.LocalizedLabels?.[0]?.Label ?? item.SchemaName,
							type: inputDataTypeDynamics(
								item?.LogicalName === "anniversary" || item?.LogicalName === "birthdate"
									? "date"
									: item.AttributeType.toLowerCase()
							),
							editable: item.IsValidForUpdate,
						};
						if (obj.type === "picklist")
							obj.picklistValues = res[1]?.data?.data
								.find(i => i.LogicalName === item.LogicalName)
								.OptionSet.Options.map(pv => ({
									label: pv?.Label.LocalizedLabels?.[0]?.Label,
									value: pv?.Value,
								}));
						return obj;
					});
				return d_lead;
			}
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return res?.data.data;
	}
};

/**
 * Get URL for custom-object-details based on integration
 */
const getCustomObjectDetailsURL = ({ integration_type, id }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "/v2/sales/lead/custom-object/info";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return `/v2/sales/lead/custom-object/pipedrive/person/${id}`;
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return "/v2/sales/lead/custom-object/info";
			case INTEGRATION_TYPE.HUBSPOT:
				return `/v2/sales/lead/custom-object/hubspot/contact/${id}`;
			case INTEGRATION_TYPE.SELLSY:
				return "/v2/sales/lead/custom-object/sellsy";
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/sales/lead/custom-object/zoho";
			case INTEGRATION_TYPE.BULLHORN:
				return "/v2/sales/lead/custom-object/bullhorn";
			case INTEGRATION_TYPE.DYNAMICS:
				return "/v2/sales/lead/custom-object/dynamics";
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return "/v2/sales/lead/custom-object/info";
	}
};

const customObjectDetailsStrategy = ({ integration_type, res }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return res?.data.data;
			case INTEGRATION_TYPE.PIPEDRIVE:
				return res?.data.data;
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return res?.data.data;
			case INTEGRATION_TYPE.HUBSPOT:
				return res?.data.data;
			case INTEGRATION_TYPE.SELLSY:
				return res?.data?.data;
			case INTEGRATION_TYPE.ZOHO:
				return res?.data.data;
			case INTEGRATION_TYPE.BULLHORN:
				return res?.data.data;
			case INTEGRATION_TYPE.DYNAMICS:
				return res?.data.data;
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return res?.data.data;
	}
};

export {
	customObjStrategy,
	getDescribeLeadURL,
	describeLeadStrategy,
	getDescribeAccountURL,
	describeAccountStrategy,
	getCustomObjectDetailsURL,
	customObjectDetailsStrategy,
};
