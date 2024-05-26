/* eslint-disable no-console */
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

/**
 * Sign in url for integration
 */
const getSignInURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "/v1/salesforce/redirect";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return "/v2/oauth/pipedrive/redirect";
			case INTEGRATION_TYPE.HUBSPOT:
				return "/v2/oauth/hubspot/redirect";
			case INTEGRATION_TYPE.SELLSY:
				return "/v2/oauth/sellsy/redirect";
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/oauth/zoho/redirect";
			case INTEGRATION_TYPE.BULLHORN:
				return "/v2/oauth/bullhorn/redirect";
			case INTEGRATION_TYPE.DYNAMICS:
				return "/v2/oauth/dynamics/redirect";
			default:
				return "/v1/salesforce/redirect";
		}
	} catch (err) {
		console.log("Error occured while fetching Sign In URL", err);
		return "/v1/salesforce/redirect";
	}
};

/**
 * Sign out url for integration
 */
const getSignOutURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return "/v1/salesforce/signout";
			case INTEGRATION_TYPE.PIPEDRIVE:
				return "/v2/oauth/pipedrive/signout";
			case INTEGRATION_TYPE.HUBSPOT:
				return "/v2/oauth/hubspot/signout";
			case INTEGRATION_TYPE.SELLSY:
				return "/v2/oauth/sellsy/signout";
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/oauth/zoho/signout";
			case INTEGRATION_TYPE.BULLHORN:
				return "/v2/oauth/bullhorn/signout";
			case INTEGRATION_TYPE.DYNAMICS:
				return "/v2/oauth/dynamics/signout";
			default:
				return "/v1/salesforce/signout";
		}
	} catch (err) {
		console.log("Error occured while fetching Sign In URL", err);
		return "/v1/salesforce/signout";
	}
};

/**
 * Sign out url for integration
 */
const getIntegrationRedirectURL = ({ integration_type, auth_code }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.SALESFORCE:
				return `/v1/salesforce/authorize?code=${auth_code}`;
			case INTEGRATION_TYPE.PIPEDRIVE:
				return `/v2/oauth/pipedrive/authorize?code=${auth_code}`;
			case INTEGRATION_TYPE.HUBSPOT:
				return `/v2/oauth/hubspot/authorize?code=${auth_code}`;
			case INTEGRATION_TYPE.SELLSY:
				return `/v2/oauth/sellsy/authorize?code=${auth_code}`;
			case INTEGRATION_TYPE.ZOHO:
				return `/v2/oauth/zoho/authorize?code=${auth_code.zoho_code}&location=${auth_code.location}&accounts-server=${auth_code.accounts_server}&`;
			case INTEGRATION_TYPE.BULLHORN:
				return `/v2/oauth/bullhorn/authorize?code=${auth_code}`;
			case INTEGRATION_TYPE.DYNAMICS:
				return `/v2/oauth/dynamics/authorize?code=${auth_code}`;
			default:
				return `/v1/salesforce/authorize?code=${auth_code}`;
		}
	} catch (err) {
		console.log("Error occured while fetching Sign In URL", err);
		return `/v1/salesforce/authorize?code=${auth_code}`;
	}
};

export { getSignInURL, getSignOutURL, getIntegrationRedirectURL };
