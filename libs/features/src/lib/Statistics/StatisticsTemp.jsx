import Statistics from "./Statistics";
import Statisticsold from "../Statisticsold/Statisticsold";

import React from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

function StatisticsTemp() {
	const user = useRecoilValue(userInfo);

	switch (user?.integration_type) {
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
		case INTEGRATION_TYPE.SHEETS:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SALESFORCE:
			return <Statistics />;
		// return <Statisticsold />;
	}
}

export default StatisticsTemp;
