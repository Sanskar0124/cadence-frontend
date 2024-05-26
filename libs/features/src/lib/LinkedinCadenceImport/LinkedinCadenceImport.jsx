import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";

// Integrations
import SalesforceCadenceImport from "./Salesforce/CadenceImport/CadenceImport";
import PipedriveCadenceImport from "./Pipedrive/CadenceImport/CadenceImport";
import GoogleSheetsCadenceImport from "./GoogleSheets/CadenceImport/CadenceImport";
import HubspotCadenceImport from "./Hubspot/CadenceImport/CadenceImport";

const LinkedinCadenceImport = () => {
	//Linkedin Cadence Import
	const navigate = useNavigate();
	const user_info = useRecoilValue(userInfo);

	switch (user_info?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return <SalesforceCadenceImport />;
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <PipedriveCadenceImport />;
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return <SalesforceCadenceImport />;
		case INTEGRATION_TYPE.HUBSPOT:
			return <HubspotCadenceImport />;
		default:
			navigate("/crm/cadence");
	}
};

export default LinkedinCadenceImport;
