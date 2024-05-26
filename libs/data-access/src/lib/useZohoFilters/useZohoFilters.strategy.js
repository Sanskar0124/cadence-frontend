import { INTEGRATION_TYPE, ZOHO_TRANSFORMATION_TABLE } from "@cadence-frontend/constants";

const getDescribeLeadURL = ({ integration_type }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.ZOHO:
				return "/v2/admin/company-settings/company-field-map/describe/lead";
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return "/v2/admin/company-settings/company-field-map/describe/lead";
	}
};

/**
 * Get strategy for /describe/{frontend-lead-object} based  zoho only
 */
const describeLeadStrategy = ({ integration_type, res }) => {
	try {
		switch (integration_type) {
			case INTEGRATION_TYPE.ZOHO: {
				let sf_lead = res?.data.data.map(item => {
					let obj = {
						name: item.api_name,
						label: item.display_label,
						type: item.data_type,
						editable: item.allowed_permissions_to_update.read_write,
						types: item.json_type,
					};
					if (obj.type === "picklist" || obj.type === "multipicklist")
						obj.picklistValues = item.pick_list_values;
					if (obj.type === "reference") {
						obj.reference_to = item.referenceTo;
					}
					return obj;
				});
				return sf_lead;
			}
		}
	} catch (err) {
		console.log("An error occured in getDescribeLead URL", err);
		return res?.data.data;
	}
};

export { getDescribeLeadURL, describeLeadStrategy };
