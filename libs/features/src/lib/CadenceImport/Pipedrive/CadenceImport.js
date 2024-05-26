import { useQuery } from "@cadence-frontend/utils";

import CadenceImportCSV from "./CadenceImport/CadenceImport";
import CadenceImportAPI from "./CadenceImportFromApi/CadenceImport";

const CadenceImport = () => {
	const query = useQuery();
	const webhook = query.get("webhook");

	return webhook ? <CadenceImportAPI /> : <CadenceImportCSV />;
};

export default CadenceImport;
