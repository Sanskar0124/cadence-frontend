/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { AuthorizedApi } from "../../api";

const fetchSalesforceData = async ({ queryKey }) => {
	const [
		,
		{ integration_id, integration_type, account_integration_id, lead: currentLead },
	] = queryKey;

	let isSalesforceAccount = account_integration_id ? true : false;
	let lead,
		account,
		insights,
		accountTopics,
		status,
		qualifications,
		contacts,
		crm,
		potentialLicence;

	if (!integration_id && !account_integration_id) {
		console.error("No integration_id or account integration id found.");
		return;
	}

	const URL = `/v1/sales/lead/salesforce${
		integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD && integration_id
			? `/lead/${integration_id}`
			: `/account/${account_integration_id}`
	}`;

	let salesforceData = await AuthorizedApi({
		method: "get",
		url: URL,
	});

	salesforceData = salesforceData.data;

	if (salesforceData.data) {
		if (account_integration_id) {
			const leadAccountStatus = currentLead?.account_map?.integration_status?.name;
			account = salesforceData.data?.account;
			insights = salesforceData.data?.account?.Account_Marketing_Insights__c?.split(";");
			crm = salesforceData.data?.account?.CRM__c?.split(";");
			accountTopics = salesforceData.data?.topics;
			status = salesforceData.data?.account[leadAccountStatus ?? ""];

			const {
				Meeting_Booked__c,
				Demo_During_Intro_Disco_Call__c,
				Date_du_Meeting__c,
				Effectif__c,
				of_Potential_Licenses__c,
				Potential_Department_s__c,
				Key_Features__c,
				// software
				CRM_1__c,
				CRM_2__c,
				CRM_Comments__c,
				RingoverCadence_Helpdesk_1__c,
				Helpdesk_2__c,
				Helpdesk_Comments__c,
				Video_Software_1__c,
				Video_Software_2__c,
				Video_Software_Comments__c,
				// operator
				VOIP__c,
				RingoverCadence_Landline_Operator__c,
				Mobile_Operator__c,
				Internet_Provider__c,
				RingoverCadence_Landline_Operator_Engagement_End_Date__c,
				Mobile_Operator_Engagement_End_Date__c,
				// account
				Decision_Maker__c,
				Resum_de_Qualification_du_Compte__c,
			} = salesforceData.data.account;

			qualifications = {
				Meeting_Booked__c,
				Demo_During_Intro_Disco_Call__c,
				Date_du_Meeting__c,
				Effectif__c,
				of_Potential_Licenses__c,
				Potential_Department_s__c,
				Key_Features__c,
				// software
				CRM_1__c,
				CRM_2__c,
				CRM_Comments__c,
				RingoverCadence_Helpdesk_1__c,
				Helpdesk_2__c,
				Helpdesk_Comments__c,
				Video_Software_1__c,
				Video_Software_2__c,
				Video_Software_Comments__c,
				// operator
				VOIP__c,
				RingoverCadence_Landline_Operator__c,
				Mobile_Operator__c,
				Internet_Provider__c,
				RingoverCadence_Landline_Operator_Engagement_End_Date__c,
				Mobile_Operator_Engagement_End_Date__c,
				// account
				Decision_Maker__c,
				Resum_de_Qualification_du_Compte__c,
			};
			let contactsOptions = salesforceData.data.contactsList.records;
			contactsOptions = contactsOptions.map(contact => ({
				label: contact.Name,
				value: contact.Id,
			}));
			contacts = contactsOptions;
		} else {
			const leadAccountStatus = currentLead?.lead_map?.integration_status?.name;

			lead = salesforceData.data?.lead;
			potentialLicence = salesforceData.data?.lead?.Potential_licence_form__c;
			accountTopics = salesforceData.data?.topics;
			status = salesforceData.data?.lead[leadAccountStatus ?? ""];
			crm = salesforceData.data?.lead?.CRM__c?.split(";");

			const {
				Lead_Position__c,
				Lead_Role__c,
				Potential_licence_form__c,
				Landline_Operator_Engagement_End_Date__c,
				Landline_Operator__c,
				CRM_1__c,
				Helpdesk_1__c,
				Sales_Engagement_Platform__c,
				Identified_Project__c,
				Estimated_Project_Start_Date__c,
				Estimated_Project_Timing__c,
				Compelling_Event__c,
				Identified_Pain_Points__c,
				Identified_Needs__c,
				Identified_Pain_Points_Comments__c,
				Identified_Needs_Comments__c,
			} = salesforceData.data.lead;

			qualifications = {
				Lead_Position__c,
				Lead_Role__c,
				Potential_licence_form__c,
				Landline_Operator_Engagement_End_Date__c,
				Landline_Operator__c,
				CRM_1__c,
				Helpdesk_1__c,
				Sales_Engagement_Platform__c,
				Identified_Project__c,
				Estimated_Project_Start_Date__c,
				Estimated_Project_Timing__c,
				Compelling_Event__c,
				Identified_Pain_Points__c,
				Identified_Needs__c,
				Identified_Pain_Points_Comments__c,
				Identified_Needs_Comments__c,
			};
		}
	}

	return {
		isSalesforceAccount,
		insights,
		accountTopics,
		status,
		qualifications,
		contacts,
		crm,
		potentialLicence,
		account,
		lead,
	};
};

export default fetchSalesforceData;
