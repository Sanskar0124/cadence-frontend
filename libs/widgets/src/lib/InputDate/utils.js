import moment from "moment-timezone";

import {
	DATE_TYPE_OPTIONS,
	MONTH_TYPE_OPTIONS,
	YEAR_TYPE_OPTIONS,
} from "@cadence-frontend/constants";

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
