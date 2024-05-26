import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";

// Integrations
import SalesforceCsvColumnMap from "./Salesforce/CsvColumnMap/CsvColumnMap";
import PipedriveCsvColumnMap from "./Pipedrive/CsvColumnMap/CsvColumnMap";
import SellsyCsvColumnMap from "./Sellsy/CsvColumnMap/CsvColumnMap";
import DynamicsCsvColumnMap from "./Dynamics/CsvColumnMap/CsvColumnMap";
import HubspotCsvColumnMap from "./Hubspot/CsvColumnMap/CsvColumnMap";
import GoogleSheetsCsvColumnMap from "./GoogleSheets/CsvColumnMap/CsvColumnMap";
import ExcelCsvColumnMap from "./Excel/CsvColumnMap/CsvColumnMap";
import SheetsCsvColumnMap from "./Sheets/CsvColumnMap/CsvColumnMap";
import ZohoCsvColumnMap from "./Zoho/CsvColumnMap/CsvColumnMap";
import BullhornCsvColumnMap from "./Bullhorn/CsvColumnMap/CsvColumnMap";

const CSVColumnMap = () => {
	const navigate = useNavigate();
	const user_info = useRecoilValue(userInfo);

	switch (user_info?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return <SalesforceCsvColumnMap />;
		case INTEGRATION_TYPE.PIPEDRIVE:
			return <PipedriveCsvColumnMap />;
		case INTEGRATION_TYPE.HUBSPOT:
			return <HubspotCsvColumnMap />;
		case INTEGRATION_TYPE.SELLSY:
			return <SellsyCsvColumnMap />;
		case INTEGRATION_TYPE.DYNAMICS:
			return <DynamicsCsvColumnMap />;
		case INTEGRATION_TYPE.GOOGLE_SHEETS:
			return <GoogleSheetsCsvColumnMap />;
		case INTEGRATION_TYPE.EXCEL:
			return <ExcelCsvColumnMap />;
		case INTEGRATION_TYPE.SHEETS:
			return <SheetsCsvColumnMap />;
		case INTEGRATION_TYPE.ZOHO:
			return <ZohoCsvColumnMap />;
		case INTEGRATION_TYPE.BULLHORN:
			return <BullhornCsvColumnMap />;
		default:
			navigate("/crm/cadence");
	}
};

export default CSVColumnMap;
