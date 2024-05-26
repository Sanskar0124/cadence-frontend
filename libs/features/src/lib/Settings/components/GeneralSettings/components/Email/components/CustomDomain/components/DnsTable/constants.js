import { ENV } from "@cadence-frontend/environments";

export const DNS_TABLE_HEADERS = [
	// {
	// 	label: {
	// 		ENGLISH: "type",
	// 		FRENCH: "type",
	// 		SPANISH: "el tipo",
	// 	},
	// 	value: "type",
	// },
	// {
	// 	label: {
	// 		ENGLISH: "host",
	// 		FRENCH: "",
	// 		SPANISH: "",
	// 	},
	// 	value: "host",
	// },
	// {
	// 	label: {
	// 		ENGLISH: "domain",
	// 		FRENCH: "",
	// 		SPANISH: "",
	// 	},
	// 	value: "domain",
	// },
	// {
	// 	label: {
	// 		ENGLISH: "value",
	// 		FRENCH: "",
	// 		SPANISH: "",
	// 	},
	// 	value: "value",
	// },
	// {
	// 	label: {
	// 		ENGLISH: "status",
	// 		FRENCH: "",
	// 		SPANISH: "",
	// 	},
	// 	value: "status",
	// },
	"type",
	"host",
	"domain",
	"value",
	"status",
	"",
];

export const RINGOVER_TRACKING_DOMAIN = ENV.CUSTOM_DOMAIN;
