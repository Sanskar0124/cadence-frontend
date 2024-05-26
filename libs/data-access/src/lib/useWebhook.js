import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const useWebhook = () => {
	const queryClient = useQueryClient();

	const KEY = "webhook";

	const fetchWebhook = () =>
		AuthorizedApi.get("v2/admin/company-settings/webhook").then(res => res.data.data);

	const {
		data: webhooks,
		isLoading: webhooksLoading,
		isError: webhooksError,
	} = useQuery(KEY, fetchWebhook);

	const createWebhookApi = async body => {
		return await AuthorizedApi.post("/v2/admin/company-settings/webhook", body).then(
			res => res.data.data
		);
	};

	const {
		mutate: createWebhook,
		isLoading: createWebhookLoading,
		isError: createWebhookError,
	} = useMutation(createWebhookApi, {
		onSuccess: () => queryClient.invalidateQueries(KEY),
	});

	const updateWebhookApi = async ({ id, body }) => {
		return await AuthorizedApi.put(`/v2/admin/company-settings/webhook/${id}`, body).then(
			res => res.data.data
		);
	};

	const {
		mutate: updateWebhook,
		isLoading: updateWebhookLoading,
		isError: updateWebhookError,
		isIdle: fetchingUpdateWebhook,
	} = useMutation(updateWebhookApi, {
		onSuccess: () => queryClient.invalidateQueries(KEY),
	});

	const deleteWebhookApi = async id => {
		return await AuthorizedApi.delete(`/v2/admin/company-settings/webhook/${id}`).then(
			res => res.data.data
		);
	};

	const {
		mutate: deleteWebhook,
		isLoading: deleteWebhookLoading,
		isError: deleteWebhookError,
	} = useMutation(deleteWebhookApi, {
		onSuccess: () => queryClient.invalidateQueries(KEY),
	});

	return {
		webhooks,
		webhooksLoading,
		webhooksError,
		createWebhook,
		createWebhookLoading,
		createWebhookError,
		updateWebhook,
		updateWebhookLoading,
		updateWebhookError,
		deleteWebhook,
		deleteWebhookLoading,
		deleteWebhookError,
		fetchingUpdateWebhook,
	};
};

export default useWebhook;
