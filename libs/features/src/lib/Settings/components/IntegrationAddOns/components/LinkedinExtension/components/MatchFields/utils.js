//unparse Ringover fields to respective states

import { deepEqual } from "@cadence-frontend/utils";
import { RINGOVER_FIELDS, VIEWS } from "./constants";

//Unparse
export const UnParseRingoverFields = fieldsInFrontend => {
	//convert array to diff objects
	const integration_endpoint_values = {};
	fieldsInFrontend.forEach(field => {
		if (!field.isArray) {
			if (field.value.name !== "") {
				//an exception for integration status,company size
				if (field.type === "picklist") {
					integration_endpoint_values[field.backendField] = {};
					integration_endpoint_values[field.backendField].name = field.value.name;
					integration_endpoint_values[field.backendField].picklist_values =
						field.value.picklist_values;
					if (field.uid === "__integration_status") {
						if (field.value.converted) {
							integration_endpoint_values[field.backendField].converted =
								field.value.converted;
						}
						if (field.value.disqualified) {
							integration_endpoint_values[field.backendField].disqualified =
								field.value.disqualified;
						}
					}
				} else {
					integration_endpoint_values[field.backendField] = field.value.name;
				}
			}
		} else {
			if (!integration_endpoint_values[field.backendField]) {
				integration_endpoint_values[field.backendField] = [];
			}
			if (field.value.name !== "")
				integration_endpoint_values[field.backendField].push(field.value.name);
		}
	});
	return integration_endpoint_values;
};

export const ParseRingoverFields = fieldsFromServer => {
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
					if (index < fieldsFromServer["lead_map"][field.backendField].length) {
						field.value.name =
							fieldsFromServer["lead_map"][field.backendField][index] ?? "";
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
					if (index < fieldsFromServer["account_map"][field.backendField].length) {
						field.value.name =
							fieldsFromServer["account_map"][field.backendField][index] ?? "";
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
					if (index < fieldsFromServer["contact_map"][field.backendField].length) {
						field.value.name =
							fieldsFromServer["contact_map"][field.backendField][index] ?? "";
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
