/* eslint-disable no-console */
import { useMutation, useQueryClient } from "react-query";
import { AuthorizedApi } from "./api";

const useWhatsappActivity = lead_id => {
	const queryClient = useQueryClient();

	const createWhatsppActivityApi = message =>
		AuthorizedApi.post("v2/sales/lead/whatsapp-message", {
			lead_id,
			message,
		}).then(res => res.data.data);

	const { mutate: createWhatsppActivity, isLoading: createWhatsppActivityLoading } =
		useMutation(createWhatsppActivityApi, {
			onSettled: () => {
				queryClient.invalidateQueries(["lead-activities", { lead_id }]);
			},
		});

	return {
		createWhatsppActivity,
		createWhatsppActivityLoading,
	};
};

export default useWhatsappActivity;
