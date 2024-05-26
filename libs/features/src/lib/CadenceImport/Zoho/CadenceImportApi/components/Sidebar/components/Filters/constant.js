export const VIEWS = {
	LEAD: "lead",
	CONTACT: "contact",
};

export const DEFAULT_SF_FIELDS_STRUCT = {
	[VIEWS.LEAD]: [],
	[VIEWS.CONTACT]: [],
	// [VIEWS.ACCOUNT]: [],
};

export const All_SUPPORTED_OPERATOR = {
	EQUAL: "=",
	NOT_EQUAL: "!=",
	GREATER_THAN_OR_EUQAL_TO: ">=",
	GREATER_THAN: ">",
	LESS_THAN: "<",
	LESS_THAN_OR_EUQAL_TO: "<=",
	IN: "in",
	NOT_IN: "not in",
	IS_NULL: "is null",
	IS_NOT_NULL: "is not null",
	BETWEEN: "between",
	NOT_BETWEEN: "not between",
	LIKE: "like",
	NOT_LIKE: "not like",
};

export const All_OPERATOR = {
	Equal: "=",
	"Not equal": "!=",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	In: "in",
	"Not in": "not in",
	"Is null": "is null",
	"Is not null": "is not null",
	Between: "between",
	"Not between": "not between",
	Like: "like",
	"Not Like": "not like",
};

export const LIKE_META_DATA = {
	"Starts with": "startsWith",
	"End with": "endsWith",
	Contains: "contains",
};

export const META_DATA = {
	startsWith: "Starts with",
	endsWith: "End with",
	contains: "Contains",
};

export const BOOLEAN_OPTIONS = {
	Selected: true,
	"Not Selected": false,
};

// date, datetime, number, currency
export const DATE_OPERATORS = {
	Equal: "=",
	"Not equal": "!=",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	// in: "in",
	// notIn: "not in",
	"Is null": "is null",
	"Is not null": "is not null",
	Between: "between",
	"Not between": "not between",
};

export const DATETIME_OPERATOR = {
	Equal: "=",
	"Not equal": "!=",
	"Greater than or equal to": ">=",
	"Greater than": ">",
	"Less than": "<",
	"Less than or equal to": "<=",
	"Is null": "is null",
	"Is not null": "is not null",
	Between: "between",
	"Not between": "not between",
};

// text, picklist
export const TEXT_OPERATORS = {
	Equal: "=",
	"Not Equal": "!=",
	Like: "like",
	"Not Like": "not like",
	In: "in",
	"Not in": "not in",
	"Is null": "is null",
	"Is not null": "is not null",
};

// lookup ownerlookup
export const LOOKUP_OPERATORS = {
	Equal: "=",
	"Not Equal": "!=",
	In: "in",
	"Not in": "not in",
	"Is null": "is null",
	"Is not null": "is not null",
};

export const BOOLEAN_OPERATORS = {
	Equal: "=",
};

export const SUPPORTED_DATATYPES = [
	"boolean",
	"lookup",
	"text",
	"picklist",
	"date",
	"datetime",
	"number",
	"currency",
	"ownerlookup",
	"integer",
	"textarea",
	"email",
	"profileimage",
	"website",
	"phone",
];

export const BASICS_OPEARATOS = [">", "<", ">=", "<=", "=", "!="];
export const BETWEEN_OPERATORS = ["between", "not between"];

export const ALL_DATA_TYPE = {
	BOOLEAN: "boolean",
	EMAIL: "email",
	TEXT: "text",
	PICKLIST: "picklist",
	DATE: "date",
	DATETIME: "datetime",
	NUMBER: "number",
	CURRENCY: "currency",
	OWNER_LOOKUP: "ownerlookup",
	LOOKUP: "lookup",
	INTEGER: "integer",
	TEXTAREA: "textarea",
	PROFILE_IMAGE: "profileimage",
	WEBSITE: "website",
	PHONE: "phone",
};
