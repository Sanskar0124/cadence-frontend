//unparse Ringover fields to respective states

import { deepEqual } from "@cadence-frontend/utils";
import { RINGOVER_FIELDS, VIEWS } from "./constants";

const checkObject = value =>
	typeof value === "object" && !Array.isArray(value) && value !== null;
//Unparse
export const UnParseRingoverFields = fieldsInFrontend => {
	//convert array to diff objects
	const sobject_values = {};
	fieldsInFrontend.forEach(field => {
		if (!field.isArray) {
			if (
				field.value?.name !== "" &&
				field.uid !== "__disqualification_reasons" &&
				field.uid !== "__integration_status"
			) {
				//an exception for integration status,company size
				if (field.value.type === "picklist") {
					sobject_values[field.backendField] = {};
					sobject_values[field.backendField].name = field.value?.name;
					sobject_values[field.backendField].picklist_values =
						field.value?.picklist_values;
				} else {
					sobject_values[field.backendField] = field.value?.name;
				}
			} else if (
				field.value?.name !== "" &&
				(field.uid === "__disqualification_reasons" ||
					field.uid === "__integration_status")
			) {
				sobject_values[field.backendField] = {};
				sobject_values[field.backendField].name = field.value?.name;
				sobject_values[field.backendField].picklist_values = field.value?.picklist_values;
				if (field.uid === "__integration_status") {
					if (field.value.converted) {
						sobject_values[field.backendField].converted = field?.value.converted;
					}
					if (field.value.disqualified) {
						sobject_values[field.backendField].disqualified = field?.value.disqualified;
					}

					if (field.value.custom_actions) {
						sobject_values[field.backendField].custom_actions =
							field?.value.custom_actions?.map(action => ({
								label: action.label,
								value: action.value,
								...(action.reasons?.length && { reasons: action.reasons }),
							})) ?? [];
					}
				}
			}
		} else {
			if (!sobject_values[field.backendField]) {
				sobject_values[field.backendField] = [];
			}
			if (field.value.name !== "") {
				if (field.backendField === "variables") {
					sobject_values[field.backendField].push({
						variable_field_name: field.label,
						target_value: {
							label: field.value.label,
							value: field.value.name,
						},
					});
				} else {
					sobject_values[field.backendField].push(field.value?.name);
				}
			}
		}
	});

	return sobject_values;
};

export const ParseRingoverFields = fieldsFromServer => {
	return {
		[VIEWS.LEAD]: RINGOVER_FIELDS[VIEWS.LEAD].map(field => {
			field = JSON.parse(JSON.stringify(field));
			if (fieldsFromServer["lead_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (checkObject(fieldsFromServer["lead_map"]?.[field.backendField])) {
						field.value.name = fieldsFromServer["lead_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["lead_map"][field.backendField]?.picklist_values ?? [];
						//	field.value.type = "picklist";
						if (field.uid === "__integration_status") {
							field.value.converted =
								fieldsFromServer["lead_map"]?.[field.backendField]?.converted ?? null;
							field.value.disqualified =
								fieldsFromServer["lead_map"]?.[field.backendField]?.disqualified ?? null;
							// for new feature
							field.value.custom_actions =
								fieldsFromServer["lead_map"]?.[field.backendField]?.custom_actions ?? [];
						}
					} else {
						field.value.name = fieldsFromServer["lead_map"]?.[field.backendField] ?? "";
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["lead_map"][field.backendField];
					if (field.backendField === "variables") {
						field.value.name = "";
						for (let fld of fields) {
							if (field.label === fld.variable_field_name) {
								field.value.name = fld.target_value.value ?? "";
								field.value.label = fld.target_value.label ?? "";
								break;
							}
						}
					} else if (index < fields.length) {
						field.value.name = fields[index] ?? "";
					}
				}
			}
			return field;
		}),
		[VIEWS.ACCOUNT]: RINGOVER_FIELDS[VIEWS.ACCOUNT].map(field => {
			field = JSON.parse(JSON.stringify(field));
			if (fieldsFromServer["account_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (checkObject(fieldsFromServer["account_map"]?.[field.backendField])) {
						field.value.name = fieldsFromServer["account_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["account_map"][field.backendField]?.picklist_values ?? [];
						//	field.value.type = "picklist";
						if (field.uid === "__integration_status") {
							field.value.converted =
								fieldsFromServer["account_map"]?.[field.backendField]?.converted ?? null;
							field.value.disqualified =
								fieldsFromServer["account_map"]?.[field.backendField]?.disqualified ??
								null;
							// for new feature
							field.value.custom_actions =
								fieldsFromServer["account_map"]?.[field.backendField]?.custom_actions ??
								[];
						}
					} else {
						field.value.name =
							fieldsFromServer["account_map"]?.[field.backendField] ?? "";
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["account_map"][field.backendField];
					if (field.backendField === "variables") {
						field.value.name = "";
						for (let fld of fields) {
							if (field.label === fld.variable_field_name) {
								field.value.name = fld.target_value.value ?? "";
								field.value.label = fld.target_value.label ?? "";
								break;
							}
						}
					} else if (index < fields.length) {
						field.value.name = fields[index] ?? "";
					}
				}
			}
			return field;
		}),
		[VIEWS.CONTACT]: RINGOVER_FIELDS[VIEWS.CONTACT].map(field => {
			field = JSON.parse(JSON.stringify(field));
			if (fieldsFromServer["contact_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (checkObject(fieldsFromServer["contact_map"]?.[field.backendField])) {
						field.value.name = field.value.name =
							fieldsFromServer["contact_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["contact_map"][field.backendField]?.picklist_values ?? [];
						// for new feature
						//		field.value.type = "picklist";
						if (field.uid === "__integration_status") {
							field.value.converted =
								fieldsFromServer["contact_map"]?.[field.backendField]?.converted ?? null;
							field.value.disqualified =
								fieldsFromServer["contact_map"]?.[field.backendField]?.disqualified ??
								null;
							field.value.custom_actions =
								fieldsFromServer["contact_map"]?.[field.backendField]?.custom_actions ??
								[];
						}
					} else {
						field.value.name =
							fieldsFromServer["contact_map"]?.[field.backendField] ?? "";
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["contact_map"][field.backendField];
					if (field.backendField === "variables") {
						field.value.name = "";
						for (let fld of fields) {
							if (field.label === fld.variable_field_name) {
								field.value.name = fld.target_value.value ?? "";
								field.value.label = fld.target_value.label ?? "";
								break;
							}
						}
					} else if (index < fields.length) {
						field.value.name = fields[index] ?? "";
					}
				}
			}
			return field;
		}),
		[VIEWS.CANDIDATE]: RINGOVER_FIELDS[VIEWS.CANDIDATE].map(field => {
			field = JSON.parse(JSON.stringify(field));
			if (fieldsFromServer["candidate_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (checkObject(fieldsFromServer["candidate_map"]?.[field.backendField])) {
						field.value.name =
							fieldsFromServer["candidate_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["candidate_map"][field.backendField]?.picklist_values ??
							[];
						// for new feature
						//	field.value.type = "picklist";
						if (field.uid === "__integration_status") {
							field.value.converted =
								fieldsFromServer["candidate_map"]?.[field.backendField]?.converted ??
								null;
							field.value.disqualified =
								fieldsFromServer["candidate_map"]?.[field.backendField]?.disqualified ??
								null;
							field.value.custom_actions =
								fieldsFromServer["candidate_map"]?.[field.backendField]?.custom_actions ??
								[];
						}
					} else {
						field.value.name =
							fieldsFromServer["candidate_map"]?.[field.backendField] ?? "";
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["candidate_map"][field.backendField];
					if (field.backendField === "variables") {
						field.value.name = "";
						for (let fld of fields) {
							if (field.label === fld.variable_field_name) {
								field.value.name = fld.target_value.value ?? "";
								field.value.label = fld.target_value.label ?? "";
								break;
							}
						}
					} else if (index < fields.length) {
						field.value.name = fields[index] ?? "";
					}
				}
			}
			return field;
		}),
		default_integration_status: fieldsFromServer.default_integration_status,
	};
};

export const validateFields = ringoverFields => {
	//validate fields and return all error messages
	const warnings = {
		[VIEWS.LEAD]: [],
		[VIEWS.CONTACT]: [],
		[VIEWS.ACCOUNT]: [],
		[VIEWS.CANDIDATE]: [],
	};
	ringoverFields[VIEWS.LEAD].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.LEAD].push(item.label);
		}
	});
	ringoverFields[VIEWS.CONTACT].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.CONTACT].push(item.label);
		}
	});
	ringoverFields[VIEWS.ACCOUNT].forEach(item => {
		if (item.backendField === "name" && item.value.name === "") {
			warnings[VIEWS.ACCOUNT].push(item.label);
		}
	});
	ringoverFields[VIEWS.CANDIDATE].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.CANDIDATE].push(item.label);
		}
	});
	return warnings;
};

//returns TRUE if there are changes
export const checkIfChanges = (localRingoverFields, originalFieldsFromServer) => {
	if (
		!originalFieldsFromServer?.lead_map ||
		!originalFieldsFromServer?.contact_map ||
		!originalFieldsFromServer?.account_map ||
		!originalFieldsFromServer?.candidate_map
	)
		return false;
	const fieldsFromServer = {
		lead_map: originalFieldsFromServer?.lead_map,
		contact_map: originalFieldsFromServer?.contact_map,
		account_map: originalFieldsFromServer?.account_map,
		candidate_map: originalFieldsFromServer?.candidate_map,
		default_integration_status: originalFieldsFromServer?.default_integration_status,
	};

	const localFields = {
		lead_map: UnParseRingoverFields(localRingoverFields[VIEWS.LEAD]),
		contact_map: UnParseRingoverFields(localRingoverFields[VIEWS.CONTACT]),
		account_map: UnParseRingoverFields(localRingoverFields[VIEWS.ACCOUNT]),
		candidate_map: UnParseRingoverFields(localRingoverFields[VIEWS.CANDIDATE]),
		default_integration_status: localRingoverFields.default_integration_status,
	};

	if (!deepEqual(localFields, fieldsFromServer)) return true;

	return false;
};
