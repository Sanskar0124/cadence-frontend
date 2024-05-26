import React from "react";
import { AuthorizedApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useEmailSignature = () => {
	const queryClient = useQueryClient();

	//Get all signatures
	const getSignatures = () =>
		AuthorizedApi.get("/v1/sales/employee/signature").then(res => res.data.data);

	const { data: signatures, isLoading: signatureLoading } = useQuery(
		"signatures",
		getSignatures
	);

	//create signature
	const createSignatureApi = signature =>
		AuthorizedApi.post(`/v1/sales/employee/signature`, signature).then(res => res.data);

	const { mutate: createSignature, isLoading: createSignatureLoading } = useMutation(
		createSignatureApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("signatures");
			},
		}
	);

	//update signature
	const updateSignatureApi = signature =>
		AuthorizedApi.put(`/v1/sales/employee/signature`, signature).then(res => res.data);

	const { mutate: updateSignature, isLoading: updateSignatureLoading } = useMutation(
		updateSignatureApi,
		{
			onSettled: () => {
				queryClient.invalidateQueries("signatures");
			},
		}
	);

	//delete signature
	const deleteSignatureApi = id =>
		AuthorizedApi.delete(`/v1/sales/employee/signature/${id}`).then(res => res.data);

	const { mutate: deleteSignature } = useMutation(deleteSignatureApi, {
		onSettled: () => {
			queryClient.invalidateQueries("signatures");
		},
	});

	//Update Primary Signature
	const updatePrimarySignatureApi = id =>
		AuthorizedApi.put(`/v1/sales/employee/signature/primary/${id}`).then(res => res.data);

	const { mutate: updatePrimarySignature } = useMutation(updatePrimarySignatureApi, {
		onMutate: async id => {
			await queryClient.cancelQueries("signatures");
			const previousSignatures = queryClient.getQueryData("signatures");
			queryClient.setQueryData("signatures", prev =>
				prev.map(sign => {
					if (sign.signature_id === id) return { ...sign, is_primary: true };
					if (sign.is_primary) return { ...sign, is_primary: false };
					return sign;
				})
			);
			return { previousSignatures };
		},
		onSettled: () => {
			queryClient.invalidateQueries("signatures");
		},
	});

	return {
		signatures,
		signatureLoading,
		createSignature,
		createUpdateSignatureLoading: createSignatureLoading || updateSignatureLoading,
		deleteSignature,
		updateSignature,
		updatePrimarySignature,
	};
};

export default useEmailSignature;
