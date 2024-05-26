import React from "react";
import { AuthorizedApi } from "./api";
import { useMutation, useQuery } from "react-query";

const usePhoneNumber = (enabled = false) => {
	//Get all phone numbers
	const getPhoneNumbers = () =>
		AuthorizedApi.get("/v1/ringover/user").then(res =>
			res.data.data?.list?.map(number => ({
				...number,
				label: number.format.international,
				value: number.format.e164,
			}))
		);

	const {
		data: phoneNumbers,
		isLoading: phoneNumbersLoading,
		isError: phoneNumbersError,
	} = useQuery("phoneNumbers", getPhoneNumbers, {
		enabled,
	});

	const fetchPhoneNumbersApi = () =>
		AuthorizedApi.get("/v1/ringover/user").then(res =>
			res.data.data?.list?.map(number => number.number)
		);

	const { mutate: fetchPhoneNumbers } = useMutation(fetchPhoneNumbersApi);

	return {
		phoneNumbers,
		phoneNumbersLoading,
		phoneNumbersError,
		fetchPhoneNumbers,
	};
};

export default usePhoneNumber;
