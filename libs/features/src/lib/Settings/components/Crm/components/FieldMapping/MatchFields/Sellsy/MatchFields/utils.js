//unparse Ringover fields to respective states

import { deepEqual } from "@cadence-frontend/utils";
import { RINGOVER_FIELDS, VIEWS } from "./constants";

//Unparse
export const UnParseRingoverFields = fieldsInFrontend => {
	//convert array to diff objects
	const sobject_values = {};
	console.log(fieldsInFrontend, "FIELDSFRONt");
	fieldsInFrontend.forEach(field => {
		if (!field.isArray) {
			if (field.value.name !== "") {
				//an exception for integration status,company size
				if (
					field.type.includes("select") ||
					field.type.includes("checkbox") ||
					field.type.includes("radio")
				) {
					sobject_values[field.backendField] = {};
					sobject_values[field.backendField].value = field.value.name;
					sobject_values[field.backendField].picklist_values =
						field.value.picklist_values;
				} else {
					sobject_values[field.backendField] = field.value.name;
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
		[VIEWS.COMPANY]: RINGOVER_FIELDS[VIEWS.COMPANY].map(field => {
			if (fieldsFromServer["company_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (
						field.type.includes("select") ||
						field.type.includes("checkbox") ||
						field.type.includes("radio")
					) {
						field.value.name =
							fieldsFromServer["company_map"]?.[field.backendField].value ?? "";
						field.value.picklist_values =
							fieldsFromServer["company_map"][field.backendField]?.picklist_values ?? [];
					} else {
						// if (
						// 	typeof fieldsFromServer["company_map"]?.[field.backendField] === "object" &&
						// 	fieldsFromServer["company_map"]?.[field.backendField].tag
						// ) {
						field.value.name =
							fieldsFromServer["company_map"]?.[field.backendField] ?? "";
						// } else {
						// field.value.name =
						// 	fieldsFromServer["company_map"]?.[field.backendField] ?? "";
						// }
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["company_map"][field.backendField];
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
			if (fieldsFromServer["contact_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (
						field.type.includes("select") ||
						field.type.includes("checkbox") ||
						field.type.includes("radio")
					) {
						field.value.name = fieldsFromServer["contact_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["contact_map"][field.backendField]?.picklist_values ?? [];
						field.value.tag = fieldsFromServer["contact_map"]?.[field.backendField].tag;
					} else {
						field.value.name =
							fieldsFromServer["contact_map"]?.[field.backendField]?.value ??
							fieldsFromServer["contact_map"]?.[field.backendField];
						field.value.tag =
							fieldsFromServer["contact_map"]?.[field.backendField].tag ?? "";
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
	};
};

export const validateFields = ringoverFields => {
	//validate fields and return all error messages
	const warnings = {
		[VIEWS.CONTACT]: [],
		[VIEWS.COMPANY]: [],
	};
	ringoverFields[VIEWS.CONTACT].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.CONTACT].push(item.label);
		}
	});
	ringoverFields[VIEWS.COMPANY].forEach(item => {
		if (item.backendField === "name" && item.value.name === "") {
			warnings[VIEWS.COMPANY].push(item.label);
		}
	});
	return warnings;
};

//returns TRUE if there are changes
export const checkIfChanges = (localRingoverFields, originalFieldsFromServer) => {
	console.log(originalFieldsFromServer, "Orggggg");
	if (!originalFieldsFromServer?.contact_map || !originalFieldsFromServer?.company_map)
		return false;
	const fieldsFromServer = {
		contact_map: originalFieldsFromServer?.contact_map,
		company_map: originalFieldsFromServer?.company_map,
	};

	const localFields = {
		contact_map: UnParseRingoverFields(localRingoverFields[VIEWS.CONTACT]),
		company_map: UnParseRingoverFields(localRingoverFields[VIEWS.COMPANY]),
	};
	console.log(fieldsFromServer, localFields, "soppp");
	if (!deepEqual(localFields, fieldsFromServer)) {
		return true;
	}

	return false;
};
