/* eslint-disable no-console */
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

//import queries
import fetchSalesforceData from "./queries/fetchSalesforceData";
//import mutations
import updateQualifications from "./mutations/updateQualifications";
import { INTEGRATION_TYPE, LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { AuthorizedApi } from "../api";

const SALESFORCE_LOGIN_MSG = "log in";
const UNAUTHORIZED_STATUS_CODE = 440;

const user = JSON.parse(localStorage.getItem("userInfo"))?.userInfo ?? {};

const useLeadSalesforce = (
	{ integration_id, integration_type, account_integration_id, lead },
	enabled
) => {
	const [isTokenExpired, setIsTokenExpired] = useState(false);
	const [salesforceSuccess, setSalesforceSuccess] = useState(false);

	const salesforceQuery = useQuery(
		[
			"salesforceQuery",
			{ integration_id, integration_type, account_integration_id, lead },
		],
		fetchSalesforceData,
		{
			enabled:
				!!enabled &&
				integration_type !== LEAD_INTEGRATION_TYPES.SALESFORCE_GOOGLE_SHEET_LEAD &&
				integration_type !== LEAD_INTEGRATION_TYPES.SALESFORCE_CSV_LEAD &&
				user?.integration_type === INTEGRATION_TYPE.SALESFORCE,
			onError: err => {
				setSalesforceSuccess(false);
				if (
					err.response?.status === UNAUTHORIZED_STATUS_CODE ||
					err.response?.data?.msg?.toLowerCase()?.includes(SALESFORCE_LOGIN_MSG)
				)
					setIsTokenExpired(true);
			},
			onSuccess: data => {
				setSalesforceSuccess(data ? true : false);
			},
		}
	);

	const { mutate: updateSalesforceQualifications, data: updatedQualificationsData } =
		useMutation(updateQualifications, {
			onError: err => {
				if (
					err.response?.status === UNAUTHORIZED_STATUS_CODE ||
					err.response?.data?.msg?.toLowerCase()?.includes(SALESFORCE_LOGIN_MSG)
				)
					setIsTokenExpired(true);
			},
			onSuccess: () => {
				salesforceQuery.refetch();
			},
		});

	return {
		salesforceQuery,
		salesforceSuccess,
		updateSalesforceQualifications,
		updatedQualificationsData,
		isTokenExpired,
		setIsTokenExpired,
	};
};

export default useLeadSalesforce;
