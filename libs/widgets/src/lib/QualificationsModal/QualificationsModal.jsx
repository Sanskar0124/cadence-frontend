import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
// import { useNavigate } from "react-router-dom";

// Integrations
import SalesforceQualificationsModal from "./Salesforce/QualificationsModal/QualificationsModal";
import PipedriveQualificationsModal from "./Pipedrive/QualificationsModal/QualificationsModal";
import HubspotQualificationsModal from "./Hubspot/QualificationsModal/QualificationsModal";
import SellsyQualificationsModal from "./Sellsy/QualificationsModal/QualificationsModal";

import ZohoQualificationModal from "./Zoho/QualificationsModal/QualificationsModal";
import BullhornQualificationModal from "./Bullhorn/QualificationsModal/QualificationsModal";
import DynamicsQualificationsModal from "./Dynamics/QualificationsModal/QualificationsModal";

const QualificationsModal = props => {
	// const navigate = useNavigate();
	const user_info = useRecoilValue(userInfo);
	switch (user_info?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return <SalesforceQualificationsModal {...props} />;
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <PipedriveQualificationsModal {...props} />;
		case INTEGRATION_TYPE.HUBSPOT:
			return <HubspotQualificationsModal {...props} />;
		case INTEGRATION_TYPE.ZOHO:
			return <ZohoQualificationModal {...props} />;
		case INTEGRATION_TYPE.SELLSY:
			return <SellsyQualificationsModal {...props} />;
		case INTEGRATION_TYPE.DYNAMICS:
			return <DynamicsQualificationsModal {...props} />;

		case INTEGRATION_TYPE.BULLHORN:
			return <BullhornQualificationModal {...props} />;
		// default:
		// 	navigate("/crm/cadence");
	}
};

export default QualificationsModal;
