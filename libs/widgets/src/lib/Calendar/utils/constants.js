import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";

export const getMeetOptions = mail_integration => {
	const options = [{ label: "Ringover Meet", value: "ringover" }];

	switch (mail_integration) {
		case MAIL_INTEGRATION_TYPES.GOOGLE:
			options.push({ label: "Google Meet", value: "google" });
			break;
		case MAIL_INTEGRATION_TYPES.OUTLOOK:
			options.push(
				{ label: "Teams For Business", value: "teamsForBusiness" },
				{ label: "Skype For Business", value: "skypeForBusiness" },
				{ label: "Skype For Consumer", value: "skypeForConsumer" }
			);
	}
	return options;
};

export const CUSTOM_TASK_NODE_ID_MAP = {
	1: "Call",
	2: "Message",
	3: "Mail",
	4: "Linkedin connection",
	5: "Whatsapp",
	6: "Other",
};
