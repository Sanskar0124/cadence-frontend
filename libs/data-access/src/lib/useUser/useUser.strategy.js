/* eslint-disable no-console */
import {
	EXCEL_TRANSFORMATION_TABLE,
	GOOGLE_SHEETS_TRANSFORMATION_TABLE,
	HUBSPOT_TRANSFORMATION_TABLE,
	INTEGRATION_TYPE,
	PIPEDRIVE_TRANSFORMATION_TABLE,
	SALESFORCE_TRANSFORMATION_TABLE,
	SELLSY_TRANSFORMATION_TABLE,
	ZOHO_TRANSFORMATION_TABLE,
	BULLHORN_TRANSFORMATION_TABLE,
	DYNAMICS_TRANSFORMATION_TABLE,
	SHEETS_TRANSFORMATION_TABLE,
} from "@cadence-frontend/constants";
import { deepMapKeys } from "@cadence-frontend/utils";

const userDataStrategy = ({ user, integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return deepMapKeys(user, key => SALESFORCE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.PIPEDRIVE:
				return deepMapKeys(user, key => PIPEDRIVE_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.GOOGLE_SHEETS:
				return deepMapKeys(user, key => GOOGLE_SHEETS_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.SHEETS:
				return deepMapKeys(user, key => SHEETS_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.HUBSPOT:
				return deepMapKeys(user, key => HUBSPOT_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.SELLSY:
				return deepMapKeys(user, key => SELLSY_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.EXCEL:
				return deepMapKeys(user, key => EXCEL_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.ZOHO:
				return deepMapKeys(user, key => ZOHO_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.BULLHORN:
				return deepMapKeys(user, key => BULLHORN_TRANSFORMATION_TABLE[key] || key);
			case INTEGRATION_TYPE.DYNAMICS:
				return deepMapKeys(user, key => DYNAMICS_TRANSFORMATION_TABLE[key] || key);
		}
	} catch (err) {
		console.log("An error occured while transforming user data", err);
		return user;
	}
};

export { userDataStrategy };
