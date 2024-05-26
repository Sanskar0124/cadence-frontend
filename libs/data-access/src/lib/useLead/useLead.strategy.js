import { deepMapKeys } from "@cadence-frontend/utils";
import {
	SALESFORCE_TRANSFORMATION_TABLE,
	PIPEDRIVE_TRANSFORMATION_TABLE,
	GOOGLE_SHEETS_TRANSFORMATION_TABLE,
	HUBSPOT_TRANSFORMATION_TABLE,
	SELLSY_TRANSFORMATION_TABLE,
	EXCEL_TRANSFORMATION_TABLE,
	ZOHO_TRANSFORMATION_TABLE,
	BULLHORN_TRANSFORMATION_TABLE,
	DYNAMICS_TRANSFORMATION_TABLE,
	SHEETS_TRANSFORMATION_TABLE,
} from "@cadence-frontend/constants";
/**
 * data: Lead Data
 *
 */
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

const LeadDataStrategy = ({ data: leadData, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return deepMapKeys(leadData, key => SALESFORCE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.PIPEDRIVE:
				return deepMapKeys(leadData, key => PIPEDRIVE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return deepMapKeys(
					leadData,
					key => GOOGLE_SHEETS_TRANSFORMATION_TABLE[key] || key
				);
			case INTEGRATION_TYPE.SHEETS:
				return deepMapKeys(leadData, key => SHEETS_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.HUBSPOT:
				return deepMapKeys(leadData, key => HUBSPOT_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.SELLSY:
				return deepMapKeys(leadData, key => SELLSY_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.EXCEL:
				return deepMapKeys(leadData, key => EXCEL_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.ZOHO:
				return deepMapKeys(leadData, key => ZOHO_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.BULLHORN:
				return deepMapKeys(leadData, key => BULLHORN_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.DYNAMICS:
				return deepMapKeys(leadData, key => DYNAMICS_TRANSFORMATION_TABLE[key] || key);
		}
	} catch (err) {
		return leadData;
	}
};
const getAddLeadsUrl = ({ integration_type, type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return `/v2/sales/department/cadence/import/salesforce/link/${type}`;
			case INTEGRATION_TYPE.PIPEDRIVE:
				return `/v2/sales/department/cadence/import/pipedrive/link`;
			case INTEGRATION_TYPE.HUBSPOT:
				return `/v2/sales/department/cadence/import/hubspot/csv/link`;
			case INTEGRATION_TYPE.ZOHO:
				return `/v2/sales/department/cadence/import/zoho/link/${type}`;
			case INTEGRATION_TYPE.SELLSY:
				return `/v2/sales/department/cadence/import/sellsy/link`;
			case INTEGRATION_TYPE.BULLHORN:
				return `/v2/sales/department/cadence/import/bullhorn/link/${type}`;
			case INTEGRATION_TYPE.DYNAMICS:
				return `/v2/sales/department/cadence/import/dynamics/link/${type}`;
			case INTEGRATION_TYPE.SHEETS:
				return "/v2/excel/link-leads";
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return "/v2/admin/company-settings/company-field-map/describe/lead";
	}
};

export { LeadDataStrategy, getAddLeadsUrl };
