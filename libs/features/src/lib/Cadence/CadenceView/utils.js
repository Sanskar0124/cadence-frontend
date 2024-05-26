import moment from "moment-timezone";
import { TABS } from "./constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export const getTabOptions = (cadence, totalLeads, user, workflows) => {
	return [
		{
			label: `${COMMON_TRANSLATION.STEPS[user?.language?.toUpperCase()]} (${
				cadence?.sequence?.length ?? 0
			})`,
			value: TABS.STEPS,
		},
		{
			label: `${COMMON_TRANSLATION.PEOPLE[user?.language?.toUpperCase()]} (${
				totalLeads ?? 0
			})`,
			value: TABS.LIST,
			id: "list-tab-btn",
		},
		{
			label: `${COMMON_TRANSLATION.WORKFLOW[user?.language?.toUpperCase()]} (${
				workflows?.length ?? 0
			})`,
			value: TABS.WORKFLOW,
		},
	];
};

export const getTotalDurationOfCadence = steps => {
	if (!steps) return "";
	const totalDurationInMins = steps.reduce((total, step) => total + step.wait_time, 0);
	return moment.duration(totalDurationInMins, "minutes").humanize();
};

export const crmRedirectionURL = (instanceUrl, integrationType) => {
	switch (integrationType) {
		case INTEGRATION_TYPE.BULLHORN: {
			let url = "";
			const indexOfCom = instanceUrl?.indexOf(".com") + 4;
			const instanceLink = instanceUrl?.substring(0, indexOfCom)?.replace("rest", "cls");

			url = `${instanceLink}/BullhornSTAFFING/OpenWindow.cfm`;

			return url;
		}

		case INTEGRATION_TYPE.HUBSPOT:
			return "https://app.hubspot.com/";

		case INTEGRATION_TYPE.SELLSY:
			return "https://www.sellsy.com/home";

		case INTEGRATION_TYPE.ZOHO:
			return instanceUrl?.replace("www.zohoapis", "crm.zoho") ?? instanceUrl;

		default:
			return instanceUrl;
	}
};
