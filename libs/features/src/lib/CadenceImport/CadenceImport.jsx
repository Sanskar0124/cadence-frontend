import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";

// Integrations
import SalesforceCadenceImport from "./Salesforce/CadenceImport";
import PipedriveCadenceImport from "./Pipedrive/CadenceImport";
import GoogleSheetsCadenceImport from "./GoogleSheets/CadenceImport/CadenceImport";
import HubspotCadenceImport from "./Hubspot/CadenceImport";
import SellsyCadenceImport from "./Sellsy/CadenceImport";
import ExcelCadenceImport from "./Excel/CadenceImport/CadenceImport";
import SheetsCadenceImport from "./Sheets/CadenceImport";
import ZohoCadenceImport from "./Zoho/CadenceImport";
import DynamicsCadenceImport from "./Dynamics/CadenceImport/CadenceImport";
import BullhornCadenceImport from "./Bullhorn/CadenceImport";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user_info = useRecoilValue(userInfo);

	switch (user_info?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return <SalesforceCadenceImport />;
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <PipedriveCadenceImport />;
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return <GoogleSheetsCadenceImport />;
		case INTEGRATION_TYPE.HUBSPOT:
			return <HubspotCadenceImport />;
		case INTEGRATION_TYPE.SELLSY:
			return <SellsyCadenceImport />;
		case INTEGRATION_TYPE.EXCEL:
			return <ExcelCadenceImport />;
		case INTEGRATION_TYPE.SHEETS:
			return <SheetsCadenceImport />;
		case INTEGRATION_TYPE.ZOHO:
			return <ZohoCadenceImport />;
		case INTEGRATION_TYPE.BULLHORN:
			return <BullhornCadenceImport />;
		case INTEGRATION_TYPE.DYNAMICS:
			return <DynamicsCadenceImport />;

		default:
			navigate("/crm/cadence");
	}
};

export default CadenceImport;
