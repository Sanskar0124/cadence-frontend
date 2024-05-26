import { INTEGRATION_TYPE, LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import {
	Cadence as CADENCE_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
} from "@cadence-frontend/languages";
import { getBase64 } from "@cadence-frontend/utils";

export const getTableColumns = (integration_type, userLanguage) => {
	if (
		integration_type === INTEGRATION_TYPE.SALESFORCE ||
		integration_type === INTEGRATION_TYPE.BULLHORN
	)
		return [
			CADENCE_TRANSLATION?.NAME?.[userLanguage?.toUpperCase()],
			PROFILE_TRANSLATION.PHONE[userLanguage?.toUpperCase()],
			"Email",
			CADENCE_TRANSLATION?.OWNER_NAME?.[userLanguage?.toUpperCase()],
			...(integration_type === INTEGRATION_TYPE.BULLHORN ? ["BH Status"] : ["SF Status"]),
			CADENCE_TRANSLATION?.STATUS?.[userLanguage?.toUpperCase()],
			CADENCE_TRANSLATION?.ACTIONS?.[userLanguage?.toUpperCase()],
		];
	else
		return [
			CADENCE_TRANSLATION?.NAME?.[userLanguage?.toUpperCase()],
			PROFILE_TRANSLATION.PHONE[userLanguage?.toUpperCase()],
			"Email",
			CADENCE_TRANSLATION?.OWNER_NAME?.[userLanguage?.toUpperCase()],
			CADENCE_TRANSLATION?.STATUS?.[userLanguage?.toUpperCase()],
			CADENCE_TRANSLATION?.ACTIONS?.[userLanguage?.toUpperCase()],
		];
};

export const getViewModeTableColumns = user => {
	return [
		CADENCE_TRANSLATION?.NAME?.[user?.language?.toUpperCase()],
		CADENCE_TRANSLATION?.OWNER_NAME?.[user?.language?.toUpperCase()],
		CADENCE_TRANSLATION?.STATUS?.[user?.language?.toUpperCase()],
		CADENCE_TRANSLATION?.ACTIONS?.[user?.language?.toUpperCase()],
	];
};

export const SHOW_REASSIGNMENT_MODAL = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.DYNAMICS:
			return true;

		default:
			return false;
	}
};

export const CSV_IMPORT_AVAILABLE = [
	INTEGRATION_TYPE.EXCEL,
	INTEGRATION_TYPE.SELLSY,
	INTEGRATION_TYPE.DYNAMICS,
];

export const TYPE_OPTIONS = [
	{
		label: "Lead",
		value: "lead",
	},
	{
		label: "Contact",
		value: "contact",
	},
];

export const DYNAMICS_TYPE_OPTIONS = [
	{
		label: "Lead",
		value: "lead",
	},
	{
		label: "Contact",
		value: "contact",
	},
];

export const BULLHORN_TYPE_OPTIONS = [
	{
		label: "Lead",
		value: "lead",
	},
	{
		label: "Contact",
		value: "contact",
	},
	{
		label: "Candidate",
		value: "candidate",
	},
];

export const LEADS_TYPE_AVAILABLE = [
	// INTEGRATION_TYPE.BULLHORN,
	INTEGRATION_TYPE.DYNAMICS,
];

export const getTypeOptions = integrationType => {
	switch (integrationType) {
		case INTEGRATION_TYPE.DYNAMICS:
			return DYNAMICS_TYPE_OPTIONS;
		case INTEGRATION_TYPE.BULLHORN:
			return BULLHORN_TYPE_OPTIONS;
	}
};

export const importCsvDocsUrl = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.HUBSPOT:
			return "https://docs.google.com/document/d/1lzLzY-WmQ8Y4KeEope5fKYnUIE-tR1zKhYAh7az1gdc/edit?usp=sharing";
		case INTEGRATION_TYPE.SELLSY:
			return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000101390-importing-leads-from-sellsy-";
		case INTEGRATION_TYPE.BULLHORN:
			return "https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107272-importing-leads-in-bullhorn";
	}
};

export const navigateToCsvImport = async (
	file,
	integration_type,
	cadence,
	navigate,
	type,
	isProspecting = false
) => {
	const base64Csv = await getBase64(file);
	sessionStorage.setItem("people-csv", base64Csv);
	sessionStorage.setItem("file-name-csv", file.name);
	sessionStorage.removeItem("mapped-fields");
	sessionStorage.removeItem("preview-body");
	sessionStorage.removeItem("csv_field_map");
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.ZOHO:
			navigate(
				`/import-csv?type=csv&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
			);
			break;
		case INTEGRATION_TYPE.HUBSPOT:
			if (isProspecting) {
				navigate(
					`/import-csv?type=csv&isProspecting=true&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			} else {
				navigate(
					`/import-csv?type=csv&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			}
			break;

		case INTEGRATION_TYPE.SELLSY:
			if (isProspecting) {
				navigate(
					`/import-csv?type=csv&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			} else {
				navigate(
					`/import-csv?cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			}
			break;
		case INTEGRATION_TYPE.SHEETS:
			navigate(
				`/import-csv?type=csv&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
			);
			break;
		case INTEGRATION_TYPE.EXCEL:
			sessionStorage.removeItem(`csv_field_map`);
			navigate(
				`/import-csv?cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
			);
			break;
		case INTEGRATION_TYPE.BULLHORN:
			if (isProspecting) {
				navigate(
					`/import-csv?type=csv&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			} else {
				sessionStorage.removeItem(`mapped-fields`);
				navigate(
					`/import-csv?type=${type}&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
				);
			}
			break;
		case INTEGRATION_TYPE.DYNAMICS:
			sessionStorage.removeItem(`mapped-fields`);
			navigate(
				`/import-csv?type=${type}&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
			);
			break;
	}
};

export const navigateToSheetsImport = (sheetUrl, integration_type, cadence, navigate) => {
	sessionStorage.setItem("sheet_url", sheetUrl);
	sessionStorage.removeItem("mapped-fields");
	sessionStorage.removeItem("preview-body");
	sessionStorage.removeItem("csv_field_map");

	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.BULLHORN:
		case INTEGRATION_TYPE.SHEETS:
			navigate(
				`/import-csv?type=sheets&cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`
			);
			break;
	}
};

export const getSampleCsvUrl = (integration_type, type, isProspecting = false) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE: {
			return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_SALESFORCE_CSV_IMPORT.csv";
		}
		case INTEGRATION_TYPE.PIPEDRIVE: {
			return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_PIPEDRIVE_CSV_IMPORT.csv";
		}
		case INTEGRATION_TYPE.HUBSPOT: {
			if (isProspecting) {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_HUBSPOT_CSV_IMPORT.csv";
			} else {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/HUBSPOT_CSV_IMPORT.csv";
			}
		}
		case INTEGRATION_TYPE.ZOHO: {
			return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_ZOHO_CSV_IMPORT.csv";
		}
		case INTEGRATION_TYPE.EXCEL:
		case INTEGRATION_TYPE.SHEETS: {
			return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/EXCEL_CSV_IMPORT.csv";
		}
		case INTEGRATION_TYPE.SELLSY: {
			if (isProspecting) {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_SELLSY_CSV_IMPORT.csv";
			} else {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/SELLSY_CSV_IMPORT.csv";
			}
		}
		case INTEGRATION_TYPE.DYNAMICS: {
			if (type === "lead") {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/DYNAMICS_LEAD_IMPORT.xlsx";
			} else {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/DYNAMICS_CONTACT_IMPORT.xlsx";
			}
		}
		case INTEGRATION_TYPE.BULLHORN: {
			if (isProspecting) {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/TEST_BULLHORN_CSV_IMPORT.csv";
			} else if (type === "lead") {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/BULLHORN_LEAD_CSV.csv";
			} else if (type === "contact") {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/BULLHORN_CONTACT_CSV.csv";
			} else if (type === "candidate") {
				return "https://storage.googleapis.com/apt-cubist-307713.appspot.com/BULLHORN_CANDIDATE_CSV.csv";
			}
		}
	}
};

export const getSampleSheetsUrl = integration_type => {
	switch (integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return "https://docs.google.com/spreadsheets/d/1hxFV_EmlHC97LzS_FVVetIyroIoCUuxRV4MCPZPwYzo/edit#gid=0";
		case INTEGRATION_TYPE.PIPEDRIVE:
			return "https://docs.google.com/spreadsheets/d/12_A1rTulkaLw8GZERwk9PLLXYMYtkMMLH-eZDQ-Kg8M/edit#gid=0";
		case INTEGRATION_TYPE.HUBSPOT:
			return "https://docs.google.com/spreadsheets/d/1MFfdaJJ9XpoQELbjTPC4yjHUp04ccM5AxqtWfh-IEK4/edit#gid=0";
		case INTEGRATION_TYPE.ZOHO:
			return "https://docs.google.com/spreadsheets/d/17uFxLIIfhq2cMs-cIsagYKVtyXa_u-7eSsLvVI6sZ2g/edit#gid=0";
		case INTEGRATION_TYPE.SELLSY:
			return "https://docs.google.com/spreadsheets/d/1Xbnwef3pR731JwGv-71aCBLdF-mwibnLgRdgM-9rc9U/edit#gid=0";
		case INTEGRATION_TYPE.BULLHORN:
			return "https://docs.google.com/spreadsheets/d/1e7HM3JX0DhEnhdT7ZL1ZJv5l6AMwCTPMuRY_Ykh1qP4/edit#gid=0";
		case INTEGRATION_TYPE.SHEETS:
			return "https://docs.google.com/spreadsheets/d/1YaTlcjUWbIMz0uTN0yKffDpV9P25uf2BlknSStG9BFo/edit#gid=0";
	}
};

export const showLeadExportModal = user => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.BULLHORN:
			return true;

		default:
			return false;
	}
};

export const checkExcelFileSupport = (user, isProspecting = false) => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
		case INTEGRATION_TYPE.PIPEDRIVE:
		case INTEGRATION_TYPE.ZOHO:
		case INTEGRATION_TYPE.SHEETS:
			return true;
		case INTEGRATION_TYPE.HUBSPOT:
		case INTEGRATION_TYPE.SELLSY:
		case INTEGRATION_TYPE.BULLHORN:
			return isProspecting === true;
		default:
			return false;
	}
};

export const EXCEL_FILE_EXTNS = ["csv", "xlsx", "xls"];

export const ownerReassignmentSupport = user => {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return [
				LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD,
				LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT,
			];

		case INTEGRATION_TYPE.DYNAMICS:
			return [
				LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD,
				LEAD_INTEGRATION_TYPES.DYNAMICS_CONTACT,
			];
		case INTEGRATION_TYPE.SELLSY:
			return [LEAD_INTEGRATION_TYPES.SELLSY_CONTACT];
	}
};
