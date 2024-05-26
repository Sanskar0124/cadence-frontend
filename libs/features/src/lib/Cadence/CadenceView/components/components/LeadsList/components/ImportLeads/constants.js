import { CADENCE_INTEGRATION_TYPE, INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { DocumentText, Excel, GoogleSheets } from "@cadence-frontend/icons";
import { capitalize, getIntegrationIcon } from "@cadence-frontend/utils";

export const IMPORT_OPTIONS = {
	CSV_FILES: "csv_files",
	FROM_INTEGRATION: "from_integration",
	GOOGLE_SHEETS: "google_sheets",
};

export const colorMappingForIntegrations = {
	[INTEGRATION_TYPE.SALESFORCE]: "#00A1E0",
	[INTEGRATION_TYPE.PIPEDRIVE]: "#363A3F",
	[INTEGRATION_TYPE.HUBSPOT]: "#FD886B",
	[INTEGRATION_TYPE.ZOHO]: "#236CB4",
	[INTEGRATION_TYPE.SELLSY]: "#161699",
	[INTEGRATION_TYPE.BULLHORN]: "#E56520",
};

export const getRadioBtns = (integration_type, cadence_integration_type) => {
	if (
		integration_type === INTEGRATION_TYPE.SHEETS &&
		[CADENCE_INTEGRATION_TYPE.EXCEL, CADENCE_INTEGRATION_TYPE.SHEETS].includes(
			cadence_integration_type
		)
	)
		return;
	const IntegrationIcon = getIntegrationIcon({ integration_type, box: true });
	const tickBg = colorMappingForIntegrations[integration_type];
	switch (integration_type) {
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.ZOHO:
			return [
				{
					icon: <DocumentText />,
					border_color: "#117E43",
					tick_bg: "#117E43",
					text: "Imports",
					value: IMPORT_OPTIONS.CSV_FILES,
				},
			];
		case INTEGRATION_TYPE.SHEETS:
			return [
				{
					icon: <Excel size={40} />,
					border_color: "#117E43",
					tick_bg: "#117E43",
					text: "CSV files",
					value: IMPORT_OPTIONS.CSV_FILES,
				},
				{
					icon: <GoogleSheets size={40} />,
					border_color: "#1DA362",
					tick_bg: "#1FA463",
					text: "Google sheets",
					value: IMPORT_OPTIONS.GOOGLE_SHEETS,
				},
			];
		default:
			return [
				{
					icon: <IntegrationIcon size={40} />,
					border_color: tickBg,
					tick_bg: tickBg,
					text: capitalize(integration_type),
					value: IMPORT_OPTIONS.FROM_INTEGRATION,
				},
				{
					icon: <DocumentText />,
					border_color: "#117E43",
					tick_bg: "#117E43",
					text: "Other sources",
					value: IMPORT_OPTIONS.CSV_FILES,
				},
			];
	}
};
