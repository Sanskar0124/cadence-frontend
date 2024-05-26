import { useQuery } from "@cadence-frontend/utils";

//CadenceImport
import CadenceImportCSV from "./Cad/CadenceImport/CadenceImport";
import CadenceImportApi from "./Cad/CadenceImportApi/CadenceImport";

const CadenceImport = () => {
	const query = useQuery();
	const webhook = query.get("webhook");

	return webhook ? <CadenceImportApi /> : <CadenceImportCSV />;
};

export default CadenceImport;
