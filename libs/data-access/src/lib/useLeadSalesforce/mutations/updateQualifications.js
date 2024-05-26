/* eslint-disable no-console */
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { AuthorizedApi } from "../../api";

const updateQualifications = async ({
	integration_id,
	integration_type,
	account_integration_id,
	body,
}) => {
	delete body?.Final_Purchase_Decision;

	if (!integration_id && !account_integration_id)
		throw new Error("Salesforce lead id or account id not present");

	const URL = `/v1/sales/lead/qual${
		integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD && integration_id
			? `/lead/${integration_id}`
			: `/account/${account_integration_id}`
	}`;

	let bodyObj;
	if (integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD && integration_id)
		bodyObj = { ...body };
	else bodyObj = { ...body, salesforce_contact_id: integration_id };

	const data = await AuthorizedApi({
		method: "PUT",
		url: URL,
		data: bodyObj,
	});

	return data.data;
};

export default updateQualifications;
