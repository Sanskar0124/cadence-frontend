import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const WEBHOOK_TYPES = {
	CONVERT: "convert",
	DISQUALIFY: "disqualify",
	CUSTOM: "custom",
};

export const WEBHOOK_TYPE = [
	{
		label: "convert",
		value: "convert",
	},
	{
		label: "disqualify",
		value: "disqualify",
	},
];

export const HTTP_METHOD = [
	{
		label: "POST",
		value: "POST",
	},
	{
		label: "GET",
		value: "GET",
	},
	{
		label: "PATCH",
		value: "PATCH",
	},
	{
		label: "PUT",
		value: "PUT",
	},
];

export const getWebhookImage = (type, user) => {
	const integration = {
		[INTEGRATION_TYPE.SALESFORCE]: "sf",
		[INTEGRATION_TYPE.HUBSPOT]: "hs",
		[INTEGRATION_TYPE.BULLHORN]: "bh",
	};

	return `https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/webhooks/${
		integration[user.integration_type]
	}-${type === "convert" ? "convert" : "dq"}-webhook.png`;
};
