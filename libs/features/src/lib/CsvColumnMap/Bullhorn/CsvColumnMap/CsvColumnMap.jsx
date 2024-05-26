import { useSearchParams } from "react-router-dom";

// Integrations
import CrmLeadMapping from "./CrmLeadMapping/CrmLeadMapping";
import CsvLeadMapping from "./CsvLeadMapping/CsvLeadMapping";

const CREATE_LEAD_TYPES = {
	CSV: "csv",
	SHEETS: "sheets",
};

const CSVColumnMap = () => {
	const [searchParams] = useSearchParams();
	const type = searchParams.get("type");

	switch (type) {
		case CREATE_LEAD_TYPES.CSV:
		case CREATE_LEAD_TYPES.SHEETS:
			return <CsvLeadMapping />;
		default:
			return <CrmLeadMapping />;
	}
};

export default CSVColumnMap;
