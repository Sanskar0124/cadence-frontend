export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
	CANDIDATE: "candidate",
};

export const DEFAULT_SF_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
	[VIEWS.CANDIDATE]: [],
};

export const All_SUPPORTED_OPERATOR = {
	EQUAL: "=",
	NOT_EQUAL: "<>",
	GREATER_THAN_OR_EUQAL_TO: ">=",
	GREATER_THAN: ">",
	LESS_THAN: "<",
	LESS_THAN_OR_EUQAL_TO: "<=",
	IN: "in",
	NOT_IN: "not in",
	IS_NULL: "is null",
	IS_NOT_NULL: "is not null",
	IS_EMPTY: "is empty",
	IS_NOT_EMPTY: "is not empty",
	// BETWEEN: "between",
	// NOT_BETWEEN: "not between",
	// LIKE: "like",
	// NOT_LIKE: "not like",
};

// DATE, DATETIME
export const DATE_OPERATORS = {
	Equal: "=",
	"Not equal": "<>",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	// in: "in",
	// notIn: "not in",
	"Is null": "IS NULL",
	"Is not null": "is not null",
	"Is empty": "is empty",
	"Is not empty": "is not empty",
	// Between: "between",
	// "Not between": "not between",
};

export const DATETIME_OPERATOR = {
	Equal: "=",
	"Not equal": "<>",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	"Is null": "is null",
	"Is not null": "is not null",
	"Is empty": "is empty",
	"Is not empty": "is not empty",
	// Between: "between",
	// "Not between": "not between",
};

export const ALL_DATATYPE = {
	STRING: "String",
	BOOLEAN: "Boolean",
	DATE: "DATE",
	DATETIME: "DATETIME",
	INTEGER: "Integer",
	BIG_DECIMAL: "BigDecimal",
	DOUBLE: "Double",
	TIMESTAMP: "Timestamp",
	SYSTEM: "SYSTEM",
	SELECT: "SELECT",
};

// String, Integer, BigDescimal, Double(Float)
export const TEXT_OPERATORS = {
	Equal: "=",
	"Not Equal": "<>",
	In: "in",
	"Not in": "not in",
	"Is null": "is null",
	"Is not null": "is not null",
	"Is empty": "is empty",
	"Is not empty": "is not empty",
};

export const BASICS_OPEARATOS = [">", "<", ">=", "<=", "=", "<>"];
export const MULTIPLE_VALUE_SUPPORT = ["in", "not in"];

export const SUPPORTED_DATATYPES = [
	"String",
	"Boolean",
	"DATETIME",
	"DATE",
	"Timestamp",
	"Double",
	"BigDesciaml",
	"Integer",
	"SELECT",
	"SYSTEM",
];

export const BOOLEAN_OPERATORS = {
	Equal: "=",
};

export const All_OPERATOR = {
	Equal: "=",
	"Not equal": "<>",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	In: "in",
	"Not in": "not in",
	"Is null": "is null",
	"Is not null": "is not null",
	"Is empty": "is empty",
	"Is not empty": "is not empty",
};

export const BOOLEAN_VALUES = {
	True: "True",
	False: "False",
};
