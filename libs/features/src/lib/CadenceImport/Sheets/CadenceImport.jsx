import GoogleSheetsCadenceImport from "./components/GoogleSheets/CadenceImport/CadenceImport";
import ExcelCadenceImport from "./components/Excel/CadenceImport/CadenceImport";
import { useQuery } from "@cadence-frontend/utils";

export const IMPORT_TYPE = {
	CSV: "csv",
	SHEETS: "sheets",
};

const CadenceImport = () => {
	const query = useQuery();
	const type = query.get("type");

	switch (type) {
		case IMPORT_TYPE.CSV:
			return <ExcelCadenceImport />;
		case IMPORT_TYPE.SHEETS:
			return <GoogleSheetsCadenceImport />;
		default:
			return;
	}
};

export default CadenceImport;
