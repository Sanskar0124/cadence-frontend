import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";

import SalesforceMatchFields from "./Salesforce/MatchFields/MatchFields";
import PipedriveMatchFields from "./Pipedrive/MatchFields/MatchFields";
import HubspotMatchFields from "./Hubspot/MatchFields/MatchFields";
import ZohoMatchFields from "./Zoho/MatchFields/MatchFields";
import SellsyMatchFields from "./Sellsy/MatchFields/MatchFields";
import BullhornMatchFields from "./Bullhorn/MatchFields/MatchFields";
import DynamicsMatchFields from "./Dynamics/MatchFields/MatchFields";
import { useNavigate } from "react-router-dom";

const MatchFields = props => {
	let user = useRecoilValue(userInfo);
	const navigate = useNavigate();
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return <SalesforceMatchFields {...props} />;
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <PipedriveMatchFields {...props} />;
		case INTEGRATION_TYPE.HUBSPOT:
			return <HubspotMatchFields {...props} />;
		case INTEGRATION_TYPE.ZOHO:
			return <ZohoMatchFields {...props} />;
		case INTEGRATION_TYPE.SELLSY:
			return <SellsyMatchFields {...props} />;
		case INTEGRATION_TYPE.BULLHORN:
			return <BullhornMatchFields {...props} />;
		case INTEGRATION_TYPE.DYNAMICS:
			return <DynamicsMatchFields {...props} />;
		default:
			return navigate("/crm/settings");
	}
};

export default MatchFields;
