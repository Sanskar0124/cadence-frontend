import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import moment from "moment-timezone";

export const ACTIONS = {
	CALL: "call",
	MESSAGE: "message",
	MAIL: "mail",
	LINKEDIN_CONNECTION: "linkedin_connection",
	WHATSAPP: "whatsapp",
	OTHER: "other",
};

export const defaultPauseStateFields = {
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
export const defaultTime = `${moment(new Date()).add(1, "hour").format("HH")}:00`;

export const getUserDropdownByIntegration = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.PIPEDRIVE:
			return true;
		default:
			return false;
	}
};

export const formatDateTime = dateString => {
	console.log(dateString, "input");
	const dateObj = new Date(dateString);
	const year = dateObj.getFullYear();
	const month = String(dateObj.getMonth() + 1).padStart(2, "0");
	const day = String(dateObj.getDate()).padStart(2, "0");
	const hours = String(dateObj.getHours()).padStart(2, "0");
	const minutes = String(dateObj.getMinutes()).padStart(2, "0");

	const formattedDate = {
		date: { DD: day, MM: month, YYYY: year },
		time: `${hours}:${minutes}`,
	};
	console.log(formattedDate, "output");
	return formattedDate;
};

export const REMINDER_TIME_OPTIONS = [
	{
		label: "10 mins",
		value: 10,
	},
	{
		label: "15 mins",
		value: 15,
	},
	{
		label: "20 mins",
		value: 20,
	},
	{
		label: "30 mins",
		value: 30,
	},
	{
		label: "1 hour",
		value: 60,
	},
];
