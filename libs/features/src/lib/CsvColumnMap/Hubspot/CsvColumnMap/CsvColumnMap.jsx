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
	const isProspecting = searchParams.get("isProspecting");

	switch (type) {
		case CREATE_LEAD_TYPES.SHEETS:
			return <CsvLeadMapping />;

		case CREATE_LEAD_TYPES.CSV:
			if (!isProspecting) {
				return <CrmLeadMapping isProspecting={isProspecting} />;
			} else if (isProspecting === "true") {
				return <CsvLeadMapping />;
			}

			break;
		default:
			return <CrmLeadMapping isProspecting={isProspecting} />;
	}
};

export default CSVColumnMap;
