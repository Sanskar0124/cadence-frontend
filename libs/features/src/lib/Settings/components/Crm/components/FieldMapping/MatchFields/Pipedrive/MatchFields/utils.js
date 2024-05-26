//unparse Ringover fields to respective states

import { deepEqual } from "@cadence-frontend/utils";
import { RINGOVER_FIELDS, VIEWS } from "./constants";

//Unparse
export const UnParseRingoverFields = fieldsInFrontend => {
	//convert array to diff objects
	const sobject_values = {};
	fieldsInFrontend.forEach(field => {
		if (!field.isArray) {
			if (field.value.name !== "") {
				//an exception for integration status,company size
				if (field.type.includes("enum")) {
					sobject_values[field.backendField] = {};
					sobject_values[field.backendField].name = field.value.name;
					sobject_values[field.backendField].picklist_values =
						field.value.picklist_values;

					// if (field.uid === "__integration_status") {
					// 	sobject_values[field.backendField].converted = field.value.converted;
					// 	sobject_values[field.backendField].disqualified = field.value.disqualified;
					// }
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
					sobject_values[field.backendField].push(field.value.name);
				}
			}
		}
	});
	return sobject_values;
};

export const ParseRingoverFields = fieldsFromServer => {
	return {
		[VIEWS.ORGANIZATION]: RINGOVER_FIELDS[VIEWS.ORGANIZATION].map(field => {
			if (fieldsFromServer["organization_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (field.type.includes("enum")) {
						field.value.name =
							fieldsFromServer["organization_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["organization_map"][field.backendField]?.picklist_values ??
							[];
					} else {
						field.value.name =
							fieldsFromServer["organization_map"]?.[field.backendField] ?? "";
					}
					// if (field.uid === "__integration_status") {
					// 	field.value.converted =
					// 		fieldsFromServer["organization_map"]?.[field.backendField]?.converted ??
					// 		null;
					// 	field.value.disqualified =
					// 		fieldsFromServer["organization_map"]?.[field.backendField]?.disqualified ??
					// 		null;
					// }
				} else {
					const index = field.index;
					const fields = fieldsFromServer["organization_map"][field.backendField];
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
		[VIEWS.PERSON]: RINGOVER_FIELDS[VIEWS.PERSON].map(field => {
			if (fieldsFromServer["person_map"]?.[field.backendField]) {
				if (!field.isArray) {
					if (field.type.includes("enum")) {
						field.value.name = fieldsFromServer["person_map"]?.[field.backendField].name;
						field.value.picklist_values =
							fieldsFromServer["person_map"][field.backendField]?.picklist_values ?? [];
					} else {
						field.value.name = fieldsFromServer["person_map"]?.[field.backendField] ?? "";
					}
				} else {
					const index = field.index;
					const fields = fieldsFromServer["person_map"][field.backendField];
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
		[VIEWS.PERSON]: [],
		[VIEWS.ORGANIZATION]: [],
	};
	ringoverFields[VIEWS.PERSON].forEach(item => {
		if (item.backendField === "first_name" && item.value.name === "") {
			warnings[VIEWS.PERSON].push(item.label);
		}
		if (item.backendField === "last_name" && item.value.name === "") {
			warnings[VIEWS.PERSON].push(item.label);
		}
	});
	ringoverFields[VIEWS.ORGANIZATION].forEach(item => {
		if (item.backendField === "name" && item.value.name === "") {
			warnings[VIEWS.ORGANIZATION].push(item.label);
		}
	});
	return warnings;
};

//returns TRUE if there are changes
export const checkIfChanges = (localRingoverFields, originalFieldsFromServer) => {
	if (
		!originalFieldsFromServer?.person_map ||
		!originalFieldsFromServer?.organization_map
	)
		return false;
	const fieldsFromServer = {
		person_map: originalFieldsFromServer?.person_map,
		organization_map: originalFieldsFromServer?.organization_map,
	};

	const localFields = {
		person_map: UnParseRingoverFields(localRingoverFields[VIEWS.PERSON]),
		organization_map: UnParseRingoverFields(localRingoverFields[VIEWS.ORGANIZATION]),
	};

	if (!deepEqual(localFields, fieldsFromServer)) {
		return true;
	}

	return false;
};
