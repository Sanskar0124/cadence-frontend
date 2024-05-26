import { useQuery } from "@cadence-frontend/utils";

import CadenceImportCSV from "./CadenceImportCsv/CadenceImport";
import CadenceImportApi from "./CadenceImportApi/CadenceImport";

const CadenceImport = () => {
	const query = useQuery();
	const webhook = query.get("webhook");

	return webhook ? <CadenceImportApi /> : <CadenceImportCSV />;
};

export default CadenceImport;
