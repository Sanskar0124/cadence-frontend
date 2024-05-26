import { useQuery } from "@cadence-frontend/utils";
import CadenceImportCSV from "./CadenceImportCsv/CadenceImport";
import CadenceImportApi from "./CadenceImportApi/CadenceImport";
import CadenceImportCrm from "./CadenceImportCrm/CadenceImport";

const CadenceImport = () => {
	const query = useQuery();
	const webhook = query.get("webhook");
	const importType = query.get("import");

	return webhook ? (
		<CadenceImportApi />
	) : importType === "crm" ? (
		<CadenceImportCrm />
	) : (
		<CadenceImportCSV />
	);
};

export default CadenceImport;
