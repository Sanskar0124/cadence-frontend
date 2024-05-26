export const inputDataTypeDynamics = type => {
	switch (type) {
		case "picklist":
			return "picklist";
		case "boolean":
			return "boolean";
		case "memo":
			return "textarea";
		case "integer":
		case "money":
		case "bigint":
			return "integer";
		case "datetime":
			return "datetime";
		case "date":
			return "date";
		case "decimal":
		case "double":
			return "number";
		default:
			return "text";
	}
};
