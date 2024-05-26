import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

export default function ({ lead, user }) {
	switch (user?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return Boolean(user?.instance_url);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return Boolean(lead?.integration_id && user?.instance_url);
		case INTEGRATION_TYPE.SHEETS:
			return true;
		case INTEGRATION_TYPE.HUBSPOT:
			return Boolean(lead?.integration_id && user?.company_integration_id);
		case INTEGRATION_TYPE.SELLSY:
			return Boolean(lead?.integration_id);
		case INTEGRATION_TYPE.ZOHO:
			return Boolean(user?.instance_url);
		case INTEGRATION_TYPE.BULLHORN:
			return Boolean(user?.instance_url);
		case INTEGRATION_TYPE.DYNAMICS:
			return Boolean(user?.instance_url);
	}
}
