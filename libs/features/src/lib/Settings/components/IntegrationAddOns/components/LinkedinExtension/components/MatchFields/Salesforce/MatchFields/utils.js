//unparse Ringover fields to respective states

import { deepEqual } from "@cadence-frontend/utils";
import { RINGOVER_FIELDS, VIEWS } from "./constants";

export const UnParseRingoverFields = fieldsInFrontend => {
	console.log("UnParseRingover - fieldsInFrontend", fieldsInFrontend);

	//convert array to diff objects
	const sobject_values = {};
	fieldsInFrontend.forEach(field => {
		if (!field.isArray) {
			if (field.value?.name !== "") {
				//an exception for integration status,company size
				if (field.type === "picklist") {
					sobject_values[field.backendField] = {};
					sobject_values[field.backendField].name = field.value?.name;
					sobject_values[field.backendField].picklist_values =
						field.value?.picklist_values;
					if (field.uid === "__integration_status") {
						if (field.value.converted) {
							sobject_values[field.backendField].converted = field?.value.converted;
						}
						if (field.value.disqualified) {
							sobject_values[field.backendField].disqualified = field?.value.disqualified;
						}
					}
				} else {
					sobject_values[field.backendField] = field.value?.name;
				}
			} else if (field?.uid === "__disqualification_reasons") {
				sobject_values[field.backendField] = field.disqualification_reason;
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
							picklist_values: field.value.picklist_values ?? null,
						},
					});
				} else {
					sobject_values[field.backendField].push(field.value?.name);
				}
			}
		}
	});
	if (!sobject_values.hasOwnProperty("variables")) {
		sobject_values["variables"] = [];
	}
	return sobject_values;
};

export const ParseRingoverFields = fieldsFromServer => {
	console.log("ParseRingoverFields - fieldsFromServer", fieldsFromServer);

	return {
		[VIEWS.LEAD]: RINGOVER_FIELDS[VIEWS.LEAD].map(field => {
			field = JSON.parse(JSON.stringify(field));
			if (fieldsFromServer["lead_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (field.type === "picklist") {
						field.value.name = fieldsFromServer["lead_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["lead_map"][field.backendField]?.picklist_values ?? [];
					} else {
						field.value.name = fieldsFromServer["lead_map"]?.[field.backendField] ?? "";
					}
					if (field.uid === "__integration_status") {
						field.value.converted =
							fieldsFromServer["lead_map"]?.[field.backendField]?.converted ?? null;
						field.value.disqualified =
							fieldsFromServer["lead_map"]?.[field.backendField]?.disqualified ?? null;
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
								field.value.picklist_values = fld.target_value.picklist_values ?? null;
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
					if (field.type === "picklist") {
						field.value.name = fieldsFromServer["account_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["account_map"][field.backendField]?.picklist_values ?? [];
					} else {
						field.value.name =
							fieldsFromServer["account_map"]?.[field.backendField] ?? "";
					}
					if (field.uid === "__integration_status") {
						field.value.converted =
							fieldsFromServer["account_map"]?.[field.backendField]?.converted ?? null;
						field.value.disqualified =
							fieldsFromServer["account_map"]?.[field.backendField]?.disqualified ?? null;
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
					if (field.value.type === "picklist") {
						field.value.name = field.value.name =
							fieldsFromServer["contact_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["contact_map"][field.backendField]?.picklist_values ?? [];
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
								field.value.picklist_values = fld.target_value.picklist_values ?? null;
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
	};
};

export const validateFields = ringoverFields => {
	//validate fields and return all error messages
	const warnings = {
		[VIEWS.LEAD]: [],
		[VIEWS.CONTACT]: [],
		[VIEWS.ACCOUNT]: [],
	};
	ringoverFields[VIEWS.LEAD].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.LEAD].push(item.label);
		}
		if (item.backendField === "last_name" && item.value.name === "") {
			warnings[VIEWS.LEAD].push(item.label);
		}
	});
	ringoverFields[VIEWS.CONTACT].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.CONTACT].push(item.label);
		}
		if (item.backendField === "last_name" && item.value.name === "") {
			warnings[VIEWS.CONTACT].push(item.label);
		}
	});
	ringoverFields[VIEWS.ACCOUNT].forEach(item => {
		if (item.backendField === "name" && item.value.name === "") {
			warnings[VIEWS.ACCOUNT].push(item.label);
		}
	});
	return warnings;
};

//returns TRUE if there are changes
export const checkIfChanges = (localRingoverFields, originalFieldsFromServer) => {
	if (!originalFieldsFromServer) {
		return false;
	}
	const fieldsFromServer = {
		lead_map: originalFieldsFromServer?.lead_map,
		contact_map: originalFieldsFromServer?.contact_map,
		account_map: originalFieldsFromServer?.account_map,
	};

	const localFields = {
		lead_map: UnParseRingoverFields(localRingoverFields[VIEWS.LEAD]),
		contact_map: UnParseRingoverFields(localRingoverFields[VIEWS.CONTACT]),
		account_map: UnParseRingoverFields(localRingoverFields[VIEWS.ACCOUNT]),
	};

	if (!deepEqual(localFields, fieldsFromServer)) {
		return true;
	}

	return false;
};
