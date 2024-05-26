import {
	MERIDIAN_TYPE_OPTIONS,
	MONTH_TYPE_OPTIONS,
	YEAR_TYPE_OPTIONS,
	DATE_TYPE_OPTIONS,
} from "@crm-frontend/constants";

export const DateData = [
	{
		name: "DD",
		options: DATE_TYPE_OPTIONS,
	},
	{
		name: "MM",
		options: MONTH_TYPE_OPTIONS,
	},
	{
		name: "YYYY",
		options: YEAR_TYPE_OPTIONS,
	},
];

export const MeridianData = {
	name: "a",
	options: MERIDIAN_TYPE_OPTIONS,
};
